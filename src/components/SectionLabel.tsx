'use client'

import { motion } from 'framer-motion'

/**
 * Rótulo de seção.
 *
 * Antes era `01 — Sobre` seguido de um fiozinho decorativo. O fio não
 * dizia nada: era só enfeite pra preencher a linha, e enfeite de preencher
 * linha é o que mais entrega template.
 *
 * No lugar dele entrou informação que a página de fato tem:
 *   - o contador (`01/05`) diz onde você está na leitura;
 *   - o caminho (`/sobre`) é o endereço real da seção, e o rótulo inteiro
 *     é um link que leva pra ela.
 *
 * Ou seja: virou navegação. Dá pra clicar, copiar o link e mandar pra
 * alguém já na altura certa da página. Um fio de 1px não faz nada disso.
 */

type Props = {
  /** Posição da seção, ex.: 1. Omitir nas seções fora da sequência. */
  n?: number
  /** Total de seções numeradas. */
  total?: number
  /** Caminho da seção, sem a barra. Ex.: "sobre". */
  path: string
  /** Destino do link. Padrão: âncora da própria seção. */
  href?: string
  /** Usa o âmbar da seção do navegador em vez do cinza padrão. */
  accent?: boolean
  /** Centraliza, pras seções de layout centrado. */
  center?: boolean
  className?: string
}

export default function SectionLabel({
  n,
  total,
  path,
  href,
  accent = false,
  center = false,
  className = '',
}: Props) {
  const destino = href ?? `#${path}`

  return (
    <motion.a
      href={destino}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`press-target focus-ring group inline-flex items-baseline gap-3 font-mono text-xs uppercase
        ${center ? 'justify-center' : ''} ${className}`}
    >
      {n !== undefined && total !== undefined && (
        <span className="tabular-nums tracking-[0.18em]">
          <span className={accent ? 'text-chrome-accent/85' : 'text-white/75'}>
            {String(n).padStart(2, '0')}
          </span>
          <span className={accent ? 'text-chrome-accent/40' : 'text-white/35'}>
            /{String(total).padStart(2, '0')}
          </span>
        </span>
      )}
      <span
        className={`tracking-[0.28em] transition-colors duration-300 ${
          accent
            ? 'text-chrome-accent/70 group-hover:text-chrome-accent'
            : 'text-white/62 group-hover:text-white/90'
        }`}
      >
        /{path}
      </span>
    </motion.a>
  )
}
