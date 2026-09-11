import { notFound } from "next/navigation";
import AutoAtualiza from "@/components/painel/AutoAtualiza";
import { lerConta, CONTA_ID, CONTA_NOME } from "@/lib/meta-ads";
import { METAS, farol, valorConfiavel, montarFunil, montarAlertas, montarLeitura, reguaHistorica } from "@/lib/painel-diagnostico";

// Painel ao vivo da conta de anúncios. Acesso: /painel?k=<PAINEL_KEY>.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Painel · Conta de anúncios", robots: { index: false, follow: false } };

// ——— formatação ———
const n = (v, casas = 0) =>
  v === null || v === undefined || !Number.isFinite(Number(v))
    ? "–"
    : Number(v).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
const brl = (v) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? "–" : "R$ " + n(v, 2));
const pct = (v, casas = 2) => (v === null || v === undefined || !Number.isFinite(Number(v)) ? "–" : n(v, casas) + "%");
const hora = (iso) =>
  new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const diaCurto = (d) => {
  const [, m, dia] = d.split("-");
  return dia + "/" + m;
};

const CORES = {
  bom: { texto: "text-olive", fundo: "bg-olive/10", borda: "border-olive/30", ponto: "bg-olive" },
  atencao: { texto: "text-[#b07f0a]", fundo: "bg-mustard/15", borda: "border-mustard/40", ponto: "bg-mustard" },
  ruim: { texto: "text-coral-deep", fundo: "bg-coral/10", borda: "border-coral/30", ponto: "bg-coral-deep" },
  neutro: { texto: "text-cacau/50", fundo: "bg-sand-light", borda: "border-sand/50", ponto: "bg-sand" },
};

// ——— peças ———

const FORMATO = {
  ctr: (v) => pct(v),
  cpc: brl,
  cpm: brl,
  cpa: brl,
  custo_lpv: brl,
  custo_checkout: brl,
  roas: (v) => n(v, 2),
  frequencia: (v) => n(v, 2) + "x",
};

function Kpi({ chave, rotulo, metricas, valor, formatado, meta, sub }) {
  // Com métrica derivada, só mostro número quando há volume que o sustente.
  const v = chave && metricas ? valorConfiavel(chave, metricas) : valor;
  const semBase = chave && metricas && v === null && metricas.gasto > 0;
  const texto = formatado !== undefined ? formatado : v === null ? "–" : (FORMATO[chave] || n)(v);
  const estado = chave ? farol(chave, v) : "neutro";
  const c = CORES[estado];
  return (
    <div className={"rounded-2xl border bg-white p-3.5 shadow-sm " + c.borda}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cacau/45">{rotulo}</p>
        <span className={"h-2 w-2 shrink-0 rounded-full " + c.ponto} />
      </div>
      <p className={"mt-1.5 font-display text-xl font-semibold leading-none sm:text-2xl " + (estado === "neutro" ? "text-cacau" : c.texto)}>
        {texto}
      </p>
      {meta ? <p className="mt-1.5 text-[11px] text-cacau/45">meta {meta}</p> : null}
      {sub ? <p className="mt-1 text-[11px] text-cacau/60">{sub}</p> : null}
      {semBase && !sub ? <p className="mt-1 text-[11px] text-cacau/40">pouco volume para ler ainda</p> : null}
    </div>
  );
}

