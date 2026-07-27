export interface PortfolioProject {
  id: string
  company: string
  category: string
  description: string
  created: string
  goal: string
  image: string
  url: string
  rotation: number
}

export const projects: PortfolioProject[] = [
  {
    id: "raver-lab",
    company: "Raver Lab",
    category: "Marca autoral / E-commerce / Cultura eletrônica",
    description: "Marca conectada à cultura da música eletrônica, estética underground e moda autoral.",
    created: "Direção criativa, e-commerce, experiência Lab, narrativa de produto e estrutura digital.",
    goal: "Criar uma experiência que funcionasse como marca, loja e plataforma cultural ao mesmo tempo.",
    image: "/portfolio/raver-lab.jpg",
    url: "https://raverlab.com.br",
    rotation: -12,
  },
  {
    id: "paulo-lorenzi",
    company: "Paulo Lorenzi",
    category: "Landing page / Imóveis de alto padrão",
    description: "Projeto de presença digital para um profissional do mercado imobiliário premium.",
    created: "Landing page pessoal, hero institucional, estrutura de contato, apresentação de serviço e direção visual.",
    goal: "Transmitir confiança, sofisticação e facilitar a conversão de clientes interessados.",
    image: "/portfolio/paulo-lorenzi.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 8,
  },
  {
    id: "janaina-campos",
    company: "Janaina Campos",
    category: "Landing page / Social media / Marca pessoal",
    description: "Página criada para apresentar uma profissional de social media com clareza, autoridade e proximidade.",
    created: "Estrutura de landing page, copy, hierarquia visual, apresentação de diferenciais e CTA de contato.",
    goal: "Conectar a profissional com o público certo e transformar interesse em conversa.",
    image: "/portfolio/janaina-campos.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: -6,
  },
  {
    id: "portfolio-studio",
    company: "Vitor Lorenzi Studio",
    category: "Portfólio / Designer / Identidade digital",
    description: "Landing page pessoal criada para apresentar serviços, visão criativa e projetos selecionados.",
    created: "Direção visual, estrutura de apresentação, seções de serviços, portfólio e experiência responsiva.",
    goal: "Criar uma presença digital premium para vender design, sites e direção criativa.",
    image: "/portfolio/vitor-lorenzi-studio.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 14,
  },
  {
    id: "branding-project",
    company: "Branding Project",
    category: "Identidade visual / Sistema de marca",
    description: "Projeto focado em transformar uma ideia de negócio em uma presença visual consistente.",
    created: "Direção de logo, tipografia, paleta, linguagem visual e aplicação da identidade.",
    goal: "Construir uma marca com personalidade, clareza e percepção profissional.",
    image: "/portfolio/branding-project.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: -15,
  },
  {
    id: "experimental-interface",
    company: "Experimental Interface",
    category: "UI / Experiência digital / Direção criativa",
    description: "Interface experimental criada para explorar atmosfera, movimento, tipografia e narrativa visual.",
    created: "Conceito de interface, direção de movimento, composição visual e experiência interativa.",
    goal: "Criar uma forma mais artística, marcante e memorável de apresentar conteúdo digital.",
    image: "/portfolio/experimental-interface.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 5,
  },
]

export const projectGradients: Record<string, string> = {
  "raver-lab":              "linear-gradient(135deg, #1C0A3C 0%, #0A0814 100%)",
  "paulo-lorenzi":          "linear-gradient(135deg, #061428 0%, #080810 100%)",
  "janaina-campos":         "linear-gradient(135deg, #061E16 0%, #060A08 100%)",
  "portfolio-studio":       "linear-gradient(135deg, #16161E 0%, #090909 100%)",
  "branding-project":       "linear-gradient(135deg, #1E130A 0%, #0E0804 100%)",
  "experimental-interface": "linear-gradient(135deg, #1E080E 0%, #0E0406 100%)",
}
