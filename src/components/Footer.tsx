import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.05] py-10" style={{ background: 'rgba(5,5,6,0.85)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-white/[0.1] rounded flex items-center justify-center">
              <span className="font-syne font-bold text-[8px] text-white/50 tracking-tight">VL</span>
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
              Vitor Lorenzi Studio
            </span>
          </div>

          <p className="font-mono text-[10px] tracking-[0.14em] text-white/16 text-center">
            © {year} — Design, branding e experiências digitais.
          </p>

          <nav className="flex items-center gap-5">
            {['Sobre', 'Serviços', 'Processo', 'Contato'].map((item) => (
              <motion.button
                key={item}
                onClick={() => {
                  const id = item.toLowerCase().replace('ç', 'c').replace('é', 'e')
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ color: 'rgba(245,245,247,0.5)' }}
                className="font-inter text-[11px] text-white/20 transition-colors duration-200"
              >
                {item}
              </motion.button>
            ))}
            <Link
              to="/portfolio"
              className="font-inter text-[11px] text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              Portfolio
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
