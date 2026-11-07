// Regras da Central de Comando: em quais paginas cada item aparece e em que ordem.
// Puro (sem rede), pra rodar igual no servidor e nos testes.

export const PAGINAS = {
  "com-voce": { titulo: "Com você", subtitulo: "esperando o seu ok", pedeVoce: true },
  "com-o-claude": { titulo: "Com o Claude", subtitulo: "fazendo e prontos", pedeVoce: false },
  agendado: { titulo: "Agendado", subtitulo: "posts e mensagens", pedeVoce: false },
  comentarios: { titulo: "Comentários e mensagens", subtitulo: "por rede", pedeVoce: true },
  campanhas: { titulo: "Campanhas e vendas", subtitulo: "anúncios e Kiwify", pedeVoce: false },
};

const ORIGENS_REDE = new Set(["instagram_comentario", "instagram_direct", "facebook_comentario", "facebook_mensagem", "tiktok_comentario"]);
const OFFSET_MS = 3 * 60 * 60 * 1000; // Brasília, sem horário de verão desde 2019

export function inicioDoDia(agora = new Date(), deslocamentoDias = 0) {
  const local = new Date(agora.getTime() - OFFSET_MS);
  local.setUTCHours(0, 0, 0, 0);
  local.setUTCDate(local.getUTCDate() + deslocamentoDias);
  return new Date(local.getTime() + OFFSET_MS);
}

export function paginasDoItem(item) {
  const p = [];
  if (item.situacao === "esperando_voce" || item.situacao === "erro") p.push("com-voce");
  if (item.origem === "claude" && (item.situacao === "com_claude" || item.situacao === "esperando_voce")) p.push("com-o-claude");
  if (item.tipo === "post" && ["agendado", "esperando_voce", "no_ar"].includes(item.situacao)) p.push("agendado");
  if (ORIGENS_REDE.has(item.origem) && item.situacao !== "arquivado") p.push("comentarios");
  if (item.tipo === "campanha" && item.situacao === "no_ar") p.push("campanhas");
  return p;
}

const tempo = (v) => (v ? new Date(v).getTime() : null);
const porPrazo = (a, b) => {
  const pa = tempo(a.prazo), pb = tempo(b.prazo);
  if (pa !== null && pb !== null && pa !== pb) return pa - pb;
  if (pa !== null && pb === null) return -1;
  if (pa === null && pb !== null) return 1;
  return tempo(a.criado_em) - tempo(b.criado_em);
};
const recente = (a, b) => tempo(b.atualizado_em) - tempo(a.atualizado_em);

export function itensDaPagina(itens, pagina, agora = new Date()) {
  const lista = itens.filter((i) => paginasDoItem(i).includes(pagina));
  if (pagina === "com-voce") return lista.sort(porPrazo);
  if (pagina === "agendado") {
    const corte = inicioDoDia(agora, -1).getTime();
    return lista.filter((i) => !i.prazo || tempo(i.prazo) >= corte).sort(porPrazo);
  }
  if (pagina === "com-o-claude") {
    const pronto = (i) => (i.situacao === "esperando_voce" ? 0 : 1);
    return lista.sort((a, b) => pronto(a) - pronto(b) || recente(a, b));
  }
  return lista.sort(recente);
}

export function contadores(itens, agora = new Date()) {
  const conta = {};
  for (const pagina of Object.keys(PAGINAS)) {
    let lista = itensDaPagina(itens, pagina, agora);
    if (pagina === "agendado") lista = lista.filter((i) => i.situacao !== "no_ar");
    if (pagina === "comentarios") lista = lista.filter((i) => i.situacao === "esperando_voce");
    conta[pagina] = lista.length;
  }
  return conta;
}

export function resumoCapa(itens, agora = new Date()) {
  const comVoce = itensDaPagina(itens, "com-voce", agora);
  const claude = itensDaPagina(itens, "com-o-claude", agora);
  const ini = inicioDoDia(agora).getTime(), fim = inicioDoDia(agora, 1).getTime();
  const agendadoHoje = itensDaPagina(itens, "agendado", agora).filter((i) => i.prazo && tempo(i.prazo) >= ini && tempo(i.prazo) < fim);
  return {
    comVoce: { total: comVoce.length, primeiros: comVoce.slice(0, 3) },
    comClaude: { fazendo: claude.filter((i) => i.situacao === "com_claude").slice(0, 3), prontos: claude.filter((i) => i.situacao === "esperando_voce").length },
    agendadoHoje: agendadoHoje.slice(0, 4),
  };
}
