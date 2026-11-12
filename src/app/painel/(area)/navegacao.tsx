"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/painel", rotulo: "Início" },
  { href: "/painel/nova-campanha", rotulo: "Nova Campanha" },
  { href: "/painel/relatorios", rotulo: "Relatórios" },
  { href: "/painel/respostas", rotulo: "Respostas" },
  { href: "/painel/configuracoes", rotulo: "Configurações" },
] as const;

export function Navegacao() {
  const caminho = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-4 lg:flex-col">
      {ITENS.map((item) => {
        const ativo = item.href === "/painel" ? caminho === "/painel" : caminho.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              ativo ? "bg-white text-marca-900" : "text-marca-100/90 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
