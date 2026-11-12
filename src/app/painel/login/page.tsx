import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/painel/auth";
import { FormularioLogin } from "./formulario";

export const metadata = { title: "Entrar — Painel de Envios" };

export default async function PaginaLogin() {
  if (await obterSessao()) redirect("/painel");
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-marca-900 to-slate-900 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marca-100/80">Vitor Lorenzi Studio</p>
          <h1 className="mt-2 text-2xl font-semibold">Painel de Envios</h1>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <FormularioLogin />
        </div>
        <p className="mt-4 text-center text-xs text-slate-300">
          Acesso de demonstração: demo@clinicavitta.com.br · demo123
        </p>
      </div>
    </main>
  );
}
