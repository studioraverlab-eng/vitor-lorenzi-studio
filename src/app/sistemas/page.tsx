import type { Metadata } from 'next'
import SistemasView from '../../components/sistemas/SistemasView'

export const metadata: Metadata = {
  title: 'Sistemas sob medida para empresas',
  description: 'CRM, agenda online, pedidos e estoque, painel administrativo e área do cliente. Sistemas web sob medida, do jeito que sua empresa já trabalha. Sorocaba e atendimento online.',
  alternates: { canonical: '/sistemas' },
  openGraph: {
    title: 'Sua planilha vira sistema. | Vitor Lorenzi Studio',
    description: 'Sistemas web sob medida: CRM, agenda, pedidos, estoque e painéis. No navegador, no computador e no celular.',
    url: '/sistemas',
  },
}

export default function SistemasPage() {
  return <SistemasView />
}
