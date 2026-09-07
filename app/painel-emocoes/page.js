import { notFound } from "next/navigation";

// Painel da campanha SET26-EMO (Meta Ads) — alimentado pela rotina de relatório (tabela public.campanha_runs no Supabase).
// Acesso: /painel-emocoes?k=<PAINEL_KEY>. Sem indexação, sem link no site.
export const dynamic = "force-dynamic";
export const metadata = { title: "Painel · Campanha Emoções", robots: { index: false, follow: false } };

const CAMPANHA_ID = "120250993061040638";
const META = {
  ctr: { meta: 2.0, alerta: 1.2, maiorMelhor: true, fmt: (v) => `${fmtN(v, 2)}%` },
  cpc: { meta: 0.6, alerta: 0.9, maiorMelhor: false, fmt: (v) => brl(v) },
  custo_lpv: { meta: 1.0, alerta: 1.5, maiorMelhor: false, fmt: (v) => brl(v) },
  custo_checkout: { meta: 6, alerta: 10, maiorMelhor: false, fmt: (v) => brl(v) },
  cpa: { meta: 25, alerta: 40, maiorMelhor: false, fmt: (v) => brl(v) },
  roas: { meta: 2.3, alerta: 1.5, maiorMelhor: true, fmt: (v) => fmtN(v, 2) },
};

const fmtN = (v, d = 0) => (v === null || v === undefined || Number.isNaN(Number(v)) ? "–" : Number(v).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }));
const brl = (v) => (v === null || v === undefined || Number.isNaN(Number(v)) ? "–" : `R$ ${fmtN(v, 2)}`);
const dt = (iso) => new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function farol(chave, v) {
  const m = META[chave];
  if (!m || v === null || v === undefined || Number.isNaN(Number(v))) return "⚪";
  const x = Number(v);
  if (m.maiorMelhor) return x >= m.meta ? "🟢" : x >= m.alerta ? "🟡" : "🔴";
  return x <= m.meta ? "🟢" : x <= m.alerta ? "🟡" : "🔴";
}

async function carregar() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const r = await fetch(`${url}/rest/v1/campanha_runs?campanha_id=eq.${CAMPANHA_ID}&order=quando.asc&limit=200`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return [];
    return await r.json();
  } catch {
    return []; // sem conexão com o banco: o painel abre vazio em vez de quebrar
  }
}

function Kpi({ rotulo, valor, sub, cor }) {
  return (
    <div className="rounded-2xl border border-sand/60 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-cacau/50">{rotulo}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-cacau">{cor ? `${cor} ` : ""}{valor}</p>
      {sub ? <p className="mt-1 text-xs text-cacau/60">{sub}</p> : null}
    </div>
  );
}

