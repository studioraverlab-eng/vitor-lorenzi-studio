export interface PortfolioProject {
  id: string
  company: string
  category: string
  description: string
  created: string
  goal: string
  image: string
  url?: string
  status: "No ar" | "Projeto desenvolvido"
  rotation: number
}

export interface OrbitCard {
  id: string
  company: string
  category: string
  image?: string
  url?: string
  rotation: number
  placeholder?: boolean
}

export const projects: PortfolioProject[] = [
  {
    id: "raver-lab",
    company: "Raver Lab",
    category: "Marca autoral / E-commerce / Cultura eletrônica",
    description: "Marca de roupa que nasceu na pista. Estética underground, cultura eletrônica e peça autoral.",
    created: "Direção criativa, e-commerce, experiência Lab, narrativa de produto e estrutura digital.",
    goal: "Ser marca, loja e plataforma cultural ao mesmo tempo, sem parecer três coisas diferentes.",
    image: "/portfolio/raver-lab.webp",
    url: "https://raverlab.com.br",
    status: "No ar",
    rotation: -12,
  },
  {
    id: "camilly-cardoso",
    company: "Studio Camilly Cardoso",
    category: "Landing page / Beleza / Agendamento no WhatsApp",
    description: "Landing page da Camilly, esteticista em Mauá, feita pra mostrar serviço e resultado e levar a cliente direto pro WhatsApp dela.",
    created: "Direção visual, copy, estrutura Astro, experiência responsiva e agendamento com mensagem pronta no WhatsApp.",
    goal: "Transformar técnica e atendimento individual em uma presença digital humana, clara e memorável.",
    image: "/portfolio/camilly-cardoso.webp",
    url: "https://studio-camilly-cardoso.vercel.app",
    status: "No ar",
    rotation: -6,
  },
  {
    id: "mart-clean",
    company: "Mart Clean",
    category: "Site institucional / Serviços / Orçamento guiado",
    description: "Site de limpeza de estofado com antes e depois, prova de confiança e orçamento montado ali mesmo.",
    created: "Posicionamento, UX, catálogo de serviços, diagnóstico visual e fluxo guiado de orçamento.",
    goal: "Organizar uma oferta ampla e transformar visitas em pedidos claros, rápidos e qualificados.",
    image: "/portfolio/mart-clean.webp",
    url: "https://martcleanhigienizacao.com.br",
    status: "No ar",
    rotation: 14,
  },
  {
    id: "paulo-lorenzi",
    company: "RECONecta",
    category: "Site de imóveis / Casas em condomínio / Painel próprio",
    description: "Vitrine de imóveis do corretor Paulo César Lorenzi, em Sorocaba e região, com painel onde ele mesmo publica cada casa.",
    created: "Identidade digital, estrutura de catálogo, página de imóvel, painel de publicação e direção visual.",
    goal: "Transmitir confiança em um mercado de alto valor e tirar o corretor da dependência de portal de terceiro.",
    image: "/portfolio/reconecta.webp",
    url: "https://reconecta-imoveis.vercel.app",
    status: "No ar",
    rotation: 8,
  },
  {
    id: "speed-car",
    company: "Speed Car",
    category: "Site / Aluguel de veículos / Simulador de ganhos",
    description: "Site da Speed Car, que aluga Gol e Voyage pra motorista de aplicativo. Tudo começou de um cartão de visita digital.",
    created: "Direção visual, recorte e tratamento dos carros, showroom animado, simulador de ganhos, contato com mensagem pronta no WhatsApp e SEO técnico.",
    goal: "Mostrar ao motorista quanto sobra na semana antes de alugar e transformar essa conta numa conversa no WhatsApp.",
    image: "/portfolio/speed-car.webp",
    url: "https://speedcar-aluguel.vercel.app",
    status: "No ar",
    rotation: -10,
  },
]

export const orbitCards: OrbitCard[] = [
  ...projects,
  {
    id: "next-brand",
    company: "Novo projeto",
    category: "Identidade em construção",
    rotation: -15,
    placeholder: true,
  },
  {
    id: "next-digital",
    company: "Em breve",
    category: "Experiência digital",
    rotation: 5,
    placeholder: true,
  },
]

export const projectGradients: Record<string, string> = {
  "raver-lab":              "linear-gradient(135deg, #1C0A3C 0%, #0A0814 100%)",
  "paulo-lorenzi":          "linear-gradient(135deg, #061428 0%, #080810 100%)",
  "camilly-cardoso":        "linear-gradient(135deg, #D7C4AE 0%, #6E4A38 100%)",
  "mart-clean":             "linear-gradient(135deg, #0D6E9E 0%, #05213D 100%)",
  "speed-car":              "linear-gradient(135deg, #1D2741 0%, #0E1424 100%)",
  "next-brand":             "linear-gradient(145deg, #171719 0%, #0A0A0B 55%, #18231D 100%)",
  "next-digital":           "linear-gradient(145deg, #1A1510 0%, #090909 58%, #15151C 100%)",
}
