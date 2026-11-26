// Onde a senha da Central fica guardada (tabela central_acesso, só a chave de servidor). Nunca importar em cliente.
const base = () => process.env.SUPABASE_URL;
const chave = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const cab = (extra = {}) => ({ apikey: chave(), Authorization: `Bearer ${chave()}`, "Content-Type": "application/json", ...extra });
// No teste local usa outra linha, pra nunca mexer na senha de verdade.
const ID = () => process.env.CENTRAL_ACESSO_ID || "principal";

// { senha_hash, trocar } | null (ainda não existe: vale a senha antiga da Vercel) | { erro: true }
export async function lerAcesso({ fetchFn = fetch } = {}) {
  if (!base() || !chave()) return { erro: true };
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_acesso?id=eq.${encodeURIComponent(ID())}&select=senha_hash,trocar`, {
      headers: cab(), cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { erro: true };
    const l = await r.json();
    return l[0] || null;
  } catch {
    return { erro: true };
  }
}

export async function gravarSenha(senhaHash, { fetchFn = fetch } = {}) {
  if (!base() || !chave()) return false;
  try {
    const r = await fetchFn(`${base()}/rest/v1/central_acesso?on_conflict=id`, {
      method: "POST",
      headers: cab({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify([{ id: ID(), senha_hash: senhaHash, trocar: false }]),
      signal: AbortSignal.timeout(10000),
    });
    return r.ok;
  } catch {
    return false;
  }
}
