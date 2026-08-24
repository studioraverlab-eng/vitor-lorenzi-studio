'use client'

import { motion } from 'framer-motion'
import SectionLabel from './SectionLabel'

const pillars = [
  { title: 'Zero template', desc: 'Nada de tema pronto com a cor trocada.' },
  { title: 'Nada no chute', desc: 'Se está ali, tem motivo. Pode perguntar de qualquer pixel.' },
  { title: 'Uma pessoa só', desc: 'A mesma cara do primeiro papo até o site no ar.' },
]

const tags = ['Identidade Visual', 'Branding', 'UX/UI', 'Web Design', 'Direção Criativa', 'Motion Design']

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function About() {
  return (
    <section id="sobre" className="content-auto py-20 md:py-36 lg:py-52">
      <div className="max-w-wide mx-auto px-6">
        <SectionLabel n={1} total={5} path="sobre" className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              className="font-syne font-bold text-white/88 leading-[1.06] text-display-section"
            >
              Design bonito é fácil. Difícil é ser lembrado depois que a pessoa fecha a aba.
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
                  <div className="font-syne font-semibold text-sm text-white/70 mb-1">{p.title}</div>
                  <div className="font-inter text-sm text-white/60 leading-[1.6]">{p.desc}</div>
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
              <p className="font-inter font-light text-base text-white/68 leading-[1.85]">
                Sou o Vitor. Minhas melhores ideias não vêm do Behance, vêm de festival, viagem e playlist boa. É isso que eu trago pro trabalho: marca e site pensados pra fazer sentido pra quem usa, não só pra ficar bonito no meu portfólio.
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
              className="focus-ring group mt-10 flex items-center gap-4 pl-5 py-1"
              style={{ borderLeft: '1.5px solid rgba(255,255,255,0.12)' }}
            >
              <div className="w-16 h-20 shrink-0 rounded-md overflow-hidden border border-white/[0.1]">
                <img
                  src="/portfolio/raver-lab.jpg"
                  alt="Raver Lab"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-syne font-semibold text-sm text-white/65 group-hover:text-white/85 transition-colors duration-300">Raver Lab</span>
                  <span className="font-mono text-xs tracking-[0.18em] text-white/60 uppercase">projeto pessoal</span>
                </div>
                <p className="font-inter text-sm text-white/60 leading-[1.7] group-hover:text-white/75 transition-colors duration-300">
                  Minha marca de roupa da cena eletrônica. Branding, loja e direção criativa, tudo feito por mim do zero.
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.14em] text-white/62 group-hover:text-white/75 transition-colors duration-300">
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
                  className="px-4 py-1.5 text-xs font-mono tracking-[0.16em] uppercase text-white/62
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
