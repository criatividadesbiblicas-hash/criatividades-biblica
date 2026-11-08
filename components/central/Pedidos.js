// components/central/Pedidos.js
"use client";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowsClockwise, PaperPlaneTilt } from "@phosphor-icons/react";
import { atualizarAgora, mandarRecado } from "@/app/central/acoes";

// Enquanto houver pedido em andamento, recarrega os dados da tela sozinha (a cada 8 s, por até 30 min).
export function Acompanhar({ ativo }) {
  const router = useRouter();
  const inicio = useRef(Date.now());
  useEffect(() => {
    if (!ativo) return;
    const t = setInterval(() => {
      if (Date.now() - inicio.current > 30 * 60 * 1000) return clearInterval(t);
      router.refresh();
    }, 8000);
    return () => clearInterval(t);
  }, [ativo, router]);
  return null;
}

function BotaoEnviar({ ocupado, rotulo, rotuloOcupado, Icone }) {
  const { pending } = useFormStatus();
  const girando = pending || ocupado;
  return (
    <button className="c-btn-sol" type="submit" disabled={girando}>
      <Icone size={15} weight="bold" className={girando && Icone === ArrowsClockwise ? "c-gira" : undefined} />
      {girando ? rotuloOcupado : rotulo}
    </button>
  );
}

export function BotaoAtualizar({ atualizando, pcLigado }) {
  return (
    <form action={atualizarAgora} className="c-atualizar">
      <BotaoEnviar ocupado={atualizando} rotulo="Atualizar agora" rotuloOcupado="Atualizando..." Icone={ArrowsClockwise} />
      {atualizando && pcLigado !== false && <span className="c-sub">o PC pega em até 15 segundos</span>}
      {pcLigado === false && <span className="c-sub">seu PC está desligado: atualiza quando ele ligar</span>}
    </form>
  );
}

export function FormRecado({ pcLigado }) {
  const [estado, acao] = useActionState(mandarRecado, { erro: null, ok: false });
  const caixa = useRef(null);
  useEffect(() => { if (estado.ok && caixa.current) caixa.current.value = ""; }, [estado]);
  return (
    <form action={acao} className="c-folha c-recado-form">
      <label htmlFor="recado" className="c-rotulo">O que você quer que eu faça?</label>
      <textarea id="recado" name="texto" ref={caixa} rows={4} maxLength={4000} required placeholder="Ex.: segura o post de quinta, vamos refazer a capa." />
      {estado.erro && <p className="c-erro" role="alert">{estado.erro}</p>}
      {estado.ok && <p className="c-sub" role="status">Recado guardado. {pcLigado === false ? "Seu PC está desligado: o Claude pega quando ele ligar." : "O Claude do PC pega em até 15 segundos."}</p>}
      <div className="c-acoes">
        <BotaoEnviar rotulo="Mandar recado" rotuloOcupado="Mandando..." Icone={PaperPlaneTilt} />
      </div>
    </form>
  );
}
