import { motion } from 'framer-motion'

const pillars = [
  { title: 'Zero templates', desc: 'Tudo começa do zero, sempre.' },
  { title: 'Estética com propósito', desc: 'Cada decisão visual tem uma razão.' },
  { title: 'Do conceito ao fim', desc: 'Um único responsável, do início ao lançamento.' },
]

const tags = ['Identidade Visual', 'Branding', 'UX/UI', 'Web Design', 'Direção Criativa', 'Motion Design']

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function About() {
  return (
    <section id="sobre" className="py-36 md:py-52">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-20"
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
              O design é onde a estratégia encontra a emoção.
            </motion.h2>

            {/* Pillars */}
            <div className="mt-16 flex flex-col gap-0">
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
              <p className="font-inter font-light text-[1.05rem] text-white/52 leading-[1.85] mb-6">
                Sou Vitor Lorenzi — designer, diretor criativo e construtor de marcas que deixam rastro.
                Meu trabalho existe na intersecção entre estética e intenção: identidades visuais,
                interfaces digitais e experiências que comunicam antes mesmo de serem lidas.
              </p>
              <p className="font-inter text-[0.93rem] text-white/35 leading-[1.9]">
                Cada projeto começa pela escuta. Pelo entendimento de quem você é, do que quer
                projetar e de onde quer chegar. O que vem depois é resultado dessa combinação —
                direção criativa com profundidade, execução com precisão e uma presença visual
                que não precisa se explicar.
              </p>
            </motion.div>

            {/* Raver Lab card */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.3, ease }}
              className="mt-10 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] group hover:border-white/[0.12] hover:bg-white/[0.035] transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-0.5 w-8 h-8 rounded-xl border border-white/[0.09] bg-white/[0.04] flex items-center justify-center shrink-0">
                  <span className="text-[14px] select-none">♪</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-syne font-semibold text-[0.88rem] text-white/72 tracking-wide">
                      Raver Lab
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-white/22 uppercase border border-white/[0.08] px-2 py-0.5 rounded-full">
                      marca própria
                    </span>
                  </div>
                  <p className="font-inter text-[0.83rem] text-white/38 leading-[1.8]">
                    Fora do studio, sou o criador da Raver Lab — uma marca de roupas e produtos
                    feita com carinho pra quem vive a cena eletrônica. Nasceu do amor genuíno
                    pela música, pelos raves, pelas pessoas que dançam até o sol aparecer.
                    É sobre identidade, cultura e o sentimento de pertencer a algo maior
                    do que qualquer pista de dança.
                  </p>
                </div>
              </div>
            </motion.div>

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
