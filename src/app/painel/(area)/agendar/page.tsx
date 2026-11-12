import Link from "next/link";
import { exigirSessao } from "@/lib/painel/auth";
import { numeroDoCliente } from "@/lib/painel/campanhas";
import { lerDb } from "@/lib/painel/db";
import { CabecalhoPagina, Cartao, estiloBotao } from "@/components/painel/ui";
import { FormularioAgendar } from "./formulario";

export default async function PaginaAgendar() {
  const sessao = await exigirSessao();
  const db = await lerDb();
  const clienteId = sessao.cliente.id;
  const numero = numeroDoCliente(db, clienteId);
  const bloqueados = db.bloqueios.filter((b) => b.clienteId === clienteId).map((b) => b.telefone);
  const textoInicial = db.modelos.find((m) => m.clienteId === clienteId)?.texto ?? "";

  return (
    <>
      <CabecalhoPagina titulo="Agendar envio" descricao="Anexe a lista, escreva a mensagem e pronto: a gente envia por você." />

      {numero?.status === "conectado" ? (
        <FormularioAgendar
          telefonesBloqueados={bloqueados}
          nomeEmpresa={sessao.cliente.nomeEmpresa}
          textoInicial={textoInicial}
        />
      ) : (
        <Cartao>
          <p className="text-sm text-slate-600">
            O WhatsApp da empresa não está conectado no momento, então não dá para agendar envios agora. Fale com a
            nossa equipe para conectar o número — depois é só voltar aqui.
          </p>
          <Link href="/painel" className={`${estiloBotao} mt-4`}>
            Voltar ao início
          </Link>
        </Cartao>
      )}
    </>
  );
}
