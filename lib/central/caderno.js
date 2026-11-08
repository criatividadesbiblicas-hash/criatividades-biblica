// Acesso do servidor ao caderno (Supabase REST, chave de servidor). Nunca importar em componente de cliente.
const base = () => process.env.SUPABASE_URL;
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const cabecalhos = (extra = {}) => ({ apikey: chave(), Authorization: `Bearer ${chave()}`, "Content-Type": "application/json", ...extra });

export async function listarItens({ fetchFn = fetch } = {}) {
  if (!base() || !chave()) return { ok: false, itens: [], erro: "O caderno não está configurado." };
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_itens?select=*&situacao=not.in.(arquivado,resolvido)&order=criado_em.desc,id.asc&limit=500`, {
      headers: cabecalhos(), cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { ok: false, itens: [], erro: `Não consegui ler o caderno (${r.status}).` };
    return { ok: true, itens: await r.json(), erro: null };
  } catch {
    return { ok: false, itens: [], erro: "Não consegui ler o caderno agora. Tente de novo em instantes." };
  }
}

export async function ultimaRodada({ fetchFn = fetch } = {}) {
  // null = o PC nunca fez rodada; { erro: true } = nao consegui ler agora.
  if (!base() || !chave()) return { erro: true };
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_rodadas?select=quando,ok,resumo&order=quando.desc&limit=1`, {
      headers: cabecalhos(), cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { erro: true };
    const linhas = await r.json();
    return linhas[0] || null;
  } catch {
    return { erro: true };
  }
}

export async function marcarResolvido(id, { fetchFn = fetch } = {}) {
  if (!base() || !chave()) return false;
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_itens?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: cabecalhos({ Prefer: "return=minimal" }),
      body: JSON.stringify({ situacao: "resolvido", atualizado_em: new Date().toISOString() }),
      signal: AbortSignal.timeout(10000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// --- pedidos (atualizar agora, recado pro Claude) ---
const PC_LIGADO_MS = 3 * 60 * 1000; // o vigia da sinal a cada minuto

export async function criarPedido(tipo, texto = null, { fetchFn = fetch } = {}) {
  if (!base() || !chave()) return false;
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_pedidos`, {
      method: "POST",
      headers: cabecalhos({ Prefer: "return=minimal" }),
      body: JSON.stringify({ tipo, texto }),
      signal: AbortSignal.timeout(10000),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// { erro, recados, atualizando, pcLigado }. recados: os 15 mais recentes, novo primeiro.
export async function estadoPedidos({ fetchFn = fetch, agora = new Date() } = {}) {
  const vazio = { erro: true, recados: [], atualizando: false, pcLigado: null };
  if (!base() || !chave()) return vazio;
  try {
    const opcoes = { headers: cabecalhos(), cache: "no-store", signal: AbortSignal.timeout(10000) };
    const [rr, ra, rv] = await Promise.all([
      fetchFn(`${base()}/rest/v1/central_pedidos?select=id,texto,situacao,resposta,criado_em,atualizado_em&tipo=eq.recado&order=criado_em.desc&limit=15`, opcoes),
      fetchFn(`${base()}/rest/v1/central_pedidos?select=id&tipo=eq.atualizar&situacao=in.(novo,fazendo)&limit=1`, opcoes),
      fetchFn(`${base()}/rest/v1/central_vigia?select=visto_em&id=eq.pc`, opcoes),
    ]);
    if (!rr.ok || !ra.ok || !rv.ok) return vazio;
    const [recados, atualizar, vigia] = await Promise.all([rr.json(), ra.json(), rv.json()]);
    const visto = vigia[0]?.visto_em ? new Date(vigia[0].visto_em).getTime() : null;
    return { erro: false, recados, atualizando: atualizar.length > 0, pcLigado: visto !== null && agora.getTime() - visto < PC_LIGADO_MS };
  } catch {
    return vazio;
  }
}
