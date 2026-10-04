export const DESCONTO = 10

export const PLANOS = [
  { name: 'Landing page', price: 800, desc: 'Uma página focada em um serviço, uma oferta ou uma campanha.', message: 'Olá, Vitor! Quero um orçamento de landing page.' },
  { name: 'Site institucional', price: 1000, desc: 'Uma presença completa para apresentar sua empresa e seus serviços.', message: 'Olá, Vitor! Quero um orçamento de site institucional.' },
  { name: 'Loja virtual', price: 1200, desc: 'Uma vitrine para apresentar produtos e estruturar a compra online.', message: 'Olá, Vitor! Quero um orçamento de loja virtual.' },
]

export const comDesconto = (price: number) => Math.round(price * (100 - DESCONTO) / 100)
export const brl = (n: number) => n.toLocaleString('pt-BR')
