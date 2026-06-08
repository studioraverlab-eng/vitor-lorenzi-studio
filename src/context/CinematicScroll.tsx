import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

interface CinematicScrollCtx {
  navigateTo: (id: string) => void
  isNavigating: boolean
}

const Ctx = createContext<CinematicScrollCtx>({
  navigateTo: () => {},
  isNavigating: false,
})

// Expo inOut — rushes toward target then decelerates like a heavy object
const expoInOut = (t: number): number => {
  if (t === 0) return 0
  if (t === 1) return 1
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2
}

// Expo out — base wheel scroll feels weighted and physical
const expoOut = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

export function CinematicScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>(0)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      easing: expoOut,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 2,
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

  const navigateTo = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target || !lenisRef.current) return

    // Phase 1 — scale compression: interface "resists" before launching
    const content = document.getElementById('page-content')
    if (content) {
      gsap.timeline()
        .to(content, {
          scale: 0.9982,
          duration: 0.22,
          ease: 'power3.in',
          transformOrigin: '50% 50%',
        })
        .to(content, {
          scale: 1,
          duration: 0.9,
          ease: 'elastic.out(1, 0.42)',
        })
    }

    // Phase 2 — veil flash signals the travel
    setIsNavigating(true)
    setTimeout(() => setIsNavigating(false), 680)

    // Phase 3 — Lenis cinematic scroll: heavy acceleration + long deceleration
    lenisRef.current.scrollTo(target, {
      offset: -76,
      duration: 2.7,
      easing: expoInOut,
    })
  }, [])

  return (
    <Ctx.Provider value={{ navigateTo, isNavigating }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCinematicScroll = () => useContext(Ctx)
