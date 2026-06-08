import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCinematicScroll } from '../context/CinematicScroll'

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

    let rafId: number
    const draw = () => {
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

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
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
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 100])
  const opacity = useTransform(scrollY, [0, 350], [1, 0])
  const { navigateTo } = useCinematicScroll()

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
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
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center pt-20"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <span className="h-px w-8 bg-white/[0.14]" />
          <span className="font-mono text-[10px] tracking-[0.32em] text-white/28 uppercase">
            Creative Direction & Digital Experience
          </span>
          <span className="h-px w-8 bg-white/[0.14]" />
        </motion.div>

        {/* Title — clamp keeps "Vitor Lorenzi" on one line */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <div className="overflow-hidden">
            <motion.h1
              variants={textReveal}
              className="font-syne font-extrabold leading-[0.88] tracking-[-0.025em] text-white/90 whitespace-nowrap"
              style={{ fontSize: 'clamp(2.4rem, 5.6vw, 6.5rem)' }}
            >
              Vitor Lorenzi
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={textReveal}
              className="font-syne font-extrabold leading-[0.88] tracking-[-0.025em] text-white/[0.14] italic"
              style={{ fontSize: 'clamp(2.4rem, 5.6vw, 6.5rem)' }}
            >
              Studio
            </motion.h1>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 font-inter font-light text-[1rem] md:text-[1.15rem] text-white/45 max-w-xl mx-auto leading-[1.72]"
        >
          Design, branding e experiências digitais para marcas que querem ser impossíveis de
          ignorar.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-3 font-inter text-[0.82rem] text-white/24 max-w-md mx-auto leading-[1.8]"
        >
          Criando identidades visuais, interfaces e experiências digitais com estética, direção
          criativa e presença.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <motion.button
            onClick={() => navigateTo('contato')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 px-7 py-3 bg-white/90 hover:bg-white text-[#050506] font-inter font-medium text-[13px] rounded-full transition-colors duration-300"
          >
            Iniciar Projeto
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </motion.button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/portfolio"
              className="flex items-center px-7 py-3 bg-transparent hover:bg-white/[0.04]
                border border-white/[0.12] hover:border-white/[0.22]
                text-white/50 hover:text-white/82 font-inter font-medium text-[13px] rounded-full
                transition-all duration-300"
            >
              Acessar Portfólios
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — absolute, never disturbs layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-white/16 uppercase">
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
