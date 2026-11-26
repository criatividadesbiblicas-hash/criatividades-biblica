import { test } from "node:test";
import assert from "node:assert/strict";
import { regrasLegenda, legendaPassa, faltaPraAgendar, textoRecado, diaLegivel, listaRedes } from "./mesa-regras.js";

const BOA = "Pergunta boa?\n\nTexto sem nada proibido.\n\n#ministerioinfantil #ebd #cultoinfantil #escolabiblicadominical #professoradeebd";

test("legenda boa passa em todas as regras", () => {
  assert.equal(legendaPassa(BOA), true);
});

test("pega travessão, palavra proibida, preço e hashtags a menos", () => {
  const r = regrasLegenda("Isso é de verdade — R$ 97\n#a #b #c");
  assert.equal(r.filter(([ok]) => !ok).length, 4);
  assert.match(r[2][1], /tem 3/);
});

test("pega 'a Criatividades' no feminino", () => {
  assert.equal(legendaPassa(BOA.replace("Texto", "Texto da a Criatividades Bíblicas")), false);
});

test("agendar pronto exige capa, dia, hora e rede", () => {
  const post = { situacao: "pronto", capas: [{ letra: "C" }], capa: null, legendas: { ig: BOA } };
  assert.deepEqual(faltaPraAgendar(post, {}), ["escolher a capa", "o dia", "o horário", "onde vai sair"]);
  assert.deepEqual(faltaPraAgendar({ ...post, capa: "C" }, { dia: "2026-11-27", hora: "18h", redes: ["ig", "tt"] }), []);
  assert.deepEqual(faltaPraAgendar({ ...post, capa: "C" }, { dia: "2026-11-27", hora: "19h15", redes: ["ig"] }), []);
});

test("agendar post em aprovação exige cards e legenda aprovados", () => {
  const post = { situacao: "aguardando", capas: [], cards: [{ ok: true }, { ok: false }], legenda_ok: false, legendas: { ig: BOA } };
  assert.deepEqual(faltaPraAgendar(post, { dia: "2026-11-27", hora: "18h", redes: ["ig"] }), ["aprovar 1 card", "aprovar a legenda"]);
});

test("legenda fora da regra trava o agendamento", () => {
  const post = { situacao: "pronto", capas: [], legendas: { ig: "Sem hashtag" } };
  assert.deepEqual(faltaPraAgendar(post, { dia: "2026-11-27", hora: "18h", redes: ["ig"] }), ["corrigir a legenda"]);
});

test("rede ou hora inventada não passa", () => {
  const post = { situacao: "pronto", capas: [], legendas: { ig: BOA } };
  assert.deepEqual(faltaPraAgendar(post, { dia: "2026-11-27", hora: "25h", redes: ["x"] }), ["o horário", "onde vai sair"]);
});

test("recado leva o pedido, o post e a regra do recado", () => {
  const t = textoRecado({ id: "abc", tipo: "ajuste_card", texto: "Aumenta a letra", dados: { card: 3 } }, { titulo: "Ação de Graças", slug: "acao", versao: 2 });
  assert.match(t, /^\[Mesa de Postagens\] Pedido abc · Ajuste num card/);
  assert.match(t, /Card: 3/);
  assert.match(t, /"Aumenta a letra"/);
  assert.match(t, /ATENDER\.md/);
  assert.ok(t.length <= 3990);
});

test("dia e redes legíveis", () => {
  assert.equal(diaLegivel("2026-11-27"), "sex 27/11");
  assert.equal(listaRedes(["ig", "tt", "pin"]), "Instagram, TikTok e Pinterest");
  assert.equal(listaRedes(["ig"]), "Instagram");
});
