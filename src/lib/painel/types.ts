// Modelo de dados local (data/db.json e data/fila.json).
// Equivalente em Postgres/Supabase documentado em docs/painel/SCHEMA.md.

export type StatusNumero = "conectado" | "desconectado" | "pausado";

export type StatusCampanha =
  | "rascunho"
  | "agendada"
  | "em_envio"
  | "concluida"
  | "pausada";

/** Situação exibida ao cliente, derivada do andamento (ver resumirCampanhas). */
export type SituacaoCampanha = "na_fila" | "enviando" | "concluida" | "pausada";

export type StatusDestinatario =
  | "pendente"
  | "na_fila"
  | "enviado"
  | "entregue"
  | "respondido"
  | "bloqueado"
  | "falhou";

export type StatusEnvio = "pendente" | "enviado" | "entregue" | "falhou";

export type StatusItemFila =
  | "pendente"
  | "enviado"
  | "entregue"
  | "falhou"
  | "cancelado";

export type Classificacao =
  | "interesse"
  | "duvida"
  | "ja_resolveu"
  | "pediu_parar";

export interface Cliente {
  id: string;
  nomeEmpresa: string;
  contatoNome: string;
  email: string;
  criadoEm: string;
}

export interface Usuario {
  id: string;
  clienteId: string;
  nome: string;
  email: string;
  /** DEMO: senha em texto puro apenas para a demonstração local. */
  senhaDemo: string;
  papel: "admin" | "operador";
}

export interface NumeroWhatsapp {
  id: string;
  clienteId: string;
  telefone: string;
  conectadoEm: string;
  status: StatusNumero;
}

export interface Modelo {
  id: string;
  clienteId: string;
  nome: string;
  texto: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Campanha {
  id: string;
  clienteId: string;
  numeroId: string;
  modeloId: string;
  nome: string;
  textoBase: string;
  agendamentoInicio: string;
  /** Quantas mensagens enviar por dia nesta campanha (padrão 30). */
  porDia: number;
  status: StatusCampanha;
  totalDestinatarios: number;
  ignoradosBloqueados: number;
  criadoEm: string;
}

export interface Destinatario {
  id: string;
  campanhaId: string;
  nome: string;
  telefone: string;
  empresa: string;
  camposExtras: Record<string, string>;
  status: StatusDestinatario;
}

export interface Envio {
  id: string;
  campanhaId: string;
  destinatarioId: string;
  telefone: string;
  mensagemRenderizada: string;
  agendadoPara: string;
  enviadoEm: string | null;
  entregueEm: string | null;
  status: StatusEnvio;
}

export interface Resposta {
  id: string;
  campanhaId: string;
  destinatarioId: string;
  telefone: string;
  textoOriginal: string;
  classificacao: Classificacao;
  virouAgendamento: boolean;
  recebidaEm: string;
}

export interface Bloqueio {
  id: string;
  clienteId: string;
  telefone: string;
  motivo: string;
  criadoEm: string;
}

export interface Db {
  clientes: Cliente[];
  usuarios: Usuario[];
  numeros: NumeroWhatsapp[];
  modelos: Modelo[];
  campanhas: Campanha[];
  destinatarios: Destinatario[];
  envios: Envio[];
  respostas: Resposta[];
  bloqueios: Bloqueio[];
}

export interface ItemFila {
  id: string;
  campanhaId: string;
  envioId: string;
  destinatarioId: string;
  telefone: string;
  mensagem: string;
  agendadoPara: string;
  status: StatusItemFila;
  tentativas: number;
}

export interface Fila {
  itens: ItemFila[];
}

/** Destinatário como chega da importação (CSV ou cadastro manual). */
export interface DestinatarioEntrada {
  nome: string;
  telefone: string;
  empresa: string;
  camposExtras: Record<string, string>;
}
