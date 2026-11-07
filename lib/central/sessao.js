// Sessao da Central: cookie "<expira>.<hmac>". Sem banco, sem biblioteca.
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "central_sessao";
export const DURACAO_S = 60 * 60 * 24 * 30;

export function assinar(expiraEmS, segredo) {
  const sig = createHmac("sha256", segredo).update(String(expiraEmS)).digest("base64url");
  return `${expiraEmS}.${sig}`;
}

export function novaSessao(segredo, agoraS = Math.floor(Date.now() / 1000)) {
  return assinar(agoraS + DURACAO_S, segredo);
}

export function sessaoValida(valor, segredo, agoraS = Math.floor(Date.now() / 1000)) {
  if (!valor || !segredo) return false;
  const [exp, sig] = String(valor).split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) <= agoraS) return false;
  const esperado = Buffer.from(assinar(exp, segredo).split(".")[1]);
  const recebido = Buffer.from(sig);
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}

export function senhaConfere(digitada, senha) {
  if (!digitada || !senha) return false;
  const h = (v) => createHmac("sha256", "central-cmp").update(String(v)).digest();
  return timingSafeEqual(h(digitada), h(senha));
}
