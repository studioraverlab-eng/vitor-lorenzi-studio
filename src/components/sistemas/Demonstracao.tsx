'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowRight, Check, Lock } from 'lucide-react'

/**
 * Três telas de sistema que a pessoa mexe de verdade. Dados de exemplo,
 * tudo no navegador. A ideia é o visitante sentir o "clicou, aconteceu"
 * antes de pedir orçamento, em vez de ler uma lista de funcionalidades.
 */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const ABAS = [
  { id: 'crm', nome: 'CRM', caminho: '/clientes' },
  { id: 'agenda', nome: 'Agenda', caminho: '/agenda' },
  { id: 'pedidos', nome: 'Pedidos e estoque', caminho: '/pedidos' },
] as const

type Aba = typeof ABAS[number]['id']

/* ── CRM ─────────────────────────────────────────────────────────── */

const ETAPAS = ['Novo', 'Em conversa', 'Proposta', 'Fechado']

function Crm() {
  const [cartoes, setCartoes] = useState([
    { id: 1, nome: 'Carla Menezes', valor: 1800, etapa: 0 },
    { id: 2, nome: 'Rafael Souza', valor: 4200, etapa: 2 },
    { id: 3, nome: 'Juliana Prado', valor: 950, etapa: 1 },
    { id: 4, nome: 'Patrícia Alves', valor: 2600, etapa: 0 },
    { id: 5, nome: 'Diego Ramos', valor: 3100, etapa: 1 },
  ])
  const avancar = (id: number) => setCartoes(cs => cs.map(c => (c.id === id && c.etapa < 3 ? { ...c, etapa: c.etapa + 1 } : c)))
  const fechado = cartoes.filter(c => c.etapa === 3).reduce((s, c) => s + c.valor, 0)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <p className="font-inter text-xs sm:text-sm text-white/55">Clique na seta pra mover o cliente de etapa.</p>
        <p className="font-mono text-xs text-white/50 shrink-0">
          fechado no mês <motion.span key={fechado} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-white/90">R$ {fechado.toLocaleString('pt-BR')}</motion.span>
        </p>
      </div>
      <LayoutGroup>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ETAPAS.map((etapa, e) => (
            <div key={etapa} className="rounded-md bg-white/[0.02] border border-white/[0.05] p-2 min-h-[150px]">
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 mb-2 px-1">{etapa}</p>
              <div className="flex flex-col gap-1.5">
                {cartoes.filter(c => c.etapa === e).map(c => (
                  <motion.div layout layoutId={`c${c.id}`} key={c.id} transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2.5 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-inter text-xs text-white/85 truncate">{c.nome}</p>
                      <p className="font-mono text-[10px] text-white/40">R$ {c.valor.toLocaleString('pt-BR')}</p>
                    </div>
                    {e < 3 ? (
                      <button onClick={() => avancar(c.id)} aria-label={`Mover ${c.nome} para ${ETAPAS[e + 1]}`} className="press-target focus-ring shrink-0 w-6 h-6 rounded-full border border-white/[0.12] flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-colors">
                        <ArrowRight size={11} />
                      </button>
                    ) : (
                      <Check size={13} className="shrink-0 text-white/60" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  )
}

/* ── Agenda ──────────────────────────────────────────────────────── */

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const HORAS = ['09:00', '10:30', '14:00', '15:30', '17:00']
const OCUPADOS = new Set(['0-1', '1-0', '1-3', '2-2', '3-0', '3-4', '4-1', '4-2'])

function Agenda() {
  const [reservado, setReservado] = useState<string | null>(null)
  const [d, h] = reservado ? reservado.split('-').map(Number) : [0, 0]

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <p className="font-inter text-xs sm:text-sm text-white/55">Escolha um horário livre, como o seu cliente faria.</p>
        <p className="font-mono text-xs text-white/50 shrink-0">{25 - OCUPADOS.size - (reservado ? 1 : 0)} livres</p>
      </div>
      <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1.5">
        <span />
        {DIAS.map(dia => <span key={dia} className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 text-center pb-1">{dia}</span>)}
        {HORAS.map((hora, hi) => (
          <div key={hora} className="contents">
            <span className="font-mono text-[10px] text-white/35 pr-2 flex items-center">{hora}</span>
            {DIAS.map((_, di) => {
              const chave = `${di}-${hi}`
              const ocupado = OCUPADOS.has(chave)
              const meu = reservado === chave
              return (
                <button
                  key={chave}
                  disabled={ocupado}
                  onClick={() => setReservado(meu ? null : chave)}
                  aria-label={`${DIAS[di]} às ${hora}${ocupado ? ', ocupado' : meu ? ', reservado por você' : ', livre'}`}
                  className={`press-target focus-ring h-9 rounded-md border font-mono text-[10px] transition-colors duration-200 ${
                    meu ? 'bg-white/90 border-white text-[#050506]'
                      : ocupado ? 'bg-white/[0.06] border-transparent text-white/25 cursor-not-allowed'
                      : 'border-white/[0.08] text-white/40 hover:border-white/30 hover:text-white/80'
                  }`}
                >
                  {meu ? 'você' : ocupado ? 'ocupado' : 'livre'}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className="h-10 mt-3">
        <AnimatePresence>
          {reservado && (
            <motion.p key={reservado} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="font-inter text-xs sm:text-sm text-white/70">
              Reservado {DIAS[d].toLowerCase()} às {HORAS[h]}. Confirmação enviada no WhatsApp do cliente e no seu.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Pedidos e estoque ───────────────────────────────────────────── */

function Pedidos() {
  const [estoque, setEstoque] = useState<Record<string, number>>({ 'Camiseta preta M': 6, 'Boné bordado': 3, 'Moletom cinza G': 2 })
  const [pedidos, setPedidos] = useState([
    { id: 1042, cliente: 'Ana R.', item: 'Camiseta preta M', valor: 129, enviado: false },
    { id: 1043, cliente: 'Bruno T.', item: 'Moletom cinza G', valor: 249, enviado: false },
    { id: 1044, cliente: 'Lívia S.', item: 'Boné bordado', valor: 89, enviado: false },
    { id: 1045, cliente: 'Caio M.', item: 'Camiseta preta M', valor: 129, enviado: false },
  ])
  const enviar = (id: number) => {
    const p = pedidos.find(x => x.id === id)
    if (!p || p.enviado) return
    setPedidos(ps => ps.map(x => (x.id === id ? { ...x, enviado: true } : x)))
    setEstoque(e => ({ ...e, [p.item]: Math.max(0, e[p.item] - 1) }))
  }
  const vendido = pedidos.filter(p => p.enviado).reduce((s, p) => s + p.valor, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
      <div>
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <p className="font-inter text-xs sm:text-sm text-white/55">Envie um pedido e veja o estoque baixar.</p>
          <p className="font-mono text-xs text-white/50 shrink-0">enviado <span className="text-white/90">R$ {vendido}</span></p>
        </div>
        <div className="flex flex-col gap-1.5">
          {pedidos.map(p => (
            <div key={p.id} className="rounded-md bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <span className="font-mono text-[10px] text-white/35">#{p.id}</span>
              <div className="min-w-0">
                <p className="font-inter text-xs text-white/85 truncate">{p.item}</p>
                <p className="font-mono text-[10px] text-white/40">{p.cliente} · R$ {p.valor}</p>
              </div>
              {p.enviado ? (
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/50 flex items-center gap-1"><Check size={11} /> enviado</span>
              ) : (
                <button onClick={() => enviar(p.id)} className="press-target focus-ring rounded-full border border-white/[0.14] px-3 py-1 font-inter text-[11px] text-white/75 hover:bg-white hover:text-[#050506] transition-colors">
                  Enviar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-md bg-white/[0.02] border border-white/[0.05] p-3">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 mb-3">Estoque</p>
        {Object.entries(estoque).map(([item, qtd]) => (
          <div key={item} className="py-2 border-b border-white/[0.05] last:border-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-inter text-xs text-white/70 truncate">{item}</span>
              <motion.span key={qtd} initial={{ scale: 1.4, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className={`font-mono text-xs ${qtd <= 1 ? 'text-amber-300/80' : 'text-white/80'}`}>{qtd}</motion.span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div className="h-full bg-white/50" animate={{ width: `${(qtd / 6) * 100}%` }} transition={{ duration: 0.5, ease }} />
            </div>
            {qtd <= 1 && <p className="mt-1.5 font-mono text-[10px] text-amber-300/70">repor estoque</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Janela ──────────────────────────────────────────────────────── */

export default function Demonstracao() {
  const [aba, setAba] = useState<Aba>('crm')
  const atual = ABAS.find(a => a.id === aba)!

  return (
    <section id="demonstracao" className="content-auto py-20 md:py-36">
      <div className="max-w-wide mx-auto px-6">
        <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-5">Demonstração</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="font-syne font-bold text-display-section text-white/85 leading-[1.1]">
            Não é print.<br />
            <span className="text-white/30 italic">Pode clicar.</span>
          </motion.h2>
          <p className="font-inter text-sm text-white/60 max-w-text leading-[1.8]">
            Três pedaços de sistema funcionando aqui mesmo, com dados de exemplo. O seu vai ter a cara e as regras da sua empresa.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease }} className="rounded-lg border border-white/[0.1] overflow-hidden shadow-2xl bg-chrome-canvas">
          <div className="flex items-center gap-3 px-4 py-3 bg-chrome-bar">
            <div className="flex gap-2 shrink-0">
              <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,99,91,0.4)' }} />
              <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(255,189,46,0.4)' }} />
              <span className="w-[11px] h-[11px] rounded-full" style={{ background: 'rgba(39,201,63,0.4)' }} />
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-2 rounded-sm px-3 py-1.5 bg-chrome-pill border border-white/[0.07]">
              <Lock size={11} className="text-white/30 shrink-0" strokeWidth={2} />
              <span className="font-mono text-xs truncate">
                <span className="font-semibold" style={{ color: '#d6d6d9' }}>sistema.suaempresa.com.br</span>
                <span style={{ color: '#59595d' }}>{atual.caminho}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] min-h-[420px]">
            <nav aria-label="Telas da demonstração" className="flex md:flex-col gap-1 p-3 border-b md:border-b-0 md:border-r border-white/[0.06] overflow-x-auto">
              {ABAS.map(a => (
                <button key={a.id} onClick={() => setAba(a.id)} aria-pressed={aba === a.id} className={`press-target focus-ring relative shrink-0 text-left rounded-md px-3 py-2 font-inter text-sm transition-colors ${aba === a.id ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
                  {aba === a.id && <motion.span layoutId="aba-ativa" className="absolute inset-0 rounded-md bg-white/[0.07] border border-white/[0.08]" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span className="relative">{a.nome}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div key={aba} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
                  {aba === 'crm' && <Crm />}
                  {aba === 'agenda' && <Agenda />}
                  {aba === 'pedidos' && <Pedidos />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
