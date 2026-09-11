// Leitura ao vivo da conta de anúncios no Meta (Graph API).
// Só funciona com um token que tenha permissão `ads_read`, em META_ADS_TOKEN.
// Sem token (ou se a API falhar), quem chama cai no último retrato salvo no Supabase.

const GRAPH = "https://graph.facebook.com/v21.0";

export const CONTA_ID = process.env.META_AD_ACCOUNT_ID || "484398841107031";
export const CONTA_NOME = "CRIATIVIDADES 02";

const CAMPOS_METRICA =
  "spend,impressions,reach,frequency,clicks,inline_link_clicks,ctr,cpc,cpm,actions,action_values,purchase_roas";

// Nomes que o Meta usa para cada etapa do funil, em ordem de preferência.
const ETAPAS = {
  lpv: ["landing_page_view", "omni_landing_page_view"],
  conteudo: ["offsite_conversion.fb_pixel_view_content", "omni_view_content", "view_content"],
  checkout: ["offsite_conversion.fb_pixel_initiate_checkout", "omni_initiated_checkout", "initiate_checkout"],
  compra: ["offsite_conversion.fb_pixel_purchase", "omni_purchase", "purchase"],
  engajamento: ["post_engagement"],
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function pegarAcao(lista, chaves) {
  if (!Array.isArray(lista)) return 0;
  for (const chave of chaves) {
    const achou = lista.find((a) => a.action_type === chave);
    if (achou) return num(achou.value);
  }
  return 0;
}

// Converte uma linha crua de insights no formato que o painel usa.
function normalizar(linha) {
  const gasto = num(linha.spend);
  const impressoes = num(linha.impressions);
  const cliques = num(linha.clicks);
  const linkCliques = num(linha.inline_link_clicks);
  const lpv = pegarAcao(linha.actions, ETAPAS.lpv);
  const checkouts = pegarAcao(linha.actions, ETAPAS.checkout);
  const compras = pegarAcao(linha.actions, ETAPAS.compra);
  const receita = pegarAcao(linha.action_values, ETAPAS.compra);

  return {
    gasto,
    impressoes,
    alcance: num(linha.reach),
    frequencia: num(linha.frequency),
    cliques,
    link_cliques: linkCliques,
    ctr: impressoes ? (cliques / impressoes) * 100 : null,
    ctr_link: impressoes ? (linkCliques / impressoes) * 100 : null,
    cpc: cliques ? gasto / cliques : null,
    cpm: impressoes ? (gasto / impressoes) * 1000 : null,
    conteudo: pegarAcao(linha.actions, ETAPAS.conteudo),
    lpv,
    custo_lpv: lpv ? gasto / lpv : null,
    checkouts,
    custo_checkout: checkouts ? gasto / checkouts : null,
    compras,
    cpa: compras ? gasto / compras : null,
    receita,
    roas: gasto ? receita / gasto : null,
    engajamento: pegarAcao(linha.actions, ETAPAS.engajamento),
  };
}

export const VAZIO = normalizar({});

// Soma várias linhas normalizadas numa só, recalculando as médias.
export function somar(linhas) {
  const cru = linhas.reduce(
    (acc, l) => ({
      gasto: acc.gasto + l.gasto,
      impressoes: acc.impressoes + l.impressoes,
      alcance: acc.alcance + l.alcance,
      cliques: acc.cliques + l.cliques,
      link_cliques: acc.link_cliques + l.link_cliques,
      conteudo: acc.conteudo + l.conteudo,
      lpv: acc.lpv + l.lpv,
      checkouts: acc.checkouts + l.checkouts,
      compras: acc.compras + l.compras,
      receita: acc.receita + l.receita,
      engajamento: acc.engajamento + l.engajamento,
    }),
    { gasto: 0, impressoes: 0, alcance: 0, cliques: 0, link_cliques: 0, conteudo: 0, lpv: 0, checkouts: 0, compras: 0, receita: 0, engajamento: 0 },
  );

  return {
    ...cru,
    frequencia: cru.alcance ? cru.impressoes / cru.alcance : 0,
    ctr: cru.impressoes ? (cru.cliques / cru.impressoes) * 100 : null,
    ctr_link: cru.impressoes ? (cru.link_cliques / cru.impressoes) * 100 : null,
    cpc: cru.cliques ? cru.gasto / cru.cliques : null,
    cpm: cru.impressoes ? (cru.gasto / cru.impressoes) * 1000 : null,
    custo_lpv: cru.lpv ? cru.gasto / cru.lpv : null,
    custo_checkout: cru.checkouts ? cru.gasto / cru.checkouts : null,
    cpa: cru.compras ? cru.gasto / cru.compras : null,
    roas: cru.gasto ? cru.receita / cru.gasto : null,
  };
}

async function graph(caminho, params) {
  const token = process.env.META_ADS_TOKEN;
  if (!token) throw new Error("sem_token");

  const url = new URL(GRAPH + "/" + caminho);
  for (const [chave, valor] of Object.entries(params || {})) {
    url.searchParams.set(chave, typeof valor === "string" ? valor : JSON.stringify(valor));
  }
  url.searchParams.set("access_token", token);

  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) });
  const json = await r.json();
  if (json.error) throw new Error(json.error.message || "erro_graph");
  return json.data || [];
}

