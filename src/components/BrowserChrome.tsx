'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function BrowserChrome() {
  return (
    <section className="py-20 md:py-36 lg:py-52 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Eyebrow — deliberately unnumbered: this isn't another item in the
            01–04 sequence, it's an interstitial signature moment. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="h-px w-8 bg-chrome-accent/40" />
          <span className="font-mono text-label text-chrome-accent/70 uppercase">
            A assinatura do studio
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
          >
            <h2 className="font-syne font-bold text-h2 text-white/85">
              Cada projeto nasce<br />
              <span className="text-white/30 italic">dentro do navegador.</span>
            </h2>
            <p className="mt-6 font-inter text-body-lg text-white/45 max-w-md leading-[1.85]">
              Sem Photoshop fingindo ser site. Penso, testo e refino direto onde o
              resultado final vai viver — pixel, tipografia e interação de verdade,
              desde o primeiro rascunho.
            </p>
          </motion.div>

          {/* Mock browser window */}
          <motion.div
            initial={{ opacity: 0, y: 32, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="relative rounded-2xl border border-white/[0.1] overflow-hidden shadow-2xl bg-chrome-canvas"
          >
            {/* Chrome bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-chrome-bar">
              <div className="flex gap-2 shrink-0">
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,99,91,0.4)' }} />
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,189,46,0.4)' }} />
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(39,201,63,0.4)' }} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2 rounded-md px-3 py-1.5 bg-chrome-pill border border-white/[0.07]">
                <Lock size={11} className="text-white/30 shrink-0" strokeWidth={2} />
                <span className="font-mono text-[11px] truncate">
                  <span className="font-semibold" style={{ color: '#d6d6d9' }}>vitorlorenzi.studio</span>
                  <span style={{ color: '#59595d' }}>/metodo</span>
                </span>
              </div>
              <div className="hidden sm:flex flex-col gap-1 shrink-0">
                <span className="w-1 h-1 rounded-full" style={{ background: '#4c4c50' }} />
                <span className="w-1 h-1 rounded-full" style={{ background: '#4c4c50' }} />
                <span className="w-1 h-1 rounded-full" style={{ background: '#4c4c50' }} />
              </div>
            </div>

            {/* Content area — dot-grid atmosphere + a real pillar, "inspected" */}
            <div className="relative chrome-dot-grid px-8 py-14 sm:px-12 sm:py-16 min-h-[260px] flex flex-col justify-center">
              <div className="relative inline-block w-fit">
                <div
                  className="absolute -inset-x-4 -inset-y-3 border border-dashed rounded"
                  style={{ borderColor: 'rgba(194,121,62,0.55)' }}
                  aria-hidden="true"
                />
                <span
                  className="absolute -top-7 left-0 font-mono text-[10px] font-semibold px-2 py-1 rounded whitespace-nowrap"
                  style={{ background: '#C2793E', color: '#050505' }}
                >
                  responsável — 100%
                </span>
                <p className="relative font-syne font-bold text-white/90 text-h3 leading-[1.15]">
                  Do conceito<br />ao código.
                </p>
              </div>
              <p className="mt-7 font-inter text-[0.8rem] text-white/35 max-w-xs leading-[1.8]">
                Uma pessoa só, do início ao fim — sem repasse, sem telefone sem fio.
              </p>
            </div>

            {/* Footer status bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-chrome-bar">
              <span className="font-mono text-[10px] flex items-center gap-2" style={{ color: '#6e6e73' }}>
                <span className="text-chrome-accent">❯</span> role pra ver mais
              </span>
              <span className="font-mono text-[10px] tabular-nums" style={{ color: '#47474a' }}>
                STUDIO
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