function Tabela({ colunas, linhas }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand/60 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-sand-light text-left text-[11px] uppercase tracking-wider text-cacau/60">
          <tr>{colunas.map((c) => <th key={c} className="px-3 py-2 font-bold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {linhas.length === 0 ? (
            <tr><td className="px-3 py-3 text-cacau/50" colSpan={colunas.length}>sem dados ainda</td></tr>
          ) : linhas.map((l, i) => (
            <tr key={i} className="border-t border-sand/40">{l.map((v, j) => <td key={j} className="whitespace-nowrap px-3 py-2">{v}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Gráfico simples em SVG: gasto acumulado (barras) e compras acumuladas (linha) por execução
function Grafico({ runs }) {
  const pts = runs.map((r) => ({ q: r.quando, gasto: Number(r.dados?.campanha?.gasto ?? 0), compras: Number(r.dados?.campanha?.compras_kiwify ?? r.dados?.campanha?.compras_meta ?? 0) }));
  if (pts.length < 2) return <p className="text-sm text-cacau/50">o gráfico aparece a partir da 2ª execução</p>;
  const W = 720, H = 220, px = 40, py = 20;
  const maxG = Math.max(...pts.map((p) => p.gasto), 1), maxC = Math.max(...pts.map((p) => p.compras), 1);
  const x = (i) => px + (i * (W - 2 * px)) / (pts.length - 1);
  const yG = (v) => H - py - (v / maxG) * (H - 2 * py), yC = (v) => H - py - (v / maxC) * (H - 2 * py);
  const bw = Math.max(4, (W - 2 * px) / pts.length - 6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-2xl border border-sand/60 bg-white">
      {pts.map((p, i) => <rect key={i} x={x(i) - bw / 2} y={yG(p.gasto)} width={bw} height={H - py - yG(p.gasto)} fill="#f2b441" opacity="0.8" />)}
      <polyline fill="none" stroke="#d6432e" strokeWidth="3" points={pts.map((p, i) => `${x(i)},${yC(p.compras)}`).join(" ")} />
      {pts.map((p, i) => <circle key={i} cx={x(i)} cy={yC(p.compras)} r="4" fill="#d6432e" />)}
      <text x={px} y={14} fontSize="11" fill="#8a7668">■ gasto acumulado (máx {brl(maxG)})   ● compras acumuladas (máx {maxC})</text>
      {pts.map((p, i) => (i % Math.ceil(pts.length / 8) === 0 ? <text key={i} x={x(i)} y={H - 4} fontSize="10" textAnchor="middle" fill="#8a7668">{dt(p.q)}</text> : null))}
    </svg>
  );
}

export default async function Painel({ searchParams }) {
  const sp = await searchParams;
  if (!process.env.PAINEL_KEY || sp?.k !== process.env.PAINEL_KEY) notFound();
  const runs = await carregar();
  const ultimo = runs[runs.length - 1];
  const d = ultimo?.dados || {};
  const c = d.campanha || {};
  const conjuntos = d.conjuntos || [];
  const anuncios = d.anuncios || [];
  const hoje = d.conjuntos_hoje || [];
  const funil = d.funil || {};
  const vendasDia = d.vendas_dia || [];
  const acoes = runs.filter((r) => r.acoes && r.acoes.trim() && !/^nenhuma/i.test(r.acoes.trim())).reverse();
  const t = (a, b) => (a && b ? `${fmtN((a / b) * 100, 1)}%` : "–");

  return (
    <main className="min-h-screen bg-ivory px-4 py-8 text-cacau md:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-coral-deep">Meta Ads · SET26-EMO · A × B</p>
            <h1 className="font-display text-3xl font-semibold">Painel da campanha Emoções</h1>
            <p className="mt-1 text-sm text-cacau/60">{ultimo ? `Última leitura: ${dt(ultimo.quando)} · dia ${ultimo.dia_teste ?? "–"} de 5 · ${runs.length} leitura(s)` : "Nenhuma leitura ainda. A rotina roda às 08h, 12h, 16h e 20h."}</p>
          </div>
          {ultimo?.alerta ? <span className="rounded-full bg-coral-deep px-4 py-2 text-sm font-bold text-white">⚠️ ação executada na última leitura</span> : null}
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi rotulo="Gasto acumulado" valor={brl(c.gasto)} sub={`previsto até agora: ${brl(c.gasto_previsto)}`} />
          <Kpi rotulo="Compras" valor={`${fmtN(c.compras_kiwify)} Kiwify · ${fmtN(c.compras_meta)} Meta`} sub={`receita ${brl(c.receita_kiwify)}`} />
          <Kpi rotulo="CPA (custo por compra)" valor={brl(c.cpa)} sub="meta ≤ R$ 25 · teto R$ 40" cor={farol("cpa", c.cpa)} />
          <Kpi rotulo="ROAS" valor={fmtN(c.roas, 2)} sub="meta ≥ 2,3" cor={farol("roas", c.roas)} />
          <Kpi rotulo="CTR" valor={`${fmtN(c.ctr, 2)}%`} sub="meta ≥ 2%" cor={farol("ctr", c.ctr)} />
          <Kpi rotulo="CPC" valor={brl(c.cpc)} sub="meta ≤ R$ 0,60" cor={farol("cpc", c.cpc)} />
          <Kpi rotulo="Custo por checkout" valor={brl(c.custo_checkout)} sub="meta ≤ R$ 6" cor={farol("custo_checkout", c.custo_checkout)} />
          <Kpi rotulo="Projeção (fim do teste)" valor={`${fmtN(c.projecao_vendas)} vendas`} sub={c.status_anuncios || ""} />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Evolução por leitura</h2>
          <Grafico runs={runs} />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Conjuntos (acumulado)</h2>
          <Tabela
            colunas={["Conjunto", "Status", "Gasto", "Impr.", "CTR", "CPC", "Pág.", "Checkout", "Compras (Meta/Kiwify)", "CPA", "ROAS"]}
            linhas={conjuntos.map((s) => [s.nome, s.status, brl(s.gasto), fmtN(s.impressoes), `${farol("ctr", s.ctr)} ${fmtN(s.ctr, 2)}%`, `${farol("cpc", s.cpc)} ${brl(s.cpc)}`, fmtN(s.lpv), fmtN(s.checkouts), `${fmtN(s.compras_meta)} / ${fmtN(s.compras_kiwify)}`, `${farol("cpa", s.cpa)} ${brl(s.cpa)}`, `${farol("roas", s.roas)} ${fmtN(s.roas, 2)}`])}
          />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Anúncios (acumulado)</h2>
          <Tabela
            colunas={["Anúncio", "Status", "Gasto", "Impr.", "CTR", "CPC", "Checkout", "Compras", "CPA"]}
            linhas={anuncios.map((a) => [a.nome, a.status, brl(a.gasto), fmtN(a.impressoes), `${farol("ctr", a.ctr)} ${fmtN(a.ctr, 2)}%`, brl(a.cpc), fmtN(a.checkouts), fmtN(a.compras_meta), `${farol("cpa", a.cpa)} ${brl(a.cpa)}`])}
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold">Hoje, por conjunto</h2>
            <Tabela colunas={["Conjunto", "Gasto", "Cliques", "Checkout", "Compras"]} linhas={hoje.map((s) => [s.nome, brl(s.gasto), fmtN(s.cliques), fmtN(s.checkouts), fmtN(s.compras_meta)])} />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold">Funil (acumulado)</h2>
            <Tabela
              colunas={["Etapa", "Qtde", "Taxa"]}
              linhas={[["Cliques no link", fmtN(funil.cliques), "–"], ["Viram a página", fmtN(funil.lpv), t(funil.lpv, funil.cliques)], ["Iniciaram checkout", fmtN(funil.checkouts), t(funil.checkouts, funil.lpv)], ["Compraram", fmtN(funil.compras), t(funil.compras, funil.checkouts)]]}
            />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Vendas reais (Kiwify) por dia</h2>
          <Tabela colunas={["Dia", "Vendas", "Receita", "Reembolsos", "Enviadas ao Meta"]} linhas={vendasDia.map((v) => [v.dia, fmtN(v.vendas), brl(v.receita), fmtN(v.reembolsos), fmtN(v.enviados_meta)])} />
        </section>

        {ultimo?.leitura ? (
          <section className="rounded-2xl border border-sand/60 bg-white p-5">
            <h2 className="font-display text-xl font-semibold">Leitura da última execução</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-cacau/85">{ultimo.leitura}</p>
          </section>
        ) : null}

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Ações executadas pela rotina</h2>
          <Tabela colunas={["Quando", "Ação"]} linhas={acoes.map((r) => [dt(r.quando), r.acoes])} />
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold">Histórico de leituras</h2>
          <Tabela
            colunas={["Quando", "Dia", "Gasto", "Compras K/M", "CPA", "ROAS", "Título"]}
            linhas={[...runs].reverse().map((r) => [dt(r.quando), r.dia_teste ?? "–", brl(r.dados?.campanha?.gasto), `${fmtN(r.dados?.campanha?.compras_kiwify)} / ${fmtN(r.dados?.campanha?.compras_meta)}`, brl(r.dados?.campanha?.cpa), fmtN(r.dados?.campanha?.roas, 2), r.titulo || "–"])}
          />
        </section>

        {ultimo?.markdown ? (
          <details className="rounded-2xl border border-sand/60 bg-white p-5">
            <summary className="cursor-pointer font-display text-lg font-semibold">Relatório completo da última execução</summary>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-cacau/85">{ultimo.markdown}</pre>
          </details>
        ) : null}

        <footer className="pt-4 text-center text-xs text-cacau/40">Criatividades Bíblicas · painel interno · atualizado pela rotina de relatório</footer>
      </div>
    </main>
  );
}
