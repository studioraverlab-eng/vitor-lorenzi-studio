import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

function IconInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconLinkedin({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

type Social = {
  label: string
  Icon: React.FC
  href: string
  desc: string
  hoverIconColor: string
  hoverTextStyle: React.CSSProperties
}

const socials: Social[] = [
  {
    label: 'WhatsApp',
    Icon: () => <MessageCircle size={15} strokeWidth={1.5} />,
    href: 'https://wa.me/5515991684097',
    desc: 'Resposta rápida',
    hoverIconColor: '#25D366',
    hoverTextStyle: { color: '#25D366' },
  },
  {
    label: 'Instagram',
    Icon: () => <IconInstagram size={15} />,
    href: 'https://instagram.com/vitorlorenzi',
    desc: '@vitorlorenzi',
    hoverIconColor: '#F77737',
    hoverTextStyle: {
      background: 'linear-gradient(90deg, #C13584 0%, #E1306C 30%, #FD5949 60%, #FCAF45 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  },
  {
    label: 'LinkedIn',
    Icon: () => <IconLinkedin size={15} />,
    href: 'https://linkedin.com/in/vitorlorenzi',
    desc: 'Conectar',
    hoverIconColor: '#0A66C2',
    hoverTextStyle: { color: '#0A66C2' },
  },
  {
    label: 'Email',
    Icon: () => <Mail size={15} strokeWidth={1.5} />,
    href: 'mailto:contato@vitorlorenzi.studio',
    desc: 'contato@vitorlorenzi.studio',
    hoverIconColor: '#EA4335',
    hoverTextStyle: { color: '#EA4335' },
  },
]

function SocialCard({ s, i }: { s: Social; i: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-3 px-6 py-3.5
        bg-white/[0.04] hover:bg-white/[0.06]
        border border-white/[0.08] hover:border-white/[0.14]
        rounded-full transition-all duration-300
        shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
    >
      <span
        className="transition-colors duration-300"
        style={{ color: hovered ? s.hoverIconColor : 'rgba(255,255,255,0.35)' }}
      >
        <s.Icon />
      </span>
      <div className="text-left">
        <div
          className="font-inter font-medium text-[13px] leading-tight transition-all duration-300"
          style={hovered ? s.hoverTextStyle : { color: 'rgba(255,255,255,0.6)' }}
        >
          {s.label}
        </div>
        <div className="font-mono text-[9px] text-white/22 tracking-[0.08em] mt-0.5 hidden sm:block">
          {s.desc}
        </div>
      </div>
    </motion.a>
  )
}

export default function Contact() {
  return (
    <section id="contato" className="relative min-h-screen flex items-center justify-center overflow-hidden py-40">
      {/* Background atmosphere */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 1000,
          height: 1000,
          background: 'radial-gradient(circle, rgba(142,142,147,0.055) 0%, transparent 55%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className="h-px w-10 bg-white/[0.09]" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">Contact</span>
          <span className="h-px w-10 bg-white/[0.09]" />
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease }}
          className="font-syne font-bold text-white/88 leading-[1.04] mb-8"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
        >
          Tem um projeto<br />
          <span className="text-white/25 italic">em mente?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="font-inter font-light text-[1rem] text-white/35 max-w-sm mx-auto leading-[1.8] mb-16"
        >
          Manda uma mensagem e conta o que você precisa. Vamos conversar.
        </motion.p>

        {/* Social buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((s, i) => (
            <SocialCard key={s.label} s={s} i={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-20 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/20 uppercase"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: 'rgba(37,211,102,0.7)' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: 'rgba(37,211,102,0.8)' }} />
          </span>
          Disponível para novos projetos
        </motion.p>
      </div>
    </section>
  )
}
