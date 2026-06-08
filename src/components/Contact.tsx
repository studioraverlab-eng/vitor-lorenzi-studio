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

const socials = [
  {
    label: 'WhatsApp',
    Icon: () => <MessageCircle size={15} strokeWidth={1.5} />,
    href: 'https://wa.me/5500000000000',
    desc: 'Resposta rápida',
  },
  {
    label: 'Instagram',
    Icon: () => <IconInstagram size={15} />,
    href: 'https://instagram.com/vitorlorenzi',
    desc: '@vitorlorenzi',
  },
  {
    label: 'LinkedIn',
    Icon: () => <IconLinkedin size={15} />,
    href: 'https://linkedin.com/in/vitorlorenzi',
    desc: 'Conectar',
  },
  {
    label: 'Email',
    Icon: () => <Mail size={15} strokeWidth={1.5} />,
    href: 'mailto:contato@vitorlorenzi.studio',
    desc: 'contato@vitorlorenzi.studio',
  },
]

export default function Contact() {
  return (
    <section id="contato" className="relative min-h-screen flex items-center justify-center overflow-hidden py-40">
      {/* Transparent — MeshGradient background shows through */}

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
          Vamos criar algo<br />
          <span className="text-white/25 italic">impossível de ignorar?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="font-inter font-light text-[1rem] text-white/35 max-w-sm mx-auto leading-[1.8] mb-16"
        >
          Um projeto começa com uma conversa. Conta o que você tem em mente.
        </motion.p>

        {/* Social buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-6 py-3.5
                bg-white/[0.04] hover:bg-white/[0.08]
                border border-white/[0.08] hover:border-white/[0.16]
                rounded-full transition-all duration-300
                shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            >
              <span className="text-white/35 group-hover:text-white/65 transition-colors duration-300">
                <s.Icon />
              </span>
              <div className="text-left">
                <div className="font-inter font-medium text-[13px] text-white/60 group-hover:text-white/88 transition-colors duration-300 leading-tight">
                  {s.label}
                </div>
                <div className="font-mono text-[9px] text-white/22 tracking-[0.08em] mt-0.5 hidden sm:block">
                  {s.desc}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-20 font-mono text-[10px] tracking-[0.25em] text-white/15 uppercase"
        >
          Disponível para novos projetos
        </motion.p>
      </div>
    </section>
  )
}
