/**
 * Presets de mola do studio.
 *
 * Mola em vez de duração fixa porque a mola sempre parte do valor que está
 * na tela agora. Dá pra interromper, reverter no meio e nada salta.
 *
 * damping 1.0 (bounce 0) é o padrão: chega e para, sem chamar atenção.
 * Overshoot só onde o gesto carregava impulso de verdade, tipo um arrasto
 * solto no meio do caminho. Menu que só apareceu não tem por que quicar.
 */
import type { Transition } from 'framer-motion'

/** Padrão de UI: response ~0.4s, sem overshoot. */
export const springUI: Transition = { type: 'spring', bounce: 0, duration: 0.4 }

/** Mesma mola, mais curta. Pra coisa pequena que precisa responder na hora. */
export const springSnappy: Transition = { type: 'spring', bounce: 0, duration: 0.26 }

/** Só quando houve impulso antes (arrasto, flick). Quica de leve. */
export const springMomentum: Transition = { type: 'spring', bounce: 0.2, duration: 0.4 }
