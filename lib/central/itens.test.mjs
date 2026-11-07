import { test } from "node:test";
import assert from "node:assert/strict";
import { PAGINAS, paginasDoItem, itensDaPagina, contadores, resumoCapa, inicioDoDia } from "./itens.js";

const AGORA = new Date("2026-11-07T10:00:00-03:00");
const base = { id: "x", tipo: "decisao", origem: "cofre", situacao: "esperando_voce", titulo: "t", prazo: null, criado_em: "2026-11-05T10:00:00Z", atualizado_em: "2026-11-05T10:00:00Z", dados: {} };
const it = (extra) => ({ ...base, ...extra });

test("as 5 paginas existem, so com-voce e comentarios pedem voce", () => {
  assert.deepEqual(Object.keys(PAGINAS), ["com-voce", "com-o-claude", "agendado", "comentarios", "campanhas"]);
  assert.deepEqual(Object.entries(PAGINAS).filter(([, p]) => p.pedeVoce).map(([k]) => k), ["com-voce", "comentarios"]);
});

test("decisao do cofre esperando voce aparece so em com-voce", () => {
  assert.deepEqual(paginasDoItem(it({})), ["com-voce"]);
});

test("tarefa do claude pronta aparece em com-voce e com-o-claude; fazendo so em com-o-claude", () => {
  assert.deepEqual(paginasDoItem(it({ tipo: "tarefa", origem: "claude", situacao: "esperando_voce" })), ["com-voce", "com-o-claude"]);
  assert.deepEqual(paginasDoItem(it({ tipo: "tarefa", origem: "claude", situacao: "com_claude" })), ["com-o-claude"]);
});

test("post que ela precisa postar aparece em com-voce e agendado; agendado so em agendado", () => {
  assert.deepEqual(paginasDoItem(it({ tipo: "post", situacao: "esperando_voce" })), ["com-voce", "agendado"]);
  assert.deepEqual(paginasDoItem(it({ tipo: "post", situacao: "agendado" })), ["agendado"]);
});

test("resolvido, ignorado e arquivado nao aparecem em lugar nenhum fora de comentarios", () => {
  for (const situacao of ["resolvido", "ignorado", "arquivado"]) assert.deepEqual(paginasDoItem(it({ situacao })), []);
});

test("com-voce ordena por prazo (nulos no fim) e depois pelo mais antigo", () => {
  const a = it({ id: "a", prazo: null, criado_em: "2026-11-01T00:00:00Z" });
  const b = it({ id: "b", prazo: "2026-11-07T14:00:00-03:00" });
  const c = it({ id: "c", prazo: "2026-11-07T12:00:00-03:00" });
  const d = it({ id: "d", prazo: null, criado_em: "2026-11-06T00:00:00Z" });
  assert.deepEqual(itensDaPagina([a, b, c, d], "com-voce", AGORA).map((i) => i.id), ["c", "b", "a", "d"]);
});

test("agendado esconde o que e de antes de ontem e ordena por horario", () => {
  const velho = it({ id: "v", tipo: "post", situacao: "no_ar", prazo: "2026-11-05T11:00:00-03:00" });
  const hoje17 = it({ id: "h17", tipo: "post", situacao: "agendado", prazo: "2026-11-07T17:00:00-03:00" });
  const hoje12 = it({ id: "h12", tipo: "post", situacao: "agendado", prazo: "2026-11-07T12:00:00-03:00" });
  assert.deepEqual(itensDaPagina([velho, hoje17, hoje12], "agendado", AGORA).map((i) => i.id), ["h12", "h17"]);
});

test("inicioDoDia usa meia-noite de Brasilia", () => {
  assert.equal(inicioDoDia(AGORA).toISOString(), "2026-11-07T03:00:00.000Z");
  assert.equal(inicioDoDia(new Date("2026-11-08T01:30:00Z")).toISOString(), "2026-11-07T03:00:00.000Z");
  assert.equal(inicioDoDia(AGORA, 1).toISOString(), "2026-11-08T03:00:00.000Z");
});

test("contadores e resumo da capa", () => {
  const itens = [
    it({ id: "1" }),
    it({ id: "2", tipo: "tarefa", origem: "claude", situacao: "com_claude", progresso: 40 }),
    it({ id: "3", tipo: "tarefa", origem: "claude", situacao: "esperando_voce" }),
    it({ id: "4", tipo: "post", situacao: "agendado", prazo: "2026-11-07T17:00:00-03:00" }),
    it({ id: "5", tipo: "post", situacao: "agendado", prazo: "2026-11-09T17:00:00-03:00" }),
  ];
  assert.deepEqual(contadores(itens, AGORA), { "com-voce": 2, "com-o-claude": 2, agendado: 2, comentarios: 0, campanhas: 0 });
  const r = resumoCapa(itens, AGORA);
  assert.equal(r.comVoce.total, 2);
  assert.equal(r.comVoce.primeiros.length, 2);
  assert.deepEqual(r.comClaude.fazendo.map((i) => i.id), ["2"]);
  assert.equal(r.comClaude.prontos, 1);
  assert.deepEqual(r.agendadoHoje.map((i) => i.id), ["4"]);
});

test("resumoCapa conta o total, nao a lista cortada (fazendo e hoje)", () => {
  const fazendo = [1, 2, 3, 4, 5].map((n) => it({ id: `f${n}`, tipo: "tarefa", origem: "claude", situacao: "com_claude" }));
  const hoje = [1, 2, 3, 4, 5, 6].map((n) => it({ id: `h${n}`, tipo: "post", situacao: "agendado", prazo: `2026-11-07T1${n}:00:00-03:00` }));
  const r = resumoCapa([...fazendo, ...hoje], AGORA);
  assert.equal(r.comClaude.fazendo.length, 3);
  assert.equal(r.comClaude.totalFazendo, 5);
  assert.equal(r.agendadoHoje.length, 4);
  assert.equal(r.totalHoje, 6);
});

test("com-voce: empate de prazo e criado_em desempata por dados.ordem e depois por id", () => {
  const mesmo = "2026-11-05T10:00:00Z";
  const itens = [
    it({ id: "d", criado_em: mesmo, dados: {} }),
    it({ id: "c", criado_em: mesmo, dados: { ordem: 2 } }),
    it({ id: "b", criado_em: mesmo, dados: { ordem: 0 } }),
    it({ id: "a", criado_em: mesmo, dados: { ordem: 2 } }),
  ];
  const ids = (l) => itensDaPagina(l, "com-voce", AGORA).map((i) => i.id);
  assert.deepEqual(ids(itens), ["b", "a", "c", "d"]);
  assert.deepEqual(ids([...itens].reverse()), ["b", "a", "c", "d"]);
});
