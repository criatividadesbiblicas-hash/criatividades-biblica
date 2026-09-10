// Matematica pura da roda 3D das historias (sem DOM, testavel com node --test).

// Normaliza qualquer angulo (em graus) para o intervalo [-180, 180).
// Ex.: normalizar(180) = -180 (o proprio calculo devolve o limite negativo, nao o positivo).
export const normalizar = (a) => ((a % 360) + 540) % 360 - 180;
export const passo = (n) => 360 / n;
export const indiceDaFrente = (ang, n) => ((Math.round(ang / passo(n)) % n) + n) % n;
export const encaixar = (ang, n) => Math.round(ang / passo(n)) * passo(n);
export function estadoCapa(i, ang, n) {
  const angulo = normalizar(i * passo(n) - ang);
  const t = Math.abs(angulo) / 180; // 0 = frente, 1 = fundo
  return {
    angulo,
    veu: Math.min(0.78, t * 1.15),
    oculta: t > 0.62,
    z: Math.round(100 - Math.abs(angulo)),
  };
}
// Raio pra n capas de `larguraCapa` px nao se sobreporem, com folga de 40px.
export const raio = (n, larguraCapa) => Math.round(larguraCapa / 2 / Math.tan(Math.PI / n)) + 40;
