"use client";

import { useActionState, useEffect, useRef } from "react";
import { adicionarBloqueioAction } from "../../actions";
import { estiloBotao, estiloCampo } from "@/components/painel/ui";

export function FormularioBloqueio() {
  const [estado, acao, pendente] = useActionState(adicionarBloqueioAction, {});
  const formulario = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (estado.ok) formulario.current?.reset();
  }, [estado]);

  return (
    <form ref={formulario} action={acao} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <input name="telefone" required placeholder="Telefone com DDD" inputMode="tel" className={`${estiloCampo} sm:max-w-52`} />
      <input name="motivo" placeholder="Motivo (opcional)" className={estiloCampo} />
      <button type="submit" disabled={pendente} className={`${estiloBotao} shrink-0`}>
        Bloquear
      </button>
      {estado.erro && <p className="text-sm text-rose-600 sm:self-center">{estado.erro}</p>}
    </form>
  );
}
