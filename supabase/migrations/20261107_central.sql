-- Central de Comando da CB · etapa 1 (07/11/2026)
create table if not exists public.central_itens (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  tipo text not null check (tipo in ('resposta','decisao','post','tarefa','campanha')),
  origem text not null check (origem in ('instagram_comentario','instagram_direct','facebook_comentario','facebook_mensagem','tiktok_comentario','cofre','claude')),
  id_externo text not null,
  situacao text not null check (situacao in ('com_claude','esperando_voce','enviando','enviado','agendado','no_ar','resolvido','ignorado','arquivado','erro')),
  titulo text not null,
  texto_original text,
  autor text,
  link text,
  contexto text,
  sugestao text,
  resposta_final text,
  erro text,
  prazo timestamptz,
  progresso smallint check (progresso between 0 and 100),
  etapa text,
  dados jsonb not null default '{}'::jsonb,
  unique (origem, id_externo)
);
create index if not exists central_itens_situacao_idx on public.central_itens (situacao);
alter table public.central_itens enable row level security;

create table if not exists public.central_rodadas (
  id bigint generated always as identity primary key,
  quando timestamptz not null default now(),
  ok boolean not null,
  resumo text
);
alter table public.central_rodadas enable row level security;
