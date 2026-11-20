import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { FIM, FASES, faseEm, faseDaUrl, restanteAte } from "./fase.js";
import { OFERTA, KIWIFY_URL, VALOR, VALOR_TOTAL, moeda, PLANO_2026, BIBLIOTECA_2025, FAQ, BLOCOS, NUMEROS, DOMINGOS, DOMINGOS_2026, DOMINGOS_2025, SERIES } from "./dados.js";

const pub = (src) => join(process.cwd(), "public", src);
const t = (iso) => Date.parse(iso);

test("marco da Black Friday: fecha seg 30/11 23h59, Brasília; sem pré-abertura", () => {
  assert.equal(FIM, "2026-11-30T23:59:59-03:00");
  assert.equal(new Date(FIM).getUTCDay(), 2, "30/11 23h59 em Brasília já é terça em UTC");
  // 15/11: a página vende desde a publicação (método ADP: a página da D é a de venda)
  assert.deepEqual(FASES, ["venda", "fechada"]);
  assert.equal(OFERTA.abertura, undefined, "não existe mais data de abertura");
});

test("fase por data", () => {
  assert.equal(faseEm(t("2026-11-08T12:00:00-03:00")), "venda");
  assert.equal(faseEm(t("2026-11-16T10:00:00-03:00")), "venda");
  assert.equal(faseEm(t("2026-11-22T23:59:59-03:00")), "venda");
  assert.equal(faseEm(t("2026-11-27T15:00:00-03:00")), "venda");
  assert.equal(faseEm(t("2026-11-30T23:59:59-03:00")), "venda");
  assert.equal(faseEm(t("2026-12-01T00:00:00-03:00")), "fechada");
});

test("?fase= força a fase só com valor válido", () => {
  const agora = t("2026-11-16T12:00:00-03:00");
  assert.equal(faseDaUrl({ fase: "fechada" }, agora), "fechada");
  assert.equal(faseDaUrl({ fase: "venda" }, agora), "venda");
  assert.equal(faseDaUrl({ fase: "pre" }, agora), "venda", "pré-abertura não existe mais");
  assert.equal(faseDaUrl({ fase: "qualquer" }, agora), "venda");
  assert.equal(faseDaUrl({}, agora), "venda");
  assert.equal(faseDaUrl(undefined, agora), "venda");
});

test("restante conta certo e zera depois do marco", () => {
  const r = restanteAte(FIM, t("2026-11-29T23:59:59-03:00"));
  assert.deepEqual(r, { d: 1, h: 0, m: 0, s: 0 });
  assert.equal(restanteAte(FIM, t("2026-12-01T00:00:00-03:00")), null);
});

test("oferta exata da Camada 1 (02/11)", () => {
  assert.equal(OFERTA.nome, "Black Biblinho · Acesso Total");
  assert.equal(OFERTA.por, "R$ 297");
  assert.equal(OFERTA.precoNumero, 297);
  // 12/11: sem grupo VIP antecipado e sem segundo preço
  assert.equal(OFERTA.vip, undefined);
  assert.equal(OFERTA.vipJanela, undefined);
  assert.equal(OFERTA.parcela, "em até 12x");
  assert.equal(OFERTA.garantiaDias, 7);
  assert.equal(OFERTA.fimCurto, "30 de novembro");
  // "em até 12x" sem valor da parcela (decisão de 09/09 mantida em 02/11)
  assert.ok(!/12x de R\$/.test(OFERTA.parcela));
  assert.ok(KIWIFY_URL.startsWith("https://pay.kiwify.com.br/"));
  assert.ok(!/SUBSTITUIR/.test(KIWIFY_URL), "o marcador do link da Kiwify ainda está na página");
});

