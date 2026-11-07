// components/central/Item.js
import { Flag, Sparkle, CalendarBlank, Check } from "@phosphor-icons/react/dist/ssr";
import { feito } from "@/app/central/acoes";
import { horaCurta, diaCurto } from "./formato";

const SELO_POST = {
  agendado: <span className="c-selo c-azul">agendado</span>,
  no_ar: <span className="c-selo c-verde"><Check size={10} weight="bold" />publicado</span>,
  esperando_voce: <span className="c-selo c-coral">falta postar</span>,
};

function BotaoFeito({ id, rotulo }) {
  return (
    <form action={feito}>
      <input type="hidden" name="id" value={id} />
      <button className="c-btn-sol" type="submit"><Check size={14} weight="bold" />{rotulo}</button>
    </form>
  );
}

export default function Item({ item }) {
  const linkNota = item.link?.startsWith("obsidian://") ? item.link : null;
  if (item.tipo === "post") {
    return (
      <article className="c-folha">
        <div className="c-meta"><CalendarBlank size={13} weight="bold" />{diaCurto(item.prazo)} · {horaCurta(item.prazo)} · {item.contexto}{SELO_POST[item.situacao]}</div>
        <h3 className="c-titulo-item">{item.titulo}</h3>
        {item.situacao === "esperando_voce" && <div className="c-acoes"><BotaoFeito id={item.id} rotulo="Postei" /></div>}
      </article>
    );
  }
  if (item.tipo === "tarefa") {
    return (
      <article className="c-folha">
        <div className="c-meta"><Sparkle size={13} weight="bold" />Tarefa do Claude{item.etapa ? ` · ${item.etapa}` : ""}</div>
        <h3 className="c-titulo-item">{item.titulo}</h3>
        {item.situacao === "com_claude" && <div className="c-barra"><i style={{ width: `${item.progresso ?? 10}%` }} /></div>}
        {item.texto_original && <p className="c-texto">{item.texto_original}</p>}
        {item.situacao === "esperando_voce" && (
          <div className="c-acoes">
            {linkNota && <a className="c-btn-linha" href={linkNota}>Abrir no Obsidian</a>}
            <BotaoFeito id={item.id} rotulo="Revisei" />
          </div>
        )}
      </article>
    );
  }
  return (
    <article className="c-folha">
      <div className="c-meta"><Flag size={13} weight="bold" />Decisão{item.prazo ? <span className="c-selo c-coral">prazo {diaCurto(item.prazo)}</span> : null}</div>
      <h3 className="c-titulo-item">{item.titulo}</h3>
      {item.texto_original && item.texto_original !== item.titulo && <p className="c-texto">{item.texto_original}</p>}
      <div className="c-acoes">
        {linkNota && <a className="c-btn-linha" href={linkNota}>Abrir no Obsidian</a>}
        <BotaoFeito id={item.id} rotulo="Feito" />
      </div>
    </article>
  );
}
