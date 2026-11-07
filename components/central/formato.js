// components/central/formato.js
const FUSO = "America/Sao_Paulo";

export function saudacao(agora = new Date()) {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: FUSO }).format(agora));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export function dataLonga(agora = new Date()) {
  const t = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: FUSO }).format(agora);
  const limpo = t.replace("-feira", "");
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

export function horaCurta(iso) {
  if (!iso) return "";
  const [h, m] = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: FUSO }).format(new Date(iso)).split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export function diaCurto(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: FUSO }).format(new Date(iso)).replace(".", "");
}

export function progressoLimpo(p) {
  if (p === null || p === undefined || p === "" || Number.isNaN(Number(p))) return null;
  return Math.min(100, Math.max(0, Number(p)));
}

export function rodadaComProblema(rodada, agora = new Date()) {
  if (!rodada) return false;
  if (rodada.erro || !rodada.ok) return true;
  return agora.getTime() - new Date(rodada.quando).getTime() > 60 * 60000;
}

export function rotuloRodada(rodada, agora = new Date()) {
  if (rodada?.erro) return "Não consegui ver a última rodada do PC.";
  if (!rodada) return "O PC ainda não fez nenhuma rodada.";
  const min = Math.round((agora.getTime() - new Date(rodada.quando).getTime()) / 60000);
  const quando = min < 2 ? "agora há pouco" : min < 60 ? `há ${min} min` : `${diaCurto(rodada.quando)} às ${horaCurta(rodada.quando)}`;
  return rodada.ok ? `Atualizado ${quando} pelo PC.` : `A última rodada do PC (${quando}) deu erro: ${rodada.resumo || "sem detalhe"}.`;
}
