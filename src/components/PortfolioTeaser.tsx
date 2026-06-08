import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function PortfolioTeaser() {
  return (
    <section className="relative py-0 overflow-hidden">
      {/* Separator line */}
      <div className="w-full h-px bg-white/[0.05]" />

      <div className="relative py-40 md:py-56" style={{ background: 'rgba(12,12,14,0.68)' }}>
        {/* Background orb */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(174,174,178,0.04) 0%, transparent 60%)',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <span className="h-px w-10 bg-white/[0.08]" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">Portfolio</span>
            <span className="h-px w-10 bg-white/[0.08]" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-syne font-bold text-white/82 leading-[1.07] mb-7"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
          >
            Projetos, conceitos e<br />
            <span className="text-white/26 italic">experiências.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-[0.95rem] text-white/32 max-w-md mx-auto leading-[1.8] mb-14"
          >
            Projetos, conceitos e experiências desenvolvidas pelo Vitor Lorenzi Studio.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-3 px-10 py-4.5 font-inter font-medium text-[14px]
                  bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] hover:border-white/[0.20]
                  text-white/65 hover:text-white rounded-full transition-all duration-300
                  shadow-[0_0_60px_rgba(255,255,255,0.04)] hover:shadow-[0_0_80px_rgba(255,255,255,0.07)]"
                style={{ padding: '14px 40px' }}
              >
                Acessar Portfólios
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="w-full h-px bg-white/[0.05]" />
    </section>
  )
}
