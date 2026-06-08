import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Portfolio() {
  return (
    <div className="bg-studio-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(142,142,147,0.06) 0%, transparent 60%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-16"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 font-inter text-[12px] text-white/25 hover:text-white/55 transition-colors duration-300"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Voltar ao início
          </Link>
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <span className="h-px w-8 bg-white/[0.08]" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">Portfolio</span>
          <span className="h-px w-8 bg-white/[0.08]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-syne font-bold text-white/82 leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Em construção.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-inter font-light text-[1rem] text-white/36 leading-[1.8] mb-12"
        >
          Os projetos do Vitor Lorenzi Studio estão sendo curados e em breve estarão disponíveis aqui. Acompanhe o processo no Instagram.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="https://instagram.com/vitorlorenzi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 font-inter text-[13px] font-medium text-white/60 hover:text-white/88
              bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] hover:border-white/[0.18]
              rounded-full transition-all duration-300"
          >
            Seguir no Instagram
          </a>
          <Link
            to="/"
            className="px-6 py-3 font-inter text-[13px] text-white/30 hover:text-white/55
              transition-colors duration-300"
          >
            Voltar ao site
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
