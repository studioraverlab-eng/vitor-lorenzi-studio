// Camada de dados local: arquivos JSON em data/. Só roda no servidor.
// Na produção, trocar estas funções por consultas ao Supabase/Postgres
// (tabelas equivalentes em docs/painel/SCHEMA.md) mantendo as mesmas assinaturas.
import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Db, Fila } from "./types";

const DIR_DADOS = path.join(process.cwd(), "data");
const ARQ_DB = path.join(DIR_DADOS, "db.json");
const ARQ_FILA = path.join(DIR_DADOS, "fila.json");

const DB_VAZIO: Db = {
  clientes: [],
  usuarios: [],
  numeros: [],
  modelos: [],
  campanhas: [],
  destinatarios: [],
  envios: [],
  respostas: [],
  bloqueios: [],
};

async function lerJson<T>(arquivo: string, padrao: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(arquivo, "utf8")) as T;
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return padrao;
    throw erro;
  }
}

/** Grava de forma atômica (arquivo temporário + rename) para não corromper o JSON. */
async function gravarJson(arquivo: string, dados: unknown): Promise<void> {
  await fs.mkdir(DIR_DADOS, { recursive: true });
  const tmp = `${arquivo}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(dados, null, 2) + "\n", "utf8");
  await fs.rename(tmp, arquivo);
}

export async function lerDb(): Promise<Db> {
  return { ...DB_VAZIO, ...(await lerJson<Partial<Db>>(ARQ_DB, {})) };
}

export async function salvarDb(db: Db): Promise<void> {
  await gravarJson(ARQ_DB, db);
}

export async function lerFila(): Promise<Fila> {
  const fila = await lerJson<Partial<Fila>>(ARQ_FILA, {});
  return { itens: fila.itens ?? [] };
}

export async function salvarFila(fila: Fila): Promise<void> {
  await gravarJson(ARQ_FILA, fila);
}

// Escritas serializadas dentro do processo: evita que duas ações
// simultâneas leiam o mesmo estado e uma sobrescreva a outra.
let corrente: Promise<unknown> = Promise.resolve();

export function comTrava<T>(tarefa: () => Promise<T>): Promise<T> {
  const resultado = corrente.then(tarefa, tarefa);
  corrente = resultado.catch(() => undefined);
  return resultado;
}
