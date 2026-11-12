// Motor de fila: transforma os destinatários de uma campanha em itens de
// envio com horário marcado, seguindo as regras de cadência:
//
//   1. Só dias úteis (seg–sex), em dois períodos: manhã (09:00–12:30) e
//      tarde (13:30–18:00), no horário de Brasília (America/Sao_Paulo).
//   2. Cada campanha tem sua cota diária (padrão 30/dia), dividida entre os
//      dois períodos — metade de manhã, metade à tarde (30 = 15 + 15).
//   3. Intervalo aleatório de 2 a 5 minutos entre uma mensagem e outra,
//      dentro de cada período.
//   4. As campanhas de um número andam em fila, uma atrás da outra: uma
//      campanha nova só começa depois que a anterior termina.
//   5. Teto diário de segurança por número, com aquecimento semanal
//      (20, 30, 40… máx. 60), somando todas as campanhas do número.
//   6. Telefones bloqueados (opt-out) ficam de fora.
//   7. Telefone repetido na mesma campanha entra uma vez só.
//   8. Toda mensagem é renderizada com os campos do destinatário.
//
// Este módulo é puro (sem fs e sem APIs do Next) e só usa Web Crypto, então
// roda no servidor, no navegador (prévias) e no script de seed (Node).

import type {
  DestinatarioEntrada,
  ItemFila,
  NumeroWhatsapp,
} from "./types";

export const FUSO = "America/Sao_Paulo";

/** Períodos de envio do dia: a cota diária se divide entre manhã e tarde. */
export const PERIODOS = [
  { nome: "manha", hora: 9, minuto: 0, fimMin: 12 * 60 + 30 },
  { nome: "tarde", hora: 13, minuto: 30, fimMin: 18 * 60 },
] as const;

export const INICIO_EXPEDIENTE_MIN = PERIODOS[0].hora * 60 + PERIODOS[0].minuto;
export const FIM_MANHA_MIN = PERIODOS[0].fimMin;
export const INICIO_TARDE_MIN = PERIODOS[1].hora * 60 + PERIODOS[1].minuto;
export const FIM_EXPEDIENTE_MIN = PERIODOS[1].fimMin;
export const INTERVALO_MIN_SEG = 2 * 60;
export const INTERVALO_MAX_SEG = 5 * 60;

/** Cota diária padrão de uma campanha e limites do campo "por dia". */
export const POR_DIA_PADRAO = 30;
export const POR_DIA_MIN = 1;
export const POR_DIA_MAX = 60;

export const TETO_SEMANA_1 = 20;
export const TETO_INCREMENTO_SEMANAL = 10;
export const TETO_MAXIMO = 60;

// ---------------------------------------------------------------------------
// Datas no fuso de São Paulo
// ---------------------------------------------------------------------------

export interface PartesData {
  ano: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
  segundo: number;
  /** 0 = domingo … 6 = sábado */
  diaSemana: number;
}

const formatadorPartes = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});

const DIAS_SEMANA = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function partesSP(data: Date): PartesData {
  const partes: Record<string, string> = {};
  for (const p of formatadorPartes.formatToParts(data)) partes[p.type] = p.value;
  return {
    ano: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour),
    minuto: Number(partes.minute),
    segundo: Number(partes.second),
    diaSemana: DIAS_SEMANA.indexOf(partes.weekday),
  };
}

/** Diferença em minutos entre o horário de SP e UTC naquele instante (ex.: -180). */
function offsetMinutosSP(data: Date): number {
  const p = partesSP(data);
  const comoUtc = Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto, p.segundo);
  const instante = Math.floor(data.getTime() / 1000) * 1000;
  return Math.round((comoUtc - instante) / 60000);
}

/** Cria o instante correspondente a uma data/hora "de parede" em SP. Aceita dia/hora transbordando. */
export function dataSP(ano: number, mes: number, dia: number, hora = 0, minuto = 0, segundo = 0): Date {
  const palpite = Date.UTC(ano, mes - 1, dia, hora, minuto, segundo);
  const offset = offsetMinutosSP(new Date(palpite));
  return new Date(palpite - offset * 60000);
}

const dois = (n: number) => String(n).padStart(2, "0");

