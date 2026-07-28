'use client'

import type { ReactNode } from 'react'
import { CinematicScrollProvider } from '../context/CinematicScroll'
import CustomCursor from './CustomCursor'
import NoiseOverlay from './NoiseOverlay'
import TransitionVeil from './TransitionVeil'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <CinematicScrollProvider>
      <CustomCursor />
      <NoiseOverlay />
      <TransitionVeil />
      {children}
    </CinematicScrollProvider>
  )
}
