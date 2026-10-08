import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { nichos } from '../../../data/nichos'
import { projects } from '../../../data/projects'
import { brl, PLANOS } from '../../../lib/planos'
import { WhatsAppLink } from '../../criar-site/ContactFlow'
import '../../criar-site/acquisition.css'

export const dynamicParams = false
export const generateStaticParams = () => nichos.map(n => ({ nicho: n.slug }))

export async function generateMetadata({ params }: { params: Promise<{ nicho: string }> }): Promise<Metadata> {
  const { nicho } = await params
  const n = nichos.find(item => item.slug === nicho)
  if (!n) return {}
  return { title: n.title, description: n.description, alternates: { canonical: `/site-para/${n.slug}` }, openGraph: { title: n.h1, description: n.description, url: `/site-para/${n.slug}` } }
}

export default async function NichoPage({ params }: { params: Promise<{ nicho: string }> }) {
  const { nicho } = await params
  const n = nichos.find(item => item.slug === nicho)
  if (!n) notFound()
  const projeto = projects.find(p => p.id === n.projeto)
  const outros = nichos.filter(item => item.slug !== n.slug)
  const schema = { '@context': 'https://schema.org', '@type': 'Service', serviceType: n.title, provider: { '@type': 'ProfessionalService', name: 'Vitor Lorenzi Studio', url: 'https://vitor-lorenzi-studio.vercel.app', areaServed: ['Sorocaba', 'Brasil'] }, areaServed: 'Sorocaba e Brasil' }
  return <div className="acq">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="acq-nav"><Link href="/" className="acq-brand">vitor lorenzi<span>STUDIO <b>&lt;.DEV/&gt;</b></span></Link><nav aria-label="Navegação"><Link href="/criar-site">Serviços</Link><Link href="/portfolio">Projetos</Link><WhatsAppLink className="acq-nav-cta" message={n.mensagem}>Pedir orçamento</WhatsAppLink></nav></header>
    <main id="main-content" tabIndex={-1}>
      <section className="acq-hero acq-wrap">
        <div className="acq-hero-copy"><p className="acq-kicker">{n.nome} • Sorocaba + online</p><h1>{n.h1}</h1><p className="acq-intro">{n.intro}</p><div className="acq-actions"><WhatsAppLink className="acq-button" message={n.mensagem}>Pedir orçamento no WhatsApp</WhatsAppLink>{projeto && <a className="acq-underlined" href="#projeto">Ver um site assim no ar</a>}</div><p className="acq-fine">Landing pages a partir de R$ {brl(PLANOS[0].promo)}. Escopo e valor final na proposta.</p></div>
        {projeto && <div className="acq-browser"><div className="acq-browser-bar"><span aria-hidden="true">● ● ●</span><span>{projeto.url?.replace('https://', '')}</span></div><Image src={projeto.image} alt={`Site ${projeto.company} desenvolvido pelo Studio`} width={1000} height={700} priority className="acq-hero-image" /><div className="acq-browser-caption"><span>{projeto.company}</span><span>{projeto.category.split(' / ')[0]}</span></div></div>}
      </section>
      <section className="acq-section acq-wrap"><div className="acq-section-head"><h2>Se isso<br />parece familiar.</h2><p>Os problemas que mais aparecem quando um cliente desse ramo me chama.</p></div><div className="acq-services">{n.dores.map(d => <article key={d}><h3>{d}</h3></article>)}</div></section>
      <section className="acq-section acq-wrap"><div className="acq-section-head"><h2>O que o<br />site resolve.</h2><p>O que entra no projeto. O resto a gente define na conversa.</p></div><div className="acq-services acq-niches"><article><h3>Entrega</h3><ul>{n.entrega.map(e => <li key={e}>{e}</li>)}</ul><WhatsAppLink className="acq-button acq-outline" message={n.mensagem}>Quero um site assim</WhatsAppLink></article></div></section>
      {projeto && <section id="projeto" className="acq-section acq-wrap"><div className="acq-section-head"><h2>Um projeto<br />real no ar.</h2><p>{projeto.description}</p></div><div className="acq-projects"><article><a href={projeto.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir site ${projeto.company}`}><div className="acq-project-image"><Image src={projeto.image} alt={`Site ${projeto.company}`} width={720} height={480} /></div><h3>{projeto.company}</h3></a><p className="acq-project-detail">{projeto.created}</p></article></div></section>}
      <section className="acq-faq acq-wrap"><h2>Perguntas comuns</h2>{[...n.perguntas, ['Você atende fora de Sorocaba?', 'Sim. O atendimento pode ser todo online.'] as [string, string]].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <section className="acq-section acq-wrap"><div className="acq-section-head"><h2>Outros<br />segmentos.</h2><p>Também faço sites para:</p></div><p>{outros.map((o, i) => <span key={o.slug}>{i > 0 && ' · '}<Link className="acq-underlined" href={`/site-para/${o.slug}`}>{o.nome}</Link></span>)}</p></section>
    </main><footer className="acq-footer acq-wrap"><p>Vitor Lorenzi Studio <span>&lt;.DEV/&gt;</span></p><Link href="/criar-site">Ver serviços e valores</Link><a href="mailto:contato@vitorlorenzi.studio">contato@vitorlorenzi.studio</a></footer>
    <div className="acq-mobile-cta"><WhatsAppLink className="acq-button" message={n.mensagem}>Pedir orçamento no WhatsApp</WhatsAppLink></div>
  </div>
}
