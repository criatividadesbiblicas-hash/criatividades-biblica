// lib/central/caderno.test.mjs
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { listarItens, ultimaRodada, marcarResolvido } from "./caderno.js";

beforeEach(() => {
  process.env.SUPABASE_URL = "https://exemplo.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "chave";
});

const resposta = (status, corpo) => async (url, init) => ({ ok: status < 300, status, json: async () => corpo, url, init });

test("listarItens pede a tabela certa, sem arquivados, com a chave", async () => {
  let pedido;
  const r = await listarItens({ fetchFn: async (url, init) => { pedido = { url, init }; return resposta(200, [{ id: "1" }])(); } });
  assert.deepEqual(r, { ok: true, itens: [{ id: "1" }], erro: null });
  assert.match(pedido.url, /\/rest\/v1\/central_itens\?/);
  assert.ok(pedido.url.includes("situacao=not.in.(arquivado,resolvido)"));
  assert.ok(pedido.url.includes("order=criado_em.desc,id.asc"));
  assert.equal(pedido.init.headers.apikey, "chave");
});

test("listarItens devolve erro legivel quando falha ou falta configuracao", async () => {
  assert.equal((await listarItens({ fetchFn: resposta(500, {}) })).erro, "Não consegui ler o caderno (500).");
  assert.equal((await listarItens({ fetchFn: async () => { throw new Error("rede"); } })).erro, "Não consegui ler o caderno agora. Tente de novo em instantes.");
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  assert.equal((await listarItens({ fetchFn: resposta(200, []) })).erro, "O caderno não está configurado.");
});

test("ultimaRodada devolve a mais recente, null so se nunca houve, { erro: true } se nao leu", async () => {
  assert.deepEqual(await ultimaRodada({ fetchFn: resposta(200, [{ quando: "2026-11-07T10:00:00Z", ok: true, resumo: "ok" }]) }), { quando: "2026-11-07T10:00:00Z", ok: true, resumo: "ok" });
  assert.equal(await ultimaRodada({ fetchFn: resposta(200, []) }), null);
  assert.deepEqual(await ultimaRodada({ fetchFn: resposta(500, {}) }), { erro: true });
  assert.deepEqual(await ultimaRodada({ fetchFn: async () => { throw new Error("rede"); } }), { erro: true });
});

test("marcarResolvido faz PATCH so no id pedido", async () => {
  let pedido;
  const ok = await marcarResolvido("11111111-1111-1111-1111-111111111111", { fetchFn: async (url, init) => { pedido = { url, init }; return { ok: true, status: 204 }; } });
  assert.equal(ok, true);
  assert.equal(pedido.init.method, "PATCH");
  assert.match(pedido.url, /id=eq\.11111111-1111-1111-1111-111111111111/);
  assert.equal(JSON.parse(pedido.init.body).situacao, "resolvido");
});

test("marcarResolvido devolve false quando a rede falha ou a resposta nao e OK", async () => {
  const id = "11111111-1111-1111-1111-111111111111";
  assert.equal(await marcarResolvido(id, { fetchFn: async () => { throw new Error("rede"); } }), false);
  assert.equal(await marcarResolvido(id, { fetchFn: async () => ({ ok: false, status: 500 }) }), false);
});

test("criarPedido grava tipo e texto na tabela de pedidos", async () => {
  const { criarPedido } = await import("./caderno.js");
  let pedido;
  const ok = await criarPedido("recado", "segura o post", { fetchFn: async (url, init) => { pedido = { url, init }; return { ok: true, status: 201 }; } });
  assert.equal(ok, true);
  assert.match(pedido.url, /\/rest\/v1\/central_pedidos$/);
  assert.deepEqual(JSON.parse(pedido.init.body), { tipo: "recado", texto: "segura o post" });
  assert.equal(await criarPedido("atualizar", null, { fetchFn: async () => { throw new Error("rede"); } }), false);
});

test("estadoPedidos junta recados, atualizacao pendente e se o PC esta ligado", async () => {
  const { estadoPedidos } = await import("./caderno.js");
  const agora = new Date("2026-11-08T12:00:00Z");
  const fetchFn = async (url) => ({
    ok: true, status: 200,
    json: async () => url.includes("tipo=eq.recado") ? [{ id: "r1" }] : url.includes("tipo=eq.atualizar") ? [{ id: "a1" }] : [{ visto_em: "2026-11-08T11:59:00Z" }],
  });
  assert.deepEqual(await estadoPedidos({ fetchFn, agora }), { erro: false, recados: [{ id: "r1" }], atualizando: true, pcLigado: true });
  const longe = new Date("2026-11-08T12:10:00Z");
  assert.equal((await estadoPedidos({ fetchFn, agora: longe })).pcLigado, false);
  assert.equal((await estadoPedidos({ fetchFn: async () => ({ ok: false, status: 500 }) })).erro, true);
});
