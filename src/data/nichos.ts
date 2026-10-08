export interface Nicho {
  slug: string
  nome: string
  title: string
  description: string
  h1: string
  intro: string
  dores: string[]
  entrega: string[]
  projeto?: string
  mensagem: string
  perguntas: [string, string][]
}

export const nichos: Nicho[] = [
  {
    slug: 'clinica-e-consultorio',
    nome: 'Clínicas e consultórios',
    title: 'Site para clínica e consultório em Sorocaba',
    description: 'Criação de site para clínica, consultório e profissional de saúde em Sorocaba e online. Agendamento pelo WhatsApp e uma página para cada procedimento.',
    h1: 'Site para clínica que o paciente confia antes da primeira consulta.',
    intro: 'O paciente pesquisa antes de marcar. Ele quer saber quem vai atender, o que você faz e como agendar. Eu monto um site que responde isso em poucos segundos e leva a conversa pro seu WhatsApp.',
    dores: ['Paciente chega pelo Instagram e não acha onde agendar', 'Procedimentos explicados só no boca a boca', 'Concorrente aparece antes no Google'],
    entrega: ['Página para cada procedimento ou especialidade', 'Profissional e formação em destaque', 'Agendamento com mensagem pronta no WhatsApp', 'SEO local para aparecer em Sorocaba e região'],
    mensagem: 'Olá, Vitor! Quero um site para minha clínica ou consultório.',
    perguntas: [
      ['Posso mostrar antes e depois?', 'Depende da sua área. Algumas especialidades têm regras do conselho sobre isso. A gente ajusta o conteúdo pra ficar dentro delas.'],
      ['O site agenda sozinho?', 'O padrão é o paciente cair no seu WhatsApp com a mensagem pronta. Se você usa um sistema de agenda, dá pra ligar o botão nele.'],
    ],
  },
  {
    slug: 'estetica-e-beleza',
    nome: 'Estética e beleza',
    title: 'Site para esteticista, salão e studio de beleza',
    description: 'Landing page para esteticista, lash, sobrancelha, salão e studio de beleza. Serviços, resultados e agendamento direto no WhatsApp.',
    h1: 'Site para studio de beleza que transforma visita em horário marcado.',
    intro: 'Sua cliente chega pelo Instagram, mas o perfil não explica preço, serviço nem como marcar. Uma página sua organiza tudo isso e manda ela pro WhatsApp já sabendo o que quer.',
    dores: ['A mesma pergunta respondida dez vezes por dia no direct', 'Serviços espalhados em destaques do Instagram', 'Cliente nova não sabe por onde começar'],
    entrega: ['Serviços com descrição e foto de resultado', 'Agendamento com mensagem pronta no WhatsApp', 'Link pronto pra bio do Instagram', 'Visual com a cara do seu studio'],
    projeto: 'camilly-cardoso',
    mensagem: 'Olá, Vitor! Quero um site para meu studio de beleza.',
    perguntas: [
      ['Serve como link da bio?', 'Serve. É o uso mais comum. Fica muito mais claro que uma lista de links.'],
      ['Preciso de fotos profissionais?', 'Ajuda, mas não é obrigatório. Fotos boas de celular dos seus resultados já funcionam bem.'],
    ],
  },
  {
    slug: 'imobiliaria-e-corretor',
    nome: 'Imobiliárias e corretores',
    title: 'Site para imobiliária e corretor de imóveis em Sorocaba',
    description: 'Site para corretor e imobiliária com vitrine de imóveis, painel para publicar sozinho e contato pelo WhatsApp. Sorocaba e região.',
    h1: 'Site para corretor que não depende de portal pra receber contato.',
    intro: 'No portal, seu imóvel fica do lado do concorrente. No seu site, o interessado só vê você. Eu monto a vitrine e um painel pra você publicar cada imóvel sem pedir ajuda.',
    dores: ['Mensalidade alta em portal e lead dividido', 'Imóvel bom apresentado com foto pequena', 'Cliente pergunta pelo imóvel e você não sabe de qual anúncio veio'],
    entrega: ['Vitrine com filtro e página de cada imóvel', 'Painel para você publicar e tirar imóveis', 'Botão de WhatsApp com o imóvel já citado na mensagem', 'SEO por bairro e condomínio'],
    projeto: 'paulo-lorenzi',
    mensagem: 'Olá, Vitor! Quero um site para minha imobiliária ou para meu trabalho como corretor.',
    perguntas: [
      ['Eu mesmo consigo cadastrar imóvel?', 'Consegue. O painel é feito pra isso, com foto, preço e descrição, sem mexer em código.'],
      ['Integra com o CRECI e o portal?', 'O número do CRECI aparece no site. Integração com portal depende de qual você usa e entra na proposta.'],
    ],
  },
  {
    slug: 'prestador-de-servico',
    nome: 'Prestadores de serviço',
    title: 'Site para empresa de limpeza, reforma e serviços',
    description: 'Site para empresa de limpeza, higienização, reforma, manutenção e serviços em domicílio. Orçamento guiado e pedido pelo WhatsApp.',
    h1: 'Site para empresa de serviço que já chega com o orçamento meio pronto.',
    intro: 'Quem contrata limpeza, reforma ou manutenção quer saber se você atende a região, quanto custa mais ou menos e se dá pra confiar. O site responde isso e já monta o pedido antes de chegar no seu WhatsApp.',
    dores: ['Orçamento que vira conversa longa e some', 'Cliente não sabe se você atende o bairro dele', 'Trabalho bom sem nenhuma foto organizada'],
    entrega: ['Catálogo de serviços com antes e depois', 'Orçamento guiado que chega pronto no WhatsApp', 'Regiões atendidas e avaliações', 'Página por serviço para aparecer no Google'],
    projeto: 'mart-clean',
    mensagem: 'Olá, Vitor! Quero um site para minha empresa de serviços.',
    perguntas: [
      ['Dá pra mostrar preço no site?', 'Dá pra mostrar valor a partir de, ou montar a estimativa pelo orçamento guiado. Você escolhe o quanto quer abrir.'],
      ['Funciona pra quem atende várias cidades?', 'Funciona. Cada cidade pode ter sua página, o que ajuda muito no Google.'],
    ],
  },
  {
    slug: 'locadora-de-veiculos',
    nome: 'Locadoras de veículos',
    title: 'Site para locadora de carro e aluguel para aplicativo',
    description: 'Site para locadora de veículos e aluguel de carro para motorista de aplicativo. Frota, simulador de ganhos e contato pelo WhatsApp.',
    h1: 'Site para locadora que mostra ao motorista quanto sobra na semana.',
    intro: 'O motorista de aplicativo faz conta antes de alugar. Se o seu site já mostra frota, preço e o quanto ele ganha por semana, a conversa no WhatsApp começa com ele decidido.',
    dores: ['Frota divulgada só em grupo e status', 'Mesma explicação de caução e regra toda hora', 'Motorista some quando descobre o valor'],
    entrega: ['Frota com foto e condição de cada carro', 'Simulador de ganhos semanais', 'Regras de aluguel claras numa página só', 'Contato com o carro escolhido já na mensagem'],
    projeto: 'speed-car',
    mensagem: 'Olá, Vitor! Quero um site para minha locadora de veículos.',
    perguntas: [
      ['Atualizo a frota sozinho?', 'Dá pra fazer com painel ou com uma lista simples que eu atualizo. Combinamos na proposta.'],
      ['Serve pra quem aluga só pra aplicativo?', 'Serve. Foi exatamente o caso da Speed Car.'],
    ],
  },
  {
    slug: 'marca-de-roupa',
    nome: 'Marcas de roupa',
    title: 'Site e loja virtual para marca de roupa autoral',
    description: 'Loja virtual e site para marca de roupa autoral e streetwear. Identidade, vitrine de produto e compra organizada.',
    h1: 'Site para marca de roupa que vende a história junto com a peça.',
    intro: 'Marca autoral não compete em preço. Compete em ideia. Eu monto uma loja que mostra a peça, o conceito e a medida certa, sem cara de template de marketplace.',
    dores: ['Loja que parece igual a todas as outras', 'Pergunta de medida e tecido toda hora no direct', 'Drop anunciado só no Instagram'],
    entrega: ['Vitrine com a identidade da marca', 'Tabela de medidas e detalhe de tecido por peça', 'Página de drop e coleção', 'Compra pelo WhatsApp ou checkout, conforme o projeto'],
    projeto: 'raver-lab',
    mensagem: 'Olá, Vitor! Quero um site para minha marca de roupa.',
    perguntas: [
      ['Precisa de checkout com cartão?', 'Não necessariamente. Muita marca pequena começa vendendo pelo WhatsApp e liga um checkout depois.'],
      ['Você faz a identidade também?', 'Faço. Direção criativa e código ficam na mesma pessoa.'],
    ],
  },
]
