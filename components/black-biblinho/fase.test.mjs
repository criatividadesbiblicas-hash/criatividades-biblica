import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { FIM, FASES, faseEm, faseDaUrl, restanteAte } from "./fase.js";
import { OFERTA, KIWIFY_URL, VALOR, VALOR_TOTAL, BONUS, moeda, PLANO_2026, BIBLIOTECA_2025, FAQ, BLOCOS, NUMEROS, DOMINGOS, DOMINGOS_2026, DOMINGOS_2025, SERIES } from "./dados.js";

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

test("a conta do valor usa preços públicos e soma mais de R$ 1.000; Planner 2027 é bônus fora da soma", () => {
  assert.equal(VALOR.length, 3, "três linhas: Plano Anual, histórias de 2025, Emoções (21/11: Planner 2026 saiu)");
  assert.equal(VALOR[0].preco, 597, "Plano Anual no preço público");
  assert.equal(VALOR[1].preco, BIBLIOTECA_2025.length * 97, "histórias de 2025 a R$ 97 cada, uma linha por história da Biblioteca");
  assert.ok(!VALOR.some((v) => /planner/i.test(v.item)), "Planner não entra na soma");
  assert.ok(VALOR_TOTAL > 1000 && VALOR_TOTAL < 1100, `total fora do esperado: ${VALOR_TOTAL}`);
  assert.ok(VALOR_TOTAL / OFERTA.precoNumero > 3, "a oferta é mais de 3x mais barata que separado");
  assert.match(BONUS.nome, /Planner Ministério Infantil 2027/);
  assert.match(BONUS.texto, /ficar pronto/);
  assert.equal(moeda(597), "R$ 597");
  assert.equal(moeda(57.9), "R$ 57,90");
});

test("promessa honesta: contagem bate com a prévia oficial do Plano Anual (PDF de 19/11, mandado em 21/11)", () => {
  // 12 temas de 2026 (11 histórias diferentes, Zaqueu repete em novembro); dezembro = Josias
  assert.equal(PLANO_2026.length, 12);
  assert.equal(PLANO_2026.filter((h) => h.junior).length, 6, "Júnior existe em 6 temas de 2026");
  assert.deepEqual(PLANO_2026.filter((h) => h.emProducao).map((h) => h.mes), ["dez"], "só dezembro (Josias) está em produção");
  assert.ok(PLANO_2026.filter((h) => !h.emProducao).every((h) => h.src), "todo tema pronto tem capa");
  assert.equal(PLANO_2026.at(-1).src, null, "Josias ainda não tem capa (a Thali vai fazer)");
  assert.equal(PLANO_2026.map((h) => h.estudos).join(","), "4,4,5,4,5,4,4,5,4,4,5,4", "estudos por tema, como na página 4 da prévia");
  // Biblioteca 2025: só as 4 histórias que ficaram na plataforma, todas com as 3 faixas
  assert.equal(BIBLIOTECA_2025.length, 4);
  assert.deepEqual(BIBLIOTECA_2025.map((h) => h.estudos), [7, 4, 4, 4]);
  assert.ok(BIBLIOTECA_2025.every((h) => h.junior && h.tema), "as 4 têm Júnior e tema");
  assert.ok(!BIBLIOTECA_2025.some((h) => /josias|arca|semeador|daniel|pr[óo]digo|ad[ãa]o/i.test(h.nome)), "as versões 2025 repaginadas não entram");
  // 14 histórias diferentes somando os dois anos; só a Ovelha Perdida aparece nos dois
  const nomes = new Set([...PLANO_2026.map((h) => h.historia), ...BIBLIOTECA_2025.map((h) => h.historia)]);
  assert.equal(nomes.size, 14);
  const em2026 = new Set(PLANO_2026.map((h) => h.historia));
  assert.deepEqual(BIBLIOTECA_2025.filter((h) => em2026.has(h.historia)).map((h) => h.historia), ["Ovelha Perdida"]);
  assert.equal(BLOCOS.length, 5, "cinco partes na área de membros, a quinta é o bônus (sem chamar de bloco na página)");
  assert.match(BLOCOS[2].detalhe, /Mais de 1\.000 famílias/, "Emoções: mais de 1.000 (Thali, 21/11), não 890");
  // 21/11: capas = apostila do professor (capa-prof-*); só Zaqueu de março fica com a das atividades
  for (const h of PLANO_2026.filter((h) => h.src)) {
    if (h.mes === "mar") assert.equal(h.src, "/plano-anual/capa-zaqueu.webp");
    else assert.match(h.src, /\/capa-prof-/, `${h.mes} ainda usa a capa das atividades`);
  }
  assert.ok(BIBLIOTECA_2025.every((h) => /\/capa-prof-2025-/.test(h.src)), "Biblioteca 2025 com a capa do professor");
  // 21/11: Planner 2026 fora; Planner 2027 só como bônus; plano de leitura continua
  assert.match(BLOCOS[3].titulo, /Plano de leitura/);
  assert.ok(!/Planner/.test(BLOCOS[3].detalhe), "o Planner tem cartão próprio, não fica dentro do plano de leitura");
  assert.equal(BLOCOS[4].titulo, "Planner Ministério Infantil 2027");
  assert.ok(BLOCOS[4].bonus && /Chamadas a Cuidar/.test(BLOCOS[4].resumo) && /a qualquer momento/.test(BLOCOS[4].resumo));
  assert.ok(!/2026/.test(BLOCOS[4].resumo + BLOCOS[4].detalhe), "não dizer que o Planner é o de 2026 reaproveitado");
  assert.ok(!JSON.stringify({ BLOCOS, FAQ, NUMEROS, VALOR }).includes("Planner Ministério Infantil 2026"), "Planner 2026 ainda citado");
  assert.ok(!/\bblocos?\b/i.test(JSON.stringify([BLOCOS, FAQ, NUMEROS])), "a palavra 'bloco' não aparece nos textos da página");
  // capa da prévia: 16 séries de estudo, 71 domingos de aula pronta (52 de 2026 + 19 de 2025)
  assert.equal(DOMINGOS_2026, 52);
  assert.equal(DOMINGOS_2025, 19);
  assert.equal(DOMINGOS, 71);
  assert.equal(SERIES, 16);
  assert.equal(NUMEROS[0].n, "71");
  assert.equal(NUMEROS[1].n, "16");
  // os textos dos blocos e da FAQ não podem ficar com a contagem antiga
  const textos = JSON.stringify({ BLOCOS, FAQ });
  assert.ok(!/11 temas|9 histórias|dos 11|7 das 9|estudo 1 d[ae] (série do )?(Rei )?Josias/i.test(textos), "resto da contagem antiga nos textos");
  assert.ok(/12 temas/.test(textos) && /4 histórias/.test(textos));
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
