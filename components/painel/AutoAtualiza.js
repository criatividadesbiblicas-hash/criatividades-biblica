"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Recarrega os dados do servidor de tempos em tempos e mostra há quanto tempo
// o painel está olhando os mesmos números.
export default function AutoAtualiza({ geradoEm, segundos = 60 }) {
  const router = useRouter();
  const [idade, setIdade] = useState("agora");
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    const contar = () => {
      const s = Math.max(0, Math.round((Date.now() - new Date(geradoEm).getTime()) / 1000));
      setIdade(s < 60 ? "há " + s + "s" : s < 3600 ? "há " + Math.round(s / 60) + " min" : "há " + Math.round(s / 3600) + " h");
    };
    contar();
    const relogio = setInterval(contar, 1000);
    return () => clearInterval(relogio);
  }, [geradoEm]);

  useEffect(() => {
    const ciclo = setInterval(() => {
      setAtualizando(true);
      router.refresh();
      setTimeout(() => setAtualizando(false), 1500);
    }, segundos * 1000);
    return () => clearInterval(ciclo);
  }, [router, segundos]);

  return (
    <button
      type="button"
      onClick={() => {
        setAtualizando(true);
        router.refresh();
        setTimeout(() => setAtualizando(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-sand/60 bg-white/70 px-3 py-1 text-xs font-semibold text-cacau/70 transition hover:border-coral/50 hover:text-coral-deep"
      title="Atualiza sozinho a cada minuto. Clique para atualizar agora."
    >
      <span className={"h-1.5 w-1.5 rounded-full " + (atualizando ? "animate-ping bg-coral" : "bg-olive")} />
      {atualizando ? "atualizando…" : "lido " + idade}
    </button>
  );
}
