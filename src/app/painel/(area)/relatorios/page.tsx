import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { metricasCampanha } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import { COR_STATUS_CAMPANHA, ROTULO_STATUS_CAMPANHA, formatarDataHora } from "@/lib/painel/formato";
import { CabecalhoPagina, Cartao, Selo, Vazio } from "@/components/painel/ui";

export default async function PaginaRelatorios() {
  const sessao = await exigirSessao();
  const db = await lerDb();
  const campanhas = db.campanhas
    .filter((c) => c.clienteId === sessao.cliente.id)
    .sort((a, b) => new Date(b.agendamentoInicio).getTime() - new Date(a.agendamentoInicio).getTime());

  return (
    <>
      <CabecalhoPagina titulo="Relatórios" descricao="Desempenho de cada campanha. Clique numa campanha para ver os destinatários." />
      <Cartao>
        {campanhas.length ? (
          <div className="-mx-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-2 font-medium">Campanha</th>
                  <th className="px-3 py-2 text-right font-medium">Destinatários</th>
                  <th className="px-3 py-2 text-right font-medium">Enviadas</th>
                  <th className="px-3 py-2 text-right font-medium">Entregues</th>
                  <th className="px-3 py-2 text-right font-medium">Respondidas</th>
                  <th className="px-3 py-2 text-right font-medium">Agendamentos</th>
                  <th className="px-3 py-2 text-right font-medium">Pedidos de parada</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campanhas.map((c) => {
                  const m = metricasCampanha(db, c);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <Link href={`/painel/relatorios/${c.id}`} className="font-medium text-slate-900 hover:underline">
                          {c.nome}
                        </Link>
                        <p className="text-xs text-slate-500">Início {formatarDataHora(c.agendamentoInicio)}</p>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">
                        {m.total}
                        {m.bloqueados > 0 && <span className="block text-xs text-slate-400">{m.bloqueados} bloqueados</span>}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{m.enviadas}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{m.entregues}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{m.respondidas}</td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-marca-600">{m.agendamentos}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{m.paradas}</td>
                      <td className="px-5 py-3">
                        <Selo cor={COR_STATUS_CAMPANHA[c.status]}>{ROTULO_STATUS_CAMPANHA[c.status]}</Selo>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Vazio>Nenhuma campanha criada ainda.</Vazio>
        )}
      </Cartao>
    </>
  );
}
