"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { agendarCampanhaAction, type AgendarCampanhaResultado } from "../../actions";
import { importarDestinatarios } from "@/lib/painel/csv";
import { camposDoTexto, normalizarTelefone, renderizarMensagem, separarDestinatarios } from "@/lib/painel/fila";
import { formatarDataHora, formatarTelefone } from "@/lib/painel/formato";
import type { DestinatarioEntrada } from "@/lib/painel/types";
import { Cartao, Vazio, estiloBotao, estiloBotaoSecundario, estiloCampo } from "@/components/painel/ui";

interface Props {
  modelos: { id: string; nome: string; texto: string }[];
  telefonesBloqueados: string[];
  nomeEmpresa: string;
  inicioSugerido: string;
  numeroAtivo: boolean;
}

const EXEMPLO_CSV = "nome,telefone,empresa,procedimento\nMaria Silva,11 90000-1234,Clínica Vitta,limpeza de pele\nJoão Souza,(11) 90000-5678,Clínica Vitta,fisioterapia\n";

function Passo({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <Cartao
      titulo={
        <span className="flex items-center gap-2 normal-case tracking-normal">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-marca-600 text-xs text-white">{numero}</span>
          <span className="text-base text-slate-900">{titulo}</span>
        </span>
      }
      className="mb-4"
    >
      {children}
    </Cartao>
  );
}

