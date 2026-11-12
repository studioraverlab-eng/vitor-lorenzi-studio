import type { ReactNode } from 'react'
import AppShell from '../../components/AppShell'
import GoogleAdsTag from '../../components/GoogleAdsTag'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: 'Vitor Lorenzi Studio',
            url: 'https://vitor-lorenzi-studio.vercel.app',
            founder: { '@type': 'Person', name: 'Vitor Lorenzi' },
            areaServed: 'Brasil',
            serviceType: ['Criação de sites', 'Branding', 'Identidade visual', 'Direção criativa'],
            sameAs: [
              'https://instagram.com/vitorlorenzistudio',
              'https://www.linkedin.com/in/v%C3%ADtor-lorenzi-6b0079284/',
            ],
          }),
        }}
      />
      <GoogleAdsTag />
      <AppShell>{children}</AppShell>
    </>
  )
}
