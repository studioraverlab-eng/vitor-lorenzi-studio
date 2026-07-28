'use client'

import type { ReactNode } from 'react'
import { CinematicScrollProvider } from '../context/CinematicScroll'
import CustomCursor from './CustomCursor'
import NoiseOverlay from './NoiseOverlay'
import TransitionVeil from './TransitionVeil'
import ScrollProgress from './ScrollProgress'
import FloatingWhatsAppButton from './FloatingWhatsAppButton'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <CinematicScrollProvider>
      <CustomCursor />
      <NoiseOverlay />
      <TransitionVeil />
      <ScrollProgress />
      {children}
      <FloatingWhatsAppButton />
    </CinematicScrollProvider>
  )
}
