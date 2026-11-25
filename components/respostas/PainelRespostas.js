"use client";

import { useCallback, useEffect, useState } from "react";
import { api, store, fmt, API } from "./api";

// ——— utilitários de interface ———

function useLoad(fn, deps = []) {
  const [data, setData] = useState(null);
  const [erro, setErro] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reload = useCallback(() => fn().then((d) => { setData(d); setErro(null); }).catch((e) => setErro(e.message)), deps);
  useEffect(() => { reload(); }, [reload]);
  return [data, reload, erro];
}

let avisar = () => {};
const toast = (m) => avisar(m);

const card = "rounded-2xl border border-sand/40 bg-white p-4 shadow-sm";
const btn = "rounded-xl border border-sand/50 bg-white px-3.5 py-2 text-sm font-bold text-cacau hover:bg-sand-light disabled:opacity-50";
const btnPri = "rounded-xl bg-coral-deep px-4 py-2 text-sm font-bold text-white hover:bg-coral disabled:opacity-50";
const input = "w-full rounded-xl border border-sand/60 bg-white px-3 py-2.5 text-[15px] text-cacau outline-none focus:border-coral-deep focus:ring-2 focus:ring-coral/20";
const label = "mb-1.5 mt-3.5 block text-[13px] font-bold text-cacau";
const hint = "mt-1 text-xs text-cacau/55";

function Chip({ tom = "neutro", children }) {
  const t = {
    ok: "bg-olive/15 text-[#4f6e35]",
    ruim: "bg-coral/15 text-coral-deep",
    alerta: "bg-mustard/25 text-[#8a6206]",
    info: "bg-dusk/15 text-[#3b6a82]",
    neutro: "bg-sand-light text-cacau/70",
  }[tom];
  return <span className={"inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold " + t}>{children}</span>;
}

function Toggle({ on, onClick, rotulo }) {
  return (
    <button type="button" aria-label={rotulo} aria-pressed={on} onClick={onClick}
      className={"relative h-[26px] w-[46px] shrink-0 rounded-full transition " + (on ? "bg-olive" : "bg-sand/60")}>
      <span className={"absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all " + (on ? "left-[23px]" : "left-[3px]")} />
    </button>
  );
}

function Tags({ value = [], onChange, placeholder }) {
  const [t, setT] = useState("");
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT(""); };
  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl border border-sand/60 bg-white p-2">
      {value.map((k) => (
        <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-sand-light px-2.5 py-1 text-xs font-bold text-cacau/80">
          {k}
          <button type="button" aria-label={"remover " + k} className="opacity-60 hover:opacity-100" onClick={() => onChange(value.filter((x) => x !== k))}>✕</button>
        </span>
      ))}
      <input value={t} placeholder={placeholder || "digite e aperte enter"} onChange={(e) => setT(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add}
        className="min-w-[140px] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none" />
    </div>
  );
}

function Copiar({ valor }) {
  return (
    <div className="flex gap-2">
      <input readOnly value={valor || ""} onFocus={(e) => e.target.select()} className={input + " font-mono text-xs"} />
      <button type="button" className={btn} onClick={() => { navigator.clipboard.writeText(valor); toast("copiado"); }}>copiar</button>
    </div>
  );
}

// ——— saúde ———

function Saude({ health, onRetomar }) {
  if (!health) return null;
  const alertas = [];
  const pausa = health.paused_until && new Date(health.paused_until) > new Date();
  if (pausa) alertas.push({ tom: "ruim", txt: `robô em pausa de proteção até ${fmt(health.paused_until)} (a Meta sinalizou limite de envio)`, acao: true });
  if (health.falhas_busca_15min >= 3) alertas.push({ tom: "ruim", txt: "a busca de comentários falhou várias vezes nos últimos 15 min. confira o token na aba conexão" });
  if (health.last_poll_ok && Date.now() - new Date(health.last_poll_ok).getTime() > 5 * 60e3 && !pausa)
    alertas.push({ tom: "alerta", txt: `última busca concluída em ${fmt(health.last_poll_ok)}. o robô pode estar parado` });
  if (health.token_age_days >= 50) alertas.push({ tom: "alerta", txt: `o token tem ${health.token_age_days} dias. gere um novo e cole na aba conexão antes dos 60` });
  if (health.queue > 0) alertas.push({ tom: "info", txt: `${health.queue} comentário(s) na fila esperando o limite por hora liberar. vão sair nas próximas rodadas` });
  if (!alertas.length) return null;
  return (
    <div className="mb-3 flex flex-col gap-2">
      {alertas.map((a, i) => (
        <div key={i} className={"flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold " +
          (a.tom === "ruim" ? "border-coral/40 bg-coral/10 text-coral-deep" : a.tom === "alerta" ? "border-mustard/50 bg-mustard/15 text-[#7a5605]" : "border-dusk/30 bg-dusk/10 text-[#3b6a82]")}>
          <span>{a.txt}</span>
          {a.acao && <button type="button" className={btn} onClick={onRetomar}>retomar agora</button>}
        </div>
      ))}
    </div>
  );
}

