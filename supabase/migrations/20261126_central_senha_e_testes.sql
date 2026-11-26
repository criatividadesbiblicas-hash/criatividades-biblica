-- Pacote de 26/11/2026: senha da Central guardada no banco (embaralhada) e reels de teste na Mesa de Postagens.

-- Senha da Central: só o hash (scrypt) fica aqui. "trocar" = senha provisória, pede a nova no primeiro acesso.
create table if not exists public.central_acesso (
  id text primary key,
  senha_hash text not null,
  trocar boolean not null default false,
  atualizado_em timestamptz not null default now()
);
alter table public.central_acesso enable row level security;
revoke all on public.central_acesso from anon, authenticated;
drop trigger if exists central_acesso_hora on public.central_acesso;
create trigger central_acesso_hora before update on public.central_acesso for each row execute function public.mesa_carimbar_hora();

-- Reels de teste na Mesa: tipo, dupla A/B, links de onde saiu e resultado.
alter table public.mesa_posts add column if not exists tipo text not null default 'normal';
alter table public.mesa_posts drop constraint if exists mesa_posts_tipo_check;
alter table public.mesa_posts add constraint mesa_posts_tipo_check check (tipo in ('normal', 'teste'));
alter table public.mesa_posts add column if not exists grupo text;
alter table public.mesa_posts add column if not exists gancho text;
alter table public.mesa_posts add column if not exists links jsonb not null default '{}'::jsonb;
alter table public.mesa_posts add column if not exists resultado jsonb;
alter table public.mesa_posts add column if not exists publicado_em timestamptz;
create index if not exists mesa_posts_tipo_idx on public.mesa_posts (tipo, situacao);

-- Reforço: as tabelas da Mesa só pela chave de servidor (o RLS já trancava; isto tira até a permissão).
revoke all on public.mesa_posts, public.mesa_ideias, public.mesa_pedidos, public.mesa_painel from anon, authenticated;
