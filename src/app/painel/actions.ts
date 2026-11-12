"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { entrar, exigirSessao, sair } from "@/lib/painel/auth";
import { criarCampanhaAgendada, type ResultadoNovaCampanha } from "@/lib/painel/campanhas";
import { comTrava, lerDb, salvarDb } from "@/lib/painel/db";
import { isoSP, normalizarTelefone, novoId, parseDataHoraLocalSP } from "@/lib/painel/fila";
import type { DestinatarioEntrada } from "@/lib/painel/types";

// ---------------------------------------------------------------------------
// Sessão
// ---------------------------------------------------------------------------

export async function entrarAction(_estado: { erro?: string }, formData: FormData): Promise<{ erro?: string }> {
  const email = String(formData.get("email") ?? "");
  const senha = String(formData.get("senha") ?? "");
  if (!(await entrar(email, senha))) return { erro: "E-mail ou senha incorretos." };
  redirect("/painel");
}

export async function sairAction() {
  await sair();
  redirect("/painel/login");
}

// ---------------------------------------------------------------------------
// Nova campanha
// ---------------------------------------------------------------------------

export interface AgendarCampanhaEntrada {
  nome: string;
  modeloId: string;
  textoBase: string;
  /** Valor do input datetime-local, interpretado no horário de Brasília. */
  inicio: string;
  destinatarios: DestinatarioEntrada[];
}

export type AgendarCampanhaResultado = { ok: true; resultado: ResultadoNovaCampanha } | { ok: false; erro: string };

export async function agendarCampanhaAction(entrada: AgendarCampanhaEntrada): Promise<AgendarCampanhaResultado> {
  const sessao = await exigirSessao();
  const inicio = parseDataHoraLocalSP(entrada.inicio);
  if (!inicio) return { ok: false, erro: "Informe a data e a hora de início." };
  if (!Array.isArray(entrada.destinatarios) || !entrada.destinatarios.length) {
    return { ok: false, erro: "Adicione pelo menos um destinatário." };
  }
  const destinatarios: DestinatarioEntrada[] = entrada.destinatarios.map((d) => ({
    nome: String(d.nome ?? ""),
    telefone: String(d.telefone ?? ""),
    empresa: String(d.empresa ?? ""),
    camposExtras: Object.fromEntries(Object.entries(d.camposExtras ?? {}).map(([k, v]) => [k, String(v)])),
  }));
  try {
    const resultado = await criarCampanhaAgendada(sessao.cliente.id, {
      nome: String(entrada.nome ?? ""),
      modeloId: String(entrada.modeloId ?? ""),
      textoBase: String(entrada.textoBase ?? ""),
      inicio,
      destinatarios,
    });
    revalidatePath("/painel", "layout");
    return { ok: true, resultado };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : "Não foi possível agendar a campanha." };
  }
}

// ---------------------------------------------------------------------------
// Modelos de mensagem
// ---------------------------------------------------------------------------

export async function salvarModeloAction(formData: FormData) {
  const sessao = await exigirSessao();
  const id = String(formData.get("id") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const texto = String(formData.get("texto") ?? "").trim();
  if (!nome || !texto) return;
  await comTrava(async () => {
    const db = await lerDb();
    const agora = isoSP(new Date());
    const existente = id && db.modelos.find((m) => m.id === id && m.clienteId === sessao.cliente.id);
    if (existente) {
      existente.nome = nome;
      existente.texto = texto;
      existente.atualizadoEm = agora;
    } else {
      db.modelos.push({ id: novoId("mod"), clienteId: sessao.cliente.id, nome, texto, criadoEm: agora, atualizadoEm: agora });
    }
    await salvarDb(db);
  });
  revalidatePath("/painel", "layout");
  redirect("/painel/configuracoes#modelos");
}

export async function excluirModeloAction(formData: FormData) {
  const sessao = await exigirSessao();
  const id = String(formData.get("id") ?? "");
  await comTrava(async () => {
    const db = await lerDb();
    db.modelos = db.modelos.filter((m) => !(m.id === id && m.clienteId === sessao.cliente.id));
    await salvarDb(db);
  });
  revalidatePath("/painel", "layout");
  redirect("/painel/configuracoes#modelos");
}

// ---------------------------------------------------------------------------
// Lista de bloqueio
// ---------------------------------------------------------------------------

export async function adicionarBloqueioAction(_estado: { erro?: string; ok?: boolean }, formData: FormData): Promise<{ erro?: string; ok?: boolean }> {
  const sessao = await exigirSessao();
  const telefone = normalizarTelefone(String(formData.get("telefone") ?? ""));
  const motivo = String(formData.get("motivo") ?? "").trim() || "Adicionado manualmente";
  if (telefone.length < 10) return { erro: "Telefone inválido. Use DDD + número, ex.: 11 90000-0000." };
  const erro = await comTrava(async () => {
    const db = await lerDb();
    if (db.bloqueios.some((b) => b.clienteId === sessao.cliente.id && b.telefone === telefone)) {
      return "Esse telefone já está na lista de bloqueio.";
    }
    db.bloqueios.push({ id: novoId("blq"), clienteId: sessao.cliente.id, telefone, motivo, criadoEm: isoSP(new Date()) });
    await salvarDb(db);
    return null;
  });
  if (erro) return { erro };
  revalidatePath("/painel", "layout");
  return { ok: true };
}

export async function removerBloqueioAction(formData: FormData) {
  const sessao = await exigirSessao();
  const id = String(formData.get("id") ?? "");
  await comTrava(async () => {
    const db = await lerDb();
    db.bloqueios = db.bloqueios.filter((b) => !(b.id === id && b.clienteId === sessao.cliente.id));
    await salvarDb(db);
  });
  revalidatePath("/painel", "layout");
}
