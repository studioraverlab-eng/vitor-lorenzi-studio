"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { agendarCampanhaAction, type AgendarCampanhaResultado } from "../../actions";
import { importarDestinatarios } from "@/lib/painel/csv";
import {
  POR_DIA_MAX,
  POR_DIA_MIN,
  POR_DIA_PADRAO,
  normalizarTelefone,
  renderizarMensagem,
  separarDestinatarios,
} from "@/lib/painel/fila";
import { formatarData, formatarTelefone } from "@/lib/painel/formato";
import type { DestinatarioEntrada } from "@/lib/painel/types";
import { Cartao, estiloBotao, estiloBotaoSecundario, estiloCampo } from "@/components/painel/ui";

interface Props {
  telefonesBloqueados: string[];
  nomeEmpresa: string;
  textoInicial: string;
}

const EXEMPLO_CSV =
  "nome,telefone\nMaria Silva,11 90000-1234\nJoão Souza,(11) 90000-5678\n";

/**
 * Interpreta a lista colada: um contato por linha, no formato
 * "Nome, telefone" (vale vírgula, ponto e vírgula ou tab). Linhas com só o
 * número também entram — nesse caso, o nome fica em branco.
 */
function interpretarColados(texto: string): { destinatarios: DestinatarioEntrada[]; ignoradas: number } {
  const destinatarios: DestinatarioEntrada[] = [];
  let ignoradas = 0;
  for (const linhaBruta of texto.split(/\r?\n/)) {
    const linha = linhaBruta.trim();
    if (!linha) continue;
    const partes = linha.split(/[;\t,]/).map((p) => p.trim()).filter(Boolean);
    const idxTelefone = partes.findIndex((p) => p.replace(/\D/g, "").length >= 10);
    if (idxTelefone === -1) {
      ignoradas++;
      continue;
    }
    const telefone = partes[idxTelefone];
    const outras = partes.filter((_, i) => i !== idxTelefone);
    destinatarios.push({
      nome: outras[0] ?? "",
      telefone,
      empresa: outras[1] ?? "",
      camposExtras: {},
    });
  }
  return { destinatarios, ignoradas };
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return <span className="mb-1 block text-sm font-medium text-slate-700">{children}</span>;
}

