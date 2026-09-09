"use client";

import { useEffect, useState } from "react";

// Contagem regressiva da promoção do Pack Arca de Noé.
// FIM da promo: quarta-feira 16/09/2026, 23h59 (horário de Brasília).
import { FIM_PROMO } from "./promo";
export { FIM_PROMO };

function restante() {
  const ms = new Date(FIM_PROMO).getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function useRestante() {
  const [r, setR] = useState(null);
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    setR(restante());
    setPronto(true);
    const t = setInterval(() => setR(restante()), 1000);
    return () => clearInterval(t);
  }, []);
  return { r, pronto };
}

const dois = (n) => String(n).padStart(2, "0");

// Blocos dias / horas / min / seg, usados só no card da oferta.
export function ContadorBlocos({ className = "" }) {
  const { r, pronto } = useRestante();
  if (!pronto) return <div className={`h-[4.5rem] ${className}`} aria-hidden="true" />;
  if (!r) {
    return <p className={`text-sm font-bold text-arca-coral ${className}`}>A promoção encerrou. O Pack continua disponível pelo valor normal.</p>;
  }
  const partes = [["dias", r.d], ["horas", r.h], ["min", r.m], ["seg", r.s]];
  return (
    <div className={`flex items-center gap-2 ${className}`} role="timer" aria-live="off">
      {partes.map(([rot, v], i) => (
        <div key={rot} className="flex items-center gap-2">
          <div className="flex min-w-[3.9rem] flex-col items-center rounded-[1.1rem] bg-arca-ceu-claro px-2 py-2 ring-1 ring-arca-mar/15">
            <span className="font-display text-[1.75rem] font-extrabold leading-none text-arca-fundo tabular-nums">{dois(v)}</span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-arca-tinta/75">{rot}</span>
          </div>
          {i < 3 && <span className="-mt-3 font-display text-xl font-extrabold text-arca-mar/50">:</span>}
        </div>
      ))}
    </div>
  );
}

// Barra fixa no rodapé. Só aparece depois que a visitante viu o bônus (sentinela #bonus),
// pra não entregar preço antes da história. Some quando a oferta está na tela.
// O botão leva pro bloco da oferta (não pro checkout): a compra acontece só no card de preço.
export function BarraContador({ href, label = "Quero o Pack" }) {
  const { r, pronto } = useRestante();
  const [liberada, setLiberada] = useState(false);
  const [sobreOferta, setSobreOferta] = useState(false);
  useEffect(() => {
    const bonus = document.getElementById("bonus");
    const oferta = document.getElementById("oferta");
    if (!bonus || !oferta) return undefined;
    const io1 = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setLiberada(true)), { threshold: 0.3 });
    const io2 = new IntersectionObserver((es) => es.forEach((e) => setSobreOferta(e.isIntersecting)), { threshold: 0.15 });
    io1.observe(bonus);
    io2.observe(oferta);
    return () => { io1.disconnect(); io2.disconnect(); };
  }, []);
  if (!pronto || !r) return null;
  const visivel = liberada && !sobreOferta;
  const txt = r.d > 0 ? `${r.d}d ${dois(r.h)}h ${dois(r.m)}min` : `${dois(r.h)}h ${dois(r.m)}min ${dois(r.s)}s`;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visivel ? "translate-y-0" : "translate-y-[120%]"}`}>
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full bg-arca-abismo py-2 pl-5 pr-2 text-white shadow-[0_14px_36px_-12px_rgba(8,63,120,0.7)]">
        <p className="text-sm leading-tight md:text-[15px]">
          <span className="font-bold">Bônus acaba em {txt}</span>
        </p>
        <a
          href={href}
          className="shrink-0 rounded-full bg-arca-sol px-5 py-2.5 font-display text-[15px] font-extrabold text-arca-tinta transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
