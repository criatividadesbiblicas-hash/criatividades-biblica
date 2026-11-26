// Mesa de Postagens: acesso do servidor ao banco (Supabase REST, chave de servidor). Nunca importar em cliente.
import { criarPedido } from "./caderno";
import { faltaPraAgendar, textoRecado, diaLegivel, listaRedes, HORA_OK, DIA_OK, REDES } from "./mesa-regras";

const base = () => process.env.SUPABASE_URL;
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const cab = (extra = {}) => ({ apikey: chave(), Authorization: `Bearer ${chave()}`, "Content-Type": "application/json", ...extra });

async function rest(caminho, { method = "GET", body, prefer, fetchFn = fetch } = {}) {
  const r = await fetchFn(`${base()}/rest/v1/${caminho}`, {
    method, headers: cab(prefer ? { Prefer: prefer } : {}), cache: "no-store",
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000),
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`banco ${r.status}`);
  return t ? JSON.parse(t) : null;
}

const UUID = /^[0-9a-f-]{36}$/i;
const PC_LIGADO_MS = 3 * 60 * 1000;
const hojeBR = (agora = new Date()) => new Date(agora.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
const somaDias = (iso, n) => new Date(new Date(`${iso}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10);

export async function estadoMesa({ fetchFn = fetch, agora = new Date() } = {}) {
  if (!base() || !chave()) return { erro: "A Mesa ainda não está ligada ao banco." };
  const hoje = hojeBR(agora);
  const de = `${somaDias(hoje, -10)}T00:00:00-03:00`, ate = `${somaDias(hoje, 60)}T23:59:59-03:00`;
  const o = { fetchFn };
  const [posts, ideias, pedidos, painel, agenda, vigia] = await Promise.all([
    rest("mesa_posts?situacao=neq.arquivado&select=*&order=dia.asc.nullslast,criado_em.asc&limit=200", o),
    rest("mesa_ideias?situacao=neq.usada&select=*&order=data.asc.nullslast,criado_em.asc&limit=200", o),
    rest("mesa_pedidos?select=id,tipo,texto,dados,situacao,resposta,criado_em,atualizado_em,post_id&order=criado_em.desc&limit=25", o),
    rest("mesa_painel?id=eq.instagram&select=dados,atualizado_em", o),
    rest(`central_itens?tipo=eq.post&prazo=gte.${encodeURIComponent(de)}&prazo=lte.${encodeURIComponent(ate)}&situacao=not.in.(arquivado,ignorado)&select=id,titulo,contexto,prazo,situacao&order=prazo.asc&limit=300`, o),
    rest("central_vigia?select=visto_em&id=eq.pc", o).catch(() => []),
  ]);
  const visto = vigia?.[0]?.visto_em ? new Date(vigia[0].visto_em).getTime() : null;
  return { hoje, posts, ideias, pedidos, painel: painel[0] || null, agenda, pcLigado: visto !== null && agora.getTime() - visto < PC_LIGADO_MS };
}

async function lerPost(id, o) {
  if (!UUID.test(id || "")) return null;
  const l = await rest(`mesa_posts?id=eq.${id}&select=*`, o);
  return l[0] || null;
}
const mudarPost = (id, campos, o) => rest(`mesa_posts?id=eq.${id}`, { ...o, method: "PATCH", body: campos, prefer: "return=minimal" });

// Grava o pedido e manda pro Claude do PC como recado (o vigia entrega).
async function pedirAoClaude({ tipo, post, texto, dados = {} }, o) {
  const [p] = await rest("mesa_pedidos", { ...o, method: "POST", prefer: "return=representation", body: [{ tipo, post_id: post?.id || null, texto: texto || null, dados }] });
  if (process.env.MESA_SEM_RECADO !== "1") {
    const ok = await criarPedido("recado", textoRecado(p, post), { fetchFn: o.fetchFn });
    if (!ok) {
      await rest(`mesa_pedidos?id=eq.${p.id}`, { ...o, method: "PATCH", body: { situacao: "erro", resposta: "Não consegui avisar o computador. Tente de novo." }, prefer: "return=minimal" });
      throw new Error("Não consegui mandar o pedido pro computador agora. Tente de novo.");
    }
  }
  return p;
}

const limpo = (t, max = 3000) => String(t || "").trim().slice(0, max);
const erro = (mensagem) => ({ erro: mensagem });

export async function acaoMesa(corpo, { fetchFn = fetch } = {}) {
  if (!base() || !chave()) return erro("A Mesa ainda não está ligada ao banco.");
  const o = { fetchFn };
  const { acao } = corpo || {};
  const texto = limpo(corpo?.texto);

  if (acao === "card_ok") {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    const cards = (post.cards || []).map((c) => (c.n === Number(corpo.n) ? { ...c, ok: !!corpo.ok } : c));
    await mudarPost(post.id, { cards }, o);
    return { ok: true };
  }
  if (acao === "legenda_ok") {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    await mudarPost(post.id, { legenda_ok: !!corpo.ok }, o);
    return { ok: true };
  }
  if (acao === "capa") {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    if (!(post.capas || []).some((c) => c.letra === corpo.letra)) return erro("Essa capa não existe.");
    await mudarPost(post.id, { capa: corpo.letra }, o);
    return { ok: true };
  }
  if (["ajuste_card", "ajuste_post", "ajuste_legenda", "ajuste_pronto"].includes(acao)) {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    if (!texto) return erro("Escreva ou fale o que mudar.");
    const dados = {};
    if (acao === "ajuste_card") dados.card = Number(corpo.n);
    if (acao === "ajuste_post") dados.tipo = corpo.tipo === "todos" ? "todos" : "sentido";
    if (acao === "ajuste_legenda") dados.rede = REDES.includes(corpo.rede) ? corpo.rede : "ig";
    const p = await pedirAoClaude({ tipo: acao, post, texto, dados }, o);
    const ocupado = { pedido: p.id, tipo: acao, card: dados.card || null };
    const extra = acao === "ajuste_post" ? { cards: (post.cards || []).map((c) => ({ ...c, ok: false })), ...(dados.tipo === "sentido" ? { legenda_ok: false } : {}) } : {};
    if (acao === "ajuste_card") extra.cards = (post.cards || []).map((c) => (c.n === dados.card ? { ...c, ok: false } : c));
    if (acao === "ajuste_legenda") extra.legenda_ok = false;
    await mudarPost(post.id, { ocupado, aviso: `Pedido enviado: "${texto.slice(0, 90)}"`, ...extra }, o);
    return { ok: true };
  }
  if (acao === "mudar_post") {
    const tipo = corpo.tipo === "todos" ? "todos" : "sentido";
    if (!texto) return erro("Escreva ou fale o que mudar no post.");
    const ids = Array.isArray(corpo.posts) ? corpo.posts.slice(0, 5) : [];
    const ideias = Array.isArray(corpo.ideias) ? corpo.ideias.filter((x) => UUID.test(x)).slice(0, 5) : [];
    if (!ids.length && !ideias.length) return erro("Marque o post que você quer mudar.");
    for (const id of ids) {
      const post = await lerPost(id, o); if (!post) continue;
      const p = await pedirAoClaude({ tipo: "mudar_post", post, texto, dados: { tipo } }, o);
      await mudarPost(post.id, { ocupado: { pedido: p.id, tipo: "mudar_post" }, aviso: `Pedido feito na aba Pedido: "${texto.slice(0, 90)}"`, cards: (post.cards || []).map((c) => ({ ...c, ok: false })) }, o);
    }
    for (const id of ideias) {
      const [ideia] = await rest(`mesa_ideias?id=eq.${id}&select=*`, o); if (!ideia) continue;
      await rest(`mesa_ideias?id=eq.${id}`, { ...o, method: "PATCH", body: { situacao: "comentada", comentario: texto }, prefer: "return=minimal" });
      await pedirAoClaude({ tipo: "comentario_ideia", texto, dados: { ideia: `${ideia.titulo} (${ideia.id})` } }, o);
    }
    return { ok: true };
  }
  if (acao === "agendar") {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    const dia = String(corpo.dia || ""), hora = String(corpo.hora || ""), redes = Array.isArray(corpo.redes) ? corpo.redes : [];
    const falta = faltaPraAgendar(post, { dia, hora, redes });
    if (falta.length) return erro(`Ainda falta: ${falta.join(", ")}.`);
    if (post.tipo === "teste") {
      // Reel de teste: a fila do PC pega na próxima rodada (até 5 min) e publica sozinha no horário aprovado.
      if (post.situacao === "publicado") return erro("Esse reel de teste já foi publicado.");
      await mudarPost(post.id, { situacao: "aprovado", dia, hora, redes, aviso: null, status: "aprovado por você, entrando na fila" }, o);
      return { ok: true };
    }
    await mudarPost(post.id, { situacao: "aprovado", dia, hora, redes, aviso: null }, o);
    await rest("mesa_pedidos", { ...o, method: "POST", prefer: "return=minimal", body: [{ tipo: "agendar", post_id: post.id, dados: { dia, hora, redes } }] });
    const [hh, mm = "00"] = hora.split("h");
    const prazo = `${dia}T${hh.padStart(2, "0")}:${(mm || "00").padEnd(2, "0")}:00-03:00`;
    await rest("central_itens?on_conflict=origem,id_externo", {
      ...o, method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ tipo: "tarefa", origem: "claude", id_externo: `mesa-agendar-${post.id}`, situacao: "com_claude", titulo: `Agendar: ${post.titulo}`,
        contexto: `${diaLegivel(dia)}, ${hora} · ${listaRedes(redes)} · aprovado na Mesa de Postagens`, prazo, etapa: "Esperando o Claude agendar",
        dados: { mesa_post: post.id, slug: post.slug } }],
    });
    return { ok: true };
  }
  if (acao === "tirar_agenda") {
    const post = await lerPost(corpo.post, o); if (!post) return erro("Post não encontrado.");
    if (post.tipo === "teste") {
      if (post.situacao === "publicado") return erro("Esse reel de teste já foi publicado.");
      // Volta a esperar aprovação; na próxima rodada a fila do PC deixa de publicar.
      await mudarPost(post.id, { situacao: "aguardando", legenda_ok: false, status: "esperando você" }, o);
      return { ok: true };
    }
    if (post.situacao === "agendado") return erro("Esse post já foi agendado nas redes. Me peça pelo recado pra tirar de lá.");
    // Já estava aprovado: volta pra prateleira de prontos, onde dá pra escolher outro dia.
    await mudarPost(post.id, { situacao: "pronto", dia: null, hora: null }, o);
    await rest(`central_itens?origem=eq.claude&id_externo=eq.mesa-agendar-${post.id}`, { ...o, method: "PATCH", body: { situacao: "arquivado" }, prefer: "return=minimal" });
    await rest(`mesa_pedidos?post_id=eq.${post.id}&tipo=eq.agendar&situacao=eq.novo`, { ...o, method: "PATCH", body: { situacao: "feito", resposta: "Você tirou da agenda." }, prefer: "return=minimal" });
    return { ok: true };
  }
  if (acao === "pedido_semana") {
    const semana = limpo(corpo.semana, 40);
    if (!semana) return erro("Escolha a semana do pedido.");
    if (!texto) return erro("Escreva ou fale o que você quer pra essa semana.");
    const fontes = Array.isArray(corpo.fontes) ? corpo.fontes.map((f) => limpo(f, 80)).filter(Boolean).slice(0, 8) : [];
    await pedirAoClaude({ tipo: "semana", texto, dados: { semana, fontes } }, o);
    return { ok: true };
  }
  if (acao === "ideia") {
    if (!UUID.test(corpo.id || "")) return erro("Ideia não encontrada.");
    const situacao = ["aprovada", "guardada", "descartada", "nova"].includes(corpo.situacao) ? corpo.situacao : null;
    if (!situacao) return erro("Escolha o que fazer com a ideia.");
    await rest(`mesa_ideias?id=eq.${corpo.id}`, { ...o, method: "PATCH", body: { situacao }, prefer: "return=minimal" });
    return { ok: true };
  }
  if (acao === "comentario_ideia") {
    if (!UUID.test(corpo.id || "")) return erro("Ideia não encontrada.");
    if (!texto) return erro("Escreva o comentário primeiro.");
    const [ideia] = await rest(`mesa_ideias?id=eq.${corpo.id}&select=*`, o); if (!ideia) return erro("Ideia não encontrada.");
    await rest(`mesa_ideias?id=eq.${ideia.id}`, { ...o, method: "PATCH", body: { situacao: "comentada", comentario: texto }, prefer: "return=minimal" });
    await pedirAoClaude({ tipo: "comentario_ideia", texto, dados: { ideia: `${ideia.titulo} (${ideia.id})`, semana: ideia.semana } }, o);
    return { ok: true };
  }
  if (acao === "montar_semana") {
    const semana = limpo(corpo.semana, 40);
    const aprovadas = await rest(`mesa_ideias?semana=eq.${encodeURIComponent(semana)}&situacao=eq.aprovada&select=id,titulo,data,hora,formato`, o);
    if (!aprovadas.length) return erro("Aprove pelo menos uma ideia antes de montar a semana.");
    await pedirAoClaude({ tipo: "montar_semana", dados: { semana, ideias: aprovadas.map((x) => `${x.titulo} · ${x.formato || ""} · ${diaLegivel(x.data)} ${x.hora || ""} (${x.id})`) } }, o);
    return { ok: true };
  }
  return erro("Ação desconhecida.");
}

export { HORA_OK, DIA_OK };
