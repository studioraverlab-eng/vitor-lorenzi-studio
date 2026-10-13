'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, CalendarDays, Package, LayoutDashboard, UserRound, Calculator, FileSpreadsheet, Bell } from 'lucide-react'
import PageBackground from '../PageBackground'
import SectionDivider from '../SectionDivider'
import Footer from '../Footer'
import { WhatsAppLink } from '../../app/criar-site/ContactFlow'
import PlanilhaVira from './PlanilhaVira'
import Demonstracao from './Demonstracao'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]
const MENSAGEM = 'Olá, Vitor! Quero conversar sobre um sistema para minha empresa.'

const reveal = { hidden: { y: '105%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 1.1, ease } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }

const TIPOS = [
  { icon: Users, title: 'CRM e carteira de clientes', desc: 'Funil de vendas, histórico de cada contato e cada vendedor vendo só a própria carteira.' },
  { icon: CalendarDays, title: 'Agenda e agendamento', desc: 'O cliente marca sozinho, você vê tudo num painel e ninguém marca em cima de ninguém.' },
  { icon: Package, title: 'Pedidos e estoque', desc: 'Pedido entra, estoque baixa, e você sabe o que vendeu e o que precisa repor.' },
  { icon: LayoutDashboard, title: 'Painel administrativo', desc: 'Você atualiza catálogo, preços e fotos sem depender de ninguém.' },
  { icon: UserRound, title: 'Área do cliente', desc: 'Login pro seu cliente acompanhar pedido, contrato ou serviço.' },
  { icon: Calculator, title: 'Orçamentos e calculadoras', desc: 'A conta que você faz na mão vira uma tela que responde na hora.' },
  { icon: FileSpreadsheet, title: 'Controles internos', desc: 'Financeiro, comissões, acessos e senhas da equipe num lugar seguro.' },
  { icon: Bell, title: 'Avisos e integrações', desc: 'Pix, Mercado Pago, e-mail, aviso no celular e mensagem pronta no WhatsApp.' },
]

const ETAPAS = [
  { n: '01', t: 'Mapear', d: 'Você me mostra como trabalha hoje: a planilha, o caderno, o grupo do WhatsApp.' },
  { n: '02', t: 'Desenhar', d: 'Você recebe as telas principais, o prazo e o valor antes de qualquer código.' },
  { n: '03', t: 'Construir', d: 'Eu desenvolvo em partes. Cada parte você testa com os seus dados.' },
  { n: '04', t: 'Ligar', d: 'Seus dados entram, sua equipe começa a usar, e eu acompanho os primeiros dias.' },
]

const PERGUNTAS: [string, string][] = [
  ['Quanto custa um sistema?', 'Depende de quantas telas, usuários e integrações ele tem. Na primeira conversa eu já dou uma faixa. O valor fechado vem na proposta.'],
  ['Preciso instalar alguma coisa?', 'Não. Abre no navegador, no computador ou no celular, com login e senha.'],
  ['Dá pra trazer minha planilha?', 'Dá. Seus dados atuais entram no sistema na hora de começar a usar.'],
  ['Tem mensalidade?', 'O sistema é seu, não é aluguel de software pronto. Hospedagem e banco de dados são combinados na proposta e costumam sair baratos.'],
  ['Você atende fora de Sorocaba?', 'Atendo. Tudo pode ser feito online.'],
]

function Topo() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass-nav w-full max-w-wide flex items-center justify-between px-5 py-3 rounded-lg">
        <Link href="/" className="focus-ring flex items-center gap-3 group">
          <div className="w-7 h-7 border border-white/[0.14] rounded-md flex items-center justify-center bg-white/[0.04]">
            <span className="font-syne font-bold text-xs text-white/70 tracking-[0.08em]">VL</span>
          </div>
          <span className="font-syne font-semibold text-sm text-white/60 tracking-[0.18em] uppercase hidden sm:block group-hover:text-white/70 transition-colors">Studio</span>
        </Link>
        <ul className="hidden md:flex items-center gap-7">
          {[['#planilha', 'Como funciona'], ['#demonstracao', 'Demonstração'], ['#tipos', 'O que eu faço']].map(([href, label]) => (
            <li key={href}><a href={href} className="focus-ring font-inter text-sm text-white/65 hover:text-white/90 transition-colors tracking-wide">{label}</a></li>
          ))}
        </ul>
        <WhatsAppLink message={MENSAGEM} className="press-target focus-ring flex items-center px-4 py-2 text-sm font-inter font-medium bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/[0.18] rounded-full text-white/70 hover:text-white transition-all">
          Pedir orçamento
        </WhatsAppLink>
      </nav>
    </header>
  )
}

