import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './painel.css'

export const metadata: Metadata = {
  title: { absolute: 'Painel de Envios — Vitor Lorenzi Studio' },
  // Área restrita: fora dos mecanismos de busca.
  robots: { index: false, follow: false },
}

export default function PainelLayout({ children }: { children: ReactNode }) {
  return <div className="painel-root min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</div>
}
