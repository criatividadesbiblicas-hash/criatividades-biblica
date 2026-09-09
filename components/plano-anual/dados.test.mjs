import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HISTORIAS, AULAS_ARCA, PECAS, ANOTACOES, FAIXAS, DEPOIMENTOS, FAQ, OFERTA, KIWIFY_URL } from "./dados.js";

const pub = (src) => join(process.cwd(), "public", src);

test("oferta e checkout exatos", () => {
  assert.equal(OFERTA.de, "R$ 1.164,00");
  assert.equal(OFERTA.por, "R$ 597,00");
  assert.equal(OFERTA.parcela, "12x de R$ 61,74");
  assert.equal(OFERTA.precoNumero, 597);
  assert.equal(KIWIFY_URL, "https://pay.kiwify.com.br/kuUKSBr");
});

test("8 historias com capa existente e sem numeracao", () => {
  assert.equal(HISTORIAS.length, 8);
  for (const h of HISTORIAS) {
    assert.ok(existsSync(pub(h.src)), `capa faltando: ${h.src}`);
    assert.ok(!/^\d|m[eê]s \d/i.test(h.nome), `nome numerado: ${h.nome}`);
    assert.ok(h.estudos >= 4 && h.estudos <= 5);
  }
});

test("todas as imagens referenciadas existem", () => {
  const srcs = [
    ...AULAS_ARCA.map((a) => a.img),
    ...PECAS.flatMap((p) => p.imagens),
    ...FAIXAS.map((f) => f.src),
  ];
  for (const s of srcs) assert.ok(existsSync(pub(s)), `imagem faltando: ${s}`);
});

test("faq cobre as objecoes da spec", () => {
  const perguntas = FAQ.map((f) => f.q.toLowerCase()).join(" | ");
  for (const chave of ["exatamente", "qual história", "de uma vez", "impresso", "papel", "equipe", "pack", "12 meses", "garantia"]) {
    assert.ok(perguntas.includes(chave), `FAQ sem pergunta sobre: ${chave}`);
  }
});

test("depoimentos: array (vazio ate a Thali mandar)", () => {
  assert.ok(Array.isArray(DEPOIMENTOS));
  for (const d of DEPOIMENTOS) assert.match(d.name, /^[^\s]+( [^\s]+)? [A-ZÀ-Ú]\.$/, "nome deve ser 'Nome I.'");
});

test("nada de portugues de Portugal nos textos", () => {
  const tudo = JSON.stringify({ AULAS_ARCA, PECAS, ANOTACOES, FAIXAS, HISTORIAS, DEPOIMENTOS, FAQ });
  for (const pt of ["está a ", "de seguida", "ecrã", "miúdos", "ficheiro", "estás a "]) {
    assert.ok(!tudo.includes(pt), `PT-PT encontrado: ${pt}`);
  }
});

test("FAIXAS: nenhum trecho e placeholder TRANSCREVER", () => {
  for (const f of FAIXAS) {
    assert.ok(!f.trecho.includes("TRANSCREVER"), `trecho ainda e placeholder: ${f.faixa}`);
  }
});
