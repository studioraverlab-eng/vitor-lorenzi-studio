'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCinematicScroll } from '../context/CinematicScroll'

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (reduceMotion || touchDevice) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    interface Particle {
      x: number; y: number
      vx: number; vy: number
      size: number; opacity: number
    }

    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 18000), 80)
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      size: Math.random() * 1.1 + 0.3,
      opacity: Math.random() * 0.22 + 0.04,
    }))

    let rafId = 0
    let active = true
    const draw = () => {
      if (!active || document.hidden) {
        rafId = 0
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 210, ${p.opacity})`
        ctx.fill()
      }
      rafId = requestAnimationFrame(draw)
    }
    draw()

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting
        if (active && !rafId && !document.hidden) draw()
        if (!active && rafId) {
          cancelAnimationFrame(rafId)
          rafId = 0
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(canvas)

    const onVisibility = () => {
      if (!document.hidden && active && !rafId) draw()
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field absolute inset-0 pointer-events-none" aria-hidden="true" />
}

const cinEase = [0.22, 1, 0.36, 1] as [number, number, number, number]

const textReveal = {
  hidden: { y: '105%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 1.1, ease: cinEase },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
}

export default function Hero() {
  const { navigateTo, navigateToPortfolio } = useCinematicScroll()

  return (
    <section
      id="inicio"
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      <ParticleField />

      {/* Content — pt-20 clears the floating navbar */}
      <div className="relative z-10 w-full max-w-wide mx-auto px-6 text-center pt-20">
        {/* Label — the URL fragment is a quiet first note of the browser-chrome
            signature that pays off fully further down the page. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="h-px w-8 bg-white/[0.14]" />
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: 'rgba(37,211,102,0.6)' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: 'rgba(37,211,102,0.85)' }} />
            </span>
            <span className="font-mono text-xs tracking-[0.28em] text-white/55 uppercase">
              vitorlorenzi.studio <span className="text-white/[0.14]">/</span> direção criativa &amp; experiências digitais
            </span>
          </span>
          <span className="h-px w-8 bg-white/[0.14]" />
        </motion.div>

        {/* Title — clamp keeps "Vitor Lorenzi" on one line */}
        <motion.h1 variants={stagger} initial="hidden" animate="show" className="font-syne font-extrabold leading-[0.95] tracking-[-0.025em] text-display-hero">
          <div className="overflow-hidden">
            <motion.span
              variants={textReveal}
              className="block text-white/95 whitespace-nowrap"
            >
              Vitor Lorenzi
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              variants={textReveal}
              className="block text-white/25 italic"
            >
              Studio
            </motion.span>
          </div>
        </motion.h1>

        {/* Subtitle — one line carrying what/for whom/why different,
            instead of two paragraphs splitting the same weight */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 font-inter font-light text-base text-white/68 max-w-text mx-auto leading-[1.75]"
        >
          Sites, marcas e experiências digitais para quem não aceita ser mais um
          — do conceito ao código, sempre a mesma pessoa cuidando de tudo.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.button
            onClick={() => navigateTo('contato')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring group flex items-center gap-2 px-7 py-3 bg-white/90 hover:bg-white text-[#050506] font-inter font-medium text-sm rounded-full transition-colors duration-300"
          >
            Iniciar Projeto
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </motion.button>

          <motion.button
            onClick={navigateToPortfolio}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black font-inter"
          >
            Acessar Portfólio
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator — absolute, never disturbs layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/50 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 1.5, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
