// Fases da página /black-biblinho (Black Friday 2026). Módulo SEM "use client": lido pelo
// servidor (page.js), pelo contador (cliente) e pelos testes.
//
//   venda   → da publicação até seg 30/11 23h59: preço, contador e botão da Kiwify.
//   fechada → depois: a oferta fechou e não volta; a página aponta pro Plano Anual de sempre.
//
// Não existe mais pré-abertura (decisão da Thali em 15/11/2026, seguindo o método ADP: a página
// da D é a página de venda, com botão de comprar, desde o primeiro dia). O gatilho é o prazo.
// Horários no fuso de Brasília (-03:00). Fim decidido em 02/11/2026.
// Pra conferir a fase fechada antes do dia, a URL aceita ?fase=fechada.

export const FIM = "2026-11-30T23:59:59-03:00";

export const FASES = ["venda", "fechada"];

export function faseEm(agoraMs = Date.now()) {
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
