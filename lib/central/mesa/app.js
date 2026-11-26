"use strict";
/* Mesa de Postagens · tela. Lê tudo de /central/mesa/api e grava cada ação lá. Nada aqui publica sozinho. */
const API = "/central/mesa/api";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => (typeof n === "number" ? n.toLocaleString("pt-BR") : "–");
const pct = (a, b) => (b ? Math.round(((a - b) / b) * 100) : 0);
const marcar = (grupo, botao) => grupo.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === botao));
const pressionado = (sel) => document.querySelector(`${sel} [aria-pressed="true"]`);

const SEM = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const SEM_SEG = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
const NOME_REDE = { ig: "Instagram", tt: "TikTok", pin: "Pinterest" };
const HORAS = ["10h", "12h", "17h30", "18h", "18h30", "20h"];
const dataUTC = (iso) => new Date(`${iso}T12:00:00Z`);
const somaDias = (iso, n) => new Date(dataUTC(iso).getTime() + n * 864e5).toISOString().slice(0, 10);
const ddmm = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const diaLegivel = (iso) => (iso ? `${SEM[dataUTC(iso).getUTCDay()]} ${ddmm(iso)}` : "");
const isoBR = (instante) => new Date(new Date(instante).getTime() - 3 * 3600e3).toISOString();
const listaRedes = (r = []) => { const n = r.map((x) => NOME_REDE[x] || x); return n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n.at(-1)}` : n[0] || ""; };

function regras(txt = "") {
  const tags = (txt.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  return [
    [!/—/.test(txt), "Sem travessão"],
    [!/\b(verdade|é real|pequenos|plantar a semente)\b/i.test(txt), "Sem palavras proibidas (verdade, é real, pequenos...)"],
    [tags === 5, `Exatamente 5 hashtags (tem ${tags})`],
    [!/R\$\s?\d/.test(txt), "Sem preço no post"],
    [!/arca de no[eé]/i.test(txt), "Sem Arca de Noé"],
    [!/\ba Criatividades\b/i.test(txt), "\"O Criatividades Bíblicas\", no masculino"],
  ];
}
const legendaPassa = (t) => regras(t).every((r) => r[0]);
const regrasHtml = (t) => regras(t).map(([ok, r]) => `<li><span class="s ${ok ? "ok" : "no"}">${ok ? "✓" : "!"}</span>${esc(r)}</li>`).join("");

/* ---------- estado e conversa com o servidor ---------- */
let E = null;
async function carregar() {
  try {
    const r = await fetch(API, { cache: "no-store" });
    if (r.status === 401) { location.href = "/central/entrar"; return; }
    const j = await r.json();
    if (!r.ok) throw new Error(j.erro || "Não consegui abrir a Mesa.");
    E = j; render();
  } catch (e) {
    $("#carregando").textContent = e.message || "Não consegui abrir a Mesa. Tente de novo em instantes.";
  }
}
async function agir(acao, dados = {}) {
  const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ acao, ...dados }) });
  if (r.status === 401) { location.href = "/central/entrar"; throw new Error("Entre de novo."); }
  let j = {}; try { j = await r.json(); } catch { }
  if (!r.ok || j.erro) throw new Error(j.erro || "Não consegui salvar agora. Tente de novo.");
  if (j.estado) { E = j.estado; render(); }
  return j;
}
const digitando = () => { const a = document.activeElement; return a && (a.tagName === "TEXTAREA" || a.tagName === "INPUT"); };
setInterval(() => { if (!document.hidden && !digitando() && !$("#pronto").open && !$("#zoom").open) carregar(); }, 25000);
document.addEventListener("visibilitychange", () => { if (!document.hidden && !digitando()) carregar(); });

const posts = () => E?.posts || [];
const postPorId = (id) => posts().find((p) => p.id === id);
const versaoAtual = (c) => c.versoes[c.versoes.length - 1];
const capaDe = (p) => (p.capa ? (p.capas || []).find((c) => c.letra === p.capa) : null);
const thumbDe = (p) => p.video?.poster || capaDe(p)?.url || (p.cards?.[0] ? versaoAtual(p.cards[0]).url : (p.capas?.[0]?.url || "/central-mesa/biblinho-lendo-biblia.webp"));
const ocupadoTexto = (p) => (E?.pcLigado ? "Claude fazendo o seu pedido" : "Pedido na fila: o computador está desligado e faz assim que ligar");

function render() {
  const rasc = {}; $$("textarea").forEach((t) => { if (t.id && t.value) rasc[t.id] = t.value; });
  $("#carregando").hidden = true; $("#principal").hidden = false;
  $("#data-hoje").textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(dataUTC(E.hoje));
  const temFila = (E.pedidos || []).some((p) => ["novo", "com_claude"].includes(p.situacao) && p.tipo !== "agendar");
  $("#barra-pc").hidden = !(temFila && !E.pcLigado);
  $("#barra-pc-texto").textContent = "O computador está desligado. Seus pedidos ficam guardados e o Claude faz assim que ele ligar.";
  montarPainel(); montarMes(); montarSemana(); montarPrateleira(); montarSemanasPedido(); montarDias(); montarPedidos(); montarIdeias(); montarSala(); montarFeed(); contadores();
  $$("textarea").forEach((t) => { ligarVoz(t); if (rasc[t.id] && !t.value) t.value = rasc[t.id]; });
  if ($("#pronto").open && ppId) abrirPronto(ppId, true);
}
function contadores() {
  const n = (id, v) => { const b = $(id); b.textContent = v; b.hidden = !v; };
  n("#bolha-aprovar", posts().filter((p) => p.situacao === "aguardando").length);
  n("#bolha-prontos", posts().filter((p) => p.situacao === "pronto").length);
  n("#bolha-ideias", (E.ideias || []).filter((i) => i.situacao === "nova").length);
}

/* ---------- navegação ---------- */
const ABAS = ["painel", "calendario", "pedido", "aprovar", "feed"];
const hist = []; let pos = -1, pulo = false;
function mostrar() {
  let a = (location.hash || "#painel").slice(1).split("/")[0]; if (!ABAS.includes(a)) a = "painel";
  if (!pulo && hist[pos] !== a) { hist.splice(pos + 1); hist.push(a); pos = hist.length - 1; }
  pulo = false;
  ABAS.forEach((x) => { $("#tela-" + x).hidden = x !== a; });
  $$(".abas a").forEach((l) => { if (l.dataset.aba === a) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current"); });
  $("#nav-voltar").disabled = pos <= 0; $("#nav-avancar").disabled = pos >= hist.length - 1;
  window.scrollTo(0, 0);
}
function pularPara(p) { if (p < 0 || p >= hist.length) return; pos = p; pulo = true; if (location.hash.slice(1) === hist[pos]) mostrar(); else location.hash = hist[pos]; }
$("#nav-voltar").addEventListener("click", () => pularPara(pos - 1));
$("#nav-avancar").addEventListener("click", () => pularPara(pos + 1));
addEventListener("hashchange", mostrar);

/* ---------- painel ---------- */
const soma = (arr, i, j) => arr.slice(i, j).reduce((a, b) => a + b, 0);
function montarPainel() {
  const P = E.painel?.dados;
  if (!P) { $("#numeros").innerHTML = `<p class="mudo">Os números ainda não chegaram do computador.</p>`; return; }
  $("#painel-lido").textContent = `Números lidos do Instagram em ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date(P.lido_em || E.painel.atualizado_em))}.`;
  const n = P.novos || [], al = P.alcance || [], L = n.length, d = P.dias || [];
  const novos7 = soma(n, L - 7, L), novosAnt = soma(n, L - 14, L - 7), alc7 = soma(al, L - 7, L), alcAnt = soma(al, L - 14, L - 7);
  const per = L >= 7 ? `${d[L - 7]} a ${d[L - 1]}` : "7 dias";
  const sinal = (v) => (v > 0 ? "+" : "") + v;
  const t7 = P.t7 || {};
  const itens = [
    ["n1", fmt(P.seguidores), "seguidores no Instagram", ""],
    ["n2", "+" + fmt(novos7), `seguidores novos (${per})`, `${sinal(pct(novos7, novosAnt))}% sobre a semana anterior (${fmt(novosAnt)})`],
    ["n3", fmt(alc7), `alcance somado dia a dia (${per})`, `${sinal(pct(alc7, alcAnt))}% sobre a semana anterior (${fmt(alcAnt)})`],
    ["n4", fmt(t7.saves), "salvamentos em 7 dias", `e ${fmt(t7.shares)} compartilhamentos`],
    ["n5", fmt(t7.total_interactions), "interações em 7 dias", "curtidas, comentários, salvos e envios"],
    ["n6", fmt(t7.profile_views), "visitas ao perfil em 7 dias", ""],
  ];
  $("#numeros").innerHTML = itens.map(([c, v, r, s]) => `<div class="numero ${c}"><b>${v}</b><span>${esc(r)}</span>${s ? `<small>${esc(s)}</small>` : ""}</div>`).join("");
  grafico("#graf-alcance", al, d, P.marcas || {}, "Pessoas alcançadas por dia");
  grafico("#graf-seg", n, d, P.marcas || {}, "Seguidores novos por dia");
  $("#chip-mediana").textContent = P.mediana ? `mediana do feed: ${fmt(P.mediana)}` : "";
  const top = P.top || [], max = top[0]?.alcance || 1;
  $("#top-posts").innerHTML = top.map((t) => `<div class="top-linha"><span style="min-width:0"><b>${esc(t.titulo)}</b> <small>(${esc(t.quando)})</small><br><small>${fmt(t.alcance)} pessoas${P.mediana ? ` · ${(t.alcance / P.mediana).toFixed(1).replace(".", ",")}x a mediana` : ""}</small></span><span class="barra" aria-hidden="true"><i style="width:${Math.round((t.alcance / max) * 100)}%"></i></span></div>`).join("") || `<p class="mudo">Sem posts nos últimos 30 dias.</p>`;
  montarAnalista(P.analista);
}
function grafico(alvo, dados, dias, marcas, rotulo) {
  if (!dados.length) { $(alvo).innerHTML = ""; return; }
  const W = 680, H = 210, ml = 40, mr = 8, mt = 16, mb = 34, n = dados.length;
  const max = Math.max(...dados, 1), passo = max > 1000 ? 1000 : max > 40 ? 10 : 5, topo = Math.ceil(max / passo) * passo;
  const bw = (W - ml - mr) / n, y = (v) => mt + (H - mt - mb) * (1 - v / topo);
  let s = `<svg class="grafico" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(rotulo)}">`;
  const linhas = max > 1000 ? [0, 1000, 2000, topo].filter((v, i, a) => a.indexOf(v) === i && v <= topo) : [0, topo / 2, topo];
  linhas.forEach((v) => { s += `<line x1="${ml}" x2="${W - mr}" y1="${y(v)}" y2="${y(v)}" stroke="#1D1A4F" stroke-opacity=".12" stroke-width="1.5"/><text x="${ml - 6}" y="${y(v) + 4}" font-size="11" text-anchor="end">${fmt(v)}</text>`; });
  dados.forEach((v, i) => {
    const x = ml + i * bw + 2, h = H - mt - mb - (y(v) - mt);
    s += `<rect x="${x}" y="${y(v)}" width="${bw - 4}" height="${Math.max(h, 1)}" rx="3" fill="${i >= n - 7 ? "#FFC531" : "#90D8E4"}" stroke="#1D1A4F" stroke-width="1.5"><title>${esc(dias[i])}: ${fmt(v)}</title></rect>`;
    const m = marcas[dias[i]];
    if (m) s += `<circle cx="${x + (bw - 4) / 2}" cy="${y(v) - 8}" r="4.5" fill="#F06060" stroke="#1D1A4F" stroke-width="1.5"/><text x="${Math.min(Math.max(x + (bw - 4) / 2, ml + 40), W - mr - 50)}" y="${y(v) - 16}" font-size="11" text-anchor="middle">${esc(m)}</text>`;
    if (i % 7 === 0 || i === n - 1) s += `<text x="${x + (bw - 4) / 2}" y="${H - mb + 16}" font-size="11" text-anchor="middle">${esc(dias[i])}</text>`;
  });
  s += `<text x="${W - mr}" y="${H - 4}" font-size="11" text-anchor="end">em amarelo: últimos 7 dias</text></svg>`;
  $(alvo).innerHTML = s;
}
function montarAnalista(A) {
  if (!A) { $("#analista").innerHTML = `<p class="mudo">A analista ainda não comentou.</p>`; return; }
  const cores = { verde: ["#2FB56B", "Crescendo"], amarelo: ["#FFC531", "Estável ou misto"], vermelho: ["#F06060", "Caindo"] };
  const [c, rot] = cores[A.farol] || cores.amarelo;
  const data = (A.arquivo || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  $("#analista").innerHTML = `
    <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap"><span class="farol"><i style="background:${c}"></i>${rot}</span><span class="mudo">Analista de métricas${data ? ` · ${data[3]}/${data[2]}` : ""}</span></div>
    <h2 class="manchete" id="h-analista">${esc(A.manchete)}</h2>
    <div class="achados" style="margin-top:.7rem">${(A.achados || []).map((a) => `<div class="achado"><h3>${esc(a.titulo)}</h3><p>${esc(a.texto)}</p></div>`).join("")}</div>
    <h3 style="font-weight:900;margin:1rem 0 .5rem">O que fazer na próxima semana</h3>
    <ol class="fazer">${(A.fazer_agora || []).map((f) => `<li><span><b>${esc(f.acao || f.titulo || "")}</b>${esc(f.porque || f.texto || "")}</span></li>`).join("")}</ol>
    ${A.falta_medir?.length ? `<details style="margin-top:.9rem"><summary style="cursor:pointer;font-weight:900">O que ainda não dá pra medir (${A.falta_medir.length})</summary><ul class="mudo" style="margin:.5rem 0 0;padding-left:1.1rem;display:grid;gap:.35rem">${A.falta_medir.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>` : ""}`;
}
$$(".redes button").forEach((b) => b.addEventListener("click", () => {
  marcar(b.parentElement, b);
  const r = b.dataset.rede;
  $("#painel-ig").hidden = r !== "ig"; $("#painel-outra").hidden = r === "ig";
  $("#outra-titulo").textContent = NOME_REDE[r];
  $("#outra-texto").textContent = r === "tt"
    ? "Os números do TikTok semana a semana entram na próxima etapa, quando a Mesa passar a ler o TikTok Studio sozinha."
    : "Os pins saem pelo Buffer. Os números do Pinterest entram na próxima etapa, junto com o TikTok.";
}));

/* ---------- o que acontece em cada dia ---------- */
function itensDoDia(iso) {
  const lista = [];
  for (const a of E.agenda || []) {
    const b = isoBR(a.prazo); if (b.slice(0, 10) !== iso) continue;
    const hora = `${+b.slice(11, 13)}h${b.slice(14, 16) === "00" ? "" : b.slice(14, 16)}`;
    const rede = String(a.contexto || "").split("·")[0].trim().replace("Instagram", "IG");
    const cls = a.situacao === "no_ar" || a.situacao === "enviado" ? "s-pub" : a.situacao === "segurado" ? "s-apr" : "s-ag";
    lista.push({ cls, txt: `${hora} ${rede} · ${a.titulo}`, ordem: b });
  }
  for (const p of posts()) {
    if (p.dia !== iso) continue;
    if (p.situacao === "aguardando") lista.push({ cls: "s-apr", txt: `${p.hora || ""} ${p.curto || p.titulo} · aprovar`.trim(), post: p.id, alvo: "aprovar", ordem: iso + (p.hora || "") });
    if (p.situacao === "aprovado") lista.push({ cls: "s-cri", txt: `${p.hora} ${p.curto || p.titulo} · o Claude agenda`, pronto: p.id, ordem: iso + p.hora });
  }
  for (const i of E.ideias || []) {
    if (i.data !== iso || !["nova", "comentada", "aprovada"].includes(i.situacao)) continue;
    lista.push({ cls: "s-ideia", txt: `${i.situacao === "aprovada" ? "✓ " : ""}${i.titulo}`, alvo: "pedido", ordem: iso + (i.hora || "") });
  }
  return lista.sort((a, b) => String(a.ordem).localeCompare(String(b.ordem)));
}
const marcaDoDia = (iso) => E.painel?.dados?.marcas?.[ddmm(iso)] || "";
function segundaDe(iso) { const d = dataUTC(iso).getUTCDay(); return somaDias(iso, d === 0 ? -6 : 1 - d); }
function semanas(n = 5) { const s0 = segundaDe(E.hoje); return Array.from({ length: n }, (_, k) => { const ini = somaDias(s0, 7 * k); return { ini, dias: Array.from({ length: 7 }, (_, i) => somaDias(ini, i)) }; }); }
const rotSemana = (s) => `${s.dias[0].slice(8, 10)} a ${ddmm(s.dias[6])}`;

/* ---------- calendário ---------- */
function botaoItem(x) {
  const t = esc(x.txt);
  if (x.pronto) return `<button class="p ${x.cls}" type="button" data-pronto="${x.pronto}" title="${t}">${t}</button>`;
  if (x.post) return `<button class="p ${x.cls}" type="button" data-sala="${x.post}" title="${t}">${t}</button>`;
  return `<button class="p ${x.cls}" type="button" data-alvo="${x.alvo || ""}" title="${t}">${t}</button>`;
}
function montarMes() {
  const cab = `<div class="mes-linha mes-cab"><span></span>${SEM_SEG.map((d) => `<span>${d}</span>`).join("")}</div>`;
  const linhas = semanas().map((s) => {
    const todos = s.dias.flatMap(itensDoDia);
    const ideiasNovas = (E.ideias || []).filter((i) => s.dias.includes(i.data) && i.situacao === "nova").length;
    const aprovar = todos.filter((x) => x.post).length;
    const estaSemana = s.dias.includes(E.hoje);
    let rotulo = "";
    if (estaSemana) rotulo += `<span class="chip chip--ok">Esta semana</span>`;
    if (ideiasNovas) rotulo += `<span class="chip chip--info">${ideiasNovas} ${ideiasNovas === 1 ? "ideia" : "ideias"} pra você</span>`;
    if (aprovar) rotulo += `<span class="chip chip--atencao">pra aprovar</span>`;
    if (!estaSemana) rotulo += `<button class="botao botao--p" type="button" data-pedir="${rotSemana(s)}">+ Fazer pedido</button>`;
    const dias = s.dias.map((iso) => {
      const ps = itensDoDia(iso), mk = marcaDoDia(iso), passado = iso < E.hoje;
      return `<div class="dia${!ps.length && !passado ? " livre" : ""}"${passado ? ' style="opacity:.6"' : ""}><span class="n">${+iso.slice(8, 10)}${iso === E.hoje ? " · hoje" : ""}</span>${mk ? `<span class="marca">${esc(mk)}</span>` : ""}${ps.map(botaoItem).join("")}</div>`;
    }).join("");
    return `<div class="mes-linha"><div class="sem-rot"><b>${rotSemana(s)}</b>${rotulo}</div>${dias}</div>`;
  }).join("");
  $("#mes-grade").innerHTML = cab + linhas;
}
function montarSemana() {
  const s = semanas(1)[0];
  $("#semana-lista").innerHTML = s.dias.map((iso, k) => {
    const ps = itensDoDia(iso);
    const corpo = ps.length ? ps.map((x) => {
      const p = x.pronto ? postPorId(x.pronto) : x.post ? postPorId(x.post) : null;
      const img = p ? `<img src="${esc(thumbDe(p))}" alt="" width="58" height="72" loading="lazy">` : `<span class="ideia-mini" style="width:3.6rem">${x.cls === "s-ideia" ? "ideia" : esc(x.txt.split("·")[0])}</span>`;
      const botao = x.pronto ? `<button class="botao botao--p botao--sol" type="button" data-pronto="${x.pronto}">Abrir</button>` : x.post ? `<button class="botao botao--p botao--sol" type="button" data-sala="${x.post}">Abrir</button>` : "";
      const chip = { "s-pub": ["chip--ok", "publicado"], "s-ag": ["chip--info", "agendado"], "s-apr": ["chip--atencao", "pra você aprovar"], "s-cri": ["chip--atencao", "aprovado, o Claude agenda"], "s-ideia": ["chip", "ideia"] }[x.cls];
      return `<div class="post-l">${img}<div style="min-width:0"><p class="t">${esc(x.txt.split("·").slice(1).join("·").trim() || x.txt)}</p><div class="m"><span class="chip ${chip[0]}">${chip[1]}</span> ${botao}</div></div></div>`;
    }).join("") : `<div class="vazio-dia">Dia livre. <button class="troca-versao" type="button" data-ir-prateleira>Puxe um post da prateleira</button> ou faça um pedido.</div>`;
    return `<div class="dia-l"><p class="d">${SEM_SEG[k]}<small>${ddmm(iso)}</small></p><div class="posts-dia">${corpo}</div></div>`;
  }).join("");
}
$$(".alterna [data-vista]").forEach((b) => b.addEventListener("click", () => {
  marcar(b.parentElement, b);
  const v = b.dataset.vista; $("#vista-mes").hidden = v !== "mes"; $("#vista-semana").hidden = v !== "semana";
  $("#cal-titulo").textContent = v === "mes" ? "Próximas semanas" : `Semana de ${rotSemana(semanas(1)[0])}`;
}));
document.addEventListener("click", (e) => {
  const pr = e.target.closest("[data-pronto]"); if (pr) { abrirPronto(pr.dataset.pronto); return; }
  const sl = e.target.closest("[data-sala]"); if (sl) { salaId = sl.dataset.sala; montarSala(); location.hash = "aprovar"; return; }
  if (e.target.closest("[data-ir-prateleira]")) { $("#prateleira").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  const p = e.target.closest("button.p"); if (p && p.dataset.alvo) { location.hash = p.dataset.alvo; return; }
  const pd = e.target.closest("[data-pedir]");
  if (pd) { location.hash = "pedido"; setTimeout(() => { trocarModo("semana"); escolherSemana(pd.dataset.pedir); $("#pedido-texto").focus(); }, 60); }
});

/* ---------- prateleira de prontos ---------- */
function pendencias(p) {
  const f = [];
  if (p.capas?.length && !p.capa) f.push("escolher capa");
  if (Object.values(p.legendas || {}).some((t) => !legendaPassa(t))) f.push("completar a legenda");
  if (p.situacao === "pronto") f.push("falta dia e hora");
  return f;
}
function montarPrateleira() {
  const lista = posts().filter((p) => ["pronto", "aprovado"].includes(p.situacao));
  const falta = lista.filter((p) => p.situacao === "pronto").length;
  $("#cont-prontos").textContent = falta; $("#cont-prontos").className = "chip " + (falta ? "chip--atencao" : "chip--ok");
  $("#prontos").innerHTML = lista.map((p) => `
    <article class="pronto${p.situacao === "aprovado" ? " agendado" : ""}">
      <button type="button" class="pronto-capa" data-pronto="${p.id}" aria-label="Abrir ${esc(p.titulo)}"><img src="${esc(thumbDe(p))}" alt="" width="720" height="900" loading="lazy">${p.formato === "reel" ? '<svg class="reel" aria-hidden="true"><use href="#i-reel"/></svg>' : ""}${p.capas?.length && !p.capa ? '<span class="tag">capa ?</span>' : ""}</button>
      <div class="pronto-info">
        <h3>${esc(p.titulo)}</h3>
        <p class="mudo">${esc(formatoTexto(p))}${p.status ? " · " + esc(p.status) : ""}</p>
        <div class="m">${p.situacao === "aprovado" ? `<span class="chip chip--ok">aprovado: ${diaLegivel(p.dia)}, ${esc(p.hora)}</span><span class="chip chip--info">o Claude agenda</span>` : ""}${pendencias(p).map((x) => `<span class="chip chip--atencao">${x}</span>`).join("")}</div>
        ${p.ocupado ? `<p class="aviso">${ocupadoTexto(p)}</p>` : p.aviso ? `<p class="aviso">${esc(p.aviso)}</p>` : ""}
        <button class="botao botao--p botao--sol" type="button" data-pronto="${p.id}">${p.situacao === "aprovado" ? "Abrir ou mudar" : "Abrir"}</button>
      </div>
    </article>`).join("") || `<p class="mudo">Nenhum post pronto esperando dia.</p>`;
}
const formatoTexto = (p) => p.formato === "reel" ? "Reel" : p.formato === "imagem" ? "Imagem" : `Carrossel de ${(p.cards?.length || 0) + (p.capas?.length ? 1 : 0)}`;

/* ---------- painel do post (prateleira e aprovação) ---------- */
let ppId = null, pp = null, ppLeg = "ig";
function abrirPronto(id, soAtualizar = false) {
  const p = postPorId(id); if (!p) return;
  const mesmo = ppId === id && soAtualizar;
  ppId = id;
  if (!mesmo) pp = { dia: p.dia, hora: p.hora, redes: [...(p.redes || ["ig"])], outra: p.hora && !HORAS.includes(p.hora) };
  $("#pp-titulo").textContent = p.titulo;
  $("#pp-formato").textContent = `${formatoTexto(p)}${p.status ? " · " + p.status : ""} · versão ${p.versao}`;
  const av = $("#pp-aviso"); av.hidden = !(p.ocupado || p.aviso); av.textContent = p.ocupado ? ocupadoTexto(p) : p.aviso || "";
  ppPecas(p);
  $("#pp-pecas-nota").textContent = p.nota || "";
  $("#pp-sec-capa").hidden = !p.capas?.length;
  if (p.capas?.length) {
    $("#pp-capas").innerHTML = p.capas.map((c) => `<button type="button" aria-pressed="${p.capa === c.letra}" data-capa="${esc(c.letra)}"><img src="${esc(c.url)}" alt="" width="720" height="900" loading="lazy"><span>Capa ${esc(c.letra)}${c.sugestao ? " · minha sugestão" : ""}</span>${c.texto && c.texto !== "Capa " + c.letra ? `<small>${esc(c.texto)}</small>` : ""}</button>`).join("");
    $("#pp-capa-nota").textContent = p.capa ? `Capa ${p.capa} escolhida. Ela entra como card 1.` : "Toque na capa que você quer. Ela entra como card 1.";
  }
  const dias = Array.from({ length: 21 }, (_, k) => somaDias(E.hoje, k));
  $("#pp-dias").innerHTML = dias.map((iso) => { const tem = itensDoDia(iso).filter((x) => x.pronto !== id && x.post !== id).length; return `<button type="button" aria-pressed="${pp.dia === iso}" data-d="${iso}" aria-label="${diaLegivel(iso)}${tem ? ", já tem post" : ", dia livre"}"><small>${SEM[dataUTC(iso).getUTCDay()]}</small><b>${iso.slice(8, 10)}</b><i class="${tem ? "tem" : ""}"></i></button>`; }).join("");
  $("#pp-horas").innerHTML = HORAS.map((h) => `<button type="button" aria-pressed="${pp.hora === h && !pp.outra}" data-h="${h}">${h}${h === "18h" ? " (sugerido)" : ""}</button>`).join("") + `<button type="button" aria-pressed="${!!pp.outra}" data-h="outro">Outro</button>`;
  $("#pp-outra-hora").hidden = !pp.outra;
  if (pp.outra && pp.hora) { const [hh, mm] = pp.hora.split("h"); $("#pp-hora-livre").value = `${hh.padStart(2, "0")}:${(mm || "00").padEnd(2, "0")}`; }
  $$("#pp-redes input").forEach((c) => { c.checked = pp.redes.includes(c.value); c.disabled = p.formato === "reel" && c.value === "pin"; });
  ppNoDia();
  const redesLeg = ["ig", "tt", "pin"].filter((r) => p.legendas?.[r]);
  if (!redesLeg.includes(ppLeg)) ppLeg = redesLeg[0] || "ig";
  $("#pp-leg-abas").innerHTML = redesLeg.length > 1 ? redesLeg.map((r) => `<button type="button" aria-pressed="${r === ppLeg}" data-ppleg="${r}">${NOME_REDE[r]}</button>`).join("") : "";
  ppLegenda(p);
  const aprovado = p.situacao === "aprovado";
  $("#pp-tirar").hidden = !aprovado;
  $("#pp-agendar").textContent = aprovado ? "Salvar mudanças" : "Aprovar e agendar";
  if (!mesmo) { $("#pp-msg").textContent = aprovado ? `Aprovado: ${diaLegivel(p.dia)}, ${p.hora}, ${listaRedes(p.redes)}. O Claude agenda e avisa na Central.` : "Escolha o dia e o horário. Depois é só aprovar."; $("#pp-msg").style.color = aprovado ? "var(--ok)" : ""; $("#pp-ajuste-erro").textContent = ""; }
  const d = $("#pronto"); if (!d.open && d.showModal) { d.showModal(); $(".pp-corpo").scrollTop = 0; }
}
function ppPecas(p) {
  if (p.formato === "reel" && p.video) { if (!$("#pp-pecas video")) $("#pp-pecas").innerHTML = `<video src="${esc(p.video.url)}" poster="${esc(p.video.poster || "")}" controls playsinline preload="none" width="540" height="960"></video>`; }
  else {
    const capa = capaDe(p);
    const lista = [...(p.capas?.length ? [capa ? capa.url : null] : []), ...(p.cards || []).map((c) => versaoAtual(c).url)];
    $("#pp-pecas").innerHTML = lista.map((s, k) => s ? `<figure><button type="button" data-zoom-src="${esc(s)}" aria-label="Ver o card ${k + 1} grande"><img src="${esc(s)}" alt="" width="720" height="900" loading="lazy"></button><span class="num">${k + 1}</span></figure>` : `<figure><div class="ideia-mini capa-vazia">capa a<br>escolher</div><span class="num">1</span></figure>`).join("");
  }
  $("#pp-pecas").querySelector(".refazendo")?.remove();
  if (p.ocupado) { const cx = $("#pp-pecas"); cx.style.position = "relative"; cx.appendChild(el("div", { class: "refazendo" }, "Claude ajustando<br>o post")); }
}
function ppNoDia() {
  if (!pp.dia) { $("#pp-no-dia").textContent = "A bolinha vermelha mostra os dias que já têm post."; return; }
  const ja = itensDoDia(pp.dia).filter((x) => x.pronto !== ppId && x.post !== ppId).map((x) => x.txt);
  const mk = marcaDoDia(pp.dia);
  $("#pp-no-dia").textContent = (ja.length ? `Nesse dia já tem: ${ja.join("; ")}.` : "Dia livre, sem nenhum post.") + (mk ? ` Data: ${mk}.` : "");
}
function ppLegenda(p) {
  const t = p.legendas?.[ppLeg] || "";
  $("#pp-legenda").textContent = t || "Sem legenda ainda.";
  $("#pp-regras").innerHTML = t ? regrasHtml(t) : "";
  $("#pp-corrigir").hidden = !t || legendaPassa(t) || !!p.ocupado;
}
$("#pronto").addEventListener("click", async (e) => {
  const p = postPorId(ppId); if (!p) return;
  if (e.target === $("#pronto")) { $("#pronto").close(); return; }
  const z = e.target.closest("[data-zoom-src]"); if (z) { abrirZoom(z.dataset.zoomSrc, "Card em tamanho grande"); return; }
  const c = e.target.closest("[data-capa]");
  if (c) { try { await agir("capa", { post: p.id, letra: c.dataset.capa }); } catch (er) { ppMsg(er.message, "erro"); } return; }
  const d = e.target.closest("[data-d]"); if (d) { pp.dia = d.dataset.d; marcar($("#pp-dias"), d); ppNoDia(); return; }
  const h = e.target.closest("[data-h]");
  if (h) { marcar($("#pp-horas"), h); if (h.dataset.h === "outro") { pp.outra = true; pp.hora = null; $("#pp-outra-hora").hidden = false; $("#pp-hora-livre").focus(); } else { pp.outra = false; pp.hora = h.dataset.h; $("#pp-outra-hora").hidden = true; } return; }
  const l = e.target.closest("[data-ppleg]"); if (l) { ppLeg = l.dataset.ppleg; marcar($("#pp-leg-abas"), l); ppLegenda(p); }
});
$("#pp-hora-livre").addEventListener("input", (e) => { const v = e.target.value; pp.hora = v ? v.replace(/^0(?=\d)/, "").replace(":00", "h").replace(":", "h") : null; });
$("#pp-redes").addEventListener("change", () => { pp.redes = $$("#pp-redes input:checked").map((c) => c.value); });
$("#pp-fechar").addEventListener("click", () => $("#pronto").close());
$("#pronto").addEventListener("close", () => { ppId = null; const v = $("#pp-pecas video"); if (v) v.pause(); $("#pp-pecas").innerHTML = ""; });
function ppMsg(t, tipo) { $("#pp-msg").textContent = t; $("#pp-msg").style.color = tipo === "erro" ? "var(--erro)" : tipo === "ok" ? "var(--ok)" : "var(--azul)"; }
$("#pp-corrigir").addEventListener("click", async () => {
  const b = $("#pp-corrigir"); b.disabled = true;
  try { await agir("ajuste_legenda", { post: ppId, rede: ppLeg, texto: "Completar a legenda pra passar nas regras da casa: 5 hashtags certeiras pro público do post, sem mexer no resto." }); ppMsg("Pedido enviado: o Claude corrige a legenda e ela volta aqui."); }
  catch (er) { ppMsg(er.message, "erro"); } finally { b.disabled = false; }
});
$("#pp-ajuste").addEventListener("input", () => { $("#pp-ajuste-erro").textContent = ""; });
$("#pp-enviar-ajuste").addEventListener("click", async () => {
  const t = $("#pp-ajuste").value.trim();
  if (!t) { $("#pp-ajuste-erro").textContent = "Escreva ou fale o que mudar."; return; }
  try { await agir("ajuste_pronto", { post: ppId, texto: t }); $("#pp-ajuste").value = ""; ppMsg("Ajuste enviado. O post volta aqui com a versão nova."); }
  catch (er) { $("#pp-ajuste-erro").textContent = er.message; }
});
$("#pp-agendar").addEventListener("click", async () => {
  const b = $("#pp-agendar"); b.disabled = true;
  try {
    await agir("agendar", { post: ppId, dia: pp.dia, hora: pp.hora, redes: pp.redes });
    const p = postPorId(ppId);
    ppMsg(`Aprovado: ${diaLegivel(p.dia)}, ${p.hora}, ${listaRedes(p.redes)}. O Claude agenda e avisa na Central.`, "ok");
  } catch (er) { ppMsg(er.message, "erro"); } finally { b.disabled = false; }
});
$("#pp-tirar").addEventListener("click", async () => {
  try { await agir("tirar_agenda", { post: ppId }); ppMsg("Saiu da agenda e voltou pra prateleira."); }
  catch (er) { ppMsg(er.message, "erro"); }
});
function abrirZoom(src, alt) { $("#zoom-img").src = src; $("#zoom-img").alt = alt; const z = $("#zoom"); if (z.showModal && !z.open) z.showModal(); }
$("#zoom-fechar").addEventListener("click", () => $("#zoom").close());

/* ---------- pedido ---------- */
const DICA = {
  semana: "Claudinha, monta o cronograma dessa semana. Quero um carrossel de porquê pras professoras e um post pros pais.",
  sentido: "Mudar o sentido: quero um post que explique o que é a data, por que a gente comemora e como a criança pode agradecer a Deus.",
  todos: "Troca o fundo de todos os cards pra azul-céu e aumenta a letra do texto.",
};
let modoPedido = "semana";
function trocarModo(m) {
  modoPedido = m; marcar($("#modo-pedido"), $(`#modo-pedido [data-modo="${m}"]`));
  $$("#form-pedido [data-so]").forEach((x) => { x.hidden = x.dataset.so !== m; });
  $("#pedido-texto").placeholder = m === "semana" ? DICA.semana : DICA[pressionado("#tipo-mudar").dataset.tipo];
  $("#pedido-erro").textContent = "";
}
$$("#modo-pedido button").forEach((b) => b.addEventListener("click", () => trocarModo(b.dataset.modo)));
$$("#tipo-mudar button").forEach((b) => b.addEventListener("click", () => { marcar($("#tipo-mudar"), b); $("#pedido-texto").placeholder = DICA[b.dataset.tipo]; }));
let semanaEscolhida = "";
function montarSemanasPedido() {
  const ops = semanas(5).slice(1).map(rotSemana).concat("Post avulso");
  $("#semanas-escolha").innerHTML = ops.map((s) => `<button type="button" aria-pressed="${s === semanaEscolhida}" data-sem="${esc(s)}">${esc(s)}</button>`).join("");
}
function escolherSemana(s) { semanaEscolhida = s; $$("#semanas-escolha button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.sem === s)); }
$("#semanas-escolha").addEventListener("click", (e) => { const b = e.target.closest("[data-sem]"); if (b) escolherSemana(b.dataset.sem); });
$("#pedido-texto").addEventListener("input", () => { $("#pedido-erro").textContent = ""; });

let diaMudar = null;
function postsDoDia(iso) {
  const l = posts().filter((p) => p.dia === iso && ["aguardando", "pronto", "aprovado"].includes(p.situacao)).map((p) => ({ id: p.id, img: thumbDe(p), t: p.titulo, est: `${formatoTexto(p)} · ${p.situacao === "aguardando" ? "pra você aprovar" : p.situacao === "aprovado" ? `aprovado, ${p.hora}` : "pronto"}` }));
  for (const i of E.ideias || []) if (i.data === iso && ["nova", "comentada", "aprovada"].includes(i.situacao)) l.push({ id: i.id, ideia: true, t: i.titulo, est: `${i.formato || ""} · ideia ${i.situacao === "aprovada" ? "aprovada" : "esperando você"}` });
  return l;
}
function montarDias() {
  const dias = Array.from({ length: 14 }, (_, k) => somaDias(E.hoje, k));
  if (!dias.includes(diaMudar)) diaMudar = dias.find((d) => postsDoDia(d).length) || dias[0];
  $("#dias-escolha").innerHTML = dias.map((iso) => { const tem = postsDoDia(iso).length; return `<button type="button" aria-pressed="${iso === diaMudar}" data-dia="${iso}" aria-label="${diaLegivel(iso)}${tem ? ", tem post" : ", dia livre"}"><small>${SEM[dataUTC(iso).getUTCDay()]}</small><b>${iso.slice(8, 10)}</b><i class="${tem ? "tem" : ""}"></i></button>`; }).join("");
  montarPostsDoDia();
}
function montarPostsDoDia() {
  const l = postsDoDia(diaMudar);
  $("#passo-posts").textContent = `Qual post de ${diaLegivel(diaMudar)}?`;
  $("#posts-do-dia").innerHTML = l.length
    ? l.map((p) => `<label class="post-esc"><input type="checkbox" name="post-mudar" value="${p.id}" data-ideia="${p.ideia ? 1 : 0}" ${l.length === 1 ? "checked" : ""}>${p.ideia ? '<span class="ideia-mini">ainda<br>é ideia</span>' : `<img src="${esc(p.img)}" alt="" width="58" height="72">`}<span style="min-width:0"><span class="t">${esc(p.t)}</span><br><span class="mudo">${esc(p.est)}</span></span></label>`).join("")
    : `<div class="vazio-dia" style="display:flex;gap:.6rem;align-items:center;justify-content:space-between;flex-wrap:wrap"><span>Nesse dia ainda não tem post.</span><button class="botao botao--p" type="button" data-avulso="${diaMudar}">Pedir um post pra esse dia</button></div>`;
}
$("#dias-escolha").addEventListener("click", (e) => { const b = e.target.closest("[data-dia]"); if (!b) return; diaMudar = b.dataset.dia; marcar($("#dias-escolha"), b); montarPostsDoDia(); $("#pedido-erro").textContent = ""; });
$("#posts-do-dia").addEventListener("click", (e) => {
  const b = e.target.closest("[data-avulso]"); if (!b) return;
  trocarModo("semana"); escolherSemana("Post avulso");
  $("#pedido-texto").value = `Post pro dia ${diaLegivel(b.dataset.avulso)}: `; $("#pedido-texto").focus();
});
$("#form-pedido").addEventListener("submit", async (e) => {
  e.preventDefault();
  const txt = $("#pedido-texto").value.trim(), erro = $("#pedido-erro"), b = $("#enviar-pedido");
  const ok = (m) => { $("#pedido-texto").value = ""; $("#pedido-msg").textContent = m; $("#pedido-msg").style.color = "var(--ok)"; statusLimpo($("#pedido-texto")); };
  b.disabled = true;
  try {
    if (modoPedido === "semana") {
      if (!semanaEscolhida) { erro.textContent = "Escolha a semana do pedido."; return; }
      if (!txt) { erro.textContent = "Escreva ou fale o que você quer pra essa semana."; return; }
      await agir("pedido_semana", { semana: semanaEscolhida, texto: txt, fontes: $$("#fontes input:checked").map((c) => c.value) });
      escolherSemana(""); ok("Pedido enviado. As ideias aparecem aqui embaixo quando a pesquisa terminar.");
    } else {
      const marcados = $$("#posts-do-dia input:checked");
      if (!marcados.length) { erro.textContent = "Marque o post que você quer mudar."; return; }
      if (!txt) { erro.textContent = "Escreva ou fale o que mudar no post."; return; }
      await agir("mudar_post", { tipo: pressionado("#tipo-mudar").dataset.tipo, texto: txt, posts: marcados.filter((m) => m.dataset.ideia === "0").map((m) => m.value), ideias: marcados.filter((m) => m.dataset.ideia === "1").map((m) => m.value) });
      ok("Pedido enviado. O post volta pra você com a versão nova.");
    }
  } catch (er) { erro.textContent = er.message; } finally { b.disabled = false; }
});
const TIPO = { semana: "Planejar semana", mudar_post: "Mudar post", ajuste_card: "Ajuste de card", ajuste_post: "Post inteiro", ajuste_legenda: "Legenda", ajuste_pronto: "Ajuste em pronto", comentario_ideia: "Comentário em ideia", montar_semana: "Montar semana", agendar: "Agendar" };
function montarPedidos() {
  const l = (E.pedidos || []).filter((p, i) => i < 8 || ["novo", "com_claude"].includes(p.situacao));
  const chip = { novo: ["chip--atencao", E.pcLigado ? "na fila" : "esperando o PC ligar"], com_claude: ["chip--info", "Claude fazendo"], feito: ["chip--ok", "pronto"], erro: ["chip--erro", "não deu certo"] };
  $("#pedidos").innerHTML = l.map((p) => {
    const post = p.post_id ? postPorId(p.post_id) : null;
    const desc = p.tipo === "agendar" ? `${post ? post.titulo + " · " : ""}${diaLegivel(p.dados?.dia)} ${p.dados?.hora || ""}` : (p.texto || p.dados?.semana || "");
    const c = p.tipo === "agendar" && p.situacao === "novo" ? ["chip--info", "o Claude agenda"] : chip[p.situacao];
    return `<div class="pedido-l"><span style="min-width:0"><b>${esc(TIPO[p.tipo] || p.tipo)}</b> <span class="mudo">· ${esc(desc.slice(0, 110))}</span>${p.resposta ? `<br><span class="mudo" style="color:var(--azul)">${esc(p.resposta)}</span>` : ""}</span><span class="chip ${c[0]}">${c[1]}</span></div>`;
  }).join("") || `<p class="mudo">Nenhum pedido ainda.</p>`;
}

/* ---------- ideias ---------- */
function montarIdeias() {
  const grupos = {};
  for (const i of E.ideias || []) { if (i.situacao === "descartada" && !i.data) continue; (grupos[i.semana] ||= []).push(i); }
  const nomes = Object.keys(grupos);
  $("#bloco-ideias").innerHTML = nomes.map((sem) => {
    const l = grupos[sem], aprov = l.filter((i) => i.situacao === "aprovada").length;
    return `<div class="secao" style="padding-block:.5rem 0">
      <div class="resumo-ideias"><h2 class="titulo-secao">Ideias pra ${esc(sem)}</h2><span class="chip ${aprov ? "chip--ok" : ""}">${aprov} de ${l.length} aprovadas</span></div>
      <div class="ideias">${l.map((d) => `
        <article class="cartao ideia${d.situacao === "aprovada" ? " aprovada" : ""}${d.situacao === "descartada" ? " descartada" : ""}" data-ideia="${d.id}">
          <div class="meta">${d.data ? `<span class="chip">${diaLegivel(d.data)}${d.hora ? " · " + esc(d.hora) : ""}</span>` : ""}${d.trilha ? `<span class="chip chip--info">${esc(d.trilha)}</span>` : ""}${d.formato ? `<span class="chip">${esc(d.formato)}</span>` : ""}</div>
          <h3>${esc(d.titulo)}</h3>
          ${d.porque ? `<div class="porque"><b>${esc(d.fonte || "Por quê")}</b>${esc(d.porque)}</div>` : ""}
          <div class="caixa-com" hidden><label class="mudo" for="com-ideia-${d.id}" style="font-weight:800">Seu comentário</label><textarea id="com-ideia-${d.id}" maxlength="3000" placeholder="Ideia legal, faz assim..."></textarea><p class="erro-campo"></p><button class="botao botao--p botao--azul" type="button" data-ac="enviar">Enviar comentário</button></div>
          <p class="estado" aria-live="polite">${d.situacao === "aprovada" ? "Aprovada. Entra na semana." : d.situacao === "guardada" ? "Guardada pra outra semana." : d.situacao === "comentada" ? `Comentário enviado: "${esc((d.comentario || "").slice(0, 80))}"` : d.situacao === "descartada" ? "Descartada." : ""}</p>
          <div class="acoes">
            <button class="botao botao--p botao--verde" type="button" data-ac="aprovada">${d.situacao === "aprovada" ? "Desaprovar" : "Aprovar"}</button>
            <button class="botao botao--p" type="button" data-ac="comentar">Comentar</button>
            <button class="botao botao--p" type="button" data-ac="guardada">Guardar</button>
            <button class="botao botao--p" type="button" data-ac="descartada">Descartar</button>
          </div>
        </article>`).join("")}</div>
      <div class="cartao final"><p class="mensagem" data-msg-semana="${esc(sem)}">Aprove as ideias que gostar. Com as aprovadas eu monto a semana e começo a criar.</p><button class="botao botao--azul" type="button" data-montar="${esc(sem)}">Montar a semana com as aprovadas</button></div>
    </div>`;
  }).join("") || `<div class="cartao"><p class="mudo">Ainda não tem ideias. Faça um pedido de semana aqui em cima e elas aparecem nesta área, cada uma com o motivo e o número que a justifica.</p></div>`;
}
$("#bloco-ideias").addEventListener("click", async (e) => {
  const m = e.target.closest("[data-montar]");
  if (m) { const msg = $(`[data-msg-semana="${CSS.escape(m.dataset.montar)}"]`); try { await agir("montar_semana", { semana: m.dataset.montar }); } catch (er) { msg.textContent = er.message; msg.style.color = "var(--erro)"; return; } const m2 = $(`[data-msg-semana="${CSS.escape(m.dataset.montar)}"]`); if (m2) { m2.textContent = "Pedido enviado: eu começo a criar os posts das ideias aprovadas."; m2.style.color = "var(--ok)"; } return; }
  const b = e.target.closest("button[data-ac]"); if (!b) return;
  const card = b.closest(".ideia"), id = card.dataset.ideia, cx = card.querySelector(".caixa-com"), ac = b.dataset.ac;
  const atual = (E.ideias || []).find((i) => i.id === id);
  try {
    if (ac === "comentar") { cx.hidden = !cx.hidden; if (!cx.hidden) cx.querySelector("textarea").focus(); return; }
    if (ac === "enviar") { const t = cx.querySelector("textarea"), er = cx.querySelector(".erro-campo"); if (!t.value.trim()) { er.textContent = "Escreva o comentário primeiro."; return; } await agir("comentario_ideia", { id, texto: t.value.trim() }); return; }
    await agir("ideia", { id, situacao: ac === "aprovada" && atual?.situacao === "aprovada" ? "nova" : ac });
  } catch (er) { card.querySelector(".estado").textContent = er.message; card.querySelector(".estado").style.color = "var(--erro)"; }
});
$("#bloco-ideias").addEventListener("input", (e) => { if (e.target.tagName === "TEXTAREA") { const er = e.target.closest(".caixa-com")?.querySelector(".erro-campo"); if (er) er.textContent = ""; } });

/* ---------- sala de aprovação ---------- */
let salaId = null, legSala = "ig";
const verAnterior = {};
function montarSala() {
  const lista = posts().filter((p) => p.situacao === "aguardando");
  if (!lista.some((p) => p.id === salaId)) salaId = lista[0]?.id || null;
  $("#escolha-post").innerHTML = lista.length > 1 ? lista.map((p) => `<button type="button" aria-pressed="${p.id === salaId}" data-escolher="${p.id}">${esc(p.curto || p.titulo)}${p.dia ? " · " + diaLegivel(p.dia) : ""}</button>`).join("") : "";
  const p = postPorId(salaId);
  $("#sala-vazia").hidden = !!p; $("#sala").hidden = !p;
  if (!p) return;
  $("#sala-titulo").textContent = p.titulo;
  $("#sub-post").textContent = `Versão ${p.versao} · ${formatoTexto(p)}${p.dia ? ` · sugestão: ${diaLegivel(p.dia)}${p.hora ? ", " + p.hora : ""}` : ""}${p.redes?.length ? ` · ${listaRedes(p.redes)}` : ""}`;
  const av = $("#aviso-post"); av.hidden = !(p.ocupado || p.aviso); av.textContent = p.ocupado ? `${ocupadoTexto(p)}. ${p.aviso || ""}` : p.aviso || "";
  const todosOcupados = p.ocupado && ["ajuste_post", "mudar_post", "ajuste_pronto"].includes(p.ocupado.tipo);
  $("#cards").innerHTML = (p.cards || []).map((c) => {
    const ver = verAnterior[`${p.id}-${c.n}`] && c.versoes.length > 1 ? c.versoes[c.versoes.length - 2] : versaoAtual(c);
    const ocupado = todosOcupados || (p.ocupado?.tipo === "ajuste_card" && p.ocupado.card === c.n);
    const estado = ocupado ? "Claude refazendo este card" : c.ok ? "Aprovado" : c.versoes.length > 1 ? `Versão ${versaoAtual(c).v} pronta.` : "Esperando você";
    return `<article class="cartao card-ap${c.ok ? " ok" : ""}" data-n="${c.n}">
      <div class="foto"><img src="${esc(ver.url)}" alt="Card ${c.n}" width="720" height="900" loading="lazy">
        <span class="num">${c.n}</span><span class="ver">${c.versoes.length > 1 ? `<span class="chip ${ver === versaoAtual(c) ? "chip--info" : ""}">versão ${ver.v}</span>` : ""}</span>
        <button class="zoom" type="button" data-zoom-src="${esc(ver.url)}" aria-label="Ver o card ${c.n} grande"><svg aria-hidden="true"><use href="#i-lupa"/></svg></button>
        ${ocupado ? `<div class="refazendo">${E.pcLigado ? "Claude refazendo" : "Na fila, esperando<br>o PC ligar"}</div>` : ""}
      </div>
      <p class="estado" style="color:${c.ok ? "var(--ok)" : ocupado ? "var(--atencao)" : ""}">${estado}${c.versoes.length > 1 ? ` <button class="troca-versao" type="button" data-trocar="${c.n}">${verAnterior[`${p.id}-${c.n}`] ? "voltar pra nova" : "ver a anterior"}</button>` : ""}</p>
      <label class="mudo" for="com-card-${p.id}-${c.n}" style="font-weight:800">O que ajustar neste card</label>
      <textarea id="com-card-${p.id}-${c.n}" maxlength="3000" placeholder="${c.n === 1 ? "Aumenta o letreiro de cima" : "Escreva ou fale o que quer mudar"}"></textarea>
      <p class="erro-campo"></p>
      <div class="linha-bt">
        <button class="botao botao--p" type="button" data-ac="enviar"${ocupado ? " disabled" : ""}>Enviar ajuste</button>
        <button class="botao botao--p botao--verde" type="button" data-ac="aprovar"${ocupado ? " disabled" : ""}>${c.ok ? "Desaprovar" : "Aprovar"}</button>
      </div>
    </article>`;
  }).join("");
  const redes = ["ig", "tt", "pin"].filter((r) => p.legendas?.[r]);
  if (!redes.includes(legSala)) legSala = redes[0] || "ig";
  $("#legenda-abas").innerHTML = redes.length > 1 ? redes.map((r) => `<button type="button" aria-pressed="${r === legSala}" data-leg="${r}">${NOME_REDE[r]}</button>`).join("") : "";
  const t = p.legendas?.[legSala] || "";
  $("#legenda-texto").textContent = t || "Sem legenda ainda.";
  $("#regras").innerHTML = t ? regrasHtml(t) : "";
  const legOcupada = p.ocupado?.tipo === "ajuste_legenda";
  $("#estado-legenda").textContent = legOcupada ? "Claude ajustando" : p.legenda_ok ? "aprovada" : "esperando você";
  $("#estado-legenda").className = "chip " + (legOcupada ? "chip--atencao" : p.legenda_ok ? "chip--ok" : "");
  $("#ok-legenda").textContent = p.legenda_ok ? "Desaprovar legenda" : "Aprovar legenda";
  const n = (p.cards || []).filter((c) => c.ok).length, total = (p.cards || []).length;
  $("#cont-cards").textContent = `${n} de ${total} cards aprovados`;
  $("#cont-cards").className = "chip " + (n === total ? "chip--ok" : "chip--atencao");
  $("#barra-prog").style.transform = `scaleX(${total ? (n + (p.legenda_ok ? 1 : 0)) / (total + 1) : 0})`;
}
$("#escolha-post").addEventListener("click", (e) => { const b = e.target.closest("[data-escolher]"); if (b) { salaId = b.dataset.escolher; montarSala(); $$("#cards textarea").forEach(ligarVoz); } });
$("#legenda-abas").addEventListener("click", (e) => { const b = e.target.closest("[data-leg]"); if (b) { legSala = b.dataset.leg; montarSala(); $$("#cards textarea").forEach(ligarVoz); } });
$("#cards").addEventListener("input", (e) => { if (e.target.tagName === "TEXTAREA") e.target.closest(".card-ap").querySelector(".erro-campo").textContent = ""; });
$("#cards").addEventListener("click", async (e) => {
  const z = e.target.closest("[data-zoom-src]"); if (z) { abrirZoom(z.dataset.zoomSrc, "Card em tamanho grande"); return; }
  const tv = e.target.closest("[data-trocar]"); if (tv) { const k = `${salaId}-${tv.dataset.trocar}`; verAnterior[k] = !verAnterior[k]; montarSala(); $$("#cards textarea").forEach(ligarVoz); return; }
  const b = e.target.closest("button[data-ac]"); if (!b) return;
  const art = b.closest(".card-ap"), n = +art.dataset.n, p = postPorId(salaId), c = p.cards.find((x) => x.n === n);
  const t = art.querySelector("textarea"), er = art.querySelector(".erro-campo");
  b.disabled = true;
  try {
    if (b.dataset.ac === "aprovar") await agir("card_ok", { post: p.id, n, ok: !c.ok });
    else { if (!t.value.trim()) { er.textContent = "Escreva o ajuste primeiro."; return; } await agir("ajuste_card", { post: p.id, n, texto: t.value.trim() }); }
  } catch (x) { er.textContent = x.message; } finally { b.disabled = false; }
});
$$("#tipo-massa button").forEach((b) => b.addEventListener("click", () => {
  marcar($("#tipo-massa"), b);
  $("#com-massa").placeholder = DICA[b.dataset.tipo];
  $("#env-massa").textContent = b.dataset.tipo === "sentido" ? "Refazer o post inteiro" : "Aplicar em todos os cards";
}));
$("#com-massa").addEventListener("input", () => { $("#erro-massa").textContent = ""; });
$("#env-massa").addEventListener("click", async () => {
  const t = $("#com-massa").value.trim();
  if (!t) { $("#erro-massa").textContent = "Escreva ou fale o que mudar no post."; return; }
  try { await agir("ajuste_post", { post: salaId, tipo: pressionado("#tipo-massa").dataset.tipo, texto: t }); $("#com-massa").value = ""; statusLimpo($("#com-massa")); }
  catch (er) { $("#erro-massa").textContent = er.message; }
});
$("#com-legenda").addEventListener("input", () => { $("#erro-legenda").textContent = ""; });
$("#env-legenda").addEventListener("click", async () => {
  const t = $("#com-legenda").value.trim();
  if (!t) { $("#erro-legenda").textContent = "Escreva o ajuste primeiro."; return; }
  try { await agir("ajuste_legenda", { post: salaId, rede: legSala, texto: t }); $("#com-legenda").value = ""; statusLimpo($("#com-legenda")); }
  catch (er) { $("#erro-legenda").textContent = er.message; }
});
$("#ok-legenda").addEventListener("click", async () => {
  const p = postPorId(salaId);
  try { await agir("legenda_ok", { post: p.id, ok: !p.legenda_ok }); } catch (er) { $("#erro-legenda").textContent = er.message; }
});
$("#aprovar-tudo").addEventListener("click", () => {
  const p = postPorId(salaId), m = $("#msg-final"); if (!p) return;
  const faltam = p.cards.filter((c) => !c.ok).length, f = [];
  if (faltam) f.push(`${faltam} ${faltam === 1 ? "card" : "cards"}`);
  if (!p.legenda_ok) f.push("a legenda");
  if (f.length) { m.textContent = "Ainda falta aprovar " + f.join(" e ") + "."; m.style.color = "var(--erro)"; return; }
  m.textContent = "Tudo aprovado. Agora escolha o dia e o horário."; m.style.color = "var(--ok)";
  abrirPronto(p.id);
});

/* ---------- feed ---------- */
function proximosNoFeed() {
  return posts().filter((p) => p.dia && p.dia >= E.hoje && ["aguardando", "pronto", "aprovado", "agendado"].includes(p.situacao) && p.formato !== "reel")
    .sort((a, b) => (b.dia + (b.hora || "")).localeCompare(a.dia + (a.hora || ""))).slice(0, 3);
}
function montarFeed() {
  const P = E.painel?.dados || {};
  $("#ig-conta").textContent = P.conta || "criatividadesbiblicas";
  $("#ig-posts").textContent = fmt(P.posts); $("#ig-seg").textContent = P.seguidores >= 1000 ? `${(P.seguidores / 1000).toFixed(1).replace(".", ",")} mil` : fmt(P.seguidores);
  const prox = proximosNoFeed();
  const tiles = [
    ...prox.map((p) => ({ url: thumbDe(p), titulo: p.titulo, data: diaLegivel(p.dia), proximo: true })),
    ...(P.feed || []).map((f) => ({ url: f.url, titulo: f.titulo, data: f.data, reel: f.reel })),
  ].slice(0, 18);
  $("#ig-grade").innerHTML = tiles.map((t, i) => `<button type="button" class="${t.proximo ? "proximo" : ""}" data-tile="${i}" title="${esc(t.data)} · ${esc(t.titulo)}" aria-label="${t.proximo ? "Próximo post" : "Post de " + esc(t.data)}: ${esc(t.titulo)}. Toque pra ver inteiro">${t.proximo ? '<span class="selo">próximo</span>' : ""}${t.reel ? '<svg class="reel" aria-hidden="true"><use href="#i-reel"/></svg>' : ""}<img src="${esc(t.url)}" alt="" width="480" height="600" loading="lazy"></button>`).join("");
  $("#ig-grade").dataset.tiles = JSON.stringify(tiles.map((t) => [t.url, t.data, t.titulo]));
  $("#proximos-feed").innerHTML = prox.length ? prox.map((p) => `<div class="pedido-l"><span><b>${esc(p.titulo)}</b><br><span class="mudo">${diaLegivel(p.dia)}${p.hora ? ", " + esc(p.hora) : ""} · ${p.situacao === "aguardando" ? "pra você aprovar" : p.situacao === "aprovado" ? "aprovado" : p.situacao === "agendado" ? "agendado" : "pronto"}</span></span><button class="botao botao--p botao--sol" type="button" ${p.situacao === "aguardando" ? `data-sala="${p.id}"` : `data-pronto="${p.id}"`}>Abrir</button></div>`).join("") : `<p class="mudo">Nenhum post com dia marcado ainda.</p>`;
}
$("#ig-grade").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tile]"); if (!b) return;
  const [s, d, t] = JSON.parse($("#ig-grade").dataset.tiles)[+b.dataset.tile];
  abrirZoom(s, `${d}: ${t}`);
});
$$("[data-grade]").forEach((b) => b.addEventListener("click", () => {
  marcar(b.parentElement, b);
  const inteiro = b.dataset.grade === "inteiro";
  $("#ig-grade").classList.toggle("inteiro", inteiro);
  $("#nota-grade").textContent = inteiro ? "Aqui cada post aparece inteiro, do tamanho que foi feito. No perfil, o Instagram corta uma faixa fina das laterais." : "No perfil, o Instagram mostra cada post um pouco mais estreito e corta uma faixa fina das laterais. Toque num post pra ver ele inteiro.";
}));
$("#tam-cel").addEventListener("input", (e) => $("#celular").style.setProperty("--larg", e.target.value + "px"));

/* ---------- falar em vez de digitar ---------- */
let alvoVoz = null, rec = null;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const statusDe = (t) => t.closest(".campo-voz")?.nextElementSibling;
const micDe = (t) => t.closest(".campo-voz")?.querySelector(".mic");
function statusLimpo(t) { const s = statusDe(t); if (s?.classList.contains("voz-status")) s.textContent = ""; }
function escreverVoz(t, txt) { t.value = t.value ? t.value.replace(/\s*$/, " ") + txt.trim() : txt.trim(); t.dispatchEvent(new Event("input", { bubbles: true })); }
function pintarMic(t, ouvindo, msg) {
  $$(".mic").forEach((m) => { m.setAttribute("aria-pressed", "false"); m.setAttribute("aria-label", "Falar em vez de digitar"); });
  if (!t || !t.isConnected) return;
  if (ouvindo) { micDe(t)?.setAttribute("aria-pressed", "true"); micDe(t)?.setAttribute("aria-label", "Parar de falar"); }
  if (msg !== undefined && statusDe(t)) statusDe(t).textContent = msg;
}
function ligarVoz(t) {
  if (t.closest(".campo-voz")) return;
  const w = el("div", { class: "campo-voz" }); t.parentNode.insertBefore(w, t); w.appendChild(t);
  const b = el("button", { type: "button", class: "mic", "aria-pressed": "false", "aria-label": "Falar em vez de digitar", title: "Falar em vez de digitar" }, '<svg aria-hidden="true"><use href="#i-mic"/></svg>');
  w.appendChild(b); w.after(el("p", { class: "voz-status", "aria-live": "polite" }));
  b.addEventListener("click", () => clicarMic(t));
}
const SEM_VOZ = "Neste aparelho, use o microfone do próprio teclado pra ditar.";
function clicarMic(t) {
  if (!SR) { t.focus(); pintarMic(t, false, SEM_VOZ); return; }
  if (rec) { const era = alvoVoz; rec.stop(); if (era === t) return; }
  alvoVoz = t; rec = new SR(); rec.lang = "pt-BR"; rec.interimResults = true; rec.continuous = true;
  rec.onstart = () => pintarMic(t, true, "Ouvindo... fale à vontade e toque de novo pra parar.");
  rec.onresult = (ev) => { let parcial = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) escreverVoz(t, r[0].transcript); else parcial += r[0].transcript; } if (statusDe(t)) statusDe(t).textContent = parcial ? "Ouvindo: " + parcial : "Ouvindo..."; };
  rec.onerror = (ev) => pintarMic(t, false, ev.error === "not-allowed" || ev.error === "service-not-allowed" ? "Microfone não liberado. Libere no navegador ou use o microfone do teclado." : ev.error === "no-speech" ? "Não ouvi nada. Toque no microfone e fale de novo." : "Não consegui ouvir agora. Tente de novo.");
  rec.onend = () => { rec = null; if (micDe(t)?.getAttribute("aria-pressed") === "true") pintarMic(t, false, t.value ? "Pronto. Confira o texto e envie." : ""); };
  try { rec.start(); } catch { rec = null; pintarMic(t, false, SEM_VOZ); }
}

/* ---------- início ---------- */
mostrar();
carregar();
