import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'

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

// Quart out — silky deceleration, luxury feel without the heavy tail of expo
const quartOut = (t: number): number => 1 - Math.pow(1 - t, 4)

// Quint in-out — controlled cinematic travel for anchor navigation
const quintInOut = (t: number): number =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CinematicScrollProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [showCinema, setShowCinema] = useState(false)
  const [cinemaFading, setCinemaFading] = useState(false)
  const [cinemaLabel, setCinemaLabel] = useState('PORTFÓLIO')

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const lenis = new Lenis({
      duration: reduced ? 0 : 1.05,
      easing: quartOut,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafRef.current)
      lenis.destroy()
    }
  }, [])

  const navigateTo = useCallback((id: string, offset = 120) => {
    const target = document.getElementById(id)
    if (!target || !lenisRef.current) return

    // Phase 1 — subtle scale breath: hints the page is about to travel
    const content = document.getElementById('page-content')
    if (!prefersReducedMotion() && content) {
      gsap.timeline()
        .to(content, {
          scale: 0.9975,
          duration: 0.18,
          ease: 'power2.in',
          transformOrigin: '50% 50%',
        })
        .to(content, {
          scale: 1,
          duration: 0.7,
          ease: 'power4.out',
        })
    }

    // Phase 2 — veil flash signals the travel
    setIsNavigating(true)
    setTimeout(() => setIsNavigating(false), 500)

    // Phase 3 — Lenis anchor scroll: controlled cinematic travel
    lenisRef.current.scrollTo(target, {
      offset,
      duration: prefersReducedMotion() ? 0 : 1.6,
      easing: quintInOut,
    })
  }, [])

  const cinemaGo = useCallback((path: string, label: string) => {
    setCinemaLabel(label)
    setCinemaFading(false)
    setShowCinema(true)
    setTimeout(() => {
      navigate(path)
      setCinemaFading(true)
      setTimeout(() => setShowCinema(false), 520)
    }, 820)
  }, [navigate])

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
          transition={{ duration: cinemaFading ? 0.7 : 0.45, ease: 'easeInOut' }}
        >
          <motion.span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.25em',
              fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
            }}
            className="text-white uppercase select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: cinemaFading ? 0 : 1, y: cinemaFading ? -8 : 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
