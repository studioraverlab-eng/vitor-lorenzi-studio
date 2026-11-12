"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { entrar, exigirSessao, sair } from "@/lib/painel/auth";
import { criarCampanhaAgendada, type ResultadoNovaCampanha } from "@/lib/painel/campanhas";
import { POR_DIA_PADRAO } from "@/lib/painel/fila";
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
// Agendar envio (uma lista/planilha nova entra no fim da fila)
// ---------------------------------------------------------------------------

export interface AgendarCampanhaEntrada {
  /** Nome da lista (em geral, o nome da planilha anexada). */
  nome: string;
  textoBase: string;
  /** Quantas mensagens enviar por dia. */
  porDia: number;
  destinatarios: DestinatarioEntrada[];
}

export type AgendarCampanhaResultado = { ok: true; resultado: ResultadoNovaCampanha } | { ok: false; erro: string };

export async function agendarCampanhaAction(entrada: AgendarCampanhaEntrada): Promise<AgendarCampanhaResultado> {
  const sessao = await exigirSessao();
  if (!String(entrada.textoBase ?? "").trim()) return { ok: false, erro: "Escreva a mensagem antes de agendar." };
  if (!Array.isArray(entrada.destinatarios) || !entrada.destinatarios.length) {
    return { ok: false, erro: "Adicione a lista de contatos (planilha ou lista colada)." };
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
      textoBase: String(entrada.textoBase ?? ""),
      porDia: Number(entrada.porDia) || POR_DIA_PADRAO,
      destinatarios,
    });
    revalidatePath("/painel", "layout");
    return { ok: true, resultado };
  } catch (erro) {
    return { ok: false, erro: erro instanceof Error ? erro.message : "Não foi possível agendar o envio." };
  }
}
