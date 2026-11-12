import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { metricasCampanha, numeroDoCliente } from "@/lib/painel/campanhas";
import { lerDb, lerFila } from "@/lib/painel/db";
import { chaveDiaSP, semanaAquecimento, tetoDiario } from "@/lib/painel/fila";
import {
  COR_CLASSIFICACAO,
  COR_STATUS_CAMPANHA,
  ROTULO_CLASSIFICACAO,
  ROTULO_STATUS_CAMPANHA,
  ROTULO_STATUS_NUMERO,
  formatarData,
  formatarDataHora,
  formatarTelefone,
} from "@/lib/painel/formato";
import { CabecalhoPagina, Cartao, Selo, Vazio, estiloBotao } from "@/components/painel/ui";

export default async function PaginaInicio() {
  const sessao = await exigirSessao();
  const [db, fila] = await Promise.all([lerDb(), lerFila()]);
  const clienteId = sessao.cliente.id;
  const agora = new Date();
  const hoje = chaveDiaSP(agora);

  const numero = numeroDoCliente(db, clienteId);
  const campanhas = db.campanhas.filter((c) => c.clienteId === clienteId);
  const idsCampanhas = new Set(campanhas.map((c) => c.id));
  const itensCliente = fila.itens.filter((i) => idsCampanhas.has(i.campanhaId));
  const itensHoje = itensCliente.filter((i) => i.status !== "cancelado" && chaveDiaSP(new Date(i.agendadoPara)) === hoje);
  const enviadosHoje = itensHoje.filter((i) => i.status === "enviado" || i.status === "entregue").length;
  const teto = numero ? tetoDiario(numero, agora) : 0;
  const semana = numero ? semanaAquecimento(numero, agora) : 0;
  const ocupacao = teto ? Math.min(100, Math.round((itensHoje.length / teto) * 100)) : 0;

  const proximas = campanhas
    .filter((c) => c.status === "agendada" || c.status === "em_envio")
    .map((c) => {
      const pendentes = itensCliente.filter((i) => i.campanhaId === c.id && i.status === "pendente");
      const proximo = pendentes.map((i) => i.agendadoPara).sort()[0] ?? c.agendamentoInicio;
      return { campanha: c, pendentes: pendentes.length, proximo };
    })
    .sort((a, b) => new Date(a.proximo).getTime() - new Date(b.proximo).getTime());

  const respostas = db.respostas
    .filter((r) => idsCampanhas.has(r.campanhaId))
    .sort((a, b) => new Date(b.recebidaEm).getTime() - new Date(a.recebidaEm).getTime())
    .slice(0, 5);
  const nomePorDestinatario = new Map(db.destinatarios.map((d) => [d.id, d.nome]));
  const nomePorCampanha = new Map(campanhas.map((c) => [c.id, c.nome]));

  const totais = campanhas.reduce(
    (acc, c) => {
      const m = metricasCampanha(db, c);
      acc.entregues += m.entregues;
      acc.respondidas += m.respondidas;
      acc.agendamentos += m.agendamentos;
      return acc;
    },
    { entregues: 0, respondidas: 0, agendamentos: 0 },
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Início"
        descricao={`Olá, ${sessao.usuario.nome}. Aqui está o resumo de hoje, ${formatarData(agora.toISOString())}.`}
        acao={
          <Link href="/painel/nova-campanha" className={estiloBotao}>
            + Nova campanha
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Cartao titulo="WhatsApp da empresa">
          {numero ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${numero.status === "conectado" ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className="text-sm font-medium">{ROTULO_STATUS_NUMERO[numero.status]}</span>
              </div>
              <p className="text-xl font-semibold">{formatarTelefone(numero.telefone)}</p>
              <p className="text-sm text-slate-500">Conectado desde {formatarDataHora(numero.conectadoEm)}</p>
            </div>
          ) : (
            <Vazio>Nenhum número conectado.</Vazio>
          )}
        </Cartao>

        <Cartao titulo="Envios de hoje">
          <p className="text-3xl font-semibold">
            {itensHoje.length}
            <span className="text-lg font-normal text-slate-400"> / {teto}</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-marca-500" style={{ width: `${ocupacao}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {enviadosHoje} já enviadas · teto do dia {teto} (semana {semana} de aquecimento)
          </p>
        </Cartao>

        <Cartao titulo="Resultados acumulados">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div>
              <dt className="text-xs text-slate-500">Entregues</dt>
              <dd className="text-2xl font-semibold">{totais.entregues}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Respostas</dt>
              <dd className="text-2xl font-semibold">{totais.respondidas}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Agendamentos</dt>
              <dd className="text-2xl font-semibold text-marca-600">{totais.agendamentos}</dd>
            </div>
          </dl>
        </Cartao>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Cartao titulo="Próximas campanhas agendadas" acao={<Link href="/painel/relatorios" className="text-sm text-marca-600 hover:underline">Ver relatórios</Link>}>
          {proximas.length ? (
            <ul className="divide-y divide-slate-100">
              {proximas.map(({ campanha, pendentes, proximo }) => (
                <li key={campanha.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link href={`/painel/relatorios/${campanha.id}`} className="block truncate font-medium hover:underline">
                      {campanha.nome}
                    </Link>
                    <p className="text-sm text-slate-500">
                      Próximo envio {formatarDataHora(proximo)} · {pendentes} na fila
                    </p>
                  </div>
                  <Selo cor={COR_STATUS_CAMPANHA[campanha.status]}>{ROTULO_STATUS_CAMPANHA[campanha.status]}</Selo>
                </li>
              ))}
            </ul>
          ) : (
            <Vazio>Nenhuma campanha agendada.</Vazio>
          )}
        </Cartao>

        <Cartao titulo="Últimas respostas" acao={<Link href="/painel/respostas" className="text-sm text-marca-600 hover:underline">Ver todas</Link>}>
          {respostas.length ? (
            <ul className="divide-y divide-slate-100">
              {respostas.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{nomePorDestinatario.get(r.destinatarioId) ?? formatarTelefone(r.telefone)}</p>
                    <Selo cor={COR_CLASSIFICACAO[r.classificacao]}>{ROTULO_CLASSIFICACAO[r.classificacao]}</Selo>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">“{r.textoOriginal}”</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {nomePorCampanha.get(r.campanhaId)} · {formatarDataHora(r.recebidaEm)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <Vazio>Nenhuma resposta ainda.</Vazio>
          )}
        </Cartao>
      </div>
    </>
  );
}
