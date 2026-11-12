# Painel de Envios — integração ao site

O Painel de Envios (originalmente um app Next.js separado, com Tailwind 4) roda
dentro deste repositório, em `/painel/*`, ao lado das páginas do site. Um único
`npm run build` gera as duas partes.

## Estrutura criada

### Rotas

O site foi movido para o route group `src/app/(site)/`, sem alterar URLs:

| Arquivo | Rota |
| --- | --- |
| `src/app/(site)/page.tsx` | `/` |
| `src/app/(site)/criar-site/` | `/criar-site` |
| `src/app/(site)/portfolio/` | `/portfolio`, `/portfolio/posts` |
| `src/app/(site)/sistemas/` | `/sistemas` |
| `src/app/(site)/site-para/[nicho]/` | `/site-para/[nicho]` |

O painel fica em `src/app/painel/`:

| Arquivo | Rota |
| --- | --- |
| `src/app/painel/login/` | `/painel/login` |
| `src/app/painel/(area)/page.tsx` | `/painel` (Início) |
| `src/app/painel/(area)/agendar/` | `/painel/agendar` (Agendar envio) |
| `src/app/painel/(area)/campanhas/` | `/painel/campanhas` (Campanhas) |
| `src/app/painel/actions.ts` | Server Actions do painel |
| `src/app/painel/not-found.tsx` | 404 do painel |

A interface tem só essas três telas. As respostas dos destinatários continuam
gravadas em `data/db.json` (`respostas`), mas não têm tela — ficam para a
operação interna.

### Layouts

- `src/app/layout.tsx` (raiz): metadata, fontes, `globals.css` e `<body>{children}</body>`.
- `src/app/(site)/layout.tsx`: skip-link, JSON-LD, `GoogleAdsTag` e `AppShell`
  (cursor customizado, véu de transição, botão flutuante etc.). Só as páginas
  do site passam por ele.
- `src/app/painel/layout.tsx`: importa `painel.css` e envolve o painel em
  `.painel-root`. Não herda nada do `AppShell`.

`src/app/criar-site/ContactFlow.tsx` é só uma reexportação para o caminho antigo,
usado por `src/components/sistemas/SistemasView.tsx`. A implementação está em
`src/app/(site)/criar-site/ContactFlow.tsx`. Sem `page.tsx`, essa pasta não gera rota.

### Bibliotecas, componentes e proxy

- `src/lib/painel/`: `auth`, `campanhas`, `csv`, `db`, `fila`, `formato`, `types`.
- `src/components/painel/ui.tsx`: componentes visuais do painel.
- `src/proxy.ts`: exige o cookie de sessão em `/painel` e `/painel/*`, exceto
  `/painel/login`. O matcher cobre só o painel; o site não passa pelo proxy.
- O código do painel importa com o alias `@/` (`@/lib/painel/...`,
  `@/components/painel/...`), definido em `paths` no `tsconfig.json`. O código
  do site continua com imports relativos.

### Dados

- `data/db.json` e `data/fila.json`: base de demonstração (Clínica Vitta).
- `docs/painel/SCHEMA.md`: modelo equivalente em Postgres/Supabase.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000/painel/login` com o usuário de demonstração:

- e-mail: `demo@clinicavitta.com.br`
- senha: `demo123`

### Variável de ambiente

`PAINEL_SESSION_SECRET` assina o cookie de sessão (`painel_session`). Sem ela,
o painel usa um segredo fixo de demonstração. Em qualquer ambiente publicado,
defina um valor longo e aleatório.

### Seed

```bash
npm run seed:painel
```

Regrava `data/db.json` e `data/fila.json` com dados de demonstração relativos à
data de hoje (requer Node 22.6+, que executa TypeScript direto). O script fica
em `scripts/seed-painel.mts`. Atenção: `scripts/` está no `.gitignore` deste
repositório (regra pré-existente), então o seed roda localmente, mas não é
versionado.

## Adaptação Tailwind 4 → Tailwind 3

O painel foi escrito para Tailwind 4 (configuração em CSS). Aqui ele usa o
Tailwind 3 do site: as utilitárias são geradas pelo `globals.css`, cujo
`content` já cobre `./src/**`.

- **Cores `marca`**: adicionadas em `theme.extend.colors` do
  `tailwind.config.js` (50, 100, 500, 600, 700, 900), no formato
  `rgb(... / <alpha-value>)` para aceitar modificadores como `/70`.
- **`src/app/painel/painel.css`** (sem `@tailwind`; tudo escopado em `.painel-root`):
  - fonte do sistema (`ui-sans-serif, system-ui, ...`) e `letter-spacing: normal`;
  - valores padrão do Tailwind para `text-xs` a `text-3xl`, `rounded-lg`,
    `rounded-xl`, `rounded-2xl`, `rounded-tl-none` e as variantes `file:` usadas,
    que o `tailwind.config.js` do site redefine com as próprias variáveis;
  - `shadow-sm` com o valor do Tailwind 4;
  - cursor nativo de volta (o `globals.css` do site esconde o cursor em
    dispositivos com mouse), mantendo `cursor-pointer` e
    `disabled:cursor-not-allowed`;
  - cor de seleção de texto do sistema e fundo claro no `body` quando o painel
    está na página.
- Todas as bordas do painel declaram cor explícita, então não foi preciso
  emular a cor de borda padrão do Tailwind 4.

## Camada de dados — ponto de troca para produção

Hoje `src/lib/painel/db.ts` lê e grava `data/db.json` e `data/fila.json`
(JSON local). Isso é adequado para desenvolvimento e demonstração.

Em produção, substitua as funções `lerDb`, `salvarDb`, `lerFila`, `salvarFila`
e `comTrava` por consultas ao Supabase/Postgres, mantendo as mesmas assinaturas;
o restante do painel não precisa mudar. O DDL das tabelas está em
`docs/painel/SCHEMA.md`.

Motivo: o filesystem da Vercel é efêmero e não é compartilhado entre
instâncias, então o JSON local não persiste em produção. Gravações somem entre
deploys e podem divergir entre instâncias.
