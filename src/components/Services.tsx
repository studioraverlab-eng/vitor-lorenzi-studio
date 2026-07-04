import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Globe, Layout, Palette, Sparkles, Compass, Zap, Play, Layers } from 'lucide-react'

const services = [
  {
    n: '01',
    icon: Globe,
    title: 'Criação de Sites',
    desc: 'Sites que funcionam e que ficam bem. Responsivos, rápidos e com acabamento de verdade.',
  },
  {
    n: '02',
    icon: Layout,
    title: 'Landing Pages',
    desc: 'Páginas diretas ao ponto. Feitas pra converter sem encher de informação.',
  },
  {
    n: '03',
    icon: Palette,
    title: 'Identidade Visual',
    desc: 'Logo, cores, tipografia e tudo que define como sua marca aparece pro mundo.',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Branding',
    desc: 'Nome, posicionamento e linguagem visual. A base pra sua marca fazer sentido.',
  },
  {
    n: '05',
    icon: Compass,
    title: 'Direção Criativa',
    desc: 'Orientação visual e estratégica pra quem precisa de coerência na comunicação.',
  },
  {
    n: '06',
    icon: Zap,
    title: 'Experiências Digitais',
    desc: 'Interfaces que fazem sentido de usar e que deixam uma boa impressão.',
  },
  {
    n: '07',
    icon: Play,
    title: 'Motion & Visual Design',
    desc: 'Animações e elementos visuais que complementam sem chamar atenção pra si mesmos.',
  },
  {
    n: '08',
    icon: Layers,
    title: 'Interfaces Premium',
    desc: 'UI/UX com cuidado nos detalhes. Pra quem sabe a diferença.',
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
        transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.1s ease',
      }}
      className="group relative p-7 rounded-2xl glass-card hover:border-white/[0.11] transition-colors duration-300 overflow-hidden cursor-default"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at ${glow.x} ${glow.y}, rgba(255,255,255,0.04), transparent 50%)`,
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-7">
        <span className="font-mono text-[10px] tracking-[0.25em] text-white/18">{service.n}</span>
        <Icon
          size={17}
          className={`text-white/18 transition-colors duration-400 ${index % 2 === 0 ? 'group-hover:text-emerald-400/60' : 'group-hover:text-white/55'}`}
          strokeWidth={1.5}
        />
      </div>

      <h3 className="font-syne font-semibold text-[1.05rem] text-white/72 mb-3 group-hover:text-white/88 transition-colors duration-300">
        {service.title}
      </h3>
      <p className="font-inter text-[0.83rem] text-white/30 leading-[1.75] group-hover:text-white/40 transition-colors duration-300">
        {service.desc}
      </p>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="servicos" className="py-36 md:py-52">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-5"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">02 — Serviços</span>
          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold text-white/82 leading-[1.1]"
            style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)' }}
          >
            O que o studio<br />
            <span className="text-white/28 italic">faz.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-[0.88rem] text-white/32 max-w-xs leading-[1.8]"
          >
            Cada projeto é tratado com o mesmo cuidado, seja o primeiro ou o décimo.
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
