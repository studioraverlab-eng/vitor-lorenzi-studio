'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import SectionLabel from './SectionLabel'
import { PLANOS, brl } from '../lib/planos'
import { whatsappUrl } from '../lib/acquisition'

export default function Pricing() {
  return (
    <section id="valores" className="relative px-6 py-24">
      <div className="max-w-wide mx-auto">
        <SectionLabel path="valores" />
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <h2 className="font-syne font-extrabold text-3xl sm:text-4xl tracking-[-0.02em] text-white/95">Valores</h2>
          <span className="rounded-full border border-[#25D366]/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-[#25D366]">
            Desconto no primeiro projeto
          </span>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {PLANOS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="flex flex-col bg-[#08080a] p-8"
            >
              <h3 className="font-syne text-xl font-bold text-white/95">{p.name}</h3>
              <p className="mt-3 min-h-[3.5rem] font-inter text-sm font-light leading-relaxed text-white/65">{p.desc}</p>
              <div className="mt-8 font-inter">
                <span className="block font-mono text-xs uppercase tracking-[0.18em] text-white/55">a partir de</span>
                {p.price > p.promo && <span className="block text-base text-white/50 line-through">R$ {brl(p.price)}</span>}
                <span className="block text-4xl font-semibold text-white">R$ {brl(p.promo)}</span>
              </div>
              <a
                href={whatsappUrl(p.message, 'home_valores')}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-inter text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                <MessageCircle size={15} strokeWidth={1.75} />
                Conversar
              </a>
            </motion.article>
          ))}
        </div>
        <p className="mt-5 font-inter text-xs text-white/50">
          Valores de entrada. Prazo, número de páginas, domínio e hospedagem são combinados na proposta, antes de começar.
        </p>
      </div>
    </section>
  )
}
