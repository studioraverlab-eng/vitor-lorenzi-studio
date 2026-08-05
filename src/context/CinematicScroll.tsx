'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface CinematicScrollCtx {
  navigateTo: (id: string, offset?: number) => void
  isNavigating: boolean
  navigateToPortfolio: () => void
  navigateToHome: () => void
}

const Ctx = createContext<CinematicScrollCtx>({
  navigateTo: () => {},
  isNavigating: false,
  navigateToPortfolio: () => {},
  navigateToHome: () => {},
})

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CinematicScrollProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [showCinema, setShowCinema] = useState(false)
  const [cinemaFading, setCinemaFading] = useState(false)
  const [cinemaLabel, setCinemaLabel] = useState('PORTFÓLIO')

  // Prefetch both routes so router.push() after the cinema veil is instant,
  // not a visible network wait (only 2 routes exist today, so this is cheap).
  useEffect(() => {
    router.prefetch('/')
    router.prefetch('/portfolio')
  }, [router])

  const navigateTo = useCallback((id: string, offset = 120) => {
    const target = document.getElementById(id)
    if (!target) return

    setIsNavigating(true)
    setTimeout(() => setIsNavigating(false), 280)

    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])

  const cinemaGo = useCallback((path: string, label: string) => {
    setCinemaLabel(label)
    setCinemaFading(false)
    setShowCinema(true)
    setTimeout(() => {
      router.push(path)
      setCinemaFading(true)
      setTimeout(() => setShowCinema(false), 260)
    }, 280)
  }, [router])

  const navigateToPortfolio = useCallback(() => cinemaGo('/portfolio', 'PORTFÓLIO'), [cinemaGo])
  const navigateToHome      = useCallback(() => cinemaGo('/', 'STUDIO'),             [cinemaGo])

  return (
    <Ctx.Provider value={{ navigateTo, isNavigating, navigateToPortfolio, navigateToHome }}>
      {/* Cinema transition overlay — rendered at provider level, covers all routes */}
      {showCinema && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 99999, backgroundColor: '#000000', pointerEvents: cinemaFading ? 'none' : 'all' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: cinemaFading ? 0 : 1 }}
          transition={{ duration: cinemaFading ? 0.24 : 0.22, ease: 'easeOut' }}
        >
          <motion.span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.25em',
              fontSize: 'var(--display-section)',
            }}
            className="text-white uppercase select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: cinemaFading ? 0 : 1, y: cinemaFading ? -8 : 0 }}
            transition={{ delay: 0.05, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {cinemaLabel}
          </motion.span>
        </motion.div>
      )}
      {children}
    </Ctx.Provider>
  )
}

export const useCinematicScroll = () => useContext(Ctx)
