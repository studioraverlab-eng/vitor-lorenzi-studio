import { exigirSessao } from "@/lib/painel/auth";
import { numeroDoCliente } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import { dataSP, partesSP, semanaAquecimento, tetoDiario } from "@/lib/painel/fila";
import { formatarTelefone } from "@/lib/painel/formato";
import { CabecalhoPagina } from "@/components/painel/ui";
import { AssistenteCampanha } from "./assistente";

/** Próximo dia útil às 09:00 (horário de Brasília), no formato do input datetime-local. */
function sugestaoInicio(): string {
  const hoje = partesSP(new Date());
  for (let delta = 1; ; delta++) {
    const p = partesSP(dataSP(hoje.ano, hoje.mes, hoje.dia + delta, 9, 0));
    if (p.diaSemana !== 0 && p.diaSemana !== 6) {
      return `${p.ano}-${String(p.mes).padStart(2, "0")}-${String(p.dia).padStart(2, "0")}T09:00`;
    }
  }
}

export default async function PaginaNovaCampanha() {
  const sessao = await exigirSessao();
  const db = await lerDb();
  const clienteId = sessao.cliente.id;
  const numero = numeroDoCliente(db, clienteId);
  const modelos = db.modelos
    .filter((m) => m.clienteId === clienteId)
    .map((m) => ({ id: m.id, nome: m.nome, texto: m.texto }));
  const bloqueados = db.bloqueios.filter((b) => b.clienteId === clienteId).map((b) => b.telefone);

  return (
    <>
      <CabecalhoPagina
        titulo="Nova Campanha"
        descricao={
          numero
            ? `Envio pelo número ${formatarTelefone(numero.telefone)} · teto atual ${tetoDiario(numero)} mensagens/dia (semana ${semanaAquecimento(numero)} de aquecimento).`
            : "Nenhum número conectado."
        }
      />
      <AssistenteCampanha
        modelos={modelos}
        telefonesBloqueados={bloqueados}
        nomeEmpresa={sessao.cliente.nomeEmpresa}
        inicioSugerido={sugestaoInicio()}
        numeroAtivo={numero?.status === "conectado"}
      />
    </>
  );
}
