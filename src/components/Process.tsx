import { motion } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Escuta',
    desc: 'Ouço o que você tem antes de propor qualquer coisa. Sem briefing preenchido, sem pressa.',
  },
  {
    n: '02',
    title: 'Estratégia',
    desc: 'Entendo o mercado e o público. Traço o caminho visual e de comunicação da marca.',
  },
  {
    n: '03',
    title: 'Direção Criativa',
    desc: 'Desenvolvo o conceito e a identidade que vai guiar tudo que vier depois.',
  },
  {
    n: '04',
    title: 'Execução',
    desc: 'Código limpo, design com acabamento. Faço do jeito que eu gostaria de receber.',
  },
  {
    n: '05',
    title: 'Entrega',
    desc: 'Lançamento, ajustes e suporte. O projeto termina quando está certo.',
  },
]

export default function Process() {
  return (
    <section id="processo" className="py-20 md:py-36 lg:py-52">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-5"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">03 — Processo</span>
          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="font-syne font-bold text-white/85 mb-16 leading-[1.1]"
          style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)' }}
        >
          Como funciona<br />
          <span className="text-white/25 italic">o processo.</span>
        </motion.h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px relative">
          {/* Connecting line — desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="absolute top-[22px] left-0 right-0 h-px origin-left hidden md:block"
            style={{ background: 'linear-gradient(90deg, rgba(37,211,102,0.35) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)' }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.75, delay: i * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative pt-14 pr-8 pb-8 group"
            >
              {/* Step dot */}
              <div className="absolute top-0 left-0 flex items-center gap-3 md:flex-col md:items-start md:gap-0">
                <div className="relative w-[42px] h-[42px] flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-white/[0.07] group-hover:border-white/[0.16] transition-colors duration-400" />
                  <div className="absolute inset-[8px] rounded-full bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors duration-400" />
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/35 group-hover:text-white/65 transition-colors duration-400 relative z-10">{step.n}</span>
                  {/* Green dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(37,211,102,0.85)' }} />
                </div>
              </div>

              <h3 className="font-syne font-semibold text-[1rem] text-white/72 mb-3 group-hover:text-white/88 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="font-inter text-[0.82rem] text-white/28 leading-[1.8] group-hover:text-white/40 transition-colors duration-300">
                {step.desc}
              </p>

              {/* Mobile connector */}
              {i < steps.length - 1 && (
                <div className="md:hidden absolute left-[20px] top-[42px] w-px h-full bg-white/[0.06]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