test("a conta do valor usa preços públicos e soma mais de R$ 1.500", () => {
  assert.equal(VALOR.length, 4, "quatro linhas, uma por bloco");
  assert.equal(VALOR[0].preco, 597, "Plano Anual no preço público");
  assert.equal(VALOR[1].preco, 9 * 97, "9 histórias de 2025 a R$ 97 cada");
  assert.ok(VALOR_TOTAL > 1500 && VALOR_TOTAL < 1700, `total fora do esperado: ${VALOR_TOTAL}`);
  assert.ok(VALOR_TOTAL / OFERTA.precoNumero > 5, "a oferta é mais de 5x mais barata que separado");
  assert.equal(moeda(597), "R$ 597");
  assert.equal(moeda(57.9), "R$ 57,90");
});

test("promessa honesta: contagem bate com o inventário de 02/11", () => {
  // 11 temas de 2026 (10 histórias diferentes, Zaqueu repete em novembro)
  assert.equal(PLANO_2026.length, 11);
  assert.equal(PLANO_2026.filter((h) => h.junior).length, 6, "Júnior existe em 6 temas de 2026");
  assert.equal(PLANO_2026.filter((h) => h.emProducao).length, 0, "19/11: novembro ficou pronto; nada em produção");
  assert.ok(PLANO_2026.every((h) => h.src), "todos os 11 temas têm capa");
  // 9 histórias completas de 2025 (Josias só tem o estudo 1 e fica fora da lista)
  assert.equal(BIBLIOTECA_2025.length, 9);
  assert.ok(!BIBLIOTECA_2025.some((h) => /josias/i.test(h.nome)));
  // 13 histórias completas diferentes somando os dois anos (o brief dizia 14 contando Josias, que só tem o estudo 1)
  const nomes = new Set([...PLANO_2026.map((h) => h.historia), ...BIBLIOTECA_2025.map((h) => h.historia)]);
  assert.equal(nomes.size, 13);
  // 6 delas em duas versões
  const em2026 = new Set(PLANO_2026.map((h) => h.historia));
  assert.equal(BIBLIOTECA_2025.filter((h) => em2026.has(h.historia)).length, 6);
  assert.equal(BLOCOS.length, 4, "a entrega tem 4 blocos");
  // domingos de aula pronta: 2026 (11 meses prontos desde 19/11) + 2025 (9 histórias), conferidos nas notas do cofre
  assert.equal(DOMINGOS_2026, 48);
  assert.equal(DOMINGOS_2025, 41);
  assert.equal(DOMINGOS, 89);
  assert.equal(SERIES, 20);
  assert.equal(NUMEROS[0].n, "89");
});

test("todas as capas referenciadas existem", () => {
  for (const h of [...PLANO_2026, ...BIBLIOTECA_2025]) {
    if (h.src) assert.ok(existsSync(pub(h.src)), `capa faltando: ${h.src}`);
  }
});

test("faq cobre as objeções da Black Friday", () => {
  const perguntas = FAQ.map((f) => f.q.toLowerCase()).join(" | ");
  for (const chave of ["na hora", "júnior", "2025", "emoções", "assinante", "dezembro", "depois do dia 30", "impresso", "equipe", "garantia", "fuso"]) {
    assert.ok(perguntas.includes(chave), `FAQ sem pergunta sobre: ${chave}`);
  }
});

test("sem travessão, sem PT de Portugal, sem 'grátis' e sem resto de pré-abertura nos textos", () => {
  const tudo = JSON.stringify({ OFERTA, PLANO_2026, BIBLIOTECA_2025, FAQ, BLOCOS });
  assert.ok(!tudo.includes("—"), "travessão encontrado");
  assert.ok(!/gr[aá]tis/i.test(tudo), "'grátis' encontrado");
  assert.ok(!/23 a 30|aviso de abertura|abre segunda/i.test(tudo), "resto da pré-abertura encontrado");
  for (const pt of ["está a ", "de seguida", "ecrã", "miúdos", "ficheiro", "estás a "]) {
    assert.ok(!tudo.includes(pt), `PT-PT encontrado: ${pt}`);
  }
});
