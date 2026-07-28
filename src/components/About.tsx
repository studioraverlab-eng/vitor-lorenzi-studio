'use client'

import { motion } from 'framer-motion'

const pillars = [
  { title: 'Zero templates', desc: 'Cada projeto parte do zero.' },
  { title: 'Nada é colocado à toa', desc: 'Cada escolha visual tem uma razão.' },
  { title: 'Do começo ao fim', desc: 'Um responsável pelo projeto inteiro.' },
]

const tags = ['Identidade Visual', 'Branding', 'UX/UI', 'Web Design', 'Direção Criativa', 'Motion Design']

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function About() {
  return (
    <section id="sobre" className="py-20 md:py-36 lg:py-52">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">01 — Sobre</span>
          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              className="font-syne font-bold text-white/88 leading-[1.06]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}
            >
              Design não é só visual. É o que faz uma marca ser lembrada.
            </motion.h2>

            {/* Pillars */}
            <div className="mt-12 flex flex-col gap-0">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 + 0.2, ease }}
                  className="border-t border-white/[0.07] py-5 last:border-b"
                >
                  <div className="font-syne font-semibold text-[0.95rem] text-white/70 mb-1">{p.title}</div>
                  <div className="font-inter text-[0.8rem] text-white/28 leading-[1.6]">{p.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:pt-2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.15, ease }}
            >
              <p className="font-inter font-light text-[1.05rem] text-white/52 leading-[1.85]">
                Sou Vitor Lorenzi. Minhas melhores referências vêm de fora da tela — festivais, viagens, música — e é isso que trago pro trabalho: identidade visual e experiências digitais pensadas pra fazer sentido pra quem vê, não só pra quem cria.
              </p>
            </motion.div>

            {/* Raver Lab aside */}
            <motion.a
              href="https://raverlab.com.br"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.3, ease }}
              className="group mt-10 flex items-center gap-4 pl-5 py-1"
              style={{ borderLeft: '1.5px solid rgba(255,255,255,0.12)' }}
            >
              <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden border border-white/[0.1]">
                <img
                  src="/portfolio/raver-lab.jpg"
                  alt="Raver Lab"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-syne font-semibold text-[0.9rem] text-white/65 group-hover:text-white/85 transition-colors duration-300">Raver Lab</span>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-white/20 uppercase">projeto paralelo</span>
                </div>
                <p className="font-inter text-[0.82rem] text-white/32 leading-[1.7] group-hover:text-white/44 transition-colors duration-300">
                  Marca autoral da cultura eletrônica — branding, e-commerce e direção criativa construídos do zero.
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-white/22 group-hover:text-white/50 transition-colors duration-300">
                  raverlab.com.br
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 10L10 2M10 2H4M10 2v6" />
                  </svg>
                </span>
              </div>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.44, ease }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-[10px] font-mono tracking-[0.16em] uppercase text-white/28
                    border border-white/[0.07] rounded-full hover:border-white/[0.14] hover:text-white/45
                    transition-all duration-300 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
