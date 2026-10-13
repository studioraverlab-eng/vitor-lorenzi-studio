export interface PostSeries {
  id: string
  cliente: string
  segmento: string
  conceito: string
  pasta: string
  total: number
  formato: "feed" | "story"
}

// Imagens em public/portfolio/posts/<pasta>/NN.webp, 720px de largura.
// Feed é 4:5 (1080x1350), story é 9:16 (1080x1920).
export const postSeries: PostSeries[] = [
  {
    id: "raver-lab",
    cliente: "Raver Lab",
    segmento: "Marca autoral de roupa / Techno",
    conceito:
      "Duas séries de feed com regras próprias. Grade é foto P&B, palavra condensada gigante e o verde da sala TECHNO. Acervo é letra pequena sobre branco, contando a história da música eletrônica.",
    pasta: "raver-lab",
    total: 12,
    formato: "feed",
  },
  {
    id: "raver-lab-materia",
    cliente: "Raver Lab · Matéria",
    segmento: "Stories de produto",
    conceito:
      "Série de stories técnicos: tecido, gramatura, modelagem e tabela de medidas, com a mesma tipografia em todas as peças.",
    pasta: "raver-lab-materia",
    total: 6,
    formato: "story",
  },
  {
    id: "caminho",
    cliente: "Caminho Imóveis",
    segmento: "Corretor de imóveis / Sorocaba",
    conceito:
      "A estrada dourada do logo atravessa o feed. Cada post mostra um pedaço dela e, na grade do perfil, os nove viram um caminho só.",
    pasta: "caminho",
    total: 9,
    formato: "feed",
  },
  {
    id: "alfero",
    cliente: "Alfero Barber",
    segmento: "Barbearia de visagismo / Sorocaba",
    conceito: "Cartaz granulado com letra larga gigante e cards de preço. Fotos reais da casa, tratadas no mesmo tom.",
    pasta: "alfero",
    total: 5,
    formato: "feed",
  },
]