export function FormularioAgendar({ telefonesBloqueados, nomeEmpresa, textoInicial }: Props) {
  const [destinatarios, setDestinatarios] = useState<DestinatarioEntrada[]>([]);
  const [nomeLista, setNomeLista] = useState("");
  const [avisos, setAvisos] = useState<string[]>([]);
  const [colados, setColados] = useState("");
  const [texto, setTexto] = useState(textoInicial);
  const [porDia, setPorDia] = useState(POR_DIA_PADRAO);
  const [resultado, setResultado] = useState<AgendarCampanhaResultado | null>(null);
  const [enviando, iniciarEnvio] = useTransition();

  const separacao = useMemo(
    () => separarDestinatarios(destinatarios, telefonesBloqueados),
    [destinatarios, telefonesBloqueados],
  );
  const primeiro = separacao.aceitos[0];
  const diasUteis = separacao.aceitos.length && porDia > 0 ? Math.ceil(separacao.aceitos.length / porDia) : 0;

  async function aoEscolherArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    const importacao = importarDestinatarios(await arquivo.text());
    setAvisos(importacao.erros);
    setDestinatarios(importacao.destinatarios);
    setNomeLista(arquivo.name.replace(/\.csv$/i, ""));
    evento.target.value = "";
  }

  function aoColar(valor: string) {
    setColados(valor);
    const { destinatarios: lidos, ignoradas } = interpretarColados(valor);
    setDestinatarios(lidos);
    if (!nomeLista) setNomeLista("Lista colada");
    setAvisos(ignoradas > 0 ? [`${ignoradas} linha(s) sem telefone válido foram ignoradas.`] : []);
  }

  function agendar() {
    setResultado(null);
    iniciarEnvio(async () => {
      setResultado(
        await agendarCampanhaAction({
          nome: nomeLista,
          textoBase: texto,
          porDia,
          destinatarios,
        }),
      );
    });
  }

  if (resultado?.ok) {
    const r = resultado.resultado;
    return (
      <Cartao>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-marca-700">Pronto! Sua lista entrou na fila.</h2>
          <p className="text-sm text-slate-700">
            <strong>{r.enfileirados}</strong> mensagens serão enviadas, {porDia} por dia, de manhã e à tarde, em
            dias úteis — a última está prevista para {formatarData(r.ultimoEnvio)}.
          </p>
          {r.bloqueados > 0 && (
            <p className="text-sm text-slate-500">{r.bloqueados} contato(s) que pediram para não receber foram pulados.</p>
          )}
          {r.duplicados > 0 && <p className="text-sm text-slate-500">{r.duplicados} telefone(s) repetido(s) entraram uma vez só.</p>}
          {r.invalidos > 0 && <p className="text-sm text-slate-500">{r.invalidos} telefone(s) inválido(s) foram ignorados.</p>}
          <p className="text-sm text-slate-500">Se já houver outra campanha rodando, esta começa quando ela terminar.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/painel/campanhas" className={estiloBotao}>
              Ver campanhas
            </Link>
            <button
              type="button"
              className={estiloBotaoSecundario}
              onClick={() => {
                setResultado(null);
                setDestinatarios([]);
                setNomeLista("");
                setColados("");
                setAvisos([]);
              }}
            >
              Agendar outra lista
            </button>
          </div>
        </div>
      </Cartao>
    );
  }

  return (
    <div className="space-y-4">
      <Cartao titulo="1 · Lista de contatos">
        <Rotulo>Planilha (CSV com as colunas nome e telefone)</Rotulo>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={aoEscolherArquivo}
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-marca-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-marca-700 hover:file:bg-marca-100"
        />
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(EXEMPLO_CSV)}`}
          download="exemplo-contatos.csv"
          className="mt-2 inline-block text-xs text-marca-600 hover:underline"
        >
          Baixar planilha de exemplo
        </a>

        <div className="mt-4">
          <Rotulo>Ou cole a lista aqui (um contato por linha: Nome, telefone)</Rotulo>
          <textarea
            value={colados}
            onChange={(e) => aoColar(e.target.value)}
            rows={5}
            placeholder={"Maria Silva, 11 90000-1234\nJoão Souza, 11 90000-5678"}
            className={estiloCampo}
          />
        </div>

        {avisos.length > 0 && (
          <ul className="mt-3 space-y-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            {avisos.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}

        {destinatarios.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">
            <strong>{separacao.aceitos.length}</strong> contato(s) na lista
            {separacao.bloqueados.length > 0 && <> · {separacao.bloqueados.length} bloqueado(s), serão pulados</>}
            {separacao.duplicados > 0 && <> · {separacao.duplicados} repetido(s)</>}
            {separacao.invalidos > 0 && <> · {separacao.invalidos} inválido(s)</>}
          </p>
        )}
      </Cartao>

      <Cartao titulo="2 · Mensagem">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          placeholder={`Olá, {{nome}}! Aqui é da ${nomeEmpresa}…`}
          className={estiloCampo}
        />
        <p className="mt-2 text-xs text-slate-500">
          Use {"{{nome}}"} para chamar cada pessoa pelo nome e {"{{empresa}}"} para o nome da empresa dela.
        </p>
        {primeiro && texto.trim() && (
          <div className="mt-3 rounded-xl bg-[#e9e3d8] p-4">
            <p className="mb-1 text-xs text-slate-600">
              Prévia para {primeiro.nome || formatarTelefone(normalizarTelefone(primeiro.telefone))}
            </p>
            <p className="max-w-sm whitespace-pre-wrap rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm shadow-sm">
              {renderizarMensagem(texto, primeiro)}
            </p>
          </div>
        )}
      </Cartao>

      <Cartao titulo="3 · Ritmo e envio">
        <label className="block max-w-xs">
          <Rotulo>Quantos enviar por dia</Rotulo>
          <input
            type="number"
            min={POR_DIA_MIN}
            max={POR_DIA_MAX}
            value={porDia}
            onChange={(e) => setPorDia(Number(e.target.value))}
            className={estiloCampo}
          />
        </label>
        <p className="mt-3 text-sm text-slate-500">Enviamos todos os dias, de manhã e à tarde, até a lista acabar.</p>
        {diasUteis > 0 && (
          <p className="mt-1 text-sm text-slate-500">
            Com {separacao.aceitos.length} contatos a {porDia} por dia, a lista termina em cerca de {diasUteis}{" "}
            {diasUteis === 1 ? "dia útil" : "dias úteis"}.
          </p>
        )}
        <button
          type="button"
          onClick={agendar}
          disabled={enviando || !separacao.aceitos.length || !texto.trim()}
          className={`${estiloBotao} mt-4 px-6 py-3 text-base`}
        >
          {enviando ? "Agendando…" : "Agendar"}
        </button>
        {!separacao.aceitos.length && (
          <p className="mt-2 text-xs text-slate-400">Anexe a planilha ou cole a lista para liberar o agendamento.</p>
        )}
        {resultado && !resultado.ok && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{resultado.erro}</p>
        )}
      </Cartao>
    </div>
  );
}
