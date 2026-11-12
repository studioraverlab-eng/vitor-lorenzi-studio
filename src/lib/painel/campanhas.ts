// Regras de negócio que juntam a camada de dados e o motor de fila.
import "server-only";

import { comTrava, lerDb, lerFila, salvarDb, salvarFila } from "./db";
import {
  agendarEnvios,
  isoSP,
  novoId,
  renderizarMensagem,
  separarDestinatarios,
} from "./fila";
import type { Campanha, Db, Destinatario, DestinatarioEntrada, Envio } from "./types";

export interface NovaCampanhaEntrada {
  nome: string;
  modeloId: string;
  textoBase: string;
  inicio: Date;
  destinatarios: DestinatarioEntrada[];
}

export interface ResultadoNovaCampanha {
  campanhaId: string;
  enfileirados: number;
  bloqueados: number;
  duplicados: number;
  invalidos: number;
  primeiroEnvio: string | null;
  ultimoEnvio: string | null;
}

export function numeroDoCliente(db: Db, clienteId: string) {
  return db.numeros.find((n) => n.clienteId === clienteId) ?? null;
}

/**
 * Cria a campanha, os destinatários e os envios, e gera os itens da fila
 * (data/fila.json) seguindo as regras de cadência de src/lib/fila.ts.
 */
export function criarCampanhaAgendada(clienteId: string, entrada: NovaCampanhaEntrada): Promise<ResultadoNovaCampanha> {
  return comTrava(async () => {
    const db = await lerDb();
    const fila = await lerFila();

    const numero = numeroDoCliente(db, clienteId);
    if (!numero) throw new Error("Nenhum número de WhatsApp conectado para esta empresa.");
    if (numero.status !== "conectado") {
      throw new Error("O número de WhatsApp está pausado ou desconectado. Reconecte antes de agendar.");
    }
    const modelo = db.modelos.find((m) => m.id === entrada.modeloId && m.clienteId === clienteId);
    if (!modelo) throw new Error("Modelo de mensagem não encontrado.");
    if (!entrada.textoBase.trim()) throw new Error("A mensagem está vazia.");

    // Sem coluna "empresa" no CSV, {{empresa}} vira o nome da empresa cliente.
    const nomeEmpresa = db.clientes.find((c) => c.id === clienteId)?.nomeEmpresa ?? "";
    const comEmpresa = entrada.destinatarios.map((d) => ({ ...d, empresa: d.empresa.trim() || nomeEmpresa }));
    const bloqueios = db.bloqueios.filter((b) => b.clienteId === clienteId).map((b) => b.telefone);
    const separacao = separarDestinatarios(comEmpresa, bloqueios);
    if (!separacao.aceitos.length) {
      throw new Error("Nenhum destinatário válido para enviar (todos bloqueados, repetidos ou inválidos).");
    }

    const agora = new Date();
    const campanha: Campanha = {
      id: novoId("cmp"),
      clienteId,
      numeroId: numero.id,
      modeloId: modelo.id,
      nome: entrada.nome.trim() || `${modelo.nome} — ${agora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
      textoBase: entrada.textoBase,
      agendamentoInicio: isoSP(entrada.inicio),
      status: "agendada",
      totalDestinatarios: separacao.aceitos.length + separacao.bloqueados.length,
      ignoradosBloqueados: separacao.bloqueados.length,
      criadoEm: isoSP(agora),
    };

    const novosDestinatarios: Destinatario[] = [];
    const novosEnvios: Envio[] = [];
    for (const d of separacao.bloqueados) {
      novosDestinatarios.push({ id: novoId("dst"), campanhaId: campanha.id, ...d, status: "bloqueado" });
    }
    for (const d of separacao.aceitos) {
      const destinatario: Destinatario = { id: novoId("dst"), campanhaId: campanha.id, ...d, status: "na_fila" };
      novosDestinatarios.push(destinatario);
      novosEnvios.push({
        id: novoId("env"),
        campanhaId: campanha.id,
        destinatarioId: destinatario.id,
        telefone: destinatario.telefone,
        mensagemRenderizada: renderizarMensagem(entrada.textoBase, d),
        agendadoPara: "",
        enviadoEm: null,
        entregueEm: null,
        status: "pendente",
      });
    }

    // Itens já na fila do mesmo número contam para o teto diário e o espaçamento.
    const campanhasDoNumero = new Set(db.campanhas.filter((c) => c.numeroId === numero.id).map((c) => c.id));
    const filaExistente = fila.itens.filter((i) => campanhasDoNumero.has(i.campanhaId));

    const itens = agendarEnvios({
      campanhaId: campanha.id,
      numero,
      inicio: entrada.inicio.getTime() > agora.getTime() ? entrada.inicio : agora,
      envios: novosEnvios.map((e) => ({
        envioId: e.id,
        destinatarioId: e.destinatarioId,
        telefone: e.telefone,
        mensagem: e.mensagemRenderizada,
      })),
      filaExistente,
    });
    const horarioPorEnvio = new Map(itens.map((i) => [i.envioId, i.agendadoPara]));
    for (const e of novosEnvios) e.agendadoPara = horarioPorEnvio.get(e.id) ?? "";

    db.campanhas.push(campanha);
    db.destinatarios.push(...novosDestinatarios);
    db.envios.push(...novosEnvios);
    fila.itens.push(...itens);

    await salvarFila(fila);
    await salvarDb(db);

    return {
      campanhaId: campanha.id,
      enfileirados: itens.length,
      bloqueados: separacao.bloqueados.length,
      duplicados: separacao.duplicados,
      invalidos: separacao.invalidos,
      primeiroEnvio: itens[0]?.agendadoPara ?? null,
      ultimoEnvio: itens.at(-1)?.agendadoPara ?? null,
    };
  });
}

export interface MetricasCampanha {
  total: number;
  enviadas: number;
  entregues: number;
  respondidas: number;
  agendamentos: number;
  paradas: number;
  bloqueados: number;
  naFila: number;
  falhas: number;
}

export function metricasCampanha(db: Db, campanha: Campanha): MetricasCampanha {
  const envios = db.envios.filter((e) => e.campanhaId === campanha.id);
  const respostas = db.respostas.filter((r) => r.campanhaId === campanha.id);
  return {
    total: campanha.totalDestinatarios,
    enviadas: envios.filter((e) => e.status === "enviado" || e.status === "entregue").length,
    entregues: envios.filter((e) => e.status === "entregue").length,
    respondidas: new Set(respostas.map((r) => r.destinatarioId)).size,
    agendamentos: respostas.filter((r) => r.virouAgendamento).length,
    paradas: respostas.filter((r) => r.classificacao === "pediu_parar").length,
    bloqueados: campanha.ignoradosBloqueados,
    naFila: envios.filter((e) => e.status === "pendente").length,
    falhas: envios.filter((e) => e.status === "falhou").length,
  };
}
