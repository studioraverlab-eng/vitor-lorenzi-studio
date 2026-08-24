'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCinematicScroll } from '../context/CinematicScroll'
import { springUI, springSnappy } from '../lib/motion'


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

  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const handleNav = (id: string, offset?: number) => {
    setMobileOpen(false)
    navigateTo(id, offset)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -96, opacity: visible ? 1 : 0 }}
        transition={springUI}
        className={`
          w-full max-w-wide grid grid-cols-[1fr_auto_1fr] items-center px-5 py-3 rounded-lg
          transition-all duration-500
          ${scrolled ? 'glass-nav-scrolled' : 'glass-nav'}
        `}
      >
        {/* Logo */}
        <Link href="/" className="focus-ring justify-self-start flex items-center gap-3 group">
          <div className="w-7 h-7 border border-white/[0.14] rounded-md flex items-center justify-center bg-white/[0.04]">
            <span className="font-syne font-bold text-xs text-white/70 tracking-[0.08em]">VL</span>
          </div>
          <span className="font-syne font-semibold text-sm text-white/60 tracking-[0.18em] uppercase hidden sm:block group-hover:text-white/70 transition-colors duration-300">
            Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="justify-self-center hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNav(item.id, item.offset)}
                className="press-target focus-ring relative font-inter text-sm text-white/65 hover:text-white/90 transition-colors duration-300 tracking-wide group"
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
          className="press-target focus-ring justify-self-end col-start-3 hidden md:flex items-center px-4 py-2 text-sm font-inter font-medium tracking-wide
            bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/[0.18]
            rounded-full text-white/70 hover:text-white transition-all duration-300
            shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          Ver projetos
        </button>

        {/* Mobile hamburger */}
        <button
          className="press-target focus-ring justify-self-end col-start-3 md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={springSnappy}
            /* Nasce do canto onde fica o hambúrguer e volta pra lá: entrar e
               sair pelo mesmo caminho deixa claro de onde a coisa veio. */
            style={{ transformOrigin: 'top right' }}
            className="absolute top-full left-4 right-4 mt-2 p-4 rounded-lg glass-nav-scrolled"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id, item.offset)}
                className="press-target focus-ring block w-full text-left py-3 px-3 text-white/60 hover:text-white/90 font-inter text-sm border-b border-white/[0.05] last:border-0 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); navigateToPortfolio() }}
              className="press-target focus-ring block w-full mt-3 text-center py-2.5 rounded-full bg-white/[0.06] text-white/70 text-sm font-inter border border-white/[0.09]"
            >
              Ver projetos
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
