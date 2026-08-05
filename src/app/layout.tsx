import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { syne, inter, dmMono } from './fonts'
import AppShell from '../components/AppShell'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://vitor-lorenzi-studio.vercel.app'),
  title: {
    default: 'Vitor Lorenzi Studio — Sites, branding e direção criativa',
    template: '%s | Vitor Lorenzi Studio',
  },
  description:
    'Sites, identidades visuais e experiências digitais sob medida. Direção criativa e desenvolvimento do conceito ao lançamento.',
  keywords: [
    'criação de sites',
    'web design',
    'branding',
    'identidade visual',
    'direção criativa',
    'landing page',
    'Sorocaba',
  ],
  authors: [{ name: 'Vitor Lorenzi' }],
  creator: 'Vitor Lorenzi Studio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Vitor Lorenzi Studio',
    title: 'Vitor Lorenzi Studio — Sites, branding e direção criativa',
    description: 'Experiências digitais sob medida, do conceito ao código.',
    images: [{ url: '/og-cover.jpg', width: 1200, height: 630, alt: 'Vitor Lorenzi Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitor Lorenzi Studio — Sites, branding e direção criativa',
    description: 'Experiências digitais sob medida, do conceito ao código.',
    images: ['/og-cover.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${inter.variable} ${dmMono.variable}`}>
      <body>
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
                'https://instagram.com/vitorlorenzi',
                'https://linkedin.com/in/vitorlorenzi',
              ],
            }),
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
