"use client";

import { useEffect, useState } from "react";
import { ABERTURA, FIM, restanteAte } from "./fase";

// Contagem regressiva da Black Friday. Na pré-abertura conta até a abertura (seg 23/11 00h);
// na venda conta até o fim (seg 30/11 23h59). Horário de Brasília.

function useRestante(marco) {
  const [r, setR] = useState(null);
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    setR(restanteAte(marco));
    setPronto(true);
    const t = setInterval(() => setR(restanteAte(marco)), 1000);
    return () => clearInterval(t);
  }, [marco]);
  return { r, pronto };
}

const dois = (n) => String(n).padStart(2, "0");

// Blocos dias / horas / min / seg, usados no card da oferta e no hero.
export function ContadorBlocos({ fase, escuro = false, className = "" }) {
  const marco = fase === "pre" ? ABERTURA : FIM;
  const { r, pronto } = useRestante(marco);
  if (!pronto) return <div className={`h-[4.6rem] ${className}`} aria-hidden="true" />;
  if (!r) return null;
  const partes = [["dias", r.d], ["horas", r.h], ["min", r.m], ["seg", r.s]];
  const caixa = escuro ? "bg-white/10 ring-white/15" : "bg-pa-ceu-claro ring-pa-tinta/10";
  const num = escuro ? "text-pa-sol" : "text-pa-tinta";
  const rot = escuro ? "text-white/70" : "text-pa-tinta/70";
  const sep = escuro ? "text-white/40" : "text-pa-tinta/30";
  return (
    <div className={`flex items-center gap-2 ${className}`} role="timer" aria-live="off" aria-label={fase === "pre" ? "Tempo até a abertura" : "Tempo até o fim da oferta"}>
      {partes.map(([rotulo, v], i) => (
        <div key={rotulo} className="flex items-center gap-2">
          <div className={`flex min-w-[3.9rem] flex-col items-center rounded-[1.1rem] px-2 py-2 ring-1 ${caixa}`}>
            <span className={`font-display text-[1.75rem] leading-none tabular-nums ${num}`}>{dois(v)}</span>
            <span className={`mt-1 text-[11px] font-bold uppercase tracking-[0.06em] ${rot}`}>{rotulo}</span>
          </div>
          {i < 3 && <span className={`-mt-3 font-display text-xl ${sep}`}>:</span>}
        </div>
      ))}
    </div>
  );
}

// Barra fixa no rodapé, só na fase de venda. Aparece depois que a visitante passou pelo
// bloco do que entra (sentinela #entra) e some quando a oferta está na tela.
export function BarraContador({ href = "#oferta", label = "Quero o Acesso Total" }) {
  const { r, pronto } = useRestante(FIM);
  const [liberada, setLiberada] = useState(false);
  const [sobreOferta, setSobreOferta] = useState(false);
  useEffect(() => {
    const gatilho = document.getElementById("entra");
    const oferta = document.getElementById("oferta");
    const fim = document.getElementById("fim");
    if (!gatilho || !oferta) return undefined;
    const io1 = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setLiberada(true)), { threshold: 0.2 });
    // Some quando a oferta ou o fechamento (que já tem o botão) estão na tela: nada de barra em cima de botão.
    const visiveis = new Set();
    const io2 = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
      setSobreOferta(visiveis.size > 0);
    }, { threshold: 0.15 });
    io1.observe(gatilho);
    io2.observe(oferta);
    if (fim) io2.observe(fim);
    return () => { io1.disconnect(); io2.disconnect(); };
  }, []);
  if (!pronto || !r) return null;
  const visivel = liberada && !sobreOferta;
  const txt = r.d > 0 ? `${r.d}d ${dois(r.h)}h ${dois(r.m)}min` : `${dois(r.h)}h ${dois(r.m)}min ${dois(r.s)}s`;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${visivel ? "translate-y-0" : "translate-y-[120%]"}`}>
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full bg-bb-noite py-2 pl-5 pr-2 text-white shadow-[0_14px_36px_-12px_rgba(10,14,30,0.7)]">
        <p className="text-sm leading-tight md:text-[15px]">
          <span className="font-bold">Fecha em {txt}</span>
        </p>
        <a href={href} className="shrink-0 rounded-full bg-pa-sol px-5 py-2.5 font-display text-[15px] text-pa-tinta transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
          {label}
        </a>
      </div>
    </div>
  );
}
