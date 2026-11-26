import { test } from "node:test";
import assert from "node:assert/strict";
import { embaralhar, confere, problemaNaSenhaNova } from "./senha.js";
import { novaTroca, trocaValida, novaSessao, sessaoValida, DURACAO_TROCA_S } from "./sessao.js";

test("senha embaralhada confere so com a senha certa", () => {
  const g = embaralhar("minha senha boa");
  assert.match(g, /^scrypt\$[\w-]+\$[\w-]+$/);
  assert.equal(confere("minha senha boa", g), true);
  assert.equal(confere("minha senha bo", g), false);
  assert.equal(confere("", g), false);
  assert.equal(confere("minha senha boa", "lixo"), false);
  assert.notEqual(embaralhar("x12345678"), embaralhar("x12345678"));
});

test("senha nova: minimo de 8 e as duas iguais", () => {
  assert.match(problemaNaSenhaNova("curta", "curta"), /pelo menos 8/);
  assert.match(problemaNaSenhaNova("senhaboa1", "senhaboa2"), /não estão iguais/);
  assert.equal(problemaNaSenhaNova("senhaboa1", "senhaboa1"), null);
});

test("passe de troca vale 15 min e nao serve como sessao", () => {
  const S = "segredo-de-teste", AGORA = 1_800_000_000;
  const t = novaTroca(S, AGORA);
  assert.equal(trocaValida(t, S, AGORA + 60), true);
  assert.equal(trocaValida(t, S, AGORA + DURACAO_TROCA_S + 1), false);
  assert.equal(sessaoValida(t, S, AGORA + 60), false);
  assert.equal(trocaValida(novaSessao(S, AGORA), S, AGORA + 60), false);
});
