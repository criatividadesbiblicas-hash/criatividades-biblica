"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// Carrossel pequeno pra prévias dentro de um card (3 imagens, setas, bolinhas, arrasto no celular,
// avança sozinho a cada 4s e para quando o mouse está em cima).
export default function MiniCarrossel({ imagens, alt = "Prévia", intervalo = 4000 }) {
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const toque = useRef(null);
  const n = imagens.length;
  const ir = (k) => setI(((k % n) + n) % n);

  useEffect(() => {
    if (pausa || n < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % n), intervalo);
    return () => clearInterval(t);
  }, [pausa, n, intervalo]);

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onTouchStart={(e) => { toque.current = e.touches[0].clientX; setPausa(true); }}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const dx = e.changedTouches[0].clientX - toque.current;
        if (Math.abs(dx) > 40) ir(dx < 0 ? i + 1 : i - 1);
        toque.current = null;
        setPausa(false);
      }}
    >
      <div className="relative aspect-[828/1170] max-h-[440px] w-full overflow-hidden rounded-t-xl shadow-[0_18px_40px_-16px_rgba(46,31,23,0.35)]">
        {imagens.map((img, k) => (
          <Image
            key={img.src}
            src={img.src}
            alt={`${alt}: ${img.legenda}`}
            fill
            sizes="(min-width: 1024px) 30vw, 90vw"
            className={`object-cover object-top transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-0"}`}
            priority={k === 0}
          />
        ))}
        <span className="absolute left-3 top-3 rounded-full bg-cacau/80 px-3 py-1 text-xs font-bold text-white">
          {imagens[i].legenda}
        </span>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(i - 1)}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-cacau shadow hover:bg-white"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => ir(i + 1)}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-cacau shadow hover:bg-white"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {imagens.map((img, k) => (
            <button
              key={img.src}
              type="button"
              onClick={() => ir(k)}
              aria-label={`Ver ${img.legenda}`}
              className={`h-2.5 rounded-full transition-all ${k === i ? "w-6 bg-coral-deep" : "w-2.5 bg-cacau/25"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
