'use client'

import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react'
import { sourceLabel, whatsappUrl } from '../../lib/acquisition'
import { trackWhatsAppConversion } from '../../lib/googleAds'

const subscribeToSource = () => () => {}
const getSource = () => sourceLabel(window.location.search, document.referrer)
const getServerSource = () => 'site-direto'

const needs = ['Criar meu primeiro site', 'Melhorar meu site atual', 'Criar uma landing page', 'Criar uma loja virtual']
const checks = [
  ['clareza', 'Fica claro o que você oferece logo na primeira tela?', 'Explicar o serviço e quem você atende antes de pedir qualquer ação.'],
  ['celular', 'É fácil ler e navegar pelo celular?', 'Revisar tamanho dos textos, navegação e disposição do conteúdo no celular.'],
  ['prova', 'Você mostra trabalhos, resultados ou depoimentos reais?', 'Acrescentar provas reais que ajudem o visitante a confiar no seu trabalho.'],
  ['contato', 'O botão de contato é fácil de encontrar?', 'Deixar o pedido de orçamento visível e com uma mensagem inicial útil.'],
]

export function WhatsAppLink({ children, className = '', message = 'Olá, Vitor! Quero conversar sobre um site para minha empresa.' }: { children: React.ReactNode; className?: string; message?: string }) {
  const source = useSyncExternalStore(subscribeToSource, getSource, getServerSource)
  return <a className={className} href={whatsappUrl(message, source)} target="_blank" rel="noopener noreferrer">{children}</a>
}

export function ContactFlow() {
  const [error, setError] = useState('')
  const submitting = useRef(false)
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current) return
    const form = e.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const business = String(data.get('business') || '').trim()
    if (!business) { setError('Conte qual é a sua empresa ou atividade.'); return }
    setError('')
    const message = `Olá, Vitor! Quero conversar sobre meu projeto.\n\nEmpresa ou atividade: ${business}\nPreciso de: ${data.get('need')}\nPrazo desejado: ${data.get('timing')}\nSite ou Instagram: ${String(data.get('site') || '').trim() || 'Ainda não tenho'}`
    submitting.current = true
    trackWhatsAppConversion(() => {
      submitting.current = false
      window.location.assign(whatsappUrl(message, getSource()))
    })
  }
  return <form onSubmit={submit} className="acq-form">
    <label>Empresa ou atividade<input name="business" required maxLength={100} autoComplete="organization" placeholder="Ex.: consultório, escritório, loja…" /></label>
    <label>O que você precisa?<select name="need" defaultValue={needs[0]}>{needs.map(need => <option key={need}>{need}</option>)}</select></label>
    <label>Quando pretende começar?<select name="timing"><option>Assim que possível</option><option>Nos próximos 30 dias</option><option>Estou planejando</option></select></label>
    <label>Site ou Instagram <span>(opcional)</span><input name="site" maxLength={180} placeholder="Seu endereço ou @perfil" autoComplete="url" /></label>
    {error && <p role="alert">{error}</p>}
    <button type="submit" className="acq-button">Continuar no WhatsApp</button>
    <p className="acq-fine">Você confere a mensagem no WhatsApp e decide quando enviar. Este formulário não salva suas respostas no site.</p>
  </form>
}

export function SiteCheck() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const recommendations = checks.filter(([id]) => answers[id] !== 'Sim').map(([, , recommendation]) => recommendation)
  return <div className="acq-check">
    {!done ? <form onSubmit={e => { e.preventDefault(); setDone(true) }}>
      <div className="acq-check-list">{checks.map(([id, question]) => <fieldset key={id}><legend>{question}</legend><div>{['Sim', 'Não', 'Não sei'].map(answer => <label key={answer}><input type="radio" required name={id} value={answer} checked={answers[id] === answer} onChange={() => setAnswers({ ...answers, [id]: answer })} />{answer}</label>)}</div></fieldset>)}</div>
      <button type="submit" className="acq-button acq-light">Ver minhas prioridades</button>
    </form> : <div role="status" tabIndex={-1}>
      <h3>{recommendations.length ? 'Seu ponto de partida' : 'Você já tem uma boa base.'}</h3>
      {recommendations.length ? <ul>{recommendations.map(text => <li key={text}>{text}</li>)}</ul> : <p>O próximo passo é revisar o site real e observar como as pessoas chegam até o contato.</p>}
      <p className="acq-fine">Esta é uma autoavaliação baseada nas suas respostas, não uma análise automática do seu site.</p>
      <WhatsAppLink className="acq-button acq-light" message={`Olá, Vitor! Fiz a autoavaliação no seu site e quero conversar sobre melhorias.\n${recommendations.map(text => `• ${text}`).join('\n')}`}>Conversar sobre as melhorias</WhatsAppLink>
      <button className="acq-text-button" type="button" onClick={() => setDone(false)}>Rever respostas</button>
    </div>}
  </div>
}
