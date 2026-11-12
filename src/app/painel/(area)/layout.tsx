import { exigirSessao } from "@/lib/painel/auth";
import { sairAction } from "../actions";
import { Navegacao } from "./navegacao";

export default async function LayoutPainel({ children }: { children: React.ReactNode }) {
  const sessao = await exigirSessao();
  return (
    <div className="min-h-screen lg:flex">
      <aside className="flex flex-col bg-marca-900 text-white lg:fixed lg:inset-y-0 lg:w-64">
        <div className="px-6 pb-4 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-marca-100/70">Vitor Lorenzi Studio</p>
          <p className="mt-1 text-lg font-semibold">Painel de Envios</p>
        </div>
        <div className="mx-4 mb-4 rounded-lg bg-white/10 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-marca-100/70">Empresa</p>
          <p className="truncate text-sm font-medium">{sessao.cliente.nomeEmpresa}</p>
        </div>
        <Navegacao />
        <form action={sairAction} className="mt-auto px-4 py-4">
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-marca-100/80 hover:bg-white/10 hover:text-white">
            Sair
          </button>
        </form>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-8 lg:ml-64 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
