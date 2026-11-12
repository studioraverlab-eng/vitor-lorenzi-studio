import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { resumirCampanhas, type ResumoCampanha } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import { COR_SITUACAO_CAMPANHA, ROTULO_SITUACAO_CAMPANHA, formatarData } from "@/lib/painel/formato";
import type { SituacaoCampanha } from "@/lib/painel/types";
import { CabecalhoPagina, Cartao, Selo, Vazio, estiloBotao } from "@/components/painel/ui";

const ORDEM_SITUACAO: Record<SituacaoCampanha, number> = {
  enviando: 0,
  na_fila: 1,
  pausada: 2,
  concluida: 3,
};

function LinhaCampanha({ resumo }: { resumo: ResumoCampanha }) {
  const { campanha, total, enviados, falhas, situacao } = resumo;
  const progresso = total > 0 ? Math.min(100, Math.round((enviados / total) * 100)) : 0;
  return (
    <li className="py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-medium text-slate-900">{campanha.nome}</p>
        <Selo cor={COR_SITUACAO_CAMPANHA[situacao]}>{ROTULO_SITUACAO_CAMPANHA[situacao]}</Selo>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-marca-500" style={{ width: `${progresso}%` }} />
      </div>
      <p className="mt-2 text-sm text-slate-500">
        <strong className="text-slate-700">{enviados} de {total}</strong> enviados · {campanha.porDia} por dia ·
        lista recebida em {formatarData(campanha.criadoEm)}
        {falhas > 0 && <> · {falhas} não entregues</>}
        {campanha.ignoradosBloqueados > 0 && (
          <> · {campanha.ignoradosBloqueados} contato(s) bloqueado(s) pulado(s)</>
        )}
      </p>
    </li>
  );
}

export default async function PaginaCampanhas() {
  const sessao = await exigirSessao();
  const db = await lerDb();
  const resumos = resumirCampanhas(db, sessao.cliente.id).sort(
    (a, b) =>
      ORDEM_SITUACAO[a.situacao] - ORDEM_SITUACAO[b.situacao] ||
      new Date(a.campanha.criadoEm).getTime() - new Date(b.campanha.criadoEm).getTime(),
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Campanhas"
        descricao="Cada lista que você anexa entra na fila: uma campanha por vez, até acabar."
        acao={
          <Link href="/painel/agendar" className={estiloBotao}>
            Agendar novo envio
          </Link>
        }
      />
      <Cartao>
        {resumos.length ? (
          <ul className="divide-y divide-slate-100">
            {resumos.map((r) => (
              <LinhaCampanha key={r.campanha.id} resumo={r} />
            ))}
          </ul>
        ) : (
          <Vazio>Nenhuma campanha ainda. Anexe uma lista para começar.</Vazio>
        )}
      </Cartao>
    </>
  );
}
