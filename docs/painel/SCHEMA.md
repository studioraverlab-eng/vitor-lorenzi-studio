# SCHEMA.md — tabelas para Supabase/Postgres (produção)

Na v1 os dados ficam em `data/db.json` e `data/fila.json`. Na produção, cada
coleção vira uma tabela abaixo. Os nomes de coluna usam `snake_case`; a
correspondência com os campos JSON (`camelCase`) está nas notas de cada tabela.

```sql
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------------------------
create type status_numero        as enum ('conectado', 'desconectado', 'pausado');
create type status_campanha      as enum ('rascunho', 'agendada', 'em_envio', 'concluida', 'pausada');
create type status_destinatario  as enum ('pendente', 'na_fila', 'enviado', 'entregue', 'respondido', 'bloqueado', 'falhou');
create type status_envio         as enum ('pendente', 'enviado', 'entregue', 'falhou');
create type status_item_fila     as enum ('pendente', 'enviado', 'entregue', 'falhou', 'cancelado');
create type classificacao_resposta as enum ('interesse', 'duvida', 'ja_resolveu', 'pediu_parar');
create type papel_usuario        as enum ('admin', 'operador');

-- Clientes (empresas) -------------------------------------------------------
create table clientes (
  id            uuid primary key default gen_random_uuid(),
  nome_empresa  text not null,
  contato_nome  text not null,
  email         text not null,
  criado_em     timestamptz not null default now()
);

-- Usuários do painel --------------------------------------------------------
-- Com Supabase Auth, id = auth.users.id e não há coluna de senha aqui.
create table usuarios (
  id          uuid primary key references auth.users (id) on delete cascade,
  cliente_id  uuid not null references clientes (id) on delete cascade,
  nome        text not null,
  email       text not null unique,
  papel       papel_usuario not null default 'admin'
);
create index usuarios_cliente_idx on usuarios (cliente_id);

-- Números de WhatsApp (um número = um cliente) ------------------------------
create table numeros_whatsapp (
  id            uuid primary key default gen_random_uuid(),
  cliente_id    uuid not null references clientes (id) on delete cascade,
  telefone      text not null unique,          -- só dígitos, com DDI (5511…)
  conectado_em  timestamptz not null,          -- base do aquecimento/teto diário
  status        status_numero not null default 'conectado'
);
create index numeros_cliente_idx on numeros_whatsapp (cliente_id);

-- Modelos de mensagem -------------------------------------------------------
create table modelos_mensagem (
  id             uuid primary key default gen_random_uuid(),
  cliente_id     uuid not null references clientes (id) on delete cascade,
  nome           text not null,
  texto          text not null,                -- com {{campos}}
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);
create index modelos_cliente_idx on modelos_mensagem (cliente_id);

-- Campanhas -----------------------------------------------------------------
create table campanhas (
  id                    uuid primary key default gen_random_uuid(),
  cliente_id            uuid not null references clientes (id) on delete cascade,
  numero_id             uuid not null references numeros_whatsapp (id),
  modelo_id             uuid references modelos_mensagem (id) on delete set null,
  nome                  text not null,
  texto_base            text not null,          -- cópia do texto usado (modelo pode mudar depois)
  agendamento_inicio    timestamptz not null,
  por_dia               integer not null default 30,  -- cota diária da campanha (manhã + tarde)
  status                status_campanha not null default 'rascunho',
  total_destinatarios   integer not null default 0,
  ignorados_bloqueados  integer not null default 0,
  criado_em             timestamptz not null default now()
);
create index campanhas_cliente_idx on campanhas (cliente_id, agendamento_inicio desc);
create index campanhas_status_idx  on campanhas (status) where status in ('agendada', 'em_envio');

-- Destinatários -------------------------------------------------------------
create table destinatarios (
  id             uuid primary key default gen_random_uuid(),
  campanha_id    uuid not null references campanhas (id) on delete cascade,
  nome           text not null,
  telefone       text not null,
  empresa        text not null default '',
  campos_extras  jsonb not null default '{}'::jsonb,
  status         status_destinatario not null default 'pendente',
  unique (campanha_id, telefone)                -- dedup por campanha
);
create index destinatarios_campanha_idx on destinatarios (campanha_id, status);

-- Envios --------------------------------------------------------------------
create table envios (
  id                    uuid primary key default gen_random_uuid(),
  campanha_id           uuid not null references campanhas (id) on delete cascade,
  destinatario_id       uuid not null unique references destinatarios (id) on delete cascade,
  telefone              text not null,
  mensagem_renderizada  text not null,
  agendado_para         timestamptz not null,
  enviado_em            timestamptz,
  entregue_em           timestamptz,
  status                status_envio not null default 'pendente'
);
create index envios_campanha_idx on envios (campanha_id, status);

-- Respostas -----------------------------------------------------------------
create table respostas (
  id                 uuid primary key default gen_random_uuid(),
  campanha_id        uuid not null references campanhas (id) on delete cascade,
  destinatario_id    uuid not null references destinatarios (id) on delete cascade,
  telefone           text not null,
  texto_original     text not null,
  classificacao      classificacao_resposta not null,
  virou_agendamento  boolean not null default false,
  recebida_em        timestamptz not null default now()
);
create index respostas_campanha_idx      on respostas (campanha_id, recebida_em desc);
create index respostas_classificacao_idx on respostas (classificacao);

-- Lista de bloqueio (opt-out) -----------------------------------------------
create table bloqueios (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes (id) on delete cascade,
  telefone    text not null,
  motivo      text not null default '',
  criado_em   timestamptz not null default now(),
  unique (cliente_id, telefone)
);

-- Fila de envios ------------------------------------------------------------
create table fila_envios (
  id               uuid primary key default gen_random_uuid(),
  campanha_id      uuid not null references campanhas (id) on delete cascade,
  envio_id         uuid not null unique references envios (id) on delete cascade,
  destinatario_id  uuid not null references destinatarios (id) on delete cascade,
  telefone         text not null,
  mensagem         text not null,               -- já renderizada
  agendado_para    timestamptz not null,
  status           status_item_fila not null default 'pendente',
  tentativas       smallint not null default 0
);
-- Varredura do operador: pendentes cujo horário chegou.
create index fila_pendentes_idx on fila_envios (agendado_para) where status = 'pendente';
-- Cancelamento em massa por telefone (pedido de parada).
create index fila_telefone_idx  on fila_envios (telefone) where status = 'pendente';
create index fila_campanha_idx  on fila_envios (campanha_id);
```

