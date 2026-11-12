import Link from "next/link";
import { estiloBotao } from "@/components/painel/ui";

// 404 do painel: fica dentro do layout do painel, sem o layout do site.
export default function NaoEncontrado() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-marca-600">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Página não encontrada</h1>
        <p className="mt-2 text-sm text-slate-500">O endereço não existe ou não está disponível para esta conta.</p>
        <Link href="/painel" className={`${estiloBotao} mt-6`}>
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
