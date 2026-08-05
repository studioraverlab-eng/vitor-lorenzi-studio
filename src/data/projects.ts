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
    description: "Marca conectada à cultura da música eletrônica, estética underground e moda autoral.",
    created: "Direção criativa, e-commerce, experiência Lab, narrativa de produto e estrutura digital.",
    goal: "Criar uma experiência que funcionasse como marca, loja e plataforma cultural ao mesmo tempo.",
    image: "/portfolio/raver-lab.webp",
    url: "https://raverlab.com.br",
    status: "No ar",
    rotation: -12,
  },
  {
    id: "paulo-lorenzi",
    company: "Paulo Lorenzi",
    category: "Landing page / Imóveis de alto padrão",
    description: "Projeto de presença digital para um profissional do mercado imobiliário premium.",
    created: "Landing page pessoal, hero institucional, estrutura de contato, apresentação de serviço e direção visual.",
    goal: "Transmitir confiança, sofisticação e facilitar a conversão de clientes interessados.",
    image: "/portfolio/paulo-lorenzi.webp",
    status: "Projeto desenvolvido",
    rotation: 8,
  },
  {
    id: "landing-base",
    company: "Landing Base",
    category: "Landing page / Beleza / Posicionamento",
    description: "Landing page para Camilly Cardoso, construída para apresentar serviços, resultados e agendamento com uma narrativa mais pessoal.",
    created: "Direção visual, copy, estrutura Astro, experiência responsiva e jornada de agendamento.",
    goal: "Transformar técnica e atendimento individual em uma presença digital humana, clara e memorável.",
    image: "/portfolio/landing-base.webp",
    status: "Projeto desenvolvido",
    rotation: -6,
  },
  {
    id: "mart-clean",
    company: "Mart Clean",
    category: "Site institucional / Serviços / Orçamento guiado",
    description: "Site para limpeza técnica de estofados, com comparação antes e depois, prova de confiança e montagem de pedido online.",
    created: "Posicionamento, UX, catálogo de serviços, diagnóstico visual e fluxo guiado de orçamento.",
    goal: "Organizar uma oferta ampla e transformar visitas em pedidos claros, rápidos e qualificados.",
    image: "/portfolio/mart-clean.webp",
    status: "Projeto desenvolvido",
    rotation: 14,
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
  "landing-base":           "linear-gradient(135deg, #D7C4AE 0%, #6E4A38 100%)",
  "mart-clean":             "linear-gradient(135deg, #0D6E9E 0%, #05213D 100%)",
  "next-brand":             "linear-gradient(145deg, #171719 0%, #0A0A0B 55%, #18231D 100%)",
  "next-digital":           "linear-gradient(145deg, #1A1510 0%, #090909 58%, #15151C 100%)",
}
