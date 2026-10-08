'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { MotionConfig } from 'framer-motion'
import { CinematicScrollProvider } from '../context/CinematicScroll'
import CustomCursor from './CustomCursor'
import NoiseOverlay from './NoiseOverlay'
import TransitionVeil from './TransitionVeil'
import ScrollProgress from './ScrollProgress'
import FloatingWhatsAppButton from './FloatingWhatsAppButton'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/criar-site' || pathname.startsWith('/site-para/')) return <>{children}</>
  return (
    /* reducedMotion="user" faz o Framer trocar sozinho todo transform por
       cross-fade quando o sistema pede menos movimento. Sem isso, o CSS
       de prefers-reduced-motion não alcança nada animado por JS. */
    <MotionConfig reducedMotion="user">
      <CinematicScrollProvider>
        <CustomCursor />
        <NoiseOverlay />
        <TransitionVeil />
        <ScrollProgress />
        {children}
        <FloatingWhatsAppButton />
      </CinematicScrollProvider>
    </MotionConfig>
  )
}