/** ISO 8601 com o fuso de SP explícito, ex.: 2026-11-16T09:03:27-03:00 */
export function isoSP(data: Date): string {
  const p = partesSP(data);
  const off = offsetMinutosSP(data);
  const sinal = off <= 0 ? "-" : "+";
  const abs = Math.abs(off);
  return (
    `${p.ano}-${dois(p.mes)}-${dois(p.dia)}T${dois(p.hora)}:${dois(p.minuto)}:${dois(p.segundo)}` +
    `${sinal}${dois(Math.floor(abs / 60))}:${dois(abs % 60)}`
  );
}

/** Chave do dia em SP, ex.: "2026-11-16". */
export function chaveDiaSP(data: Date): string {
  const p = partesSP(data);
  return `${p.ano}-${dois(p.mes)}-${dois(p.dia)}`;
}

/** Interpreta "2026-11-16T09:00" (input datetime-local) como horário de SP. */
export function parseDataHoraLocalSP(valor: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(valor);
  if (!m) return null;
  return dataSP(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]));
}

function diasEntre(inicio: Date, fim: Date): number {
  const a = partesSP(inicio);
  const b = partesSP(fim);
  const ua = Date.UTC(a.ano, a.mes - 1, a.dia);
  const ub = Date.UTC(b.ano, b.mes - 1, b.dia);
  return Math.floor((ub - ua) / 86400000);
}

// ---------------------------------------------------------------------------
// Aquecimento e teto diário
// ---------------------------------------------------------------------------

/** Semana de aquecimento (1, 2, 3…) do número na data informada. */
export function semanaAquecimento(numero: Pick<NumeroWhatsapp, "conectadoEm">, data: Date = new Date()): number {
  const dias = Math.max(0, diasEntre(new Date(numero.conectadoEm), data));
  return Math.floor(dias / 7) + 1;
}

/**
 * Teto de segurança do número no dia (todas as campanhas somadas):
 * semana 1 = 20, +10 por semana, máximo 60. A cota de cada campanha
 * (porDia) vale até este teto.
 */
export function tetoDiario(numero: Pick<NumeroWhatsapp, "conectadoEm">, data: Date = new Date()): number {
  const semana = semanaAquecimento(numero, data);
  return Math.min(TETO_SEMANA_1 + TETO_INCREMENTO_SEMANAL * (semana - 1), TETO_MAXIMO);
}

// ---------------------------------------------------------------------------
// Mensagens e telefones
// ---------------------------------------------------------------------------

/** Mantém só dígitos; números brasileiros sem DDI recebem 55. */
export function normalizarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10 || digitos.length === 11) return `55${digitos}`;
  return digitos;
}

