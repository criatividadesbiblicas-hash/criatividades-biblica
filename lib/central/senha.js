// Senha da Central guardada embaralhada (scrypt + sal). Puro, sem rede: roda igual no servidor, no PC e nos testes.
// Formato guardado: "scrypt$<sal base64url>$<hash base64url>". O mesmo formato é gerado por ferramentas/central/senha-provisoria.mjs.
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export const MINIMO = 8;

export function embaralhar(senha) {
  const sal = randomBytes(16);
  const h = scryptSync(String(senha), sal, 32);
  return `scrypt$${sal.toString("base64url")}$${h.toString("base64url")}`;
}

export function confere(senha, guardado) {
  try {
    const [alg, sal, h] = String(guardado || "").split("$");
    if (alg !== "scrypt" || !sal || !h || !senha) return false;
    const esperado = Buffer.from(h, "base64url");
    const calculado = scryptSync(String(senha), Buffer.from(sal, "base64url"), esperado.length);
    return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}

// Erro em português pra mostrar na tela, ou null se a senha nova serve.
export function problemaNaSenhaNova(nova, repetida) {
  const n = String(nova || "");
  if (n.length < MINIMO) return `A senha nova precisa ter pelo menos ${MINIMO} letras ou números.`;
  if (n.length > 100) return "A senha nova ficou comprida demais.";
  if (n !== String(repetida || "")) return "As duas senhas novas não estão iguais.";
  return null;
}
