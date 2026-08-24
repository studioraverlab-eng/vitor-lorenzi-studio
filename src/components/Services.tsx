'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Globe, Layout, Palette, Sparkles, Compass, Zap, Play, Layers } from 'lucide-react'
import SectionLabel from './SectionLabel'

const services = [
  {
    n: '01',
    icon: Globe,
    title: 'Criação de Sites',
    desc: 'Rápido, bonito no celular e sem gambiarra por baixo.',
  },
  {
    n: '02',
    icon: Layout,
    title: 'Landing Pages',
    desc: 'Uma página, um objetivo: fazer a pessoa clicar.',
  },
  {
    n: '03',
    icon: Palette,
    title: 'Identidade Visual',
    desc: 'Logo, cor e tipografia que combinam de verdade.',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Branding',
    desc: 'Nome, jeito de falar e como a marca aparece no mundo.',
  },
  {
    n: '05',
    icon: Compass,
    title: 'Direção Criativa',
    desc: 'Pra tudo que você posta parecer da mesma marca.',
  },
  {
    n: '06',
    icon: Zap,
    title: 'Experiências Digitais',
    desc: 'Interface que a pessoa entende sem precisar de tutorial.',
  },
  {
    n: '07',
    icon: Play,
    title: 'Motion & Visual Design',
    desc: 'Movimento na medida. Nada de site piscando feito fliperama.',
  },
  {
    n: '08',
    icon: Layers,
    title: 'Interfaces Premium',
    desc: 'Aquele acabamento que você não sabe explicar, mas sente.',
  },
]

interface CardProps {
  service: typeof services[0]
  index: number
}

function ServiceCard({ service, index }: CardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: '50%', y: '50%' })
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = service.icon

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    setTilt({ x: (nx - 0.5) * 9, y: -(ny - 0.5) * 9 })
    setGlow({ x: `${nx * 100}%`, y: `${ny * 100}%` })
  }

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        /* Enquanto o ponteiro está em cima, o card segue 1:1, sem atraso.
           A suavização entra só quando o mouse sai e o card volta ao lugar. */
        transition: tilt.x === 0 ? 'transform 520ms var(--ease-out-expo)' : 'transform 0s',
      }}
      className="group relative p-6 rounded-lg glass-card hover:border-white/[0.11] transition-colors duration-300 overflow-hidden cursor-default"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at ${glow.x} ${glow.y}, rgba(255,255,255,0.04), transparent 50%)`,
        }}
      />

      {/* Oversized watermark numeral */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-5 font-syne font-extrabold text-4xl text-white/[0.035] group-hover:text-white/[0.06] transition-colors duration-500 select-none"
        style={{ lineHeight: 1, letterSpacing: '-0.1em' }}
      >
        {service.n}
      </span>

      {/* Icon badge */}
      <div
        className={`relative z-10 w-11 h-11 rounded-md flex items-center justify-center mb-6 border transition-all duration-400 ${
          index % 2 === 0
            ? 'border-emerald-400/[0.12] bg-emerald-400/[0.05] group-hover:border-emerald-400/25 group-hover:bg-emerald-400/[0.09]'
            : 'border-white/[0.08] bg-white/[0.03] group-hover:border-white/[0.16] group-hover:bg-white/[0.06]'
        }`}
      >
        <Icon
          size={19}
          className={`transition-colors duration-400 ${index % 2 === 0 ? 'text-emerald-400/50 group-hover:text-emerald-400/85' : 'text-white/35 group-hover:text-white/70'}`}
          strokeWidth={1.5}
        />
      </div>

      <h3 className="relative z-10 font-syne font-semibold text-base text-white/72 mb-2 group-hover:text-white/88 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="relative z-10 font-inter text-sm text-white/60 leading-[1.6] group-hover:text-white/75 transition-colors duration-300">
        {service.desc}
      </p>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="servicos" className="content-auto py-20 md:py-36 lg:py-52">
      <div className="max-w-wide mx-auto px-6">
        <SectionLabel n={2} total={5} path="servicos" className="mb-5" />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold text-white/82 leading-[1.1] text-display-section"
          >
            O que o studio<br />
            <span className="text-white/28 italic">faz.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-sm text-white/60 max-w-text leading-[1.8]"
          >
            Projeto grande ou pequeno, o cuidado é o mesmo. Não existe modo preguiça por aqui.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={s.n} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