/** Substitui {{nome}}, {{empresa}} e campos livres. Campos ausentes ficam vazios. */
export function renderizarMensagem(texto: string, destinatario: DestinatarioEntrada): string {
  const campos: Record<string, string> = {};
  for (const [chave, valor] of Object.entries(destinatario.camposExtras ?? {})) {
    campos[chave.trim().toLowerCase()] = valor;
  }
  campos.nome = destinatario.nome;
  campos.primeiro_nome = destinatario.nome.trim().split(/\s+/)[0] ?? "";
  campos.empresa = destinatario.empresa;
  campos.telefone = destinatario.telefone;
  return texto
    .replace(/\{\{\s*([\wÀ-ſ-]+)\s*\}\}/g, (_, chave: string) => campos[chave.toLowerCase()] ?? "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Campos {{...}} usados num texto de modelo. */
export function camposDoTexto(texto: string): string[] {
  const achados = new Set<string>();
  for (const m of texto.matchAll(/\{\{\s*([\wÀ-ſ-]+)\s*\}\}/g)) achados.add(m[1].toLowerCase());
  return [...achados];
}

// ---------------------------------------------------------------------------
// Aleatoriedade
// ---------------------------------------------------------------------------

/** Inteiro aleatório em [min, max] usando Web Crypto (aleatoriedade real). */
export function inteiroAleatorio(min: number, max: number): number {
  const faixa = max - min + 1;
  const limite = Math.floor(0x100000000 / faixa) * faixa;
  const buf = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(buf);
  } while (buf[0] >= limite);
  return min + (buf[0] % faixa);
}

export function novoId(prefixo: string): string {
  return `${prefixo}_${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

// ---------------------------------------------------------------------------
// Separação de destinatários (dedup + bloqueios)
// ---------------------------------------------------------------------------

export interface SeparacaoDestinatarios {
  aceitos: DestinatarioEntrada[];
  bloqueados: DestinatarioEntrada[];
  duplicados: number;
  invalidos: number;
}

export function separarDestinatarios(
  entrada: DestinatarioEntrada[],
  telefonesBloqueados: Iterable<string>,
): SeparacaoDestinatarios {
  const bloqueio = new Set([...telefonesBloqueados].map(normalizarTelefone));
  const vistos = new Set<string>();
  const resultado: SeparacaoDestinatarios = { aceitos: [], bloqueados: [], duplicados: 0, invalidos: 0 };
  for (const d of entrada) {
    const telefone = normalizarTelefone(d.telefone);
    if (telefone.length < 10) {
      resultado.invalidos++;
      continue;
    }
    if (vistos.has(telefone)) {
      resultado.duplicados++;
      continue;
    }
    vistos.add(telefone);
    const normalizado = { ...d, nome: d.nome.trim(), empresa: d.empresa.trim(), telefone };
    if (bloqueio.has(telefone)) resultado.bloqueados.push(normalizado);
    else resultado.aceitos.push(normalizado);
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// Agendamento
// ---------------------------------------------------------------------------

export interface EnvioParaAgendar {
  envioId: string;
  destinatarioId: string;
  telefone: string;
  /** Mensagem já renderizada para o destinatário. */
  mensagem: string;
}

export interface ParametrosAgendamento {
  campanhaId: string;
  numero: Pick<NumeroWhatsapp, "conectadoEm">;
  /** Cota diária DESTA campanha (mensagens por dia, divididas manhã/tarde). */
  porDia: number;
  /** A partir de quando a campanha pode começar. */
  inicio: Date;
  envios: EnvioParaAgendar[];
  /**
   * Itens já existentes na fila do MESMO número (campanhas anteriores):
   * a campanha nova começa depois deles e eles contam no teto do número.
   */
  filaExistente: Pick<ItemFila, "agendadoPara" | "status">[];
  /** Injetável para testes; padrão = Web Crypto. */
  aleatorio?: (min: number, max: number) => number;
}

/** 0 = manhã, 1 = tarde. Fora dos períodos, retorna o período mais próximo. */
function periodoDoMinuto(minutoDoDia: number): number {
  return minutoDoDia < FIM_MANHA_MIN ? 0 : 1;
}

function inicioPeriodo(p: PartesData, periodo: number): Date {
  const per = PERIODOS[periodo];
  return dataSP(p.ano, p.mes, p.dia, per.hora, per.minuto);
}

function proximoDiaInicio(p: PartesData): Date {
  return dataSP(p.ano, p.mes, p.dia + 1, PERIODOS[0].hora, PERIODOS[0].minuto);
}

/** Metade de uma cota para a manhã; a tarde fica com o restante (30 → 15 + 15). */
function metadeManha(cota: number): number {
  return Math.ceil(cota / 2);
}

/**
 * Gera os itens da fila de uma campanha. Não persiste nada — quem chama grava
 * em data/fila.json (ver src/lib/campanhas.ts).
 */
export function agendarEnvios(params: ParametrosAgendamento): ItemFila[] {
  const aleatorio = params.aleatorio ?? inteiroAleatorio;
  const porDia = Math.min(POR_DIA_MAX, Math.max(POR_DIA_MIN, Math.floor(params.porDia) || POR_DIA_PADRAO));

  // Uso do número (todas as campanhas) a partir da fila existente.
  const usoNumeroDia = new Map<string, number>();
  const usoNumeroPeriodo = new Map<string, number>();
  let ultimoExistente = 0;

  for (const item of params.filaExistente) {
    if (item.status === "cancelado") continue;
    const quando = new Date(item.agendadoPara);
    const p = partesSP(quando);
    const dia = chaveDiaSP(quando);
    const periodo = periodoDoMinuto(p.hora * 60 + p.minuto);
    usoNumeroDia.set(dia, (usoNumeroDia.get(dia) ?? 0) + 1);
    usoNumeroPeriodo.set(`${dia}#${periodo}`, (usoNumeroPeriodo.get(`${dia}#${periodo}`) ?? 0) + 1);
    ultimoExistente = Math.max(ultimoExistente, quando.getTime());
  }

  // Uso desta campanha (só os itens criados agora).
  const usoCampanhaDia = new Map<string, number>();
  const usoCampanhaPeriodo = new Map<string, number>();

  // Nunca encostar no último envio já agendado do mesmo número: a campanha
  // nova entra na fila atrás das anteriores.
  let cursor = new Date(
    Math.max(
      params.inicio.getTime(),
      ultimoExistente ? ultimoExistente + aleatorio(INTERVALO_MIN_SEG, INTERVALO_MAX_SEG) * 1000 : 0,
    ),
  );

  const itens: ItemFila[] = [];
  for (const envio of params.envios) {
    // Avança o cursor até um horário que respeite todas as regras.
    for (let guarda = 0; ; guarda++) {
      if (guarda > 10000) throw new Error("Não foi possível encontrar horário para o envio.");
      const p = partesSP(cursor);
      const minutoDoDia = p.hora * 60 + p.minuto;
      const jitterInicio = () => aleatorio(0, 90) * 1000;

      // Fim de semana ou depois do expediente: manhã do dia seguinte.
      if (p.diaSemana === 0 || p.diaSemana === 6 || minutoDoDia >= FIM_EXPEDIENTE_MIN) {
        cursor = new Date(proximoDiaInicio(p).getTime() + jitterInicio());
        continue;
      }
      // Antes de abrir: manhã de hoje.
      if (minutoDoDia < INICIO_EXPEDIENTE_MIN) {
        cursor = new Date(inicioPeriodo(p, 0).getTime() + jitterInicio());
        continue;
      }
      // Pausa do almoço: tarde de hoje.
      if (minutoDoDia >= FIM_MANHA_MIN && minutoDoDia < INICIO_TARDE_MIN) {
        cursor = new Date(inicioPeriodo(p, 1).getTime() + jitterInicio());
        continue;
      }

      const dia = chaveDiaSP(cursor);
      const periodo = periodoDoMinuto(minutoDoDia);
      const teto = tetoDiario(params.numero, cursor);

      // Cota do dia cheia (da campanha ou do número): manhã do dia seguinte.
      if ((usoCampanhaDia.get(dia) ?? 0) >= porDia || (usoNumeroDia.get(dia) ?? 0) >= teto) {
        cursor = new Date(proximoDiaInicio(p).getTime() + jitterInicio());
        continue;
      }

      // Cota do período cheia: próximo período (tarde de hoje ou manhã de amanhã).
      const cotaPeriodoCampanha = periodo === 0 ? metadeManha(porDia) : porDia - metadeManha(porDia);
      const cotaPeriodoNumero = periodo === 0 ? metadeManha(teto) : teto - metadeManha(teto);
      if (
        (usoCampanhaPeriodo.get(`${dia}#${periodo}`) ?? 0) >= cotaPeriodoCampanha ||
        (usoNumeroPeriodo.get(`${dia}#${periodo}`) ?? 0) >= cotaPeriodoNumero
      ) {
        cursor =
          periodo === 0
            ? new Date(inicioPeriodo(p, 1).getTime() + jitterInicio())
            : new Date(proximoDiaInicio(p).getTime() + jitterInicio());
        continue;
      }

      usoCampanhaDia.set(dia, (usoCampanhaDia.get(dia) ?? 0) + 1);
      usoCampanhaPeriodo.set(`${dia}#${periodo}`, (usoCampanhaPeriodo.get(`${dia}#${periodo}`) ?? 0) + 1);
      usoNumeroDia.set(dia, (usoNumeroDia.get(dia) ?? 0) + 1);
      usoNumeroPeriodo.set(`${dia}#${periodo}`, (usoNumeroPeriodo.get(`${dia}#${periodo}`) ?? 0) + 1);
      break;
    }

    itens.push({
      id: novoId("fila"),
      campanhaId: params.campanhaId,
      envioId: envio.envioId,
      destinatarioId: envio.destinatarioId,
      telefone: envio.telefone,
      mensagem: envio.mensagem,
      agendadoPara: isoSP(cursor),
      status: "pendente",
      tentativas: 0,
    });

    cursor = new Date(cursor.getTime() + aleatorio(INTERVALO_MIN_SEG, INTERVALO_MAX_SEG) * 1000);
  }
  return itens;
}
