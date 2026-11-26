-- Mesa de Postagens (app do cronograma), fase 1 · 26/11/2026
-- Posts em criação, aprovação e prontos; ideias dos pedidos; o que a Thali pede pela tela; números do painel.
-- Só o servidor (chave de servidor) lê e grava: RLS ligado e nenhuma política, igual às tabelas da Central.

create table if not exists public.mesa_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  curto text,
  formato text not null default 'carrossel' check (formato in ('carrossel', 'reel', 'imagem')),
  trilha text,
  situacao text not null default 'aguardando' check (situacao in (
    'em_criacao', 'aguardando', 'pronto', 'aprovado', 'agendado', 'publicado', 'segurado', 'arquivado'
  )),
  dia date,
  hora text,
  redes text[] not null default array['ig']::text[],
  capa text,
  capas jsonb not null default '[]'::jsonb,
  cards jsonb not null default '[]'::jsonb,
  video jsonb,
  legendas jsonb not null default '{}'::jsonb,
  legenda_ok boolean not null default false,
  versao integer not null default 1,
  status text,
  nota text,
  fonte text,
  ocupado jsonb,
  aviso text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists mesa_posts_situacao_idx on public.mesa_posts (situacao, dia);
alter table public.mesa_posts enable row level security;

create table if not exists public.mesa_ideias (
  id uuid primary key default gen_random_uuid(),
  semana text not null,
  data date,
  hora text,
  titulo text not null,
  trilha text,
  formato text,
  fonte text,
  porque text,
  situacao text not null default 'nova' check (situacao in ('nova', 'aprovada', 'comentada', 'guardada', 'descartada', 'usada')),
  comentario text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists mesa_ideias_semana_idx on public.mesa_ideias (semana, data);
alter table public.mesa_ideias enable row level security;

create table if not exists public.mesa_pedidos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in (
    'semana', 'mudar_post', 'ajuste_card', 'ajuste_post', 'ajuste_legenda', 'ajuste_pronto',
    'comentario_ideia', 'montar_semana', 'agendar'
  )),
  post_id uuid references public.mesa_posts (id) on delete set null,
  texto text check (texto is null or char_length(texto) <= 3000),
  dados jsonb not null default '{}'::jsonb,
  situacao text not null default 'novo' check (situacao in ('novo', 'com_claude', 'feito', 'erro')),
  resposta text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists mesa_pedidos_situacao_idx on public.mesa_pedidos (situacao, criado_em);
alter table public.mesa_pedidos enable row level security;

create table if not exists public.mesa_painel (
  id text primary key,
  dados jsonb not null,
  atualizado_em timestamptz not null default now()
);
alter table public.mesa_painel enable row level security;

-- Hora das mudanças vem do servidor (o relógio do PC pode estar fora).
create or replace function public.mesa_carimbar_hora() returns trigger language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end $$;
drop trigger if exists mesa_posts_hora on public.mesa_posts;
create trigger mesa_posts_hora before update on public.mesa_posts for each row execute function public.mesa_carimbar_hora();
drop trigger if exists mesa_ideias_hora on public.mesa_ideias;
create trigger mesa_ideias_hora before update on public.mesa_ideias for each row execute function public.mesa_carimbar_hora();
drop trigger if exists mesa_pedidos_hora on public.mesa_pedidos;
create trigger mesa_pedidos_hora before update on public.mesa_pedidos for each row execute function public.mesa_carimbar_hora();
drop trigger if exists mesa_painel_hora on public.mesa_painel;
create trigger mesa_painel_hora before update on public.mesa_painel for each row execute function public.mesa_carimbar_hora();

-- Imagens e vídeos das peças: pasta pública com nomes que não dá pra adivinhar.
insert into storage.buckets (id, name, public) values ('mesa', 'mesa', true)
on conflict (id) do nothing;