export default function SistemasView() {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <PageBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Topo />

        {/* Abertura */}
        <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
          <div className="relative z-10 w-full max-w-wide mx-auto px-6 text-center pt-20">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-mono text-xs tracking-[0.28em] text-white/62 uppercase mb-8">
              vitorlorenzi.studio <span className="text-white/[0.14]">/</span> sistemas sob medida
            </motion.p>
            <motion.h1 variants={stagger} initial="hidden" animate="show" className="font-syne font-extrabold leading-[0.95] tracking-[-0.025em] text-display-hero">
              <div className="overflow-hidden"><motion.span variants={reveal} className="block text-white/95">Sua planilha</motion.span></div>
              <div className="overflow-hidden"><motion.span variants={reveal} className="block text-white/25 italic">vira sistema.</motion.span></div>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }} className="mt-8 font-inter font-light text-base text-white/68 max-w-text mx-auto leading-[1.75]">
              CRM, agenda, pedidos, estoque, área do cliente. Eu desenvolvo o sistema do jeito que a sua empresa já trabalha, e você fala direto comigo do começo ao fim.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} className="mt-10 flex items-center justify-center gap-3 flex-wrap">
              <WhatsAppLink message={MENSAGEM} className="focus-ring group flex items-center gap-2 px-7 py-3 bg-white/90 hover:bg-white text-[#050506] font-inter font-medium text-sm rounded-full transition-colors duration-300">
                Pedir orçamento
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </WhatsAppLink>
              <a href="#demonstracao" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black font-inter">
                Testar a demonstração
              </a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase">rola pra ver</span>
            <motion.div animate={{ scaleY: [1, 1.5, 1], opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent origin-top" />
          </motion.div>
        </section>

        <PlanilhaVira />
        <SectionDivider />
        <Demonstracao />
        <SectionDivider />

        {/* O que eu faço */}
        <section id="tipos" className="content-auto py-20 md:py-36">
          <div className="max-w-wide mx-auto px-6">
            <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-5">O que eu desenvolvo</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="font-syne font-bold text-white/82 leading-[1.1] text-display-section">
                Cada empresa tem<br />
                <span className="text-white/28 italic">a sua bagunça.</span>
              </motion.h2>
              <p className="font-inter text-sm text-white/60 max-w-text leading-[1.8]">Quase sempre o sistema certo é uma mistura de dois ou três destes. A gente descobre qual na primeira conversa.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIPOS.map((t, i) => {
                const Icon = t.icon
                return (
                  <motion.div key={t.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease }} className="group relative p-6 rounded-lg glass-card hover:border-white/[0.11] transition-colors duration-300 overflow-hidden">
                    <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-5 font-syne font-extrabold text-4xl text-white/[0.035] group-hover:text-white/[0.06] transition-colors duration-500 select-none" style={{ lineHeight: 1, letterSpacing: '-0.1em' }}>{String(i + 1).padStart(2, '0')}</span>
                    <div className="relative z-10 w-11 h-11 rounded-md flex items-center justify-center mb-6 border border-white/[0.08] bg-white/[0.03] group-hover:border-white/[0.16] group-hover:bg-white/[0.06] transition-all duration-300">
                      <Icon size={19} strokeWidth={1.5} className="text-white/40 group-hover:text-white/75 transition-colors duration-300" />
                    </div>
                    <h3 className="relative z-10 font-syne font-semibold text-base text-white/72 mb-2 group-hover:text-white/88 transition-colors duration-300">{t.title}</h3>
                    <p className="relative z-10 font-inter text-sm text-white/60 leading-[1.6] group-hover:text-white/75 transition-colors duration-300">{t.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Processo */}
        <section className="content-auto py-20 md:py-36">
          <div className="max-w-wide mx-auto px-6">
            <p className="font-mono text-xs tracking-[0.28em] text-white/50 uppercase mb-5">Processo</p>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="font-syne font-bold text-white/85 mb-16 leading-[1.1] text-display-section">
              Da planilha<br /><span className="text-white/25 italic">ao sistema.</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
              {ETAPAS.map((e, i) => (
                <motion.div key={e.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08, ease }} className="border-t border-white/[0.08] pt-6">
                  <span className="font-mono text-xs tracking-[0.1em] text-white/50">{e.n}</span>
                  <h3 className="mt-3 font-syne font-semibold text-base text-white/80 mb-2">{e.t}</h3>
                  <p className="font-inter text-sm text-white/60 leading-[1.8]">{e.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Perguntas */}
        <section className="content-auto py-20 md:py-36">
          <div className="max-w-wide mx-auto px-6 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <h2 className="font-syne font-bold text-white/85 leading-[1.1] text-display-section">Antes de<br /><span className="text-white/25 italic">começar.</span></h2>
            <div>
              {PERGUNTAS.map(([q, a]) => (
                <details key={q} className="group border-b border-white/[0.08] py-5">
                  <summary className="focus-ring cursor-pointer list-none flex items-center justify-between gap-4 font-inter text-base text-white/80">
                    {q}
                    <span className="font-mono text-white/40 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 font-inter text-sm text-white/60 leading-[1.8] max-w-text">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Fechamento */}
        <section className="py-24 md:py-40">
          <div className="max-w-wide mx-auto px-6 text-center">
            <h2 className="font-syne font-bold text-white/90 leading-[1.05] text-display-section">
              Me manda a planilha.<br /><span className="text-white/30 italic">Eu te mostro o sistema.</span>
            </h2>
            <p className="mt-6 font-inter text-sm text-white/60 max-w-text mx-auto leading-[1.8]">Conta como sua empresa funciona hoje. Em uma conversa eu já te digo o que dá pra fazer e quanto custa, mais ou menos.</p>
            <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
              <WhatsAppLink message={MENSAGEM} className="focus-ring group flex items-center gap-2 px-7 py-3 bg-white/90 hover:bg-white text-[#050506] font-inter font-medium text-sm rounded-full transition-colors duration-300">
                Chamar no WhatsApp
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </WhatsAppLink>
              <Link href="/" className="focus-ring inline-flex items-center rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black font-inter">
                Conhecer o Studio
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
