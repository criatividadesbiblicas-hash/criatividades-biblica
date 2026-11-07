// components/central/Lista.js
import { InstagramLogo, FacebookLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { PAGINAS } from "@/lib/central/itens";
import Item from "./Item";

const VAZIO = {
  "com-voce": "Nada esperando você. Quando o cofre ou o Claude precisarem do seu ok, aparece aqui.",
  "com-o-claude": "Nenhuma tarefa do Claude em andamento.",
  agendado: "Nada agendado a partir de hoje. A agenda vem da nota Agenda de postagens, no cofre.",
};

export default function Lista({ pagina, itens, erro }) {
  const p = PAGINAS[pagina];
  return (
    <>
      <div>
        <h1 className="c-ola">{p.titulo}</h1>
        <p className="c-sub">{p.subtitulo}</p>
      </div>
      {erro && <p className="c-erro" role="alert">{erro}</p>}
      {pagina === "comentarios" && itens.length === 0 && (
        <section className="c-aviso">
          <h2>Sem conexão ainda</h2>
          <p>Comentários e directs do Instagram e comentários e mensagens do Facebook chegam na etapa 2, cada um com a resposta sugerida e o botão aprovar e enviar. O TikTok vem depois.</p>
          <p className="c-meta" style={{ marginTop: 10, gap: 12 }}><InstagramLogo size={18} /><FacebookLogo size={18} /><TiktokLogo size={18} /></p>
        </section>
      )}
      {pagina === "campanhas" && itens.length === 0 && (
        <section className="c-aviso">
          <h2>Sem conexão ainda</h2>
          <p>Anúncios e vendas da Kiwify chegam na etapa 3. Enquanto isso, o painel de anúncios continua no endereço de sempre.</p>
        </section>
      )}
      {!["comentarios", "campanhas"].includes(pagina) && itens.length === 0 && !erro && <section className="c-aviso"><p>{VAZIO[pagina]}</p></section>}
      {itens.map((i) => <Item key={i.id} item={i} />)}
    </>
  );
}
