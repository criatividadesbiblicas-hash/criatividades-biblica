-- Central de Comando: pedidos que a Thali faz pela tela (atualizar agora, recado pro Claude),
-- sinal de vida do vigia do PC e a situacao "segurado" pra posts da agenda.

create table if not exists public.central_pedidos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('atualizar', 'recado')),
  texto text check (texto is null or char_length(texto) <= 4000),
  situacao text not null default 'novo' check (situacao in ('novo', 'fazendo', 'feito', 'erro')),
  resposta text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists central_pedidos_situacao_idx on public.central_pedidos (situacao, criado_em);
alter table public.central_pedidos enable row level security;

create table if not exists public.central_vigia (
  id text primary key,
  visto_em timestamptz not null default now()
);
alter table public.central_vigia enable row level security;

alter table public.central_itens drop constraint if exists central_itens_situacao_check;
alter table public.central_itens add constraint central_itens_situacao_check check (situacao = any (array[
  'com_claude', 'esperando_voce', 'enviando', 'enviado', 'agendado', 'segurado', 'no_ar',
  'resolvido', 'ignorado', 'arquivado', 'erro'
]));

-- O relogio do PC pode estar adiantado ou atrasado: a hora do sinal de vida e das mudancas de pedido vem do servidor.
create or replace function public.central_carimbar_hora() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'central_vigia' then new.visto_em := now(); else new.atualizado_em := now(); end if;
  return new;
end $$;
drop trigger if exists central_vigia_hora on public.central_vigia;
create trigger central_vigia_hora before insert or update on public.central_vigia for each row execute function public.central_carimbar_hora();
drop trigger if exists central_pedidos_hora on public.central_pedidos;
create trigger central_pedidos_hora before update on public.central_pedidos for each row execute function public.central_carimbar_hora();
