import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { enviadosNoDia, numeroDoCliente, resumirCampanhas } from "@/lib/painel/campanhas";
import { lerDb, lerFila } from "@/lib/painel/db";
import { chaveDiaSP } from "@/lib/painel/fila";
import { ROTULO_STATUS_NUMERO, formatarData, formatarTelefone } from "@/lib/painel/formato";
import { CabecalhoPagina, Cartao, Vazio, estiloBotao } from "@/components/painel/ui";

const estiloBotaoGrande = `${estiloBotao} px-6 py-3 text-base`;

export default async function PaginaInicio() {
  const sessao = await exigirSessao();
  const [db, fila] = await Promise.all([lerDb(), lerFila()]);
  const clienteId = sessao.cliente.id;
  const agora = new Date();
  const hoje = chaveDiaSP(agora);

  const numero = numeroDoCliente(db, clienteId);
  const resumos = resumirCampanhas(db, clienteId);
  const idsCampanhas = new Set(resumos.map((r) => r.campanha.id));
  const atual = resumos.find((r) => r.situacao === "enviando") ?? null;
  const hojeTotal = enviadosNoDia(fila, idsCampanhas, hoje);
  const progresso = atual && atual.total > 0 ? Math.min(100, Math.round((atual.enviados / atual.total) * 100)) : 0;

  return (
    <>
      <CabecalhoPagina
        titulo="Início"
        descricao={`Olá, ${sessao.usuario.nome}. Hoje é ${formatarData(agora.toISOString())}.`}
        acao={
          <Link href="/painel/agendar" className={estiloBotaoGrande}>
            Agendar novo envio
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Cartao titulo="WhatsApp da empresa">
          {numero && numero.status === "conectado" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">{ROTULO_STATUS_NUMERO[numero.status]}</span>
              </div>
              <p className="text-xl font-semibold">{formatarTelefone(numero.telefone)}</p>
              <p className="text-sm text-slate-500">Este é o número que envia as mensagens das suas campanhas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-sm font-medium">{numero ? ROTULO_STATUS_NUMERO[numero.status] : "Não conectado"}</span>
              </div>
              <p className="text-sm text-slate-600">Para conectar o WhatsApp da empresa, siga estes passos:</p>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
                <li>Abra o WhatsApp no celular da empresa.</li>
                <li>Toque em <strong>Aparelhos conectados</strong> e depois em <strong>Conectar um aparelho</strong>.</li>
                <li>Aponte a câmera do celular para o QR Code que a nossa equipe mostra para você.</li>
              </ol>
              <p className="text-sm text-slate-500">
                A conexão é feita uma única vez, com a ajuda da nossa equipe. Depois disso, é só agendar os envios por aqui.
              </p>
            </div>
          )}
        </Cartao>

        <Cartao titulo="Campanha atual">
          {atual ? (
            <div className="space-y-3">
              <p className="truncate text-base font-semibold text-slate-900">{atual.campanha.nome}</p>
              <p className="text-3xl font-semibold">
                {atual.enviados}
                <span className="text-lg font-normal text-slate-400"> de {atual.total} enviados</span>
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-marca-500" style={{ width: `${progresso}%` }} />
              </div>
              <p className="text-sm text-slate-500">
                {hojeTotal} enviado(s) hoje · {atual.campanha.porDia} por dia, de manhã e à tarde
              </p>
              <Link href="/painel/campanhas" className="inline-block text-sm text-marca-600 hover:underline">
                Ver todas as campanhas
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Vazio>Nenhuma campanha rodando agora.</Vazio>
              <Link href="/painel/agendar" className={estiloBotao}>
                Agendar novo envio
              </Link>
            </div>
          )}
        </Cartao>
      </div>
    </>
  );
}
