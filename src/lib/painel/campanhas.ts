// Regras de negócio que juntam a camada de dados e o motor de fila.
import "server-only";

import { comTrava, lerDb, lerFila, salvarDb, salvarFila } from "./db";
import {
  POR_DIA_MAX,
  POR_DIA_MIN,
  POR_DIA_PADRAO,
  agendarEnvios,
  isoSP,
  novoId,
  renderizarMensagem,
  separarDestinatarios,
} from "./fila";
import type {
  Campanha,
  Db,
  Destinatario,
  DestinatarioEntrada,
  Envio,
  Fila,
  Modelo,
  SituacaoCampanha,
} from "./types";

export interface NovaCampanhaEntrada {
  /** Nome da lista (em geral, o nome da planilha anexada). */
  nome: string;
  textoBase: string;
  /** Quantas mensagens enviar por dia (padrão 30). */
  porDia: number;
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

function limitarPorDia(valor: number): number {
  if (!Number.isFinite(valor)) return POR_DIA_PADRAO;
  return Math.min(POR_DIA_MAX, Math.max(POR_DIA_MIN, Math.floor(valor)));
}

/**
 * Cria a campanha (uma planilha/lista), os destinatários e os envios, e gera
 * os itens da fila (data/fila.json) seguindo a cadência de src/lib/fila.ts:
 * manhã e tarde, cota diária da campanha, atrás das campanhas anteriores.
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
    if (!entrada.textoBase.trim()) throw new Error("A mensagem está vazia.");
    const porDia = limitarPorDia(entrada.porDia);

    const agora = new Date();
    const nomeCampanha =
      entrada.nome.trim() ||
      `Lista — ${agora.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}`;

    // O texto da mensagem fica guardado como modelo interno da campanha
    // (a tela de agendamento não trabalha com modelos separados).
    let modelo = db.modelos.find((m) => m.clienteId === clienteId && m.texto === entrada.textoBase);
    if (!modelo) {
      modelo = {
        id: novoId("mod"),
        clienteId,
        nome: nomeCampanha,
        texto: entrada.textoBase,
        criadoEm: isoSP(agora),
        atualizadoEm: isoSP(agora),
      } satisfies Modelo;
      db.modelos.push(modelo);
    }

    // Sem coluna "empresa" no CSV, {{empresa}} vira o nome da empresa cliente.
    const nomeEmpresa = db.clientes.find((c) => c.id === clienteId)?.nomeEmpresa ?? "";
    const comEmpresa = entrada.destinatarios.map((d) => ({ ...d, empresa: d.empresa.trim() || nomeEmpresa }));
    const bloqueios = db.bloqueios.filter((b) => b.clienteId === clienteId).map((b) => b.telefone);
    const separacao = separarDestinatarios(comEmpresa, bloqueios);
    if (!separacao.aceitos.length) {
      throw new Error("Nenhum destinatário válido para enviar (todos bloqueados, repetidos ou inválidos).");
    }

    const campanha: Campanha = {
      id: novoId("cmp"),
      clienteId,
      numeroId: numero.id,
      modeloId: modelo.id,
      nome: nomeCampanha,
      textoBase: entrada.textoBase,
      agendamentoInicio: isoSP(agora),
      porDia,
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

    // Itens já na fila do mesmo número: esta campanha entra atrás deles.
    const campanhasDoNumero = new Set(db.campanhas.filter((c) => c.numeroId === numero.id).map((c) => c.id));
    const filaExistente = fila.itens.filter((i) => campanhasDoNumero.has(i.campanhaId));

    const itens = agendarEnvios({
      campanhaId: campanha.id,
      numero,
      porDia,
      inicio: agora,
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

// ---------------------------------------------------------------------------
// Resumo para as telas (Início e Campanhas)
// ---------------------------------------------------------------------------

export interface ResumoCampanha {
  campanha: Campanha;
  /** Contatos que vão receber a mensagem (total da lista menos bloqueados). */
  total: number;
  enviados: number;
  pendentes: number;
  /** Envios que falharam (já processados, não contam como pendentes). */
  falhas: number;
  situacao: SituacaoCampanha;
}

/**
 * Resume as campanhas do cliente na ordem em que foram criadas (a ordem da
 * fila): a primeira que ainda não terminou é a que está "enviando"; as
 * seguintes estão "na fila".
 */
export function resumirCampanhas(db: Db, clienteId: string): ResumoCampanha[] {
  const campanhas = db.campanhas
    .filter((c) => c.clienteId === clienteId)
    .sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());

  let ativaEncontrada = false;
  return campanhas.map((campanha) => {
    const envios = db.envios.filter((e) => e.campanhaId === campanha.id);
    const total = campanha.totalDestinatarios - campanha.ignoradosBloqueados;
    const enviados = envios.filter((e) => e.status === "enviado" || e.status === "entregue").length;
    const pendentes = envios.filter((e) => e.status === "pendente").length;
    const falhas = envios.filter((e) => e.status === "falhou").length;

    let situacao: SituacaoCampanha;
    if (campanha.status === "pausada") {
      situacao = "pausada";
    } else if (total > 0 && pendentes === 0) {
      situacao = "concluida";
    } else if (!ativaEncontrada) {
      situacao = "enviando";
      ativaEncontrada = true;
    } else {
      situacao = "na_fila";
    }
    return { campanha, total, enviados, pendentes, falhas, situacao };
  });
}

/** Quantas mensagens do cliente foram enviadas no dia informado (pela fila). */
export function enviadosNoDia(fila: Fila, idsCampanhas: ReadonlySet<string>, chaveDia: string): number {
  return fila.itens.filter(
    (i) =>
      idsCampanhas.has(i.campanhaId) &&
      (i.status === "enviado" || i.status === "entregue") &&
      i.agendadoPara.slice(0, 10) === chaveDia,
  ).length;
}
