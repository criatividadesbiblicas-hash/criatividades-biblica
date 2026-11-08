// components/central/Menu.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { House, User, Sparkle, CalendarBlank, ChatCircle, ChartLineUp, PaperPlaneTilt, List, X } from "@phosphor-icons/react";
import { PAGINAS } from "@/lib/central/itens";

const ICONES = { capa: House, "com-voce": User, "com-o-claude": Sparkle, agendado: CalendarBlank, comentarios: ChatCircle, campanhas: ChartLineUp, recados: PaperPlaneTilt };

function Itens({ ativa, contadores, aoTocar }) {
  const linhas = [["capa", { titulo: "Capa", subtitulo: "o resumo do dia" }], ...Object.entries(PAGINAS), ["recados", { titulo: "Recado pro Claude", subtitulo: "peça e acompanhe" }]];
  return linhas.map(([chave, p]) => {
    const Icone = ICONES[chave];
    const n = contadores?.[chave];
    return (
      <Link key={chave} href={chave === "capa" ? "/central" : `/central/${chave}`} className="c-item-menu" aria-current={ativa === chave ? "page" : undefined} onClick={aoTocar}>
        <span className="c-ic"><Icone size={18} weight="bold" /></span>
        <span className="c-txt">{p.titulo}<small>{p.subtitulo}</small></span>
        {n > 0 && <span className={`c-cont${p.pedeVoce ? " c-sol" : ""}`}>{n}</span>}
      </Link>
    );
  });
}

export default function Menu({ ativa, contadores, rotulo }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <header className="c-topo">
        <button className="c-icone-btn" type="button" aria-label="Abrir o menu" aria-expanded={aberto} onClick={() => setAberto(true)}><List size={20} weight="bold" /></button>
        <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
        <span style={{ width: 42 }} aria-hidden="true" />
      </header>
      {aberto && (
        <>
          <div className="c-veu" onClick={() => setAberto(false)} aria-hidden="true" />
          <nav className="c-gaveta" aria-label="Menu da Central">
            <button className="c-icone-btn" type="button" aria-label="Fechar o menu" onClick={() => setAberto(false)} style={{ alignSelf: "flex-end" }}><X size={18} weight="bold" /></button>
            <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
            <Itens ativa={ativa} contadores={contadores} aoTocar={() => setAberto(false)} />
            <p className="c-pe-menu">{rotulo}</p>
          </nav>
        </>
      )}
      <nav className="c-lateral" aria-label="Menu da Central">
        <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
        <Itens ativa={ativa} contadores={contadores} />
        <p className="c-pe-menu">{rotulo}</p>
      </nav>
    </>
  );
}
