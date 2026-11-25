"use client";

import "./carteiro.css";
import { useCallback, useEffect, useState } from "react";
import { api, store, fmt, API } from "./api";

const LOGO = "/marca/logo-horizontal.png";
const MASCOTE = "/marca/biblinho-mascote-grande.png";

// ——— utilitários ———

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
const CORES_AVATAR = ["#ffc531", "#90d8e4", "#f0a89c", "#d8e4c0", "#fccc84"];
const sigla = (label = "") => (label.match(/\b([AD-P]\d)\b/) || [])[1] || label.slice(0, 2).toUpperCase();

function Chave({ on, onClick, rotulo }) {
  return <button type="button" className="chave" aria-pressed={!!on} aria-label={rotulo} onClick={onClick} />;
}

function Tags({ value = [], onChange, placeholder, rosa }) {
  const [t, setT] = useState("");
  const add = () => { const v = t.trim(); if (v && !value.includes(v)) onChange([...value, v]); setT(""); };
  return (
    <div className={"tags" + (rosa ? " tags--rosa" : "")}>
      {value.map((k) => (
        <span key={k} className="tag">{k}<button type="button" aria-label={"remover " + k} onClick={() => onChange(value.filter((x) => x !== k))}>✕</button></span>
      ))}
      <input value={t} placeholder={placeholder || "digite e aperte enter"} onChange={(e) => setT(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add} />
    </div>
  );
}

function Copiar({ valor, id }) {
  return (
    <div className="linha-form">
      <input id={id} readOnly className="entrada mono" value={valor || ""} onFocus={(e) => e.target.select()} />
      <button type="button" className="btn btn--mini" onClick={() => navigator.clipboard?.writeText(valor).then(() => toast("copiado"), () => toast("selecione e copie o texto"))}>copiar</button>
    </div>
  );
}

function Titulo({ cor, antes, marca, tom, depois, sub }) {
  return (
    <div className="titulo-tela">
      <div>
        <h1 className={"letreiro" + (cor ? " letreiro--" + cor : "")}>{antes} <span className={"marca" + (tom ? " marca--" + tom : "")}>{marca}</span>{depois ? " " + depois : ""}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

const ICONES = {
  painel: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  regras: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></>,
  testar: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></>,
  conexao: <path d="M9 7V2M15 7V2M6 7h12v4a6 6 0 0 1-12 0zM12 17v5" />,
};
const Icone = ({ id }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONES[id]}</svg>;

// ——— avisos de saúde ———

function Avisos({ health, onRetomar }) {
  if (!health) return null;
  const lista = [];
  const pausa = health.paused_until && new Date(health.paused_until) > new Date();
  if (pausa) lista.push(["ruim", `Carteiro em pausa de proteção até ${fmt(health.paused_until)}. a Meta sinalizou limite de envio.`, true]);
  if (health.falhas_busca_15min >= 3) lista.push(["ruim", "a busca de comentários falhou várias vezes nos últimos 15 minutos. confira o token na aba conexão."]);
  if (health.last_poll_ok && Date.now() - new Date(health.last_poll_ok).getTime() > 5 * 60e3 && !pausa) lista.push(["alerta", `a última busca terminou em ${fmt(health.last_poll_ok)}. o carteiro pode estar parado.`]);
  if (health.token_age_days >= 50) lista.push(["alerta", `a licença do carteiro (token) tem ${health.token_age_days} dias. gere um novo e cole na aba conexão antes dos 60.`]);
  if (health.queue > 0) lista.push(["info", `${health.queue} comentário(s) na fila do carteiro. o limite de segurança segurou um pico, e eles saem nas próximas rodadas.`]);
  return lista.map(([tom, txt, acao], i) => (
    <div key={i} className={"aviso" + (tom !== "alerta" ? " aviso--" + tom : "")} role="status">
      <p>{txt}</p>
      {acao && <button type="button" className="btn btn--mini" onClick={onRetomar}>retomar agora</button>}
    </div>
  ));
}

// ——— aba painel ———

const LOGK = {
  ignorado: "ignorado", duplicado: "repetido", falha_envio: "falha", falha_busca: "falha na busca", assinatura_invalida: "assinatura inválida",
  sem_token: "sem token", pausado: "desligado", webhook_verificado: "webhook verificado", token_renovado: "token renovado",
  token_falha_renovacao: "falha ao renovar token", pausa_automatica: "pausa automática", proximo_post_ligado: "próximo post ligado",
};

function Grafico({ dias }) {
  if (!dias?.length) return <p className="vazio">ainda sem comentários nesse período</p>;
  const W = 560, H = 230, L = 34, R = 8, T = 18, B = 30;
  const topo = Math.max(...dias.map((d) => d.captados));
  const passo = topo <= 5 ? 1 : topo <= 20 ? 5 : topo <= 50 ? 10 : topo <= 100 ? 20 : Math.ceil(topo / 5 / 10) * 10;
  const max = Math.max(passo, Math.ceil(topo / passo) * passo);
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const ticks = []; for (let v = 0; v <= max; v += passo) ticks.push(v);
  const slot = (W - L - R) / dias.length, bw = Math.min(26, slot / 3);
  return (
    <svg className="grafico" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="comentários captados e cliques por dia">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="rgb(29 26 79 / .12)" strokeWidth="1.5" strokeDasharray={v ? "4 5" : "0"} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fontWeight="800" fill="rgb(29 26 79 / .55)">{v}</text>
        </g>
      ))}
      {dias.map((d, i) => {
        const cx = L + slot * i + slot / 2;
        return (
          <g key={d.dia}>
            <rect x={cx - bw - 1} y={y(d.captados)} width={bw} height={y(0) - y(d.captados)} rx="5" fill="#f06060" stroke="#1d1a4f" strokeWidth="2"><title>{`${d.dia}: ${d.captados} captados`}</title></rect>
            <rect x={cx + 1} y={y(d.cliques)} width={bw} height={y(0) - y(d.cliques)} rx="5" fill="#4aa8ee" stroke="#1d1a4f" strokeWidth="2"><title>{`${d.dia}: ${d.cliques} cliques`}</title></rect>
            <text x={cx} y={H - 9} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="rgb(29 26 79 / .6)">{d.dia.slice(8)}/{d.dia.slice(5, 7)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Painel() {
  const [dias, setDias] = useState(7);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [d, reload] = useLoad(() => api("dashboard", { days: dias }), [dias]);
  useEffect(() => { const t = setInterval(reload, 20000); return () => clearInterval(t); }, [reload]);

  const t = d?.totals || {};
  const taxa = t.enviados ? Math.round((t.cliques / t.enviados) * 100) : 0;
  const pctOrg = t.captados ? Math.round(((t.organico || 0) / t.captados) * 100) : 0;
  const maxMedia = Math.max(1, ...(d?.by_media || []).map((m) => m.captados));
  const leads = (d?.leads || []).filter((l) =>
    (filtro === "todos" || (filtro === "clicou" && l.clicks > 0) || (filtro === "anuncio" && l.source === "anuncio")) &&
    (!busca || `${l.username} ${l.comment_text}`.toLowerCase().includes(busca.toLowerCase())));

  const csv = () => {
    const linhas = [["data", "usuario", "comentario", "status", "cliques", "origem", "etiqueta"]].concat(
      leads.map((l) => [l.created_at, "@" + l.username, (l.comment_text || "").replace(/"/g, "'"), l.status, l.clicks, l.source, l.tag || ""]));
    const blob = new Blob(["﻿" + linhas.map((r) => r.map((c) => `"${c ?? ""}"`).join(";")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "leads-instagram.csv"; a.click();
  };

  return (
    <section className="miolo">
      <div className="titulo-tela">
        <div>
          <h1 className="letreiro letreiro--sol">Seu <span className="marca">painel</span></h1>
          <p>quem comentou, recebeu o direct e clicou no botão</p>
        </div>
        <div className="filtros" role="group" aria-label="período">
          {[[1, "hoje"], [7, "7 dias"], [30, "30 dias"]].map(([n, l]) => (
            <button key={n} type="button" className="pilula" aria-pressed={dias === n} onClick={() => setDias(n)}>{l}</button>
          ))}
        </div>
      </div>

      <Avisos health={d?.health} onRetomar={async () => { await api("pause", { minutes: 0 }); reload(); toast("Carteiro voltou pras entregas 📬"); }} />

      <div className="kpis">
        <div className="cartao kpi"><div className="rot">comentários captados</div><div className="num">{t.captados ?? "–"}</div><div className="apoio">{d ? `${t.organico || 0} orgânico · ${t.anuncio || 0} anúncio` : " "}</div></div>
        <div className="cartao kpi"><div className="rot">directs entregues</div><div className="num">{t.enviados ?? "–"}</div><div className="apoio">{t.falhas ? `${t.falhas} com falha` : "nenhuma falha"}</div></div>
        <div className="cartao kpi"><div className="rot">clicaram no botão</div><div className="num">{t.cliques ?? "–"}</div><div className="apoio">foram pra página de destino</div></div>
        <div className="cartao kpi kpi--destaque"><div className="rot">taxa de clique</div><div className="num">{d ? taxa + "%" : "–"}</div><div className="apoio">de quem recebeu o direct</div></div>
      </div>

      <div className="duas">
        <div className="cartao">
          <div className="cab"><h2>Por dia</h2><div className="legenda"><span><i style={{ background: "var(--coral)" }} />captados</span><span><i style={{ background: "var(--ceu)" }} />cliques</span></div></div>
          {d ? <Grafico dias={d.by_day} /> : <p className="vazio">carregando…</p>}
        </div>
        <div className="cartao">
          <h2>De onde vêm</h2>
          <p className="sub">posts orgânicos × anúncios (só leitura dos anúncios)</p>
          {t.captados ? (
            <div className="barra-origem">
              {pctOrg > 0 && <span style={{ width: pctOrg + "%", background: "var(--sol)" }}>orgânico {pctOrg}%</span>}
              {pctOrg < 100 && <span style={{ width: 100 - pctOrg + "%", background: "var(--agua)", borderLeft: pctOrg ? "2px solid var(--marinho)" : 0 }}>anúncio {100 - pctOrg}%</span>}
            </div>
          ) : null}
          <div className="lista" style={{ marginTop: 12 }}>
            {(d?.by_media || []).slice(0, 5).map((m) => (
              <div key={m.media_id || "x"} className="linha-item">
                {m.thumb ? <img className="capa" src={m.thumb} alt="" /> : <span className="capa capa--ad">{m.source === "anuncio" ? sigla(m.caption) : "IG"}</span>}
                <div className="txt">
                  <div className="t">{(m.caption || "post").split("\n")[0].slice(0, 60)}</div>
                  <div className="c">{m.captados} comentários · {m.cliques} cliques</div>
                  <div className="barrinha"><i style={{ width: (m.captados / maxMedia) * 100 + "%" }} /></div>
                </div>
              </div>
            ))}
            {d && !d.by_media?.length && <p className="vazio">aparece aqui quando chegarem comentários</p>}
          </div>
        </div>
      </div>

      <div className="cartao">
        <div className="cab">
          <h2>Quem pediu o link</h2>
          <div className="filtros">
            {[["todos", "todos"], ["clicou", "clicaram"], ["anuncio", "vieram de anúncio"]].map(([k, l]) => (
              <button key={k} type="button" className="pilula" aria-pressed={filtro === k} onClick={() => setFiltro(k)}>{l}</button>
            ))}
            <button type="button" className="btn btn--mini" onClick={csv}>exportar planilha</button>
          </div>
        </div>
        <input id="busca-leads" className="entrada" style={{ marginTop: 12 }} placeholder="buscar @ ou comentário" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="lista" style={{ marginTop: 6 }}>
          {leads.map((l, i) => (
            <div key={l.id} className="lead">
              <span className="avatar" style={{ background: CORES_AVATAR[i % CORES_AVATAR.length] }}>{(l.username || "?")[0].toUpperCase()}</span>
              <div style={{ minWidth: 0 }}>
                <div className="topo-lead">
                  <a className="arroba" href={"https://instagram.com/" + l.username} target="_blank" rel="noreferrer">@{l.username}</a>
                  {l.status === "enviado" ? <span className="chip chip--ok">entregue 📬</span> : l.status === "falhou" ? <span className="chip chip--ruim">não entregue</span> : <span className="chip chip--alerta">na fila do carteiro</span>}
                  {l.clicks > 0 && <span className="chip chip--info">clicou{l.clicks > 1 ? ` ${l.clicks}x` : ""}</span>}
                  {l.source === "anuncio" ? <span className="chip chip--sol">anúncio</span> : <span className="chip">orgânico</span>}
                  {l.tag && <span className="chip">{l.tag}</span>}
                </div>
                <p className="com"><q>{l.comment_text}</q> · {fmt(l.created_at)}</p>
                {l.error && <p className="erro">{l.error}</p>}
              </div>
            </div>
          ))}
          {d && !leads.length && <p className="vazio">ninguém nesse filtro ainda</p>}
        </div>
      </div>

      <details className="cartao">
        <summary>O que o carteiro fez por último</summary>
        <div className="lista" style={{ marginTop: 8 }}>
          {(d?.logs || []).map((g, i) => (
            <div key={i} className="linha-item" style={{ alignItems: "flex-start" }}>
              <span className="chip">{LOGK[g.kind] || g.kind}</span>
              <div className="txt c">{fmt(g.created_at)} · {g.detail?.username ? "@" + g.detail.username + " · " : ""}{g.detail?.texto ? `“${g.detail.texto}” · ` : ""}{g.detail?.motivo || g.detail?.erro || g.detail?.dica || ""}</div>
            </div>
          ))}
          {d && !d.logs?.length && <p className="vazio">nada ainda</p>}
        </div>
      </details>
    </section>
  );
}

// ——— aba respostas ———

function EditorRegra({ regra, palavrasGerais, onSalvo, onCancelar }) {
  const [r, setR] = useState(regra);
  const [salvando, setSalvando] = useState(false);
  const set = (k, v) => setR({ ...r, [k]: v });
  const id = (k) => `${k}-${regra.id || regra.media_id || "nova"}`;
  const salvar = async () => {
    if (!(r.link_url || "").startsWith("http")) return toast("coloque um link começando com https://");
    setSalvando(true);
    try { await api("save_rule", r); toast("resposta salva"); onSalvo(); } catch (e) { toast(e.message); }
    setSalvando(false);
  };
  return (
    <>
      <div className="grade-campos">
        <div className="campo"><label htmlFor={id("link")}>Página de destino</label>
          <input id={id("link")} className="entrada" value={r.link_url || ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://materiais.criatividadesbiblicas.com.br/..." />
          <span className="dica">o link vai escondido no botão. a gente conta quem clicou.</span></div>
        <div className="campo"><label htmlFor={id("msg")}>Mensagem do direct</label>
          <textarea id={id("msg")} className="entrada" value={r.dm_message || ""} onChange={(e) => set("dm_message", e.target.value)} />
          <span className="dica">a linha com <b>{"{link}"}</b> só aparece se a Meta recusar o botão.</span></div>
      </div>
      <div className="grade-campos duas-col">
        <div className="campo"><label htmlFor={id("btn")}>Texto do botão <span style={{ color: "var(--tinta-50)" }}>{(r.button_text || "").length}/20</span></label>
          <input id={id("btn")} className="entrada" maxLength={20} value={r.button_text || ""} onChange={(e) => set("button_text", e.target.value)} placeholder="Quero ver agora" /></div>
        <div className="campo"><label htmlFor={id("tag")}>Etiqueta dos leads</label>
          <input id={id("tag")} className="entrada" value={r.tag || ""} onChange={(e) => set("tag", e.target.value)} placeholder="ex: black, kids, emoções" /></div>
      </div>
      <div className="grade-campos">
        <div className="campo"><span className="rotulo">Resposta no comentário <span style={{ fontWeight: 600, color: "var(--tinta-65)" }}>(sorteia uma)</span></span>
          <Tags value={r.public_replies || []} onChange={(v) => set("public_replies", v)} placeholder="ex: Te chamei no direct! 💛" /></div>
        <div className="campo"><span className="rotulo">Palavras de interesse {regra.media_id ? "desta resposta" : ""}</span>
          <Tags value={r.keywords || []} onChange={(v) => set("keywords", v)} placeholder="vazio = usa as palavras gerais" />
          {!r.keywords?.length && <span className="dica">usando as gerais: {palavrasGerais.join(", ")}</span>}</div>
      </div>
      <div className="filtros" style={{ marginTop: 16 }}>
        <button type="button" className="btn btn--sol" onClick={salvar} disabled={salvando}>{salvando ? "salvando…" : "Salvar resposta"}</button>
        {onCancelar && <button type="button" className="btn" onClick={onCancelar}>Cancelar</button>}
      </div>
    </>
  );
}

function Regras() {
  const [adm, reload] = useLoad(() => api("admin"), []);
  const [midia, , erroMidia] = useLoad(() => api("media"), []);
  const [editando, setEditando] = useState(null);
  const [kw, setKw] = useState(null);
  const [novoAd, setNovoAd] = useState({ media_id: "", label: "" });
  if (!adm) return <section className="miolo"><p className="vazio">carregando…</p></section>;

  const s = adm.settings;
  const padrao = adm.rules.find((r) => !r.media_id);
  const proximo = adm.rules.find((r) => r.media_id === "__next__");
  const especificas = adm.rules.filter((r) => r.media_id && r.media_id !== "__next__");
  const porMidia = Object.fromEntries(especificas.map((r) => [r.media_id, r]));
  const kwS = kw || { default_keywords: s.default_keywords, negative_keywords: s.negative_keywords };
  const base = (extra) => ({ dm_message: padrao?.dm_message, link_url: padrao?.link_url, public_replies: padrao?.public_replies, button_text: padrao?.button_text, tag: padrao?.tag, keywords: [], ...extra });
  const subir = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="miolo">
      <Titulo cor="ceu" antes="O que o" marca="Carteiro" tom="agua" depois="entrega" sub="vale pra todos os posts e anúncios. personalize um post quando ele levar pra outra página." />

      {editando && (
        <div className="cartao" style={{ borderColor: "var(--coral)" }}>
          <div className="cab"><h2>{editando.media_id === "__next__" ? "Resposta do próximo post" : "Personalizar: " + (editando.name || "post")}</h2>
            {editando.media_thumb && <img className="capa" src={editando.media_thumb} alt="" />}</div>
          <EditorRegra key={editando.id || editando.media_id} regra={editando} palavrasGerais={s.default_keywords} onSalvo={() => { setEditando(null); reload(); }} onCancelar={() => setEditando(null)} />
        </div>
      )}

      <div className="regras-grade">
        <div className="coluna">
          <div className="cartao">
            <div className="cab"><h2>Resposta padrão</h2><span className="chip chip--ok">● ativa</span></div>
            {padrao && <EditorRegra key={padrao.id + padrao.updated_at} regra={padrao} palavrasGerais={s.default_keywords} onSalvo={reload} />}
          </div>
          <div className="cartao">
            <h2>Palavras de interesse</h2>
            <p className="sub">entende “EU QUEROOO!!!”, sem acento e com letra repetida. comece com <b>=</b> pra exigir o comentário exato (<b>=eu</b>).</p>
            <div style={{ marginTop: 12 }}><Tags value={kwS.default_keywords} onChange={(v) => setKw({ ...kwS, default_keywords: v })} /></div>
            <p className="rotulo" style={{ margin: "14px 0 6px" }}>Ignorar quando tiver</p>
            <Tags rosa value={kwS.negative_keywords} onChange={(v) => setKw({ ...kwS, negative_keywords: v })} />
            {kw && <button type="button" className="btn btn--sol" style={{ marginTop: 14 }} onClick={async () => { await api("save_settings", kw); setKw(null); reload(); toast("palavras salvas"); }}>Salvar palavras</button>}
          </div>
        </div>

        <div className="coluna">
          <div className="cartao cartao--ceu">
            <div className="cab"><h2>Próximo post</h2>{proximo && <span className="chip chip--sol">aguardando publicação</span>}</div>
            <p className="sub">o próximo reels já sai com esta resposta. você não precisa voltar aqui depois de postar.</p>
            <div className="filtros" style={{ marginTop: 12 }}>
              {proximo ? (
                <>
                  <button type="button" className="btn btn--mini" onClick={() => { setEditando(proximo); subir(); }}>Editar</button>
                  <button type="button" className="btn btn--mini btn--perigo" onClick={async () => { await api("delete_rule", { id: proximo.id }); reload(); toast("resposta do próximo post removida"); }}>Remover</button>
                </>
              ) : (
                <button type="button" className="btn btn--sol btn--mini" onClick={() => { setEditando(base({ name: "resposta do próximo post", media_id: "__next__" })); subir(); }}>Preparar resposta</button>
              )}
            </div>
          </div>

          <div className="cartao">
            <h2>Anúncios monitorados</h2>
            <p className="sub">o carteiro só lê os comentários. nada é alterado nos anúncios.</p>
            <div className="lista" style={{ marginTop: 8 }}>
              {(adm.extra_media || []).map((e) => (
                <div key={e.media_id} className="linha-item">
                  <span className="capa capa--ad" style={{ width: 40, height: 40, borderRadius: 12 }}>{sigla(e.label)}</span>
                  <div className="txt"><div className="t">{e.label}</div><div className="c mono">{e.media_id}</div></div>
                  <Chave on={e.active} rotulo={"ler comentários de " + e.label} onClick={async () => { await api("save_extra", { media_id: e.media_id, active: !e.active }); reload(); }} />
                </div>
              ))}
            </div>
            <div className="grade-campos duas-col">
              <input id="novo-ad-id" className="entrada" placeholder="id da mídia do anúncio" value={novoAd.media_id} onChange={(e) => setNovoAd({ ...novoAd, media_id: e.target.value.trim() })} />
              <input id="novo-ad-nome" className="entrada" placeholder="nome (ex: anúncio P1)" value={novoAd.label} onChange={(e) => setNovoAd({ ...novoAd, label: e.target.value })} />
            </div>
            <button type="button" className="btn btn--mini" style={{ marginTop: 10 }} disabled={!/^\d{10,}$/.test(novoAd.media_id)} onClick={async () => { await api("save_extra", novoAd); setNovoAd({ media_id: "", label: "" }); reload(); toast("anúncio adicionado"); }}>+ Adicionar anúncio</button>
            <p className="dica" style={{ marginTop: 8 }}>pode pedir pro Claude sincronizar os anúncios novos, como o conjunto P.</p>
          </div>

          {especificas.length > 0 && (
            <div className="cartao">
              <h2>Posts com resposta própria</h2>
              <div className="lista" style={{ marginTop: 8 }}>
                {especificas.map((r) => (
                  <div key={r.id} className="linha-item">
                    {r.media_thumb ? <img className="capa" src={r.media_thumb} alt="" /> : <span className="capa capa--ad">IG</span>}
                    <div className="txt"><div className="t">{r.name}</div><div className="c">→ {(r.link_url || "").replace(/^https?:\/\//, "")}{r.tag ? ` · etiqueta ${r.tag}` : ""}</div>
                      <div className="filtros" style={{ marginTop: 6 }}>
                        <button type="button" className="btn btn--mini" onClick={() => { setEditando(r); subir(); }}>Editar</button>
                        <button type="button" className="btn btn--mini btn--perigo" onClick={async () => { await api("delete_rule", { id: r.id }); reload(); toast("o post voltou pra resposta padrão"); }}>Remover</button>
                      </div>
                    </div>
                    <Chave on={r.active} rotulo={"ativar resposta de " + r.name} onClick={async () => { await api("save_rule", { id: r.id, active: !r.active }); reload(); }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cartao">
        <h2>Seus posts recentes</h2>
        <p className="sub">toque em personalizar quando um post precisar levar pra outra página.</p>
        {erroMidia && <p className="dica">{erroMidia}</p>}
        {!midia && !erroMidia && <p className="vazio">carregando posts…</p>}
        <div className="posts">
          {(midia?.data || []).map((m) => (
            <div key={m.id} className="post">
              <img src={m.thumbnail_url || m.media_url} alt="" loading="lazy" />
              <div className="b">
                <span className="cap">{m.caption || "(sem legenda)"}</span>
                {porMidia[m.id] ? <span className="chip chip--info">personalizado</span> :
                  <button type="button" className="btn btn--mini" onClick={() => { setEditando(base({ name: (m.caption || "post").split("\n")[0].slice(0, 60), media_id: m.id, media_caption: (m.caption || "").slice(0, 300), media_thumb: m.thumbnail_url || m.media_url, media_permalink: m.permalink })); subir(); }}>Personalizar</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— aba testar ———

function Testar() {
  const [texto, setTexto] = useState("EU QUEROOO 😍");
  const [res, setRes] = useState(null);
  const rodar = useCallback(async (t) => { try { setRes(await api("test", { text: t, username: "professora.ana" })); } catch (e) { toast(e.message); } }, []);
  useEffect(() => { const h = setTimeout(() => rodar(texto), 350); return () => clearTimeout(h); }, [texto, rodar]);
  return (
    <section className="miolo">
      <Titulo cor="coral" antes="Testa" marca="aqui" tom="rosa" sub="escreve um comentário como se fosse uma professora. nada é enviado de verdade." />
      <div className="duas">
        <div className="cartao">
          <div className="campo"><label htmlFor="t-com">Comentário</label><input id="t-com" className="entrada" value={texto} onChange={(e) => setTexto(e.target.value)} /></div>
          <div className="filtros" style={{ marginTop: 10 }}>
            {["tenho interesse!!", "qual o valor?", "que lindo 😍", "não quero"].map((x) => <button key={x} type="button" className="pilula" onClick={() => setTexto(x)}>{x}</button>)}
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            {res?.match ? (
              <>
                <span className="chip chip--ok" style={{ justifySelf: "start" }}>entregaria · palavra “{(res.palavra || "").replace("=", "")}”</span>
                <div className="passo"><span className="n">1</span><p>responde no comentário: “{res.publica}”</p></div>
                <div className="passo"><span className="n">2</span><p>o carteiro entrega o direct com o botão “{res.botao}”</p></div>
                <div className="passo"><span className="n">3</span><p>marca o lead e conta o clique</p></div>
              </>
            ) : res ? (
              <>
                <span className="chip chip--alerta" style={{ justifySelf: "start" }}>não entregaria</span>
                <div className="passo"><span className="n">!</span><p>{res.motivo}</p></div>
              </>
            ) : <p className="vazio">testando…</p>}
          </div>
        </div>
        <div className="celular" aria-label="prévia no instagram">
          <div className="tela-cel">
            <div>
              <div className="cel-topo"><span className="av"><img src={MASCOTE} alt="" /></span><div><b>criatividadesbiblicas</b><span>direct</span></div></div>
              <div className="cel-coment"><div><b>professora.ana</b> {texto || "…"}</div>{res?.match && <div className="r"><b>criatividadesbiblicas</b> {res.publica}</div>}</div>
            </div>
            <div className="cel-msgs">
              {res?.match ? (
                <>
                  <div className="aviso-ig">criatividadesbiblicas enviou uma mensagem sobre um comentário seu</div>
                  <div className="bolha">{res.direct}</div>
                  <a className="bolha-botao" href={res.link} target="_blank" rel="noreferrer">{res.botao}</a>
                </>
              ) : <div className="aviso-ig">nenhuma mensagem enviada</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— aba conexão ———

function Conexao() {
  const [adm, reload] = useLoad(() => api("admin"), []);
  const [d] = useLoad(() => api("dashboard", { days: 1 }), []);
  const [token, setToken] = useState("");
  const [segredo, setSegredo] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);
  if (!adm) return <section className="miolo"><p className="vazio">carregando…</p></section>;
  const s = adm.settings, h = d?.health;
  const pausado = s.paused_until && new Date(s.paused_until) > new Date();
  const idade = s.token_updated_at ? Math.floor((Date.now() - new Date(s.token_updated_at).getTime()) / 864e5) : null;
  const buscaOk = h?.last_poll_ok && Date.now() - new Date(h.last_poll_ok).getTime() < 5 * 60e3;
  const usados = h?.enviados_ultima_hora ?? 0;
  const conectar = async () => {
    setOcupado(true);
    try { const r = await api("connect", { token }); setToken(""); reload(); toast(`conectado como @${r.me.username} ✓`); }
    catch (e) { toast("o token não funcionou: " + e.message); }
    setOcupado(false);
  };
  const pausar = async (min) => { await api("pause", { minutes: min }); reload(); toast(min ? `carteiro em pausa por ${min >= 60 ? min / 60 + "h" : min + " min"}` : "Carteiro voltou pras entregas 📬"); };

  return (
    <section className="miolo">
      <Titulo antes="Tudo" marca="ligado?" tom="menta" sub="saúde do carteiro e controles de segurança" />
      <div className="duas">
        <div className="cartao">
          <h2>Saúde do carteiro</h2>
          <div className="checklist">
            <div className="check"><span className={"ic" + (s.has_token ? "" : " ic--ruim")}>{s.has_token ? "✓" : "!"}</span><div><b>Instagram conectado</b><span>{s.has_token ? `@${s.ig_username} · token colado em ${fmt(s.token_updated_at)}` : "cole o token abaixo"}</span></div><span className={"chip " + (s.has_token ? "chip--ok" : "chip--ruim")}>{s.has_token ? "ok" : "falta"}</span></div>
            <div className="check"><span className={"ic" + (buscaOk ? "" : " ic--alerta")}>{buscaOk ? "✓" : "!"}</span><div><b>Busca de comentários</b><span>{h?.last_poll_ok ? `última rodada em ${fmt(h.last_poll_ok)} · posts + ${(adm.extra_media || []).filter((e) => e.active).length} anúncios` : "ainda sem rodada registrada"}</span></div><span className={"chip " + (buscaOk ? "chip--ok" : "chip--alerta")}>{buscaOk ? "ok" : "verificar"}</span></div>
            <div className="check"><span className={"ic" + (pausado ? " ic--alerta" : "")}>{pausado ? "❚❚" : "✓"}</span><div><b>Entregas</b><span>{pausado ? `em pausa até ${fmt(s.paused_until)}` : s.enabled ? "carteiro ligado e entregando" : "carteiro desligado"}</span></div><span className={"chip " + (pausado || !s.enabled ? "chip--alerta" : "chip--ok")}>{pausado ? "pausa" : s.enabled ? "ok" : "desligado"}</span></div>
            {idade !== null && <div className="check"><span className={"ic" + (idade >= 50 ? " ic--alerta" : "")}>{idade >= 50 ? "!" : "✓"}</span><div><b>Validade do token</b><span>colado há {idade} dia(s). gere um novo antes de completar 60</span></div><span className={"chip " + (idade >= 50 ? "chip--alerta" : "chip--ok")}>{60 - idade} dias</span></div>}
          </div>
        </div>
        <div className="cartao cartao--ceu">
          <h2>Limite de segurança</h2>
          <p className="sub">protege a conta de bloqueio quando um reels viraliza</p>
          <div className="cab" style={{ marginTop: 14, fontWeight: 800 }}><span>entregas na última hora</span><span style={{ fontFamily: "var(--f-letreiro)" }}>{usados} / {s.max_per_hour}</span></div>
          <div className="medidor"><i style={{ width: Math.min(100, (usados / s.max_per_hour) * 100) + "%" }} /></div>
          <p className="sub" style={{ marginTop: 12 }}>3 segundos entre cada entrega. se a Meta sinalizar limite, o carteiro pausa sozinho por 30 minutos.</p>
          <div className="filtros" style={{ marginTop: 16 }}>
            <button type="button" className="btn" onClick={() => pausar(30)}>Pausar 30 min</button>
            <button type="button" className="btn" onClick={() => pausar(120)}>Pausar 2h</button>
            {pausado && <button type="button" className="btn btn--sol" onClick={() => pausar(0)}>Retomar agora</button>}
          </div>
        </div>
      </div>

      <div className="cartao">
        <h2>Conexão com o Instagram</h2>
        <div className="grade-campos">
          <div className="campo"><label htmlFor="c-token">{s.has_token ? "Trocar token" : "Token do app da Meta"}</label>
            <div className="linha-form"><input id="c-token" type="password" className="entrada" value={token} onChange={(e) => setToken(e.target.value)} placeholder="EAG… ou IGAA…" />
              <button type="button" className="btn btn--sol" disabled={!token || ocupado} onClick={conectar}>{ocupado ? "conectando…" : "Conectar"}</button></div></div>
          <div className="campo"><label htmlFor="c-segredo">Chave secreta do app {s.has_app_secret && <span className="chip chip--ok">salva</span>}</label>
            <div className="linha-form"><input id="c-segredo" type="password" className="entrada" value={segredo} onChange={(e) => setSegredo(e.target.value)} placeholder="cole aqui" />
              <button type="button" className="btn" disabled={!segredo} onClick={async () => { await api("save_settings", { app_secret: segredo.trim() }); setSegredo(""); reload(); toast("chave salva"); }}>Salvar</button></div></div>
          <div className="campo"><label htmlFor="c-webhook">Endereço do webhook</label><Copiar id="c-webhook" valor={adm.webhook_url} /></div>
          <div className="campo"><label htmlFor="c-verifica">Token de verificação</label><Copiar id="c-verifica" valor={s.verify_token} /></div>
        </div>
      </div>

      <div className="cartao">
        <div className="vazio-mascote"><img src={MASCOTE} alt="" /><p>Quando chegar a hora de renovar a minha licença de carteiro (o token), eu aviso no topo do painel com uma faixa amarela. Você só cola o novo e eu volto pras entregas.</p></div>
      </div>

      <div className="cartao">
        <h2>Senha do painel</h2>
        <div className="linha-form" style={{ marginTop: 12 }}>
          <input id="c-senha" type="password" className="entrada" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="nova senha (mínimo 6)" />
          <button type="button" className="btn" disabled={senha.length < 6} onClick={async () => { try { await api("set_pass", { pass: senha }); store.set(senha); setSenha(""); toast("senha trocada"); } catch (e) { toast(e.message); } }}>Trocar</button>
        </div>
        <button type="button" className="btn btn--mini" style={{ marginTop: 12 }} onClick={() => { store.set(""); location.reload(); }}>Sair</button>
      </div>
    </section>
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
    <main className="login">
      <form onSubmit={entrar} className="cartao">
        <img className="logo" src={LOGO} alt="Criatividades Bíblicas" />
        <span className="chip chip--sol nome">📬 Biblinho Carteiro</span>
        <div className="campo"><label htmlFor="l-senha">Senha</label>
          <input id="l-senha" type="password" autoFocus className="entrada" value={p} onChange={(e) => { setP(e.target.value); setErro(false); }} /></div>
        {erro && <p className="dica" style={{ color: "var(--ruim)", margin: 0 }}>senha incorreta</p>}
        <button className="btn btn--sol">Entrar</button>
      </form>
    </main>
  );
}

const ABAS = [["painel", "Painel", Painel], ["regras", "Respostas", Regras], ["testar", "Testar", Testar], ["conexao", "Conexão", Conexao]];

function ChaveRobo({ curta }) {
  const [adm, reload] = useLoad(() => api("admin"), []);
  const on = adm?.settings?.enabled;
  const alternar = async () => { await api("save_settings", { enabled: !on }); reload(); toast(on ? "Carteiro em pausa" : "Carteiro voltou pras entregas 📬"); };
  return (
    <div className="robo" data-on={String(on !== false)}>
      <span className="ponto" />
      <span>{adm ? (on ? (curta ? "ligado" : "carteiro ligado") : (curta ? "desligado" : "carteiro desligado")) : "…"}</span>
      <Chave on={on !== false} rotulo="ligar ou desligar o carteiro" onClick={alternar} />
    </div>
  );
}

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
    let t;
    avisar = (m) => { setMsg(m); clearTimeout(t); t = setTimeout(() => setMsg(null), 2600); };
  }, []);
  const ir = (a) => { setAba(a); history.replaceState(null, "", "#" + a); window.scrollTo(0, 0); };

  if (!pronto) return null;
  if (!logado) return <Login onOk={() => setLogado(true)} />;
  const Atual = (ABAS.find((a) => a[0] === aba) || ABAS[0])[2];

  return (
    <div className="app">
      <aside className="lateral" aria-label="menu">
        <span className="chip chip--sol nome" style={{ fontSize: 13 }}>📬 Biblinho Carteiro</span>
        <img className="logo" src={LOGO} alt="Criatividades Bíblicas" />
        <nav className="nav">
          {ABAS.map(([id, nome]) => (
            <button key={id} type="button" aria-current={aba === id ? "page" : undefined} onClick={() => ir(id)}><Icone id={id} />{nome}</button>
          ))}
        </nav>
        <div className="lateral-pe">
          <ChaveRobo />
          <div className="mascote-pe"><img src={MASCOTE} alt="" /><p>entrego o link no direct de quem comenta <b>eu quero</b>, em até 1 minuto 📬</p></div>
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <header className="topo">
          <img className="logo" src={LOGO} alt="Criatividades Bíblicas" />
          <ChaveRobo curta />
        </header>
        <main className="conteudo"><Atual key={aba} /></main>
      </div>
      <nav className="abas" aria-label="abas">
        {ABAS.map(([id, nome]) => (
          <button key={id} type="button" aria-current={aba === id ? "page" : undefined} onClick={() => ir(id)}><Icone id={id} />{nome}</button>
        ))}
      </nav>
      {msg && <div className="toast" role="status">{msg}</div>}
    </div>
  );
}
