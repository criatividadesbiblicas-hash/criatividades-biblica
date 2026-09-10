import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, passo, indiceDaFrente, encaixar, estadoCapa, raio } from "./roda-math.js";

test("normalizar leva qualquer angulo para (-180, 180]", () => {
  assert.equal(normalizar(0), 0);
  assert.equal(normalizar(190), -170);
  assert.equal(normalizar(-190), 170);
  assert.equal(normalizar(720), 0);
});

test("passo e indice da frente com 8 capas", () => {
  assert.equal(passo(8), 45);
  assert.equal(indiceDaFrente(0, 8), 0);
  assert.equal(indiceDaFrente(45, 8), 1);
  assert.equal(indiceDaFrente(-45, 8), 7);
  assert.equal(indiceDaFrente(20, 8), 0);
  assert.equal(indiceDaFrente(25, 8), 1);
  assert.equal(indiceDaFrente(360 * 3 + 90, 8), 2);
});

test("encaixar arredonda para o multiplo do passo", () => {
  assert.equal(encaixar(20, 8), 0);
  assert.equal(encaixar(25, 8), 45);
  assert.equal(encaixar(-70, 8), -90);
});

test("estadoCapa: frente nitida, fundo oculto, z decresce com o angulo", () => {
  const frente = estadoCapa(0, 0, 8);
  assert.equal(frente.angulo, 0);
  assert.equal(frente.veu, 0);
  assert.equal(frente.oculta, false);
  assert.equal(frente.z, 100);
  const lado = estadoCapa(1, 0, 8);
  assert.equal(lado.angulo, 45);
  assert.ok(lado.veu > 0.2 && lado.veu < 0.4);
  assert.equal(lado.oculta, false);
  const fundo = estadoCapa(4, 0, 8);
  assert.equal(Math.abs(fundo.angulo), 180);
  assert.equal(fundo.oculta, true);
  assert.ok(fundo.z < lado.z && lado.z < frente.z);
});

test("raio cresce com o numero de capas e a largura", () => {
  assert.ok(raio(8, 240) > raio(6, 240));
  assert.ok(raio(8, 300) > raio(8, 240));
  assert.equal(raio(8, 240), Math.round(120 / Math.tan(Math.PI / 8)) + 40);
});
