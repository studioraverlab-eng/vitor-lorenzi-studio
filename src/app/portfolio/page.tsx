import type { Metadata } from 'next'
import PortfolioView from '../../components/PortfolioView'

export const metadata: Metadata = {
  title: 'Portfólio',
  description: 'Projetos selecionados de sites, e-commerce, branding e experiências digitais criados pelo Vitor Lorenzi Studio.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfólio | Vitor Lorenzi Studio',
    description: 'Projetos reais de sites, e-commerce, branding e experiências digitais.',
    url: '/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioView />
}
