"use client";

import { useActionState } from "react";
import { entrarAction } from "../actions";
import { estiloBotao, estiloCampo } from "@/components/painel/ui";

export function FormularioLogin() {
  const [estado, acao, pendente] = useActionState(entrarAction, {});
  return (
    <form action={acao} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
        <input name="email" type="email" required autoComplete="username" className={estiloCampo} placeholder="voce@empresa.com.br" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Senha</span>
        <input name="senha" type="password" required autoComplete="current-password" className={estiloCampo} />
      </label>
      {estado.erro && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{estado.erro}</p>}
      <button type="submit" disabled={pendente} className={`${estiloBotao} w-full`}>
        {pendente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
