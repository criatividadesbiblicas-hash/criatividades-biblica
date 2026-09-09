// Fim da promoção de lançamento do Pack Arca de Noé: quarta-feira 16/09/2026, 23h59 (Brasília).
// Módulo sem "use client" de propósito: é lido pelo servidor (page.js) e pelo cliente (Contador.js).
export const FIM_PROMO = "2026-09-16T23:59:59-03:00";
export const promoAtiva = () => Date.now() < new Date(FIM_PROMO).getTime();
