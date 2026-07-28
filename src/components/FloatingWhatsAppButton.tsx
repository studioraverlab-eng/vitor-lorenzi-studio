'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_URL =
  'https://wa.me/5515991684097?text=' +
  encodeURIComponent('Olá! Vi seu site e quero falar sobre um projeto.')

export default function FloatingWhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center gap-2"
        >
          {/* Label — appears on hover, desktop only */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block font-inter text-[12px] font-medium text-white/80 bg-black/70 backdrop-blur-sm border border-white/[0.08] rounded-full px-3.5 py-2 whitespace-nowrap"
              >
                Falar no WhatsApp
              </motion.span>
            )}
          </AnimatePresence>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar no WhatsApp"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="focus-ring relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            style={{ background: '#25D366' }}
          >
            <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ background: '#25D366' }} />
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#050506" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
