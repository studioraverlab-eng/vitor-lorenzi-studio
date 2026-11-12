// Formatação e rótulos em pt-BR usados nas telas.
import type { Classificacao, SituacaoCampanha, StatusCampanha, StatusDestinatario, StatusNumero } from "./types";

const FUSO = "America/Sao_Paulo";

export function formatarTelefone(telefone: string): string {
  const d = telefone.replace(/\D/g, "");
  const m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(d);
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : telefone;
}

export function formatarDataHora(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    timeZone: FUSO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: FUSO, day: "2-digit", month: "2-digit", year: "numeric" });
}

export const ROTULO_CLASSIFICACAO: Record<Classificacao, string> = {
  interesse: "Interesse",
  duvida: "Dúvida",
  ja_resolveu: "Já resolveu",
  pediu_parar: "Pediu para parar",
};

export const COR_CLASSIFICACAO: Record<Classificacao, string> = {
  interesse: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  duvida: "bg-sky-100 text-sky-800 ring-sky-200",
  ja_resolveu: "bg-slate-100 text-slate-700 ring-slate-200",
  pediu_parar: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const ROTULO_SITUACAO_CAMPANHA: Record<SituacaoCampanha, string> = {
  na_fila: "Na fila",
  enviando: "Enviando",
  concluida: "Concluída",
  pausada: "Pausada",
};

export const COR_SITUACAO_CAMPANHA: Record<SituacaoCampanha, string> = {
  na_fila: "bg-amber-100 text-amber-800 ring-amber-200",
  enviando: "bg-sky-100 text-sky-800 ring-sky-200",
  concluida: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  pausada: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const ROTULO_STATUS_CAMPANHA: Record<StatusCampanha, string> = {
  rascunho: "Rascunho",
  agendada: "Agendada",
  em_envio: "Em envio",
  concluida: "Concluída",
  pausada: "Pausada",
};

export const COR_STATUS_CAMPANHA: Record<StatusCampanha, string> = {
  rascunho: "bg-slate-100 text-slate-700 ring-slate-200",
  agendada: "bg-amber-100 text-amber-800 ring-amber-200",
  em_envio: "bg-sky-100 text-sky-800 ring-sky-200",
  concluida: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  pausada: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const ROTULO_STATUS_DESTINATARIO: Record<StatusDestinatario, string> = {
  pendente: "Pendente",
  na_fila: "Na fila",
  enviado: "Enviado",
  entregue: "Entregue",
  respondido: "Respondeu",
  bloqueado: "Bloqueado",
  falhou: "Falhou",
};

export const COR_STATUS_DESTINATARIO: Record<StatusDestinatario, string> = {
  pendente: "bg-slate-100 text-slate-700 ring-slate-200",
  na_fila: "bg-amber-100 text-amber-800 ring-amber-200",
  enviado: "bg-sky-100 text-sky-800 ring-sky-200",
  entregue: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  respondido: "bg-violet-100 text-violet-800 ring-violet-200",
  bloqueado: "bg-rose-100 text-rose-800 ring-rose-200",
  falhou: "bg-rose-100 text-rose-800 ring-rose-200",
};

export const ROTULO_STATUS_NUMERO: Record<StatusNumero, string> = {
  conectado: "Conectado",
  desconectado: "Desconectado",
  pausado: "Pausado",
};
