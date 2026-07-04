import { motion } from 'framer-motion'
import { useCinematicScroll } from '../context/CinematicScroll'

export default function PortfolioTeaser() {
  const { navigateToPortfolio } = useCinematicScroll()

  return (
    <section className="relative py-0 overflow-hidden">
      <div className="relative py-20 md:py-40 lg:py-56">
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
            Uma seleção de<br />
            <span className="text-white/26 italic">projetos.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-[0.95rem] text-white/32 max-w-md mx-auto leading-[1.8] mb-14"
          >
            Sites, marcas e experiências criados com atenção ao que importa.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <motion.button
              onClick={navigateToPortfolio}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black font-inter"
            >
              Acessar Portfólio
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
