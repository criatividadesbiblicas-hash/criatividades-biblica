import { test } from "node:test";
import assert from "node:assert/strict";
import { assinar, novaSessao, sessaoValida, senhaConfere, DURACAO_S } from "./sessao.js";

const S = "segredo-de-teste";
const AGORA = 1_800_000_000;

test("sessao nova vale por 30 dias e depois expira", () => {
  const v = novaSessao(S, AGORA);
  assert.equal(sessaoValida(v, S, AGORA + 10), true);
  assert.equal(sessaoValida(v, S, AGORA + DURACAO_S + 1), false);
});

test("assinatura adulterada, segredo errado ou formato ruim nao valem", () => {
  const v = assinar(AGORA + 100, S);
  const [exp] = v.split(".");
  assert.equal(sessaoValida(`${Number(exp) + 999}.${v.split(".")[1]}`, S, AGORA), false);
  assert.equal(sessaoValida(v, "outro", AGORA), false);
  assert.equal(sessaoValida("lixo", S, AGORA), false);
  assert.equal(sessaoValida(undefined, S, AGORA), false);
  assert.equal(sessaoValida(v, undefined, AGORA), false);
});

test("senha confere so quando igual e nunca com vazio", () => {
  assert.equal(senhaConfere("abc", "abc"), true);
  assert.equal(senhaConfere("abd", "abc"), false);
  assert.equal(senhaConfere("", "abc"), false);
  assert.equal(senhaConfere("abc", undefined), false);
});
