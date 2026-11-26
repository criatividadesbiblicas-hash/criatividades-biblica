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

// Passe curto (15 min) de quem entrou com a senha provisoria: so abre a tela de trocar a senha.
export const COOKIE_TROCA = "central_troca";
export const DURACAO_TROCA_S = 15 * 60;
const assinarTroca = (exp, segredo) => createHmac("sha256", segredo).update(`troca:${exp}`).digest("base64url");

export function novaTroca(segredo, agoraS = Math.floor(Date.now() / 1000)) {
  const exp = agoraS + DURACAO_TROCA_S;
  return `${exp}.${assinarTroca(exp, segredo)}`;
}

export function trocaValida(valor, segredo, agoraS = Math.floor(Date.now() / 1000)) {
  if (!valor || !segredo) return false;
  const [exp, sig] = String(valor).split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) <= agoraS) return false;
  const esperado = Buffer.from(assinarTroca(exp, segredo));
  const recebido = Buffer.from(sig);
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}
