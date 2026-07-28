import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { syne, inter, dmMono } from './fonts'
import AppShell from '../components/AppShell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vitor Lorenzi Studio',
  description:
    'Vitor Lorenzi Studio — Design, branding e experiências digitais para marcas que querem ser impossíveis de ignorar.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${inter.variable} ${dmMono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
