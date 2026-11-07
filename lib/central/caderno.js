// Acesso do servidor ao caderno (Supabase REST, chave de servidor). Nunca importar em componente de cliente.
const base = () => process.env.SUPABASE_URL;
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const cabecalhos = (extra = {}) => ({ apikey: chave(), Authorization: `Bearer ${chave()}`, "Content-Type": "application/json", ...extra });

export async function listarItens({ fetchFn = fetch } = {}) {
  if (!base() || !chave()) return { ok: false, itens: [], erro: "O caderno não está configurado." };
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_itens?select=*&situacao=neq.arquivado&order=criado_em.desc&limit=500`, {
      headers: cabecalhos(), cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { ok: false, itens: [], erro: `Não consegui ler o caderno (${r.status}).` };
    return { ok: true, itens: await r.json(), erro: null };
  } catch {
    return { ok: false, itens: [], erro: "Não consegui ler o caderno agora. Tente de novo em instantes." };
  }
}

export async function ultimaRodada({ fetchFn = fetch } = {}) {
  if (!base() || !chave()) return null;
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_rodadas?select=quando,ok,resumo&order=quando.desc&limit=1`, {
      headers: cabecalhos(), cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const linhas = await r.json();
    return linhas[0] || null;
  } catch {
    return null;
  }
}

export async function marcarResolvido(id, { fetchFn = fetch } = {}) {
  if (!base() || !chave()) return false;
  const r = await fetchFn(`${base()}/rest/v1/central_itens?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: cabecalhos({ Prefer: "return=minimal" }),
    body: JSON.stringify({ situacao: "resolvido", atualizado_em: new Date().toISOString() }),
    signal: AbortSignal.timeout(10000),
  });
  return r.ok;
}
