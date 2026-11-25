"use client";

export const API = "https://zmpvybqduaejazsllojb.supabase.co/functions/v1/cb-respostas/api";
const KEY = "cb_pass";

export const store = {
  get() { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } },
  set(v) { try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch {} },
};

export async function api(action, data) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-cb-pass": store.get() },
    body: JSON.stringify({ action, data }),
  });
  const j = await r.json().catch(() => ({ erro: "resposta inválida do servidor" }));
  if (r.status === 401) { store.set(""); location.reload(); }
  if (j.erro) throw new Error(j.erro);
  return j;
}

export const fmt = (s) =>
  new Date(s).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
