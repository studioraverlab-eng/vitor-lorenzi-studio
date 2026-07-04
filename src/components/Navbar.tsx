import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCinematicScroll } from '../context/CinematicScroll'


const navItems = [
  { label: 'Início',   id: 'inicio',   offset: 120 },
  { label: 'Sobre',    id: 'sobre',    offset: 160 },
  { label: 'Serviços', id: 'servicos', offset: 120 },
  { label: 'Processo', id: 'processo', offset: 120 },
  { label: 'Contato',  id: 'contato',  offset: 120 },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)
  const { navigateTo, navigateToPortfolio } = useCinematicScroll()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 30)
      if (y < 60) {
        setVisible(true)
      } else if (y < lastY.current - 6) {
        setVisible(true)
      } else if (y > lastY.current + 6) {
        setVisible(false)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id: string, offset?: number) => {
    setMobileOpen(false)
    navigateTo(id, offset)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -96, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`
          w-full max-w-5xl flex items-center justify-between px-5 py-3 rounded-2xl
          transition-all duration-500
          ${scrolled ? 'glass-nav-scrolled' : 'glass-nav'}
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 border border-white/[0.14] rounded-lg flex items-center justify-center bg-white/[0.04]">
            <span className="font-syne font-bold text-[9px] text-white/70 tracking-[0.08em]">VL</span>
          </div>
          <span className="font-syne font-semibold text-[13px] text-white/50 tracking-[0.18em] uppercase hidden sm:block group-hover:text-white/70 transition-colors duration-300">
            Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id, item.offset)}
                className="relative font-inter text-[13px] text-white/40 hover:text-white/80 transition-colors duration-300 tracking-wide group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={navigateToPortfolio}
          className="hidden md:flex items-center px-4 py-2 text-[12px] font-inter font-medium tracking-wide
            bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/[0.18]
            rounded-full text-white/70 hover:text-white transition-all duration-300
            shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          Acessar Portfólios
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
            className="block w-5 h-px bg-white/50 origin-center"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
            className="block w-5 h-px bg-white/50 origin-center"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
            className="block w-5 h-px bg-white/50 origin-center"
          />
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 p-4 rounded-2xl glass-nav-scrolled"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id, item.offset)}
                className="block w-full text-left py-3 px-3 text-white/50 hover:text-white/90 font-inter text-[14px] border-b border-white/[0.05] last:border-0 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); navigateToPortfolio() }}
              className="block w-full mt-3 text-center py-2.5 rounded-full bg-white/[0.06] text-white/70 text-sm font-inter border border-white/[0.09]"
            >
              Acessar Portfólios
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