function Secao({ titulo, apoio, children }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-cacau">{titulo}</h2>
      {apoio ? <p className="mt-0.5 text-sm text-cacau/55">{apoio}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Funil({ etapas, regua }) {
  const topo = etapas[0]?.valor || 1;
  const refs = { cliques: regua?.ctr, lpv: regua?.clique_para_lpv, checkouts: regua?.lpv_para_checkout, compras: regua?.checkout_para_compra };

  return (
    <div className="rounded-2xl border border-sand/50 bg-white p-4">
      <div className="space-y-2.5">
        {etapas.map((e) => {
          const largura = Math.max(3, (e.valor / topo) * 100);
          const ref = refs[e.chave];
          const fraco = e.taxa !== null && ref && e.taxa < ref * 0.6;
          return (
            <div key={e.chave}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                <span className="font-semibold text-cacau">{e.rotulo}</span>
                <span className="tabular-nums text-cacau/70">
                  {n(e.valor)}
                  {e.taxa !== null ? <span className={"ml-2 text-xs " + (fraco ? "font-semibold text-coral-deep" : "text-cacau/45")}>{pct(e.taxa, 1)} da etapa anterior</span> : null}
                  {e.custo ? <span className="ml-2 text-xs text-cacau/45">· {brl(e.custo)} cada</span> : null}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-sand-light">
                <div className={"h-full rounded-full " + (fraco ? "bg-coral-deep" : "bg-dusk")} style={{ width: largura + "%" }} />
              </div>
              {fraco ? (
                <p className="mt-1 text-[11px] text-coral-deep">
                  Vazando aqui: nas suas campanhas antigas essa passagem era de {pct(ref, 1)}.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Grafico({ serie }) {
  if (!serie?.length) return null;
  const L = 640, A = 180, pad = { e: 8, d: 8, c: 12, b: 22 };
  const maxGasto = Math.max(...serie.map((d) => d.gasto), 1);
  const maxCompras = Math.max(...serie.map((d) => d.compras), 1);
  const larguraBarra = (L - pad.e - pad.d) / serie.length;
  const alturaUtil = A - pad.c - pad.b;
  const xDe = (i) => pad.e + i * larguraBarra;
  const yCompras = (v) => pad.c + alturaUtil - (v / maxCompras) * alturaUtil;

  const linha = serie.map((d, i) => xDe(i) + larguraBarra / 2 + "," + yCompras(d.compras)).join(" ");

  return (
    <div className="rounded-2xl border border-sand/50 bg-white p-4">
      <div className="mb-2 flex flex-wrap gap-4 text-[11px] text-cacau/60">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-dusk/50" /> gasto do dia</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-coral-deep" /> vendas do dia</span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={"0 0 " + L + " " + A} className="h-44 w-full min-w-[520px]" role="img" aria-label="Gasto e vendas por dia nos últimos 14 dias">
          {serie.map((d, i) => {
            const altura = (d.gasto / maxGasto) * alturaUtil;
            return (
              <g key={d.data}>
                <rect
                  x={xDe(i) + larguraBarra * 0.18}
                  y={pad.c + alturaUtil - altura}
                  width={larguraBarra * 0.64}
                  height={Math.max(0, altura)}
                  rx="3"
                  className="fill-dusk/45"
                />
                <text x={xDe(i) + larguraBarra / 2} y={A - 6} textAnchor="middle" className="fill-cacau/45 text-[9px]">
                  {diaCurto(d.data)}
                </text>
              </g>
            );
          })}
          <polyline points={linha} fill="none" strokeWidth="2" className="stroke-coral-deep" strokeLinejoin="round" />
          {serie.map((d, i) =>
            d.compras > 0 ? <circle key={d.data} cx={xDe(i) + larguraBarra / 2} cy={yCompras(d.compras)} r="3" className="fill-coral-deep" /> : null,
          )}
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-cacau/50">
        Pico de gasto no período: {brl(maxGasto)} em um dia. Pico de vendas: {n(maxCompras)}.
      </p>
    </div>
  );
}

// Devolve [texto, farol] de uma métrica, em branco quando ainda não há base.
function leitura(chave, m, formatar) {
  const v = valorConfiavel(chave, m);
  return [v === null ? "–" : formatar(v), farol(chave, v)];
}

function LinhaMetrica({ m, orcamento }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-4 lg:grid-cols-7">
      {[
        ["Gasto", brl(m.gasto)],
        orcamento ? ["Orçamento/dia", brl(orcamento)] : null,
        ["Aparições", n(m.impressoes)],
        ["CTR", ...leitura("ctr", m, pct)],
        ["Custo/clique", ...leitura("cpc", m, brl)],
        ["Checkouts", n(m.checkouts)],
        ["Vendas", n(m.compras)],
        ["Custo/venda", ...leitura("cpa", m, brl)],
        ["ROAS", ...leitura("roas", m, (v) => n(v, 2))],
      ]
        .filter(Boolean)
        .map(([rotulo, valor, estado]) => (
          <div key={rotulo}>
            <p className="text-[10px] uppercase tracking-wide text-cacau/40">{rotulo}</p>
            <p className={"tabular-nums font-semibold " + (estado && estado !== "neutro" ? CORES[estado].texto : "text-cacau")}>{valor}</p>
          </div>
        ))}
    </div>
  );
}

const SELO = {
  ACTIVE: ["No ar", "bom"],
  PAUSED: ["Pausado", "neutro"],
  WITH_ISSUES: ["Com problema", "ruim"],
  PENDING_REVIEW: ["Em análise", "atencao"],
  DISAPPROVED: ["Reprovado", "ruim"],
  CAMPAIGN_PAUSED: ["Campanha pausada", "neutro"],
  ADSET_PAUSED: ["Conjunto pausado", "neutro"],
  IN_PROCESS: ["Agendado", "atencao"],
  PENDING_BILLING_INFO: ["Falta pagamento", "ruim"],
};

function Selo({ entrega }) {
  const [texto, estado] = SELO[entrega] || [entrega, "neutro"];
  const c = CORES[estado];
  return <span className={"shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " + c.fundo + " " + c.texto}>{texto}</span>;
}

// ——— busca dos dados ———

async function ultimoSnapshot() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const r = await fetch(`${url}/rest/v1/painel_snapshot?conta_id=eq.${CONTA_ID}&order=quando.desc&limit=1`, {
      headers: { apikey: key, Authorization: "Bearer " + key },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const linhas = await r.json();
    return linhas[0] ? { ...linhas[0].payload, gerado_em: linhas[0].quando, fonte: "snapshot" } : null;
  } catch {
    return null;
  }
}

async function carregar() {
  try {
    return await lerConta();
  } catch (erro) {
    const reserva = await ultimoSnapshot();
    return reserva ? { ...reserva, motivo_reserva: erro.message } : null;
  }
}

// ——— página ———

export default async function PainelConta({ searchParams }) {
  const sp = await searchParams;
  if (!process.env.PAINEL_KEY || sp?.k !== process.env.PAINEL_KEY) notFound();

  const dados = await carregar();

  if (!dados) {
    return (
      <main className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-cacau">Painel sem dados</h1>
        <p className="mt-3 text-sm text-cacau/70">
          Não consegui falar com o Meta nem achei um retrato salvo. Isso acontece quando falta o token de leitura de anúncios.
        </p>
      </main>
    );
  }

  const leitura = montarLeitura(dados);
  const alertas = montarAlertas(dados);
  const regua = reguaHistorica(dados.historico);
  const funil = montarFunil(dados.periodo);
  const ativas = dados.campanhas.filter((c) => c.ativo);
  const pausadas = dados.campanhas.filter((c) => !c.ativo && c.metricas.gasto > 0);
  const orcamentoDia = ativas.flatMap((c) => c.conjuntos.filter((cj) => cj.ativo)).reduce((s, cj) => s + (cj.orcamento_dia || 0), 0);
  const h = dados.hoje;
  const p = dados.periodo;
  const corEstado = CORES[leitura.estado === "aprendendo" || leitura.estado === "parado" ? "neutro" : leitura.estado];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-5 sm:px-6">
      {/* cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/50 pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-cacau/40">Conta {CONTA_NOME}</p>
          <h1 className="font-display text-2xl font-semibold text-cacau sm:text-3xl">Painel de anúncios</h1>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <AutoAtualiza geradoEm={dados.gerado_em} segundos={60} />
          <p className="text-[11px] text-cacau/45">
            {dados.fonte === "meta" ? "ao vivo · " : "último retrato salvo · "}
            {hora(dados.gerado_em)}
          </p>
        </div>
      </header>

      {dados.fonte !== "meta" ? (
        <div className="mt-4 rounded-2xl border border-mustard/40 bg-mustard/10 p-4">
          <p className="text-sm font-semibold text-cacau">Mostrando o último retrato salvo, não o tempo real</p>
          <p className="mt-1 text-sm text-cacau/70">
            Para o painel puxar sozinho, falta um token de leitura de anúncios na variável <code className="rounded bg-white/70 px-1">META_ADS_TOKEN</code>.
            {dados.motivo_reserva ? <span className="block mt-1 text-xs text-cacau/50">Motivo: {dados.motivo_reserva}</span> : null}
          </p>
        </div>
      ) : null}

      {/* o que está acontecendo */}
      <section className={"mt-5 rounded-3xl border p-5 " + corEstado.borda + " " + corEstado.fundo}>
        <div className="flex items-center gap-2">
          <span className={"h-2.5 w-2.5 rounded-full " + corEstado.ponto} />
          <h2 className="font-display text-xl font-semibold text-cacau">{leitura.titulo}</h2>
        </div>
        <div className="mt-3 space-y-2">
          {leitura.linhas.map((linha, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-cacau/85">{linha}</p>
          ))}
        </div>
      </section>

      {/* hoje */}
      <Secao titulo="Hoje" apoio={"Desde a meia-noite" + (orcamentoDia ? " · orçamento previsto de " + brl(orcamentoDia) + " para o dia" : "")}>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi rotulo="Gasto hoje" formatado={brl(h.gasto)} sub={orcamentoDia ? n((h.gasto / orcamentoDia) * 100, 0) + "% do orçamento" : null} />
          <Kpi rotulo="Vendas hoje" formatado={n(h.compras)} sub={h.receita ? brl(h.receita) + " em receita" : "nenhuma ainda"} />
          <Kpi chave="cpa" rotulo="Custo/venda" metricas={h} meta="≤ R$ 25" />
          <Kpi chave="roas" rotulo="ROAS" metricas={h} meta="≥ 2,3" />
          <Kpi chave="ctr" rotulo="CTR" metricas={h} meta="≥ 2%" />
          <Kpi chave="cpc" rotulo="Custo/clique" metricas={h} meta="≤ R$ 0,60" />
        </div>
      </Secao>

      {/* período */}
      <Secao titulo="Últimos 30 dias" apoio="Tudo que rodou no mês, somando todas as campanhas">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi rotulo="Investido" formatado={brl(p.gasto)} sub={n(p.impressoes) + " aparições"} />
          <Kpi rotulo="Vendas" formatado={n(p.compras)} sub={brl(p.receita) + " em receita"} />
          <Kpi chave="cpa" rotulo="Custo/venda" metricas={p} meta="≤ R$ 25" />
          <Kpi chave="roas" rotulo="ROAS" metricas={p} meta="≥ 2,3" />
          <Kpi chave="custo_checkout" rotulo="Custo/checkout" metricas={p} meta="≤ R$ 6" />
          <Kpi chave="cpm" rotulo="CPM" metricas={p} meta="≤ R$ 15" />
          <Kpi chave="custo_lpv" rotulo="Custo/visita" metricas={p} meta="≤ R$ 1" />
          <Kpi chave="frequencia" rotulo="Frequência" metricas={p} meta="≤ 1,8x" />
          <Kpi rotulo="Alcance" formatado={n(p.alcance)} sub="contas diferentes" />
          <Kpi rotulo="Cliques" formatado={n(p.cliques)} sub={n(p.link_cliques) + " no link"} />
          <Kpi rotulo="Visitas na página" formatado={n(p.lpv)} />
          <Kpi rotulo="Engajamento" formatado={n(p.engajamento)} sub="curtidas, comentários, salvamentos" />
        </div>
      </Secao>

      {/* alertas */}
      {alertas.length ? (
        <Secao titulo="O que pede decisão sua" apoio="Regras aplicadas automaticamente sobre os números acima">
          <div className="space-y-2.5">
            {alertas.map((a, i) => {
              const c = CORES[a.nivel === "critico" ? "ruim" : a.nivel === "atencao" ? "atencao" : "neutro"];
              return (
                <div key={i} className={"rounded-2xl border p-4 " + c.borda + " " + c.fundo}>
                  <p className={"font-semibold " + c.texto}>{a.titulo}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cacau/75">{a.texto}</p>
                </div>
              );
            })}
          </div>
        </Secao>
      ) : null}

      {/* funil */}
      <Secao titulo="Funil" apoio="Onde as pessoas entram e onde elas somem, nos últimos 30 dias">
        <Funil etapas={funil} regua={regua} />
      </Secao>

      {/* gráfico */}
      <Secao titulo="Últimos 14 dias" apoio="Gasto por dia e vendas por dia, lado a lado">
        <Grafico serie={dados.serie} />
      </Secao>

      {/* campanhas */}
      <Secao titulo="Campanhas, conjuntos e anúncios" apoio="Toque para abrir e ver o detalhe de cada nível">
        <div className="space-y-3">
          {[...ativas, ...pausadas].map((c) => (
            <details key={c.id} open={c.ativo} className="group rounded-2xl border border-sand/50 bg-white p-4 open:shadow-sm">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center gap-2">
                  <Selo entrega={c.entrega} />
                  <span className="font-semibold text-cacau">{c.nome}</span>
                  <span className="ml-auto text-xs text-cacau/45 group-open:hidden">toque para abrir</span>
                </div>
                <LinhaMetrica m={c.metricas} orcamento={c.orcamento_dia} />
              </summary>

              <div className="mt-4 space-y-3 border-t border-sand/40 pt-4">
                {c.conjuntos.length === 0 ? <p className="text-sm text-cacau/50">Sem conjuntos.</p> : null}
                {c.conjuntos.map((cj) => (
                  <div key={cj.id} className="rounded-xl bg-sand-light/60 p-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Selo entrega={cj.entrega} />
                      <span className="text-sm font-semibold text-cacau">{cj.nome}</span>
                    </div>
                    <LinhaMetrica m={cj.metricas} orcamento={cj.orcamento_dia} />

                    <div className="mt-3 space-y-2">
                      {cj.anuncios.map((a) => (
                        <div key={a.id} className="rounded-lg border border-sand/40 bg-white px-3 py-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Selo entrega={a.entrega} />
                            <span className="text-[13px] font-medium text-cacau/85">{a.nome}</span>
                          </div>
                          <LinhaMetrica m={a.metricas} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Secao>

      {/* régua da própria conta */}
      {regua ? (
        <Secao titulo="A régua da sua conta" apoio={"Média das " + regua.campanhas + " campanhas suas que geraram venda — é com isso que vale comparar, não com benchmark de internet"}>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            <Kpi rotulo="CTR típico" formatado={pct(regua.ctr)} />
            <Kpi rotulo="Custo/clique típico" formatado={brl(regua.cpc)} />
            <Kpi rotulo="CPM típico" formatado={brl(regua.cpm)} />
            <Kpi rotulo="Clique → página" formatado={pct(regua.clique_para_lpv, 0)} />
            <Kpi rotulo="Página → pagamento" formatado={pct(regua.lpv_para_checkout, 0)} />
            <Kpi rotulo="Pagamento → compra" formatado={pct(regua.checkout_para_compra, 0)} />
          </div>

          <div className="mt-3 overflow-x-auto rounded-2xl border border-sand/50 bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-sand/40 text-left text-[11px] uppercase tracking-wide text-cacau/45">
                  <th className="px-3 py-2 font-semibold">Campanha</th>
                  <th className="px-3 py-2 text-right font-semibold">Investido</th>
                  <th className="px-3 py-2 text-right font-semibold">Vendas</th>
                  <th className="px-3 py-2 text-right font-semibold">Custo/venda</th>
                  <th className="px-3 py-2 text-right font-semibold">ROAS</th>
                  <th className="px-3 py-2 text-right font-semibold">CTR</th>
                </tr>
              </thead>
              <tbody>
                {dados.historico.slice(0, 12).map((hc) => (
                  <tr key={hc.id} className="border-b border-sand/25 last:border-0">
                    <td className="max-w-[220px] truncate px-3 py-2 text-cacau/80" title={hc.nome}>{hc.nome}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-cacau/70">{brl(hc.gasto)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-cacau/70">{n(hc.compras)}</td>
                    <td className={"px-3 py-2 text-right tabular-nums font-semibold " + CORES[farol("cpa", hc.cpa)].texto}>{brl(hc.cpa)}</td>
                    <td className={"px-3 py-2 text-right tabular-nums font-semibold " + CORES[farol("roas", hc.roas)].texto}>{hc.roas === null ? "–" : n(hc.roas, 2)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-cacau/70">{pct(hc.ctr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Secao>
      ) : null}

      {/* glossário */}
      <Secao titulo="O que cada número quer dizer">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Object.entries(METAS).map(([chave, m]) => (
            <div key={chave} className="rounded-xl border border-sand/40 bg-white p-3.5">
              <p className="text-sm font-semibold text-cacau">
                {m.rotulo}
                <span className="ml-2 text-[11px] font-normal text-cacau/45">
                  meta {m.maiorMelhor ? "≥" : "≤"} {chave === "ctr" ? m.alvo + "%" : chave === "roas" || chave === "frequencia" ? n(m.alvo, chave === "roas" ? 1 : 1) : brl(m.alvo)}
                </span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-cacau/65">{m.ajuda}</p>
            </div>
          ))}
        </div>
      </Secao>

      <p className="mt-10 text-center text-[11px] text-cacau/35">
        Página privada · atualiza sozinha a cada minuto · conta {CONTA_ID}
      </p>
    </main>
  );
}