export function AssistenteCampanha({ modelos, telefonesBloqueados, nomeEmpresa, inicioSugerido, numeroAtivo }: Props) {
  const [destinatarios, setDestinatarios] = useState<DestinatarioEntrada[]>([]);
  const [avisosCsv, setAvisosCsv] = useState<string[]>([]);
  const [manual, setManual] = useState({ nome: "", telefone: "", empresa: "" });
  const [modeloId, setModeloId] = useState(modelos[0]?.id ?? "");
  const [texto, setTexto] = useState(modelos[0]?.texto ?? "");
  const [nomeCampanha, setNomeCampanha] = useState("");
  const [inicio, setInicio] = useState(inicioSugerido);
  const [resultado, setResultado] = useState<AgendarCampanhaResultado | null>(null);
  const [enviando, iniciarEnvio] = useTransition();

  const separacao = useMemo(() => separarDestinatarios(destinatarios, telefonesBloqueados), [destinatarios, telefonesBloqueados]);
  const bloqueadosSet = useMemo(() => new Set(telefonesBloqueados.map(normalizarTelefone)), [telefonesBloqueados]);
  const camposExtras = useMemo(() => [...new Set(destinatarios.flatMap((d) => Object.keys(d.camposExtras)))], [destinatarios]);
  const camposFaltando = camposDoTexto(texto).filter((c) => !["nome", "primeiro_nome", "empresa", "telefone", ...camposExtras].includes(c));

  function comEmpresaPadrao(d: DestinatarioEntrada): DestinatarioEntrada {
    return { ...d, empresa: d.empresa || nomeEmpresa };
  }

  async function aoEscolherArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    const importacao = importarDestinatarios(await arquivo.text());
    setAvisosCsv(importacao.erros);
    setDestinatarios((atuais) => [...atuais, ...importacao.destinatarios.map(comEmpresaPadrao)]);
    evento.target.value = "";
  }

  function adicionarManual(evento: React.FormEvent) {
    evento.preventDefault();
    if (!manual.nome.trim() || !manual.telefone.trim()) return;
    setDestinatarios((atuais) => [...atuais, comEmpresaPadrao({ ...manual, camposExtras: {} })]);
    setManual({ nome: "", telefone: "", empresa: "" });
  }

  function escolherModelo(id: string) {
    setModeloId(id);
    setTexto(modelos.find((m) => m.id === id)?.texto ?? "");
  }

  function confirmar() {
    setResultado(null);
    iniciarEnvio(async () => {
      setResultado(await agendarCampanhaAction({ nome: nomeCampanha, modeloId, textoBase: texto, inicio, destinatarios }));
    });
  }

  if (resultado?.ok) {
    const r = resultado.resultado;
    return (
      <Cartao>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-marca-700">Campanha agendada!</h2>
          <ul className="space-y-1 text-sm text-slate-700">
            <li>
              <strong>{r.enfileirados}</strong> mensagens programadas, do dia {formatarDataHora(r.primeiroEnvio)} até {formatarDataHora(r.ultimoEnvio)}.
            </li>
            {r.bloqueados > 0 && <li>{r.bloqueados} destinatário(s) da lista de bloqueio foram pulados.</li>}
            {r.duplicados > 0 && <li>{r.duplicados} telefone(s) repetido(s) entraram uma vez só.</li>}
            {r.invalidos > 0 && <li>{r.invalidos} telefone(s) inválido(s) foram ignorados.</li>}
          </ul>
          <p className="text-sm text-slate-500">
            Os envios respeitam horário comercial, rodadas espaçadas e o teto diário do número. Acompanhe pelo relatório.
          </p>
          <div className="flex gap-2">
            <Link href={`/painel/relatorios/${r.campanhaId}`} className={estiloBotao}>
              Ver relatório da campanha
            </Link>
            <button
              type="button"
              className={estiloBotaoSecundario}
              onClick={() => {
                setResultado(null);
                setDestinatarios([]);
                setNomeCampanha("");
              }}
            >
              Criar outra campanha
            </button>
          </div>
        </div>
      </Cartao>
    );
  }

  const previas = separacao.aceitos.slice(0, 3);

  return (
    <>
      <Passo numero={1} titulo="Destinatários">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm text-slate-600">
              Importe uma planilha CSV com as colunas <strong>nome</strong> e <strong>telefone</strong> (opcional: <strong>empresa</strong> e
              outras colunas, que viram campos para a mensagem).
            </p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={aoEscolherArquivo}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-marca-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-marca-700 hover:file:bg-marca-100"
            />
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(EXEMPLO_CSV)}`}
              download="exemplo-destinatarios.csv"
              className="mt-2 inline-block text-xs text-marca-600 hover:underline"
            >
              Baixar planilha de exemplo
            </a>
            {avisosCsv.length > 0 && (
              <ul className="mt-2 space-y-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                {avisosCsv.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </div>
          <form onSubmit={adicionarManual} className="space-y-2">
            <p className="text-sm text-slate-600">Ou adicione manualmente:</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input value={manual.nome} onChange={(e) => setManual({ ...manual, nome: e.target.value })} placeholder="Nome" className={estiloCampo} />
              <input value={manual.telefone} onChange={(e) => setManual({ ...manual, telefone: e.target.value })} placeholder="Telefone com DDD" inputMode="tel" className={estiloCampo} />
              <input value={manual.empresa} onChange={(e) => setManual({ ...manual, empresa: e.target.value })} placeholder={`Empresa (${nomeEmpresa})`} className={estiloCampo} />
            </div>
            <button type="submit" className={estiloBotaoSecundario}>
              + Adicionar
            </button>
          </form>
        </div>

        <div className="mt-5">
          {destinatarios.length ? (
            <>
              <p className="mb-2 text-sm text-slate-600">
                <strong>{separacao.aceitos.length}</strong> serão enviados
                {separacao.bloqueados.length > 0 && <> · {separacao.bloqueados.length} na lista de bloqueio (serão pulados)</>}
                {separacao.duplicados > 0 && <> · {separacao.duplicados} repetido(s)</>}
                {separacao.invalidos > 0 && <> · {separacao.invalidos} inválido(s)</>}
              </p>
              <div className="max-h-80 overflow-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-2 font-medium">Nome</th>
                      <th className="px-3 py-2 font-medium">Telefone</th>
                      <th className="px-3 py-2 font-medium">Empresa</th>
                      {camposExtras.map((c) => (
                        <th key={c} className="px-3 py-2 font-medium">
                          {c}
                        </th>
                      ))}
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {destinatarios.map((d, i) => {
                      const bloqueado = bloqueadosSet.has(normalizarTelefone(d.telefone));
                      return (
                        <tr key={i} className={bloqueado ? "bg-rose-50 text-rose-700" : ""}>
                          <td className="px-3 py-1.5">{d.nome}</td>
                          <td className="px-3 py-1.5 tabular-nums">
                            {formatarTelefone(normalizarTelefone(d.telefone))}
                            {bloqueado && <span className="ml-2 text-xs">(bloqueado)</span>}
                          </td>
                          <td className="px-3 py-1.5">{d.empresa}</td>
                          {camposExtras.map((c) => (
                            <td key={c} className="px-3 py-1.5">
                              {d.camposExtras[c] ?? ""}
                            </td>
                          ))}
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => setDestinatarios((atuais) => atuais.filter((_, j) => j !== i))}
                              className="text-xs text-slate-400 hover:text-rose-600"
                            >
                              remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Vazio>Nenhum destinatário ainda. Importe um CSV ou adicione manualmente.</Vazio>
          )}
        </div>
      </Passo>

      <Passo numero={2} titulo="Mensagem">
        {modelos.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Modelo</span>
                <select value={modeloId} onChange={(e) => escolherModelo(e.target.value)} className={estiloCampo}>
                  {modelos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Texto (personalize à vontade)</span>
                <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={7} className={estiloCampo} />
              </label>
              <p className="text-xs text-slate-500">
                Campos disponíveis: {["nome", "primeiro_nome", "empresa", ...camposExtras].map((c) => `{{${c}}}`).join(", ")}
              </p>
              {camposFaltando.length > 0 && (
                <p className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                  Atenção: {camposFaltando.map((c) => `{{${c}}}`).join(", ")} não existe na lista importada e vai ficar em branco.
                </p>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Nome da campanha</span>
                <input
                  value={nomeCampanha}
                  onChange={(e) => setNomeCampanha(e.target.value)}
                  placeholder={modelos.find((m) => m.id === modeloId)?.nome}
                  className={estiloCampo}
                />
              </label>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Prévia</p>
              {previas.length ? (
                <div className="space-y-3 rounded-xl bg-[#e9e3d8] p-4">
                  {previas.map((d) => (
                    <div key={d.telefone}>
                      <p className="mb-1 text-xs text-slate-600">Para {d.nome}</p>
                      <p className="max-w-sm whitespace-pre-wrap rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm shadow-sm">
                        {renderizarMensagem(texto, d)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Vazio>Adicione destinatários para ver a prévia personalizada.</Vazio>
              )}
            </div>
          </div>
        ) : (
          <Vazio>
            Nenhum modelo cadastrado. <Link href="/painel/configuracoes#modelos" className="text-marca-600 underline">Crie um modelo</Link> primeiro.
          </Vazio>
        )}
      </Passo>

      <Passo numero={3} titulo="Agendamento">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Início (horário de Brasília)</span>
            <input type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} className={estiloCampo} />
          </label>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando || !numeroAtivo || !separacao.aceitos.length || !modeloId || !texto.trim() || !inicio}
            className={estiloBotao}
          >
            {enviando ? "Agendando…" : `Confirmar e agendar ${separacao.aceitos.length || ""} envio(s)`}
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          As mensagens saem de segunda a sexta, das 9h às 18h, em rodadas ao longo do dia, com 2 a 5 minutos entre uma e outra e
          respeitando o teto diário do número. O que passar do teto continua no próximo dia útil.
        </p>
        {!numeroAtivo && <p className="mt-2 text-sm text-rose-600">O número de WhatsApp não está ativo; não é possível agendar agora.</p>}
        {resultado && !resultado.ok && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{resultado.erro}</p>}
      </Passo>
    </>
  );
}
