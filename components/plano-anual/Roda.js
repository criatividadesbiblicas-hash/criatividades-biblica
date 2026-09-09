"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { passo, indiceDaFrente, encaixar, estadoCapa, raio } from "./roda-math";

const LARGURA = 260; // px da capa (elemento de assinatura da pagina: precisa ler "substancial")
const RAZAO_CAPA = 1273 / 900; // proporcao real da capa (altura / largura)
const ALTURA = Math.round(LARGURA * RAZAO_CAPA); // altura da capa, derivada da largura
const SENSIBILIDADE = 0.28; // graus por pixel arrastado

// Carrossel 3D circular das capas. Sem numero, sem ordem. Gira por arrasto (mouse/toque),
// setas e teclado. Com prefers-reduced-motion vira uma fila estatica com a capa central maior.
export default function Roda({ historias }) {
  const n = historias.length;
  const R = raio(n, LARGURA);
  const [ang, setAng] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [reduzido, setReduzido] = useState(false);
  const inicio = useRef({ x: 0, ang: 0 });
  const frente = indiceDaFrente(ang, n);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzido(mq.matches);
    const f = (e) => setReduzido(e.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const girar = (delta) => setAng((a) => encaixar(a, n) + delta * passo(n));

  const onPointerDown = (e) => {
    inicio.current = { x: e.clientX, ang };
    setArrastando(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!arrastando) return;
    setAng(inicio.current.ang + (e.clientX - inicio.current.x) * SENSIBILIDADE);
  };
  const onPointerUp = () => {
    if (!arrastando) return;
    setArrastando(false);
    setAng((a) => encaixar(a, n));
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") girar(1);
    if (e.key === "ArrowLeft") girar(-1);
  };

  if (reduzido) {
    return (
      <div className="flex items-end justify-center gap-4 overflow-x-auto px-4 py-6">
        {/* A capa maior e a mesma que a roda mostra de frente em repouso (indice 0),
            e a legenda carrega o numero de estudos igual a versao com movimento. */}
        {historias.map((h, i) => (
          <figure key={h.slug} className={`shrink-0 text-center ${i === 0 ? "w-56" : "w-36 opacity-80"}`}>
            <Image src={h.src} alt={`Capa: ${h.nome}`} width={900} height={1273} className="rounded-[12px] border-4 border-white shadow-[0_18px_40px_-16px_rgba(11,60,100,0.35)]" />
            <figcaption className="mt-2 text-sm font-bold">
              {h.nome}
              <span className="mt-0.5 block text-[13px] font-semibold text-pa-tinta/75">{h.estudos} estudos</span>
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Histórias do Plano Anual"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative mx-auto h-[430px] w-full max-w-5xl touch-pan-y outline-none [perspective:1400px] [perspective-origin:50%_40%] md:h-[460px] ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-1/2 h-24 w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(42,138,62,0.16),rgba(42,138,62,0))]"
        />
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
          style={{
            transform: `translateZ(-${R}px) rotateY(${-ang}deg)`,
            transition: arrastando ? "none" : "transform .55s cubic-bezier(.22,.8,.26,1)",
          }}
        >
          {historias.map((h, i) => {
            const s = estadoCapa(i, ang, n);
            return (
              <figure
                key={h.slug}
                className="absolute [backface-visibility:hidden] [transform-style:preserve-3d]"
                style={{
                  width: LARGURA,
                  left: -LARGURA / 2,
                  top: -ALTURA / 2,
                  zIndex: s.z,
                  opacity: s.oculta ? 0.35 : 1,
                  transform: `rotateY(${i * passo(n)}deg) translateZ(${R}px)`,
                }}
              >
                <div className="relative">
                  <Image
                    src={h.src}
                    alt={i === frente ? `Capa: ${h.nome}` : ""}
                    width={900}
                    height={1273}
                    sizes="220px"
                    priority={i < 3}
                    draggable={false}
                    className="pointer-events-none block w-full rounded-[12px] border-4 border-white shadow-[0_22px_48px_rgba(11,60,100,0.28)]"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[12px] bg-pa-ceu-claro transition-opacity duration-300" style={{ opacity: s.veu }} />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 right-0 top-full mt-1.5 h-[70px] rounded-[12px] opacity-[0.14] blur-[1px] [mask-image:linear-gradient(#000,transparent)]"
                    style={{ background: `url(${h.src}) center top / 100% auto no-repeat`, transform: "scaleY(-1)" }}
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      <p className="min-h-[3.25rem] text-center" aria-live="polite">
        <span className="block font-display text-[1.35rem] text-pa-tinta">{historias[frente].nome}</span>
        <span className="block text-sm font-semibold text-pa-tinta/70">{historias[frente].estudos} estudos</span>
      </p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button type="button" onClick={() => girar(-1)} aria-label="História anterior" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pa-tinta shadow-[0_6px_16px_rgba(11,60,100,0.16)] transition-colors hover:bg-pa-sol">
          <CaretLeft size={22} weight="bold" />
        </button>
        <button type="button" onClick={() => girar(1)} aria-label="Próxima história" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pa-tinta shadow-[0_6px_16px_rgba(11,60,100,0.16)] transition-colors hover:bg-pa-sol">
          <CaretRight size={22} weight="bold" />
        </button>
      </div>
      <p className="mt-3 text-center text-[13px] font-semibold text-pa-tinta/60">arrasta pro lado ou usa as setas</p>
    </div>
  );
}
