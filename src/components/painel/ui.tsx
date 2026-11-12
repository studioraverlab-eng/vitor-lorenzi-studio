import type { ReactNode } from "react";

export function Cartao({ titulo, acao, children, className = "" }: { titulo?: ReactNode; acao?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {(titulo || acao) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{titulo}</h2>}
          {acao}
        </header>
      )}
      {children}
    </section>
  );
}

export function Selo({ children, cor }: { children: ReactNode; cor: string }) {
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cor}`}>{children}</span>;
}

export function CabecalhoPagina({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">{children}</p>;
}

export const estiloBotao =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-marca-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-marca-700 disabled:cursor-not-allowed disabled:opacity-50";
export const estiloBotaoSecundario =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50";
export const estiloCampo =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-100";
