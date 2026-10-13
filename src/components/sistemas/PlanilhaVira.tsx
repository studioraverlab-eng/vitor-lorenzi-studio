'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * A planilha vira sistema, e quem faz a conversão é o scroll.
 *
 * Cada linha da planilha é a mesma peça que vira cartão no quadro: não é
 * uma troca de imagem, é a linha saindo da tabela e indo pra coluna do
 * status dela. É o argumento da página inteira acontecendo na tela.
 */

const ETAPAS = ['Novo contato', 'Em conversa', 'Proposta', 'Fechado']

const LINHAS = [
  { nome: 'Carla Menezes', origem: 'Instagram', data: '02/10', etapa: 0 },
  { nome: 'Rafael Souza', origem: 'Indicação', data: '03/10', etapa: 2 },
  { nome: 'Juliana Prado', origem: 'Google', data: '03/10', etapa: 1 },
  { nome: 'Marcos Lima', origem: 'WhatsApp', data: '05/10', etapa: 3 },
  { nome: 'Patrícia Alves', origem: 'Site', data: '06/10', etapa: 0 },
  { nome: 'Diego Ramos', origem: 'Google', data: '07/10', etapa: 1 },
  { nome: 'Fernanda Dias', origem: 'Instagram', data: '08/10', etapa: 2 },
  { nome: 'Lucas Martins', origem: 'Indicação', data: '09/10', etapa: 0 },
]

const ALTURA_LINHA = 40
const TOPO_TABELA = 44
const TOPO_QUADRO = 52
const ALTURA_CARTAO = 58
const ESPACO = 8

function posicaoNoQuadro(i: number) {
  const etapa = LINHAS[i].etapa
  const ordem = LINHAS.slice(0, i).filter(l => l.etapa === etapa).length
  return { coluna: etapa, ordem }
}

function Linha({ i, largura, progresso }: { i: number; largura: number; progresso: MotionValue<number> }) {
  const l = LINHAS[i]
  const { coluna, ordem } = posicaoNoQuadro(i)
  const colLargura = (largura - ESPACO * 3) / 4
  // Cada linha sai um pouquinho depois da anterior, pra se ler o movimento.
  const ini = 0.18 + i * 0.025
  const fim = ini + 0.42
  const faixa = [ini, fim]

  const x = useTransform(progresso, faixa, [0, coluna * (colLargura + ESPACO)])
  const y = useTransform(progresso, faixa, [TOPO_TABELA + i * ALTURA_LINHA, TOPO_QUADRO + ordem * (ALTURA_CARTAO + ESPACO)])
  const w = useTransform(progresso, faixa, [largura, colLargura])
  const h = useTransform(progresso, faixa, [ALTURA_LINHA, ALTURA_CARTAO])
  const raio = useTransform(progresso, faixa, [0, 8])
  const fundo = useTransform(progresso, faixa, ['rgba(255,255,255,0)', 'rgba(255,255,255,0.045)'])
  const borda = useTransform(progresso, faixa, ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.09)'])
  const tabela = useTransform(progresso, [ini, ini + 0.12], [1, 0])
  const cartao = useTransform(progresso, [fim - 0.12, fim], [0, 1])

  return (
    <motion.div
      className="absolute left-0 top-0 overflow-hidden"
      style={{ x, y, width: w, height: h, borderRadius: raio, background: fundo, borderBottom: '1px solid', borderColor: borda }}
    >
      <motion.div style={{ opacity: tabela }} className="absolute inset-0 grid grid-cols-[1.4fr_1fr_0.7fr_1fr] items-center px-3 font-mono text-[11px] sm:text-xs text-white/55">
        <span className="truncate text-white/75">{l.nome}</span>
        <span className="truncate">{l.origem}</span>
        <span>{l.data}</span>
        <span className="truncate">{ETAPAS[l.etapa].toLowerCase()}</span>
      </motion.div>
      <motion.div style={{ opacity: cartao }} className="absolute inset-0 flex flex-col justify-center px-2.5 sm:px-3">
        <span className="font-inter text-[11px] sm:text-sm text-white/85 truncate">{colLargura < 120 ? l.nome.split(' ')[0] : l.nome}</span>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/40 truncate">{l.origem}</span>
      </motion.div>
    </motion.div>
  )
}