// Os presets `last_Nd` do Meta terminam ontem: uma campanha que só rodou hoje
// sumiria do acumulado. Por isso monto a janela à mão, sempre terminando hoje.
function janela(dias) {
  const hoje = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const inicio = new Date(hoje);
  inicio.setDate(inicio.getDate() - (dias - 1));
  const iso = (d) => d.toISOString().slice(0, 10);
  return { since: iso(inicio), until: iso(hoje) };
}

// Busca tudo o que o painel precisa, em paralelo, e devolve o retrato pronto.
export async function lerConta() {
  const act = "act_" + CONTA_ID;
  const camposHierarquia = CAMPOS_METRICA + ",campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name";

  const [porAnuncio, porAnuncioHoje, serie, campanhas, conjuntos, anuncios, historico] = await Promise.all([
    graph(act + "/insights", { level: "ad", time_range: janela(30), fields: camposHierarquia, limit: "300" }),
    graph(act + "/insights", { level: "ad", date_preset: "today", fields: camposHierarquia, limit: "300" }),
    graph(act + "/insights", { time_range: janela(14), time_increment: "1", fields: CAMPOS_METRICA }),
    graph(act + "/campaigns", { fields: "id,name,status,effective_status,objective,daily_budget,created_time,start_time", limit: "60" }),
    graph(act + "/adsets", { fields: "id,name,status,effective_status,daily_budget,optimization_goal,campaign_id,created_time", limit: "150" }),
    graph(act + "/ads", { fields: "id,name,status,effective_status,adset_id,campaign_id,created_time", limit: "300" }),
    graph(act + "/insights", { level: "campaign", date_preset: "maximum", fields: CAMPOS_METRICA + ",campaign_id,campaign_name", limit: "60" }),
  ]);

  return montar({ porAnuncio, porAnuncioHoje, serie, campanhas, conjuntos, anuncios, historico });
}

const ATIVOS = new Set(["ACTIVE", "WITH_ISSUES", "PENDING_REVIEW", "IN_PROCESS", "PENDING_BILLING_INFO"]);

function montar({ porAnuncio, porAnuncioHoje, serie, campanhas, conjuntos, anuncios, historico }) {
  const acumulado = new Map(porAnuncio.map((l) => [l.ad_id, normalizar(l)]));
  const deHoje = new Map(porAnuncioHoje.map((l) => [l.ad_id, normalizar(l)]));

  const arvore = campanhas
    .filter((c) => c.effective_status !== "DELETED" && c.effective_status !== "ARCHIVED")
    .map((c) => {
      const meusConjuntos = conjuntos
        .filter((cj) => cj.campaign_id === c.id)
        .map((cj) => {
          const meusAnuncios = anuncios
            .filter((a) => a.adset_id === cj.id)
            .map((a) => ({
              id: a.id,
              nome: a.name,
              status: a.status,
              entrega: a.effective_status,
              ativo: ATIVOS.has(a.effective_status),
              criado_em: a.created_time,
              metricas: acumulado.get(a.id) || VAZIO,
              hoje: deHoje.get(a.id) || VAZIO,
            }));

          return {
            id: cj.id,
            nome: cj.name,
            status: cj.status,
            entrega: cj.effective_status,
            ativo: ATIVOS.has(cj.effective_status),
            orcamento_dia: cj.daily_budget ? num(cj.daily_budget) / 100 : null,
            otimizacao: cj.optimization_goal,
            criado_em: cj.created_time,
            metricas: somar(meusAnuncios.map((a) => a.metricas)),
            hoje: somar(meusAnuncios.map((a) => a.hoje)),
            anuncios: meusAnuncios,
          };
        });

      return {
        id: c.id,
        nome: c.name,
        status: c.status,
        entrega: c.effective_status,
        ativo: ATIVOS.has(c.effective_status),
        objetivo: c.objective,
        orcamento_dia: c.daily_budget ? num(c.daily_budget) / 100 : null,
        criada_em: c.created_time,
        comecou_em: c.start_time,
        metricas: somar(meusConjuntos.map((cj) => cj.metricas)),
        hoje: somar(meusConjuntos.map((cj) => cj.hoje)),
        conjuntos: meusConjuntos,
      };
    })
    .sort((a, b) => Number(b.ativo) - Number(a.ativo) || b.hoje.gasto - a.hoje.gasto || b.metricas.gasto - a.metricas.gasto);

  return {
    gerado_em: new Date().toISOString(),
    fonte: "meta",
    conta: { id: CONTA_ID, nome: CONTA_NOME },
    hoje: somar(arvore.map((c) => c.hoje)),
    periodo: somar(arvore.map((c) => c.metricas)),
    campanhas: arvore,
    serie: serie.map((l) => ({ data: l.date_start, ...normalizar(l) })),
    historico: historico
      .map((l) => ({ id: l.campaign_id, nome: l.campaign_name, ...normalizar(l) }))
      .filter((h) => h.gasto > 30)
      .sort((a, b) => b.gasto - a.gasto),
  };
}
