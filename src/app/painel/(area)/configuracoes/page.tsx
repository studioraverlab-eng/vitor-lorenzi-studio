import { exigirSessao } from "@/lib/painel/auth";
import { numeroDoCliente } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import { TETO_INCREMENTO_SEMANAL, TETO_MAXIMO, TETO_SEMANA_1, semanaAquecimento, tetoDiario } from "@/lib/painel/fila";
import { ROTULO_STATUS_NUMERO, formatarData, formatarDataHora, formatarTelefone } from "@/lib/painel/formato";
import { excluirModeloAction, removerBloqueioAction, salvarModeloAction } from "../../actions";
import { CabecalhoPagina, Cartao, Vazio, estiloBotao, estiloBotaoSecundario, estiloCampo } from "@/components/painel/ui";
import { FormularioBloqueio } from "./formulario-bloqueio";

function FormularioModelo({ id, nome = "", texto = "", rotuloBotao }: { id?: string; nome?: string; texto?: string; rotuloBotao: string }) {
  return (
    <form action={salvarModeloAction} className="space-y-3">
      {id && <input type="hidden" name="id" value={id} />}
      <input name="nome" defaultValue={nome} required placeholder="Nome do modelo" className={estiloCampo} />
      <textarea
        name="texto"
        defaultValue={texto}
        required
        rows={4}
        placeholder="Olá, {{nome}}! Aqui é da {{empresa}}…"
        className={estiloCampo}
      />
      <button type="submit" className={estiloBotao}>
        {rotuloBotao}
      </button>
    </form>
  );
}

export default async function PaginaConfiguracoes() {
  const sessao = await exigirSessao();
  const db = await lerDb();
  const clienteId = sessao.cliente.id;
  const numero = numeroDoCliente(db, clienteId);
  const modelos = db.modelos.filter((m) => m.clienteId === clienteId);
  const bloqueios = db.bloqueios
    .filter((b) => b.clienteId === clienteId)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

  return (
    <>
      <CabecalhoPagina titulo="Configurações" descricao="Número de WhatsApp, modelos de mensagem e lista de bloqueio." />

      <Cartao titulo="Número de WhatsApp conectado">
        {numero ? (
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">Número</p>
              <p className="font-semibold">{formatarTelefone(numero.telefone)}</p>
              <p className="text-sm text-slate-500">{ROTULO_STATUS_NUMERO[numero.status]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Conectado em</p>
              <p className="font-semibold">{formatarDataHora(numero.conectadoEm)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Semana de aquecimento</p>
              <p className="font-semibold">Semana {semanaAquecimento(numero)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Teto atual</p>
              <p className="font-semibold">{tetoDiario(numero)} mensagens/dia</p>
            </div>
            <p className="text-sm text-slate-500 sm:col-span-4">
              Para proteger o número, os envios seguem um aquecimento gradual: {TETO_SEMANA_1} mensagens/dia na primeira semana,
              +{TETO_INCREMENTO_SEMANAL} a cada semana, até {TETO_MAXIMO}/dia. Os envios acontecem de segunda a sexta, das 9h às 18h,
              em rodadas espaçadas.
            </p>
          </div>
        ) : (
          <Vazio>Nenhum número conectado. Fale com o suporte do Vitor Lorenzi Studio para conectar.</Vazio>
        )}
      </Cartao>

      <Cartao titulo="Modelos de mensagem" className="mt-4">
        <div id="modelos" className="space-y-3">
          <p className="text-sm text-slate-500">
            Use {"{{nome}}"}, {"{{empresa}}"} e qualquer coluna extra da planilha (ex.: {"{{procedimento}}"}) para personalizar.
          </p>
          {modelos.length ? (
            modelos.map((m) => (
              <details key={m.id} className="group rounded-lg border border-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium">{m.nome}</p>
                    <p className="truncate text-sm text-slate-500">{m.texto}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">Atualizado {formatarData(m.atualizadoEm)} · editar</span>
                </summary>
                <div className="space-y-3 border-t border-slate-100 px-4 py-4">
                  <FormularioModelo id={m.id} nome={m.nome} texto={m.texto} rotuloBotao="Salvar alterações" />
                  <form action={excluirModeloAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className={`${estiloBotaoSecundario} text-rose-700`}>
                      Excluir modelo
                    </button>
                  </form>
                </div>
              </details>
            ))
          ) : (
            <Vazio>Nenhum modelo cadastrado.</Vazio>
          )}
          <details className="rounded-lg border border-dashed border-slate-300">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-marca-600">+ Novo modelo</summary>
            <div className="border-t border-slate-100 px-4 py-4">
              <FormularioModelo rotuloBotao="Criar modelo" />
            </div>
          </details>
        </div>
      </Cartao>

      <Cartao titulo="Lista de bloqueio (não enviar)" className="mt-4">
        <p className="mb-3 text-sm text-slate-500">
          Telefones desta lista nunca recebem mensagens: são pulados automaticamente ao agendar uma campanha. Quem responde pedindo
          para parar entra aqui sozinho.
        </p>
        <FormularioBloqueio />
        {bloqueios.length ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {bloqueios.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-sm font-medium tabular-nums">{formatarTelefone(b.telefone)}</p>
                  <p className="text-xs text-slate-500">
                    {b.motivo} · {formatarData(b.criadoEm)}
                  </p>
                </div>
                <form action={removerBloqueioAction}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className="text-sm text-rose-600 hover:underline">
                    Remover
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Vazio>Nenhum telefone bloqueado.</Vazio>
          </div>
        )}
      </Cartao>
    </>
  );
}