export default function PlanilhaVira() {
  const secao = useRef<HTMLElement>(null)
  const caixa = useRef<HTMLDivElement>(null)
  const [largura, setLargura] = useState(0)
  const { scrollYProgress: rolagem } = useScroll({ target: secao, offset: ['start start', 'end end'] })
  // Cópia simples do progresso. Ligado direto no useScroll, o Framer passa a
  // opacidade pra uma ScrollTimeline do navegador, que aqui calculava errado
  // e deixava o texto da tabela por cima dos cartões.
  const scrollYProgress = useMotionValue(0)
  useMotionValueEvent(rolagem, 'change', v => scrollYProgress.set(v))

  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setLargura(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cabecalhoTabela = useTransform(scrollYProgress, [0.16, 0.26], [1, 0])
  const cabecalhoQuadro = useTransform(scrollYProgress, [0.5, 0.64], [0, 1])
  const legendaAntes = useTransform(scrollYProgress, [0.2, 0.32], [1, 0])
  const legendaDepois = useTransform(scrollYProgress, [0.4, 0.52], [0, 1])
  const barra = useTransform(scrollYProgress, [0.5, 0.64], ['planilha-clientes-FINAL-v3.xlsx', 'sistema.suaempresa.com.br/clientes'])
  const colLargura = largura ? (largura - ESPACO * 3) / 4 : 0
  const alturaCaixa = TOPO_TABELA + LINHAS.length * ALTURA_LINHA + 16

  return (
    <section ref={secao} id="planilha" className="relative h-[300vh]">
      <div className="sticky top-0 h-dvh flex items-center">
        <div className="w-full max-w-wide mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center">
          <div className="relative min-h-[150px] sm:min-h-[180px]">
            <motion.div style={{ opacity: legendaAntes }} className="absolute inset-0">
              <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-5">Antes</p>
              <h2 className="font-syne font-bold text-display-section text-white/85">
                Tudo numa planilha<br />
                <span className="text-white/30 italic">que só você entende.</span>
              </h2>
            </motion.div>
            <motion.div style={{ opacity: legendaDepois }} className="absolute inset-0">
              <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-5">Depois</p>
              <h2 className="font-syne font-bold text-display-section text-white/85">
                Os mesmos dados,<br />
                <span className="text-white/30 italic">agora trabalhando.</span>
              </h2>
              <p className="hidden sm:block mt-5 font-inter text-sm text-white/60 max-w-text leading-[1.8]">
                Cada cliente na etapa certa, com histórico e responsável. Sem procurar linha, sem cor pintada à mão.
              </p>
            </motion.div>
          </div>

          <div className="rounded-lg border border-white/[0.1] overflow-hidden shadow-2xl bg-chrome-canvas">
            <div className="flex items-center gap-3 px-4 py-3 bg-chrome-bar">
              <div className="flex gap-2 shrink-0">
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,99,91,0.4)' }} />
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,189,46,0.4)' }} />
                <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(39,201,63,0.4)' }} />
              </div>
              <div className="flex-1 min-w-0 rounded-sm px-3 py-1.5 bg-chrome-pill border border-white/[0.07]">
                <motion.span className="block font-mono text-xs text-white/60 truncate">{barra}</motion.span>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div ref={caixa} className="relative" style={{ height: alturaCaixa }}>
                <motion.div style={{ opacity: cabecalhoTabela }} className="absolute inset-x-0 top-0 h-9 grid grid-cols-[1.4fr_1fr_0.7fr_1fr] items-center px-3 font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-white/35 border-b border-white/[0.08]">
                  <span>Nome</span><span>Origem</span><span>Data</span><span>Status</span>
                </motion.div>

                {largura > 0 && (
                  <motion.div style={{ opacity: cabecalhoQuadro }} className="absolute inset-x-0 top-0">
                    {ETAPAS.map((etapa, c) => (
                      <div key={etapa} className="absolute top-0 flex items-center justify-between gap-1" style={{ left: c * (colLargura + ESPACO), width: colLargura }}>
                        <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.12em] uppercase text-white/45 truncate">{etapa}</span>
                        <span className="font-mono text-[10px] text-white/30">{LINHAS.filter(l => l.etapa === c).length}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {largura > 0 && LINHAS.map((_, i) => <Linha key={i} i={i} largura={largura} progresso={scrollYProgress} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