## Correspondência com o JSON local

| JSON (`data/`)              | Tabela              | Notas |
|-----------------------------|---------------------|-------|
| `db.clientes`               | `clientes`          | `nomeEmpresa` → `nome_empresa`, `contatoNome` → `contato_nome`, `criadoEm` → `criado_em`. |
| `db.usuarios`               | `usuarios`          | `senhaDemo` **não** vai para o banco: a senha fica no Supabase Auth (`auth.users`). |
| `db.numeros`                | `numeros_whatsapp`  | `conectadoEm` → `conectado_em` (base do `tetoDiario`). |
| `db.modelos`                | `modelos_mensagem`  | `atualizadoEm` → `atualizado_em` (atualizar via trigger ou na aplicação). |
| `db.campanhas`              | `campanhas`         | `textoBase`, `agendamentoInicio`, `porDia`, `totalDestinatarios`, `ignoradosBloqueados` → snake_case. |
| `db.destinatarios`          | `destinatarios`     | `camposExtras` (objeto) → `campos_extras jsonb`. Dedup garantido por `unique (campanha_id, telefone)`. |
| `db.envios`                 | `envios`            | `mensagemRenderizada` → `mensagem_renderizada`; datas `null` → `NULL`. |
| `db.respostas`              | `respostas`         | `textoOriginal`, `virouAgendamento`, `recebidaEm` → snake_case. |
| `db.bloqueios`              | `bloqueios`         | `unique (cliente_id, telefone)` impede duplicar. |
| `fila.itens`                | `fila_envios`       | `envioId` → `envio_id`; `agendadoPara` (ISO com fuso) → `timestamptz`. |

IDs: no JSON são strings com prefixo (`cmp_…`, `dst_…`); no Postgres, `uuid`.
Telefones: sempre só dígitos com DDI (`5511900000000`), igual ao JSON.

## Row Level Security (isolamento por cliente)

Cada empresa só pode ver e alterar os próprios dados. Habilitar RLS em todas as
tabelas e resolver o cliente do usuário logado por uma função:

```sql
create or replace function cliente_atual() returns uuid
language sql stable security definer set search_path = public as $$
  select cliente_id from usuarios where id = auth.uid()
$$;

alter table clientes          enable row level security;
alter table usuarios          enable row level security;
alter table numeros_whatsapp  enable row level security;
alter table modelos_mensagem  enable row level security;
alter table campanhas         enable row level security;
alter table destinatarios     enable row level security;
alter table envios            enable row level security;
alter table respostas         enable row level security;
alter table bloqueios         enable row level security;
alter table fila_envios       enable row level security;

-- Tabelas com cliente_id direto
create policy "cliente le a propria empresa" on clientes
  for select using (id = cliente_atual());
create policy "usuarios do cliente" on usuarios
  for select using (cliente_id = cliente_atual());
create policy "numeros do cliente" on numeros_whatsapp
  for select using (cliente_id = cliente_atual());
create policy "modelos do cliente" on modelos_mensagem
  for all using (cliente_id = cliente_atual()) with check (cliente_id = cliente_atual());
create policy "campanhas do cliente" on campanhas
  for all using (cliente_id = cliente_atual()) with check (cliente_id = cliente_atual());
create policy "bloqueios do cliente" on bloqueios
  for all using (cliente_id = cliente_atual()) with check (cliente_id = cliente_atual());

-- Tabelas ligadas via campanha
create policy "destinatarios do cliente" on destinatarios
  for all using (exists (select 1 from campanhas c where c.id = campanha_id and c.cliente_id = cliente_atual()));
create policy "envios do cliente" on envios
  for select using (exists (select 1 from campanhas c where c.id = campanha_id and c.cliente_id = cliente_atual()));
create policy "respostas do cliente" on respostas
  for select using (exists (select 1 from campanhas c where c.id = campanha_id and c.cliente_id = cliente_atual()));
create policy "fila do cliente (leitura)" on fila_envios
  for select using (exists (select 1 from campanhas c where c.id = campanha_id and c.cliente_id = cliente_atual()));
```

- **Escrita em `envios`, `respostas` e `fila_envios`** (retornos de envio) é
  feita pelo processo de operação com a `service_role` key, que ignora RLS —
  nunca expor essa chave no navegador.
- A geração da fila (Nova Campanha) deve rodar no servidor numa transação:
  inserir campanha, destinatários, envios e itens da fila juntos.
- `numeros_whatsapp` é somente leitura para o cliente; quem altera status e
  `conectado_em` é o processo de operação/suporte.
