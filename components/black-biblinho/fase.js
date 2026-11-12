// Fases da página /black-biblinho (Black Friday 2026). Módulo SEM "use client": lido pelo
// servidor (page.js), pelo contador (cliente) e pelos testes.
//
//   pre     → até dom 22/11 23h59: pré-abertura. Sem preço. Botão leva pro grupo VIP.
//   venda   → seg 23/11 00h até seg 30/11 23h59: preço, contador e botão da Kiwify.
//   fechada → depois: a oferta fechou e não volta; a página aponta pro Plano Anual de sempre.
//
// Horários no fuso de Brasília (-03:00). Datas decididas pela Thali em 02/11/2026.
// Pra conferir cada fase antes do dia, a URL aceita ?fase=pre|venda|fechada.

export const ABERTURA = "2026-11-23T00:00:00-03:00";
export const FIM = "2026-11-30T23:59:59-03:00";

export const FASES = ["pre", "venda", "fechada"];

export function faseEm(agoraMs = Date.now()) {
  if (agoraMs < Date.parse(ABERTURA)) return "pre";
  if (agoraMs <= Date.parse(FIM)) return "venda";
  return "fechada";
}

// searchParams vem do Next já resolvido (objeto simples). Valor inválido é ignorado.
export function faseDaUrl(searchParams, agoraMs = Date.now()) {
  const pedida = searchParams && typeof searchParams.fase === "string" ? searchParams.fase : null;
  if (pedida && FASES.includes(pedida)) return pedida;
  return faseEm(agoraMs);
}

// Tempo que falta até um marco, em dias/horas/min/seg. null quando já passou.
export function restanteAte(isoMarco, agoraMs = Date.now()) {
  const ms = Date.parse(isoMarco) - agoraMs;
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
