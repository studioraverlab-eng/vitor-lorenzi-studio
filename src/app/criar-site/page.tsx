import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '../../data/projects'
import { nichos } from '../../data/nichos'
import { brl, PLANOS } from '../../lib/planos'
import { ContactFlow, SiteCheck, WhatsAppLink } from './ContactFlow'
import './acquisition.css'

export const metadata: Metadata = {
  title: 'Criação de sites e landing pages para sua empresa',
  description: 'Sites, landing pages e lojas virtuais com Vitor Lorenzi. Veja projetos reais e converse diretamente pelo WhatsApp. Sorocaba e atendimento online para o Brasil.',
  alternates: { canonical: '/criar-site' },
  openGraph: { title: 'Seu próximo cliente precisa entender por que escolher você.', description: 'Sites e landing pages com design, conteúdo e um caminho claro até o WhatsApp.', url: '/criar-site', images: [] },
  twitter: { card: 'summary', title: 'Criação de sites | Vitor Lorenzi Studio', images: [] },
}

const selected = ['mart-clean', 'raver-lab', 'speed-car'].map(id => projects.find(project => project.id === id)!)

export default function AcquisitionPage() {
  return <div className="acq">
    <header className="acq-nav"><Link href="/" className="acq-brand">vitor lorenzi<span>STUDIO <b>&lt;.DEV/&gt;</b></span></Link><nav aria-label="Navegação"><a href="#projetos">Projetos</a><a href="#investimento">Serviços</a><a className="acq-nav-cta" href="#conversar">Pedir orçamento</a></nav></header>
    <main id="main-content" tabIndex={-1}>
      <section className="acq-hero acq-wrap">
        <div className="acq-hero-copy"><p className="acq-kicker">Sites e landing pages • Sorocaba + online</p><h1>Criação de sites que fazem seu cliente escolher você.</h1><p className="acq-intro">Eu crio sites que apresentam seu trabalho com clareza e deixam o caminho até o WhatsApp fácil. Do design ao site no ar, você conversa direto comigo.</p><div className="acq-actions"><WhatsAppLink className="acq-button">Pedir orçamento no WhatsApp</WhatsAppLink><a className="acq-underlined" href="#projetos">Ver projetos reais</a></div><p className="acq-fine">Landing pages a partir de R$ {brl(PLANOS[0].promo)}, com desconto no primeiro projeto. Escopo e valor final na proposta.</p></div>
        <div className="acq-browser"><div className="acq-browser-bar"><span aria-hidden="true">● ● ●</span><span>martcleanhigienizacao.com.br</span></div><Image src="/portfolio/mart-clean.webp" alt="Site da Mart Clean desenvolvido pelo Studio, com apresentação de serviços e pedido de orçamento" width={1000} height={700} priority className="acq-hero-image" /><div className="acq-browser-caption"><span>Mart Clean</span><span>Site + orçamento guiado</span></div></div>
      </section>
      <div className="acq-proof-strip acq-wrap"><p>Design pensado para sua marca</p><p>Experiência no celular</p><p>Contato direto pelo WhatsApp</p></div>
      <section id="projetos" className="acq-section acq-wrap"><div className="acq-section-head"><h2>O trabalho fala.<br />Pode abrir e conferir.</h2><p>Projetos de negócios diferentes, cada um com um caminho próprio até o contato.</p></div><div className="acq-projects">{selected.map(project => <article key={project.id}><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir site ${project.company}`}><div className="acq-project-image"><Image src={project.image} alt={`Site ${project.company}`} width={720} height={480} /></div><h3>{project.company}</h3></a><p>{project.description}</p><p className="acq-project-detail">{project.created}</p></article>)}</div><Link className="acq-underlined" href="/portfolio">Conhecer o portfólio completo</Link></section>
      <section id="nichos" className="acq-section acq-wrap"><div className="acq-section-head"><h2>Sites para clínicas<br />e imobiliárias.</h2><p>Dois tipos de negócio em que o site decide quem recebe a mensagem.</p></div><div className="acq-services acq-niches">{[
        { name: 'Clínicas e consultórios', desc: 'Para o paciente confiar antes da primeira consulta e marcar sem complicação.', items: ['Agendamento pelo WhatsApp', 'Autoridade do profissional em destaque', 'Uma página para cada procedimento'], message: 'Olá, Vitor! Quero um site para minha clínica ou consultório.' },
        { name: 'Imobiliárias e corretores', desc: 'Para os imóveis aparecerem bem e cada interessado virar contato.', items: ['Vitrine de imóveis', 'Captação de leads pelo WhatsApp'], message: 'Olá, Vitor! Quero um site para minha imobiliária ou para meu trabalho como corretor.' },
      ].map(niche => <article key={niche.name}><h3>{niche.name}</h3><p>{niche.desc}</p><ul>{niche.items.map(item => <li key={item}>{item}</li>)}</ul><WhatsAppLink className="acq-button acq-outline" message={niche.message}>Quero um site assim</WhatsAppLink></article>)}</div> <p className="acq-fine">Outros segmentos: {nichos.map((n, i) => <span key={n.slug}>{i > 0 && ' · '}<Link className="acq-underlined" href={`/site-para/${n.slug}`}>{n.nome}</Link></span>)}</p></section>
      <section id="investimento" className="acq-section acq-wrap"><div className="acq-section-head"><h2>Qual é o seu<br />próximo passo?</h2><p>Escolhemos o formato pelo que seu negócio precisa comunicar e vender.</p></div><div className="acq-services">{[
        { name: 'Landing page', price: 800, promo: 400, desc: 'Uma página focada em um serviço, uma oferta ou uma campanha.', items: ['Apresentação da oferta', 'Layout para celular e desktop', 'Chamada para o WhatsApp'], message: 'Olá, Vitor! Quero um orçamento de landing page.' },
        { name: 'Site institucional', price: 1000, promo: 700, desc: 'Uma presença completa para apresentar sua empresa e seus serviços.', items: ['Estrutura de páginas por escopo', 'Serviços e portfólio organizados', 'Caminho claro para pedir orçamento'], message: 'Olá, Vitor! Quero um orçamento de site institucional.' },
        { name: 'Loja virtual', price: 900, promo: 900, desc: 'Uma vitrine para apresentar produtos e estruturar a compra online.', items: ['Catálogo conforme o projeto', 'Jornada de compra planejada', 'Integrações definidas na proposta'], message: 'Olá, Vitor! Quero um orçamento de loja virtual.' },
      ].map(service => <article key={service.name}><h3>{service.name}</h3><p>{service.desc}</p><div className="acq-price"><span>a partir de</span>{service.price > service.promo && <s className="acq-old">R$ {brl(service.price)}</s>}R$ {brl(service.promo)}</div><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><WhatsAppLink className="acq-button acq-outline" message={service.message}>Conversar sobre {service.name.toLowerCase()}</WhatsAppLink></article>)}</div><p className="acq-fine">Valores de entrada. Prazos, quantidade de páginas, domínio, hospedagem, manutenção e custos de plataformas são combinados na proposta, antes de começar.</p></section>
      <section id="avaliar" className="acq-assessment"><div className="acq-wrap acq-assessment-grid"><div><p className="acq-kicker">Já tem um site?</p><h2>Olhe para ele<br />como seu cliente.</h2><p>Responda quatro perguntas e descubra o que merece atenção primeiro. Sem cadastro.</p></div><SiteCheck /></div></section>
      <section id="processo" className="acq-section acq-wrap"><div className="acq-section-head"><h2>Da conversa<br />à publicação.</h2><p>Você sabe o que está sendo feito e participa das decisões.</p></div><ol className="acq-process"><li><span>01</span><h3>Entender</h3><p>Conversamos sobre seu negócio, o público e o objetivo do site.</p></li><li><span>02</span><h3>Definir</h3><p>Você recebe a proposta com entregas, investimento e prazo.</p></li><li><span>03</span><h3>Criar</h3><p>Eu desenvolvo a estrutura e o visual para você revisar.</p></li><li><span>04</span><h3>Publicar</h3><p>Conferimos a experiência e colocamos o projeto no ar.</p></li></ol></section>
      <section id="conversar" className="acq-contact acq-wrap"><div><p className="acq-kicker">Fale direto com Vitor</p><h2>Me conta<br />o que você<br />quer colocar<br />no mundo.</h2><p>Preencha o essencial e continue a conversa no WhatsApp. Se preferir, pode mandar sua ideia direto.</p><WhatsAppLink className="acq-underlined">Abrir WhatsApp sem preencher</WhatsAppLink></div><ContactFlow /></section>
      <section id="perguntas" className="acq-faq acq-wrap"><h2>Antes de começar</h2>{[
        ['Você atende fora de Sorocaba?', 'Sim. O atendimento pode ser online, com alinhamento, apresentação e revisão à distância.'],
        ['Preciso ter tudo pronto?', 'Pode chegar com a ideia. Na conversa, definimos o que você já tem e o que precisa ser produzido, como textos, fotos e identidade.'],
        ['Quanto tempo leva?', 'O prazo depende das páginas, funcionalidades e materiais. Ele é definido na proposta, depois que entendermos seu projeto.'],
        ['O site garante clientes?', 'O site organiza sua apresentação e facilita o contato. A geração de clientes também depende da oferta, divulgação, procura e atendimento.'],
        ['Como meus dados são usados aqui?', 'As respostas do formulário e da autoavaliação ficam na página enquanto você navega. Ao abrir o WhatsApp, elas entram em uma mensagem que você pode revisar antes de enviar. A mensagem inclui a origem da visita, quando identificável. Usamos uma tag do Google Ads para medir cliques de contato e a origem dos anúncios. As respostas deste formulário não são enviadas ao Google por esse evento. Abrir o WhatsApp não envia a mensagem automaticamente.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
    </main><footer className="acq-footer acq-wrap"><p>Vitor Lorenzi Studio <span>&lt;.DEV/&gt;</span></p><Link href="/">Conhecer o Studio</Link><a href="mailto:contato@vitorlorenzi.studio">contato@vitorlorenzi.studio</a></footer>
    <div className="acq-mobile-cta"><WhatsAppLink className="acq-button">Pedir orçamento no WhatsApp</WhatsAppLink></div>
  </div>
}
