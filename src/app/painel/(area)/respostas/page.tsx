import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { lerDb } from "@/lib/painel/db";
import { COR_CLASSIFICACAO, ROTULO_CLASSIFICACAO, formatarDataHora, formatarTelefone } from "@/lib/painel/formato";
import type { Classificacao } from "@/lib/painel/types";
import { CabecalhoPagina, Cartao, Selo, Vazio } from "@/components/painel/ui";

const CLASSIFICACOES = Object.keys(ROTULO_CLASSIFICACAO) as Classificacao[];

export default async function PaginaRespostas({ searchParams }: PageProps<"/painel/respostas">) {
  const { classificacao } = await searchParams;
  const filtro = CLASSIFICACOES.find((c) => c === classificacao) ?? null;

  const sessao = await exigirSessao();
  const db = await lerDb();
  const campanhas = new Map(db.campanhas.filter((c) => c.clienteId === sessao.cliente.id).map((c) => [c.id, c]));
  const destinatarios = new Map(db.destinatarios.map((d) => [d.id, d]));
  const todas = db.respostas
    .filter((r) => campanhas.has(r.campanhaId))
    .sort((a, b) => new Date(b.recebidaEm).getTime() - new Date(a.recebidaEm).getTime());
  const respostas = filtro ? todas.filter((r) => r.classificacao === filtro) : todas;
  const contagem = (c: Classificacao) => todas.filter((r) => r.classificacao === c).length;

  const filtroLink = (ativo: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
      ativo ? "bg-marca-600 text-white ring-marca-600" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
    }`;

  return (
    <>
      <CabecalhoPagina titulo="Respostas" descricao="Respostas recebidas às campanhas, já classificadas." />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/painel/respostas" className={filtroLink(!filtro)}>
          Todas ({todas.length})
        </Link>
        {CLASSIFICACOES.map((c) => (
          <Link key={c} href={`/painel/respostas?classificacao=${c}`} className={filtroLink(filtro === c)}>
            {ROTULO_CLASSIFICACAO[c]} ({contagem(c)})
          </Link>
        ))}
      </div>

      <Cartao>
        {respostas.length ? (
          <ul className="divide-y divide-slate-100">
            {respostas.map((r) => {
              const d = destinatarios.get(r.destinatarioId);
              const campanha = campanhas.get(r.campanhaId);
              return (
                <li key={r.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo cor={COR_CLASSIFICACAO[r.classificacao]}>{ROTULO_CLASSIFICACAO[r.classificacao]}</Selo>
                      {r.virouAgendamento && <Selo cor="bg-marca-50 text-marca-700 ring-marca-100">Virou agendamento</Selo>}
                      <span className="font-medium">{d?.nome ?? "—"}</span>
                      <span className="text-sm tabular-nums text-slate-500">{formatarTelefone(r.telefone)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{r.textoOriginal}</p>
                    {campanha && (
                      <Link href={`/painel/relatorios/${campanha.id}`} className="mt-1 inline-block text-xs text-marca-600 hover:underline">
                        {campanha.nome}
                      </Link>
                    )}
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-slate-400">{formatarDataHora(r.recebidaEm)}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <Vazio>Nenhuma resposta {filtro ? "nessa classificação" : "recebida ainda"}.</Vazio>
        )}
      </Cartao>
    </>
  );
}