// ——— aba painel ———

const STATUS = { enviado: ["ok", "direct enviado"], falhou: ["ruim", "falhou"], processando: ["alerta", "enviando"] };
const LOGK = {
  ignorado: "ignorado", duplicado: "repetido", falha_envio: "falha", falha_busca: "falha na busca", assinatura_invalida: "assinatura inválida",
  sem_token: "sem token", pausado: "pausado", webhook_verificado: "webhook verificado", token_renovado: "token renovado",
  token_falha_renovacao: "falha ao renovar token", pausa_automatica: "pausa automática", proximo_post_ligado: "próximo post ligado",
};

function Painel() {
  const [dias, setDias] = useState(7);
  const [q, setQ] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [origem, setOrigem] = useState("");
  const [d, reload] = useLoad(() => api("dashboard", { days: dias }), [dias]);
  const [adm, reloadAdm] = useLoad(() => api("admin"), []);
  useEffect(() => { const t = setInterval(reload, 20000); return () => clearInterval(t); }, [reload]);

  const on = adm?.settings?.enabled;
  const alternar = async () => { await api("save_settings", { enabled: !on }); reloadAdm(); toast(on ? "robô desligado" : "robô ligado"); };
  const t = d?.totals || {};
  const taxa = t.enviados ? Math.round((t.cliques / t.enviados) * 100) : 0;
  const leads = (d?.leads || []).filter((l) =>
    (!q || `${l.username} ${l.comment_text}`.toLowerCase().includes(q.toLowerCase())) &&
    (!etiqueta || (l.tag || "sem etiqueta") === etiqueta) && (!origem || l.source === origem));
  const maxDia = Math.max(1, ...(d?.by_day || []).map((x) => x.captados));

  const csv = () => {
    const linhas = [["data", "usuario", "comentario", "status", "cliques", "origem", "etiqueta", "regra"]].concat(
      leads.map((l) => [l.created_at, "@" + l.username, (l.comment_text || "").replace(/"/g, "'"), l.status, l.clicks, l.source, l.tag || "", l.rule_name || ""]));
    const blob = new Blob(["﻿" + linhas.map((r) => r.map((c) => `"${c ?? ""}"`).join(";")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "leads-instagram.csv"; a.click();
  };

  return (
    <>
      <Saude health={d?.health} onRetomar={async () => { await api("pause", { minutes: 0 }); reload(); toast("robô retomado"); }} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Painel</h1>
          <p className="mb-4 text-sm text-cacau/60">quem comentou, recebeu direct e clicou no botão</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Chip tom={on ? "ok" : "alerta"}>{on ? "● robô ligado" : "❚❚ desligado"}</Chip>
          <Toggle on={!!on} onClick={alternar} rotulo="ligar ou desligar o robô" />
        </div>
      </div>
      {adm && !adm.settings.has_token && (
        <div className={card + " mb-3 border-coral/40"}><b>falta conectar o instagram.</b> abra a aba conexão.</div>
      )}
      <div className="mb-3 inline-flex rounded-xl bg-sand-light p-1">
        {[1, 7, 30].map((n) => (
          <button key={n} type="button" onClick={() => setDias(n)}
            className={"rounded-lg px-3 py-1.5 text-sm font-bold " + (dias === n ? "bg-white shadow-sm" : "text-cacau/55")}>
            {n === 1 ? "hoje" : n + " dias"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["comentários captados", t.captados, d ? `${t.organico || 0} orgânico · ${t.anuncio || 0} anúncio` : ""],
          ["directs enviados", t.enviados, t.falhas ? `${t.falhas} falharam` : ""],
          ["clicaram no botão", t.cliques, ""],
          ["taxa de clique", d ? taxa + "%" : null, ""],
        ].map(([l, v, h]) => (
          <div key={l} className={card}>
            <p className="text-[13px] text-cacau/60">{l}</p>
            <p className="font-display text-3xl font-semibold tabular-nums">{v ?? "–"}</p>
            <p className="text-xs text-cacau/50">{h || " "}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className={card}>
          <div className="flex items-center justify-between">
            <h2 className="mb-2 font-bold">por dia</h2>
            <div className="flex gap-3 text-xs text-cacau/60">
              <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-coral-deep align-[-1px]" />captados</span>
              <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-dusk align-[-1px]" />cliques</span>
            </div>
          </div>
          {d?.by_day?.length ? (
            <div className="flex h-36 items-end gap-1.5 pt-2">
              {d.by_day.map((x) => (
                <div key={x.dia} className="flex h-full flex-1 flex-col items-center gap-1" title={`${x.dia}: ${x.captados} captados, ${x.cliques} cliques`}>
                  <div className="flex w-full flex-1 items-end gap-0.5">
                    <div className="flex-1 rounded-t bg-coral-deep" style={{ height: (x.captados / maxDia) * 100 + "%", minHeight: 2 }} />
                    <div className="flex-1 rounded-t bg-dusk" style={{ height: (x.cliques / maxDia) * 100 + "%", minHeight: 2 }} />
                  </div>
                  <span className="text-[11px] text-cacau/50">{x.dia.slice(8)}/{x.dia.slice(5, 7)}</span>
                </div>
              ))}
            </div>
          ) : <p className="py-6 text-center text-sm text-cacau/50">ainda sem comentários captados nesse período</p>}
        </div>
        <div className={card}>
          <h2 className="mb-2 font-bold">posts e anúncios que mais puxam</h2>
          {d?.by_media?.length ? d.by_media.map((m) => (
            <div key={m.media_id || "x"} className="flex gap-3 border-t border-sand/30 py-2.5 first:border-0">
              {m.thumb ? <img src={m.thumb} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> : <div className="h-12 w-12 shrink-0 rounded-lg bg-sand-light" />}
              <div className="min-w-0">
                <p className="text-sm font-bold">{m.captados} comentários · {m.cliques} cliques {m.source === "anuncio" && <Chip tom="info">anúncio</Chip>}</p>
                <p className="truncate text-sm text-cacau/60">{(m.caption || m.media_id || "").slice(0, 80)}</p>
              </div>
            </div>
          )) : <p className="py-6 text-center text-sm text-cacau/50">aparece aqui quando chegarem comentários</p>}
        </div>
      </div>

      <div className={card + " mt-3"}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">leads</h2>
          <div className="flex flex-wrap gap-2">
            <input className={input + " w-48 py-2"} placeholder="buscar @ ou texto" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className={input + " w-auto py-2"} value={origem} onChange={(e) => setOrigem(e.target.value)} aria-label="filtrar por origem">
              <option value="">toda origem</option><option value="organico">orgânico</option><option value="anuncio">anúncio</option>
            </select>
            <select className={input + " w-auto py-2"} value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} aria-label="filtrar por etiqueta">
              <option value="">toda etiqueta</option>
              {(d?.tags || []).map((x) => <option key={x.tag} value={x.tag}>{x.tag} ({x.n})</option>)}
            </select>
            <button type="button" className={btn} onClick={csv}>exportar csv</button>
          </div>
        </div>
        {leads.length ? leads.map((l) => {
          const [tom, txt] = STATUS[l.status] || ["neutro", l.status];
          return (
            <div key={l.id} className="border-t border-sand/30 py-3 first:border-0">
              <div className="flex flex-wrap items-center gap-2">
                <a className="font-bold underline-offset-2 hover:underline" href={"https://instagram.com/" + l.username} target="_blank" rel="noreferrer">@{l.username}</a>
                <Chip tom={tom}>{txt}</Chip>
                {l.clicks > 0 && <Chip tom="info">clicou{l.clicks > 1 ? ` ${l.clicks}x` : ""}</Chip>}
                <Chip tom={l.source === "anuncio" ? "info" : "neutro"}>{l.source === "anuncio" ? "anúncio" : "orgânico"}</Chip>
                {l.tag && <Chip>{l.tag}</Chip>}
              </div>
              <p className="mt-0.5 text-sm text-cacau/60 [overflow-wrap:anywhere]">“{l.comment_text}” · {fmt(l.created_at)}</p>
              {l.error && <p className="text-sm text-coral-deep">{l.error}</p>}
            </div>
          );
        }) : <p className="py-6 text-center text-sm text-cacau/50">nenhum lead com esses filtros</p>}
      </div>

      <details className={card + " mt-3"}>
        <summary className="cursor-pointer font-bold">atividade do robô (últimos eventos)</summary>
        <div className="mt-2">
          {(d?.logs || []).map((g, i) => (
            <div key={i} className="flex flex-wrap items-start gap-2 border-t border-sand/30 py-2 text-sm first:border-0">
              <Chip>{LOGK[g.kind] || g.kind}</Chip>
              <span className="text-cacau/60 [overflow-wrap:anywhere]">
                {fmt(g.created_at)} · {g.detail?.username ? "@" + g.detail.username + " · " : ""}{g.detail?.texto ? `“${g.detail.texto}” · ` : ""}
                {g.detail?.motivo || g.detail?.erro || g.detail?.dica || ""}
              </span>
            </div>
          ))}
          {!d?.logs?.length && <p className="py-4 text-center text-sm text-cacau/50">nada ainda</p>}
        </div>
      </details>
    </>
  );
}

// ——— aba regras ———

function EditorRegra({ regra, palavrasGerais, onSalvo, onCancelar }) {
  const [r, setR] = useState(regra);
  const [salvando, setSalvando] = useState(false);
  const set = (k, v) => setR({ ...r, [k]: v });
  const salvar = async () => {
    if (!(r.link_url || "").startsWith("http")) return toast("coloque um link começando com https://");
    if ((r.button_text || "").length > 20) return toast("o texto do botão pode ter no máximo 20 caracteres");
    setSalvando(true);
    try { await api("save_rule", r); toast("regra salva"); onSalvo(); } catch (e) { toast(e.message); }
    setSalvando(false);
  };
  return (
    <div>
      <label className={label}>link de destino (landing page)</label>
      <input className={input} value={r.link_url || ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://materiais.criatividadesbiblicas.com.br/..." />
      <p className={hint}>o link fica escondido no botão do direct. o clique é contado e a pessoa chega na página com utm_source=instagram</p>
      <label className={label}>mensagem do direct</label>
      <textarea className={input + " min-h-[120px]"} value={r.dm_message || ""} onChange={(e) => set("dm_message", e.target.value)} />
      <p className={hint}>a linha com <b>{"{link}"}</b> some quando o botão funciona. ela só é usada se a Meta recusar o botão</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>texto do botão <span className="font-normal text-cacau/50">({(r.button_text || "").length}/20)</span></label>
          <input className={input} maxLength={20} value={r.button_text || ""} onChange={(e) => set("button_text", e.target.value)} placeholder="Quero ver agora" />
        </div>
        <div>
          <label className={label}>etiqueta dos leads</label>
          <input className={input} value={r.tag || ""} onChange={(e) => set("tag", e.target.value)} placeholder="ex: black, kids, emoções" />
        </div>
      </div>
      <label className={label}>respostas públicas no comentário (sorteia uma)</label>
      <Tags value={r.public_replies || []} onChange={(v) => set("public_replies", v)} placeholder="ex: Te chamei no direct! 💛" />
      <label className={label}>palavras-chave {regra.media_id ? "desta regra" : "da regra padrão"}</label>
      <Tags value={r.keywords || []} onChange={(v) => set("keywords", v)} placeholder="vazio = usa as palavras gerais" />
      {!r.keywords?.length && <p className={hint}>usando as gerais: {palavrasGerais.join(", ")}</p>}
      <div className="mt-4 flex gap-2">
        <button type="button" className={btnPri} onClick={salvar} disabled={salvando}>{salvando ? "salvando…" : "salvar"}</button>
        {onCancelar && <button type="button" className={btn + " border-transparent"} onClick={onCancelar}>cancelar</button>}
      </div>
    </div>
  );
}

function Regras() {
  const [adm, reload] = useLoad(() => api("admin"), []);
  const [midia, , erroMidia] = useLoad(() => api("media"), []);
  const [editando, setEditando] = useState(null);
  const [kw, setKw] = useState(null);
  const [novoAd, setNovoAd] = useState({ media_id: "", label: "" });

  if (!adm) return <p className="py-10 text-center text-cacau/50">carregando…</p>;
  const s = adm.settings;
  const padrao = adm.rules.find((r) => !r.media_id);
  const proximo = adm.rules.find((r) => r.media_id === "__next__");
  const especificas = adm.rules.filter((r) => r.media_id && r.media_id !== "__next__");
  const porMidia = Object.fromEntries(especificas.map((r) => [r.media_id, r]));
  const kwS = kw || { default_keywords: s.default_keywords, negative_keywords: s.negative_keywords };
  const base = (extra) => ({ dm_message: padrao?.dm_message, link_url: padrao?.link_url, public_replies: padrao?.public_replies, button_text: padrao?.button_text, tag: padrao?.tag, keywords: [], ...extra });
  const personalizar = (m) => { setEditando(base({ name: (m.caption || "post").split("\n")[0].slice(0, 60), media_id: m.id, media_caption: (m.caption || "").slice(0, 300), media_thumb: m.thumbnail_url || m.media_url, media_permalink: m.permalink })); scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Regras</h1>
      <p className="mb-4 text-sm text-cacau/60">o que o robô responde. a regra padrão vale pra todos os posts e anúncios. personalize um post pra mandar outro link</p>

      {editando && (
        <div className={card + " mb-3 border-coral/50"}>
          <div className="mb-1 flex items-center gap-3">
            {editando.media_thumb && <img src={editando.media_thumb} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            <h2 className="font-bold">{editando.media_id === "__next__" ? "regra do próximo post" : "personalizar: " + editando.name}</h2>
          </div>
          <EditorRegra key={editando.id || editando.media_id} regra={editando} palavrasGerais={s.default_keywords} onSalvo={() => { setEditando(null); reload(); }} onCancelar={() => setEditando(null)} />
        </div>
      )}

      <div className={card}>
        <div className="flex items-center justify-between"><h2 className="font-bold">regra padrão · todos os posts e anúncios</h2><Chip tom="ok">ativa</Chip></div>
        {padrao && <EditorRegra key={padrao.id + padrao.updated_at} regra={padrao} palavrasGerais={s.default_keywords} onSalvo={reload} />}
      </div>

      <div className={card + " mt-3"}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold">próximo post publicado</h2>
          {proximo ? <Chip tom="info">aguardando o próximo post</Chip> : null}
        </div>
        <p className="mt-1 text-sm text-cacau/60">
          deixe pronta a regra do próximo reels. quando ele for publicado, o robô aplica automaticamente, sem você precisar entrar aqui
        </p>
        <div className="mt-3 flex gap-2">
          {proximo ? (
            <>
              <button type="button" className={btn} onClick={() => { setEditando(proximo); scrollTo({ top: 0, behavior: "smooth" }); }}>editar</button>
              <button type="button" className={btn + " text-coral-deep"} onClick={async () => { await api("delete_rule", { id: proximo.id }); reload(); toast("regra do próximo post removida"); }}>remover</button>
            </>
          ) : (
            <button type="button" className={btnPri} onClick={() => { setEditando(base({ name: "regra do próximo post", media_id: "__next__" })); scrollTo({ top: 0, behavior: "smooth" }); }}>criar regra do próximo post</button>
          )}
        </div>
      </div>

      <div className={card + " mt-3"}>
        <h2 className="font-bold">palavras de interesse (gerais)</h2>
        <div className="mt-2"><Tags value={kwS.default_keywords} onChange={(v) => setKw({ ...kwS, default_keywords: v })} /></div>
        <p className={hint}>ignora acento, maiúscula, pontuação e letra repetida (“EU QUEROOO!!!” casa com “quero”). comece com <b>=</b> pra exigir o comentário exato (<b>=eu</b> pega só quem escreveu “eu”)</p>
        <label className={label}>ignorar quando tiver</label>
        <Tags value={kwS.negative_keywords} onChange={(v) => setKw({ ...kwS, negative_keywords: v })} />
        {kw && <button type="button" className={btnPri + " mt-3"} onClick={async () => { await api("save_settings", kw); setKw(null); reload(); toast("palavras salvas"); }}>salvar palavras</button>}
      </div>

      <div className={card + " mt-3"}>
        <h2 className="font-bold">anúncios monitorados</h2>
        <p className="mt-1 text-sm text-cacau/60">anúncios criados direto no gerenciador (dark posts) não aparecem no perfil. o robô lê os comentários deles daqui. só leitura: nada é alterado nos anúncios</p>
        <div className="mt-2">
          {(adm.extra_media || []).map((e) => (
            <div key={e.media_id} className="flex items-center justify-between gap-2 border-t border-sand/30 py-2.5 first:border-0">
              <div className="min-w-0"><p className="text-sm font-bold">{e.label}</p><p className="font-mono text-xs text-cacau/50">{e.media_id}</p></div>
              <div className="flex items-center gap-2">
                <Toggle on={e.active} rotulo={"monitorar " + e.label} onClick={async () => { await api("save_extra", { media_id: e.media_id, active: !e.active }); reload(); }} />
                <button type="button" className={btn + " px-2.5 py-1.5 text-xs text-coral-deep"} onClick={async () => { if (confirm("parar de monitorar " + e.label + "?")) { await api("save_extra", { media_id: e.media_id, delete: true }); reload(); } }}>remover</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className={input} placeholder="id da mídia do anúncio" value={novoAd.media_id} onChange={(e) => setNovoAd({ ...novoAd, media_id: e.target.value.trim() })} />
          <input className={input} placeholder="nome (ex: anúncio P1)" value={novoAd.label} onChange={(e) => setNovoAd({ ...novoAd, label: e.target.value })} />
          <button type="button" className={btn} disabled={!/^\d{10,}$/.test(novoAd.media_id)} onClick={async () => { await api("save_extra", novoAd); setNovoAd({ media_id: "", label: "" }); reload(); toast("anúncio adicionado"); }}>adicionar</button>
        </div>
        <p className={hint}>o id da mídia aparece no gerenciador de anúncios → anúncio → “ver publicação”. se preferir, peça pro Claude sincronizar os anúncios novos</p>
      </div>

      {especificas.length > 0 && (
        <div className={card + " mt-3"}>
          <h2 className="font-bold">posts personalizados</h2>
          {especificas.map((r) => (
            <div key={r.id} className="flex gap-3 border-t border-sand/30 py-3 first:border-0">
              {r.media_thumb ? <img src={r.media_thumb} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" /> : <div className="h-12 w-12 shrink-0 rounded-lg bg-sand-light" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{r.name}</p>
                <p className="truncate text-xs text-cacau/55">→ {r.link_url}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Toggle on={r.active} rotulo="ativar regra" onClick={async () => { await api("save_rule", { id: r.id, active: !r.active }); reload(); }} />
                  <button type="button" className={btn + " px-2.5 py-1.5 text-xs"} onClick={() => { setEditando(r); scrollTo({ top: 0, behavior: "smooth" }); }}>editar</button>
                  <button type="button" className={btn + " px-2.5 py-1.5 text-xs text-coral-deep"} onClick={async () => { if (confirm("remover? o post volta pra regra padrão")) { await api("delete_rule", { id: r.id }); reload(); } }}>remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={card + " mt-3"}>
        <h2 className="mb-2 font-bold">seus posts recentes</h2>
        {erroMidia && <p className={hint}>{erroMidia}</p>}
        {!midia && !erroMidia && <p className="py-6 text-center text-sm text-cacau/50">carregando posts…</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(midia?.data || []).map((m) => (
            <div key={m.id} className="flex flex-col overflow-hidden rounded-xl border border-sand/40 bg-white">
              <img src={m.thumbnail_url || m.media_url} alt="" loading="lazy" className="aspect-[4/5] w-full bg-sand-light object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-2.5 text-xs text-cacau/60">
                <p className="line-clamp-2">{m.caption || "(sem legenda)"}</p>
                {porMidia[m.id] ? <Chip tom="info">personalizado</Chip> : <button type="button" className={btn + " px-2 py-1.5 text-xs"} onClick={() => personalizar(m)}>personalizar</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ——— aba testar ———

function Testar() {
  const [texto, setTexto] = useState("Eu quero!!! 😍");
  const [mid, setMid] = useState("");
  const [res, setRes] = useState(null);
  const [midia] = useLoad(() => api("media").catch(() => ({ data: [] })), []);
  const rodar = async () => { try { setRes(await api("test", { text: texto, media_id: mid || null, username: "professora.ana" })); } catch (e) { toast(e.message); } };
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Testar</h1>
      <p className="mb-4 text-sm text-cacau/60">simula um comentário e mostra o que o robô faria. não envia nada</p>
      <div className={card}>
        <label className={label + " mt-0"}>comentário</label>
        <input className={input} value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && rodar()} />
        <label className={label}>em qual post</label>
        <select className={input} value={mid} onChange={(e) => setMid(e.target.value)}>
          <option value="">qualquer post (regra padrão)</option>
          {(midia?.data || []).map((m) => <option key={m.id} value={m.id}>{(m.caption || m.id).slice(0, 70)}</option>)}
        </select>
        <button type="button" className={btnPri + " mt-4"} onClick={rodar}>simular</button>
      </div>
      {res && (
        <div className={card + " mt-3"}>
          {res.match ? (
            <>
              <div className="mb-3 flex flex-wrap gap-2"><Chip tom="ok">responderia</Chip><Chip>regra: {res.regra}</Chip><Chip>palavra: {res.palavra}</Chip></div>
              <p className={label + " mt-0"}>resposta pública no comentário</p>
              <p className="inline-block rounded-xl bg-coral/10 px-3 py-2 text-sm">{res.publica || "(sem resposta pública)"}</p>
              <p className={label}>direct</p>
              <div className="max-w-sm overflow-hidden rounded-[20px] rounded-bl-md bg-sand-light">
                <p className="whitespace-pre-wrap px-4 py-3 text-sm">{res.direct}</p>
                <a href={res.link} target="_blank" rel="noreferrer" className="block border-t border-sand/50 bg-white py-2.5 text-center text-sm font-bold text-cacau">{res.botao}</a>
              </div>
            </>
          ) : <div className="flex flex-wrap items-center gap-2"><Chip tom="alerta">não responderia</Chip><span className="text-sm">{res.motivo}</span></div>}
        </div>
      )}
    </>
  );
}

// ——— aba conexão ———

function Conexao() {
  const [adm, reload] = useLoad(() => api("admin"), []);
  const [token, setToken] = useState("");
  const [segredo, setSegredo] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);
  if (!adm) return <p className="py-10 text-center text-cacau/50">carregando…</p>;
  const s = adm.settings;
  const pausado = s.paused_until && new Date(s.paused_until) > new Date();
  const conectar = async () => {
    setOcupado(true);
    try { const r = await api("connect", { token }); setToken(""); reload(); toast(`conectado como @${r.me.username} ✓`); }
    catch (e) { toast("token não funcionou: " + e.message); }
    setOcupado(false);
  };
  const pausar = async (min) => { await api("pause", { minutes: min }); reload(); toast(min ? `robô pausado por ${min >= 60 ? min / 60 + "h" : min + " min"}` : "robô retomado"); };
  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Conexão</h1>
      <p className="mb-4 text-sm text-cacau/60">ligação com o instagram e controles de segurança</p>
      <div className={card}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold">token do instagram</h2>
          {s.has_token && <Chip tom="ok">@{s.ig_username} conectado</Chip>}
        </div>
        {s.token_updated_at && <p className={hint}>colado em {fmt(s.token_updated_at)}. gere um novo antes de completar 60 dias</p>}
        <label className={label}>{s.has_token ? "trocar token" : "cole o token gerado no app da Meta"}</label>
        <div className="flex gap-2">
          <input type="password" className={input} value={token} onChange={(e) => setToken(e.target.value)} placeholder="EAG… ou IGAA…" />
          <button type="button" className={btnPri} disabled={!token || ocupado} onClick={conectar}>{ocupado ? "conectando…" : "conectar"}</button>
        </div>
        <label className={label}>chave secreta do app {s.has_app_secret && <Chip tom="ok">salva</Chip>}</label>
        <div className="flex gap-2">
          <input type="password" className={input} value={segredo} onChange={(e) => setSegredo(e.target.value)} placeholder="cole aqui" />
          <button type="button" className={btn} disabled={!segredo} onClick={async () => { await api("save_settings", { app_secret: segredo.trim() }); setSegredo(""); reload(); toast("chave salva"); }}>salvar</button>
        </div>
        <label className={label}>url de callback do webhook</label>
        <Copiar valor={adm.webhook_url} />
        <label className={label}>token de verificação</label>
        <Copiar valor={s.verify_token} />
      </div>

      <div className={card + " mt-3"}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold">pausa e limites</h2>
          {pausado ? <Chip tom="ruim">pausado até {fmt(s.paused_until)}</Chip> : <Chip tom="ok">rodando</Chip>}
        </div>
        <p className="mt-1 text-sm text-cacau/60">
          limite de segurança: até {s.max_per_hour} directs por hora, com 3 segundos entre cada um. o que passar espera na fila.
          se a Meta sinalizar limite, o robô pausa sozinho por 30 min
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => pausar(30)}>pausar 30 min</button>
          <button type="button" className={btn} onClick={() => pausar(120)}>pausar 2h</button>
          {pausado && <button type="button" className={btnPri} onClick={() => pausar(0)}>retomar agora</button>}
        </div>
      </div>

      <div className={card + " mt-3"}>
        <h2 className="font-bold">senha do painel</h2>
        <div className="mt-2 flex gap-2">
          <input type="password" className={input} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="nova senha (mínimo 6)" />
          <button type="button" className={btn} disabled={senha.length < 6} onClick={async () => { try { await api("set_pass", { pass: senha }); store.set(senha); setSenha(""); toast("senha trocada"); } catch (e) { toast(e.message); } }}>trocar</button>
        </div>
        <button type="button" className={btn + " mt-3 border-transparent text-cacau/60"} onClick={() => { store.set(""); location.reload(); }}>sair</button>
      </div>
    </>
  );
}

// ——— login e casca ———

function Login({ onOk }) {
  const [p, setP] = useState("");
  const [erro, setErro] = useState(false);
  const entrar = async (e) => {
    e.preventDefault();
    const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", "x-cb-pass": p }, body: JSON.stringify({ action: "login" }) });
    if (r.ok) { store.set(p); onOk(); } else setErro(true);
  };
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={entrar} className={card + " w-full max-w-sm"}>
        <p className="font-display text-xl font-semibold">Respostas · Instagram</p>
        <label className={label}>senha</label>
        <input type="password" autoFocus className={input} value={p} onChange={(e) => { setP(e.target.value); setErro(false); }} />
        {erro && <p className="mt-1 text-sm text-coral-deep">senha incorreta</p>}
        <button className={btnPri + " mt-4 w-full"}>entrar</button>
      </form>
    </main>
  );
}

const ABAS = [["painel", "Painel", "📊", Painel], ["regras", "Regras", "⚙️", Regras], ["testar", "Testar", "🧪", Testar], ["conexao", "Conexão", "🔌", Conexao]];

export default function PainelRespostas() {
  const [pronto, setPronto] = useState(false);
  const [logado, setLogado] = useState(false);
  const [aba, setAba] = useState("painel");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setLogado(!!store.get());
    const h = location.hash.slice(1);
    if (ABAS.some((a) => a[0] === h)) setAba(h);
    setPronto(true);
    avisar = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2800); };
  }, []);
  const ir = (a) => { setAba(a); history.replaceState(null, "", "#" + a); };

  if (!pronto) return null;
  if (!logado) return <Login onOk={() => setLogado(true)} />;
  const Atual = (ABAS.find((a) => a[0] === aba) || ABAS[0])[3];
  return (
    <div className="min-h-screen bg-ivory pb-24 text-cacau md:pb-10">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <p className="font-display text-lg font-semibold">Respostas <span className="text-coral-deep">·</span> Instagram</p>
        <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-sand/40 bg-white px-1 pb-[calc(6px+env(safe-area-inset-bottom))] pt-1.5 md:static md:justify-end md:gap-1 md:border-0 md:bg-transparent md:p-0">
          {ABAS.map(([id, nome, ic]) => (
            <button key={id} type="button" onClick={() => ir(id)}
              className={"flex flex-col items-center rounded-xl px-3 py-1.5 text-xs font-bold md:flex-row md:gap-1.5 md:text-sm " +
                (aba === id ? "bg-coral/10 text-coral-deep md:bg-white md:text-cacau md:shadow-sm" : "text-cacau/55")}>
              <span className="text-lg leading-none md:hidden">{ic}</span>{nome}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4"><Atual key={aba} /></main>
      {msg && <div role="status" className="fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-cacau px-4 py-2.5 text-sm font-bold text-ivory shadow-lg md:bottom-8">{msg}</div>}
    </div>
  );
}
