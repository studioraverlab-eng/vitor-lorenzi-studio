import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirSessao } from "@/lib/painel/auth";
import { metricasCampanha } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import {
  COR_CLASSIFICACAO,
  COR_STATUS_CAMPANHA,
  COR_STATUS_DESTINATARIO,
  ROTULO_CLASSIFICACAO,
  ROTULO_STATUS_CAMPANHA,
  ROTULO_STATUS_DESTINATARIO,
  formatarDataHora,
  formatarTelefone,
} from "@/lib/painel/formato";
import { CabecalhoPagina, Cartao, Selo } from "@/components/painel/ui";

export default async function PaginaCampanha({ params }: PageProps<"/painel/relatorios/[id]">) {
  const { id } = await params;
  const sessao = await exigirSessao();
  const db = await lerDb();
  const campanha = db.campanhas.find((c) => c.id === id && c.clienteId === sessao.cliente.id);
  if (!campanha) notFound();

  const m = metricasCampanha(db, campanha);
  const destinatarios = db.destinatarios.filter((d) => d.campanhaId === campanha.id);
  const envioPorDestinatario = new Map(db.envios.filter((e) => e.campanhaId === campanha.id).map((e) => [e.destinatarioId, e]));
  const respostaPorDestinatario = new Map(db.respostas.filter((r) => r.campanhaId === campanha.id).map((r) => [r.destinatarioId, r]));
  destinatarios.sort((a, b) => (envioPorDestinatario.get(a.id)?.agendadoPara ?? "z").localeCompare(envioPorDestinatario.get(b.id)?.agendadoPara ?? "z"));

  const indicadores = [
    ["Destinatários", m.total],
    ["Na fila", m.naFila],
    ["Enviadas", m.enviadas],
    ["Entregues", m.entregues],
    ["Respondidas", m.respondidas],
    ["Agendamentos", m.agendamentos],
    ["Pedidos de parada", m.paradas],
    ["Bloqueados (pulados)", m.bloqueados],
  ] as const;

  return (
    <>
      <Link href="/painel/relatorios" className="text-sm text-marca-600 hover:underline">
        ← Voltar para relatórios
      </Link>
      <div className="mt-2">
        <CabecalhoPagina
          titulo={campanha.nome}
          descricao={`Início agendado para ${formatarDataHora(campanha.agendamentoInicio)}`}
          acao={<Selo cor={COR_STATUS_CAMPANHA[campanha.status]}>{ROTULO_STATUS_CAMPANHA[campanha.status]}</Selo>}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {indicadores.map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{rotulo}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{valor}</p>
          </div>
        ))}
      </div>

      <Cartao titulo="Mensagem base" className="mt-4">
        <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{campanha.textoBase}</p>
      </Cartao>

      <Cartao titulo={`Destinatários (${destinatarios.length})`} className="mt-4">
        <div className="-mx-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-2 font-medium">Nome</th>
                <th className="px-3 py-2 font-medium">Telefone</th>
                <th className="px-3 py-2 font-medium">Agendado para</th>
                <th className="px-3 py-2 font-medium">Entregue em</th>
                <th className="px-3 py-2 font-medium">Resposta</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {destinatarios.map((d) => {
                const envio = envioPorDestinatario.get(d.id);
                const resposta = respostaPorDestinatario.get(d.id);
                return (
                  <tr key={d.id}>
                    <td className="px-5 py-2.5 font-medium">{d.nome}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">{formatarTelefone(d.telefone)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">{formatarDataHora(envio?.agendadoPara)}</td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">{formatarDataHora(envio?.entregueEm)}</td>
                    <td className="px-3 py-2.5">
                      {resposta ? <Selo cor={COR_CLASSIFICACAO[resposta.classificacao]}>{ROTULO_CLASSIFICACAO[resposta.classificacao]}</Selo> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-2.5">
                      <Selo cor={COR_STATUS_DESTINATARIO[d.status]}>{ROTULO_STATUS_DESTINATARIO[d.status]}</Selo>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Cartao>
    </>
  );
}
