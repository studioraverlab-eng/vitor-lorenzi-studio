// Parser de CSV feito à mão: aspas, aspas escapadas (""), separador , ou ;
// (detectado pelo cabeçalho) e quebras de linha \n ou \r\n.
import type { DestinatarioEntrada } from "./types";

export function parseCsv(texto: string): string[][] {
  const conteudo = texto.replace(/^\uFEFF/, "");
  const primeiraLinha = conteudo.split(/\r?\n/, 1)[0] ?? "";
  const separador = (primeiraLinha.match(/;/g)?.length ?? 0) > (primeiraLinha.match(/,/g)?.length ?? 0) ? ";" : ",";

  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let emAspas = false;

  for (let i = 0; i < conteudo.length; i++) {
    const c = conteudo[i];
    if (emAspas) {
      if (c === '"' && conteudo[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') {
        emAspas = false;
      } else {
        campo += c;
      }
    } else if (c === '"') {
      emAspas = true;
    } else if (c === separador) {
      linha.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && conteudo[i + 1] === "\n") i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else {
      campo += c;
    }
  }
  if (campo !== "" || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }
  return linhas.filter((l) => l.some((v) => v.trim() !== ""));
}

const ALIASES: Record<string, "nome" | "telefone" | "empresa"> = {
  nome: "nome",
  name: "nome",
  telefone: "telefone",
  celular: "telefone",
  whatsapp: "telefone",
  fone: "telefone",
  phone: "telefone",
  empresa: "empresa",
  company: "empresa",
};

function normalizarCabecalho(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export interface ResultadoImportacao {
  destinatarios: DestinatarioEntrada[];
  camposExtras: string[];
  erros: string[];
}

/** Converte o CSV em destinatários. Colunas obrigatórias: nome, telefone. */
export function importarDestinatarios(texto: string): ResultadoImportacao {
  const linhas = parseCsv(texto);
  if (!linhas.length) return { destinatarios: [], camposExtras: [], erros: ["O arquivo está vazio."] };

  const cabecalho = linhas[0].map(normalizarCabecalho);
  const papeis = cabecalho.map((c) => ALIASES[c] ?? null);
  const erros: string[] = [];
  if (!papeis.includes("nome")) erros.push('Coluna "nome" não encontrada no cabeçalho.');
  if (!papeis.includes("telefone")) erros.push('Coluna "telefone" não encontrada no cabeçalho.');
  if (erros.length) return { destinatarios: [], camposExtras: [], erros };

  const camposExtras = cabecalho.filter((c, i) => !papeis[i] && c);
  const destinatarios: DestinatarioEntrada[] = [];
  linhas.slice(1).forEach((valores, idx) => {
    const d: DestinatarioEntrada = { nome: "", telefone: "", empresa: "", camposExtras: {} };
    cabecalho.forEach((coluna, i) => {
      const valor = (valores[i] ?? "").trim();
      const papel = papeis[i];
      if (papel) d[papel] = valor;
      else if (coluna) d.camposExtras[coluna] = valor;
    });
    if (!d.nome || !d.telefone) {
      erros.push(`Linha ${idx + 2}: nome ou telefone em branco — ignorada.`);
      return;
    }
    destinatarios.push(d);
  });
  return { destinatarios, camposExtras, erros };
}
