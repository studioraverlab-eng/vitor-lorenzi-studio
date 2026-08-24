'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { springSnappy } from '../lib/motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const faqs = [
  {
    q: 'Como funciona o processo?',
    a: 'Começa com a gente conversando, sem formulário chato. Depois vem estratégia, conceito, execução e entrega. Sempre comigo, do primeiro papo até o site no ar.',
  },
  {
    q: 'Quanto custa?',
    a: 'Depende do tamanho da encrenca. Prefiro te dar um número honesto a um número chutado, então me conta o projeto que eu monto o orçamento em cima do que você precisa de verdade.',
  },
  {
    q: 'Quanto tempo leva um projeto?',
    a: 'Depende do escopo. Um site institucional sai bem mais rápido que uma marca inteira do zero. A gente fecha o prazo junto, antes de qualquer coisa começar.',
  },
  {
    q: 'Você faz só site ou cuida da marca também?',
    a: 'Os dois. Identidade visual, branding, direção criativa e o site em si. Dá pra pegar só um pedaço ou o pacote inteiro, do conceito ao código.',
  },
  {
    q: 'Com quem eu vou falar durante o projeto?',
    a: 'Comigo. Só comigo. Quem te mostra o conceito é a mesma pessoa que escreve o código.',
  },
  {
    q: 'Como eu começo?',
    a: 'Chama no WhatsApp e conta o que você tem em mente. Pode ser uma ideia meio solta, a gente organiza junto.',
  },
]

function FaqItem({ item, index, isOpen, onToggle }: {
  item: typeof faqs[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = `faq-answer-${index}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
      className="border-t border-white/[0.07] last:border-b"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        className="press-target focus-ring group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-syne font-semibold text-base sm:text-base text-white/75 group-hover:text-white/95 transition-colors duration-300">
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/30 group-hover:text-white/60 transition-all duration-300 ${isOpen ? 'rotate-180 text-white/70' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-label={item.q}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springSnappy}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 font-inter text-sm text-white/65 leading-[1.85] max-w-text">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="perguntas" className="content-auto py-20 md:py-36 lg:py-44">
      <div className="max-w-wide mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-5"
        >
          <span className="font-mono text-xs tracking-[0.35em] text-white/62 uppercase">05 / Perguntas</span>
          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
          className="font-syne font-bold text-display-section text-white/85 mb-14 leading-[1.1]"
        >
          Antes de falar<br />
          <span className="text-white/25 italic">comigo.</span>
        </motion.h2>

        <div className="max-w-text">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
