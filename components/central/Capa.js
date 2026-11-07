// components/central/Capa.js
import Link from "next/link";
import { User, Sparkle, CalendarBlank, ChatCircle, CaretRight, InstagramLogo, FacebookLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";
import { saudacao, dataLonga, horaCurta, progressoLimpo, rodadaComProblema, rotuloRodada } from "./formato";

const SEM_LER = "Não consegui ver agora";
const ORIGEM_ROTULO = { cofre: "do cofre", claude: "do Claude" };

export default function Capa({ resumo, erro, rodada }) {
  const { comVoce, comClaude, agendadoHoje } = resumo;
  return (
    <div className="c-capa">
      <div className="c-saud">
        <h1 className="c-ola">{saudacao()}, Thali</h1>
        <p className="c-sub">{dataLonga()}</p>
        {rodadaComProblema(rodada)
          ? <p className="c-erro c-rodada" role="status">{rotuloRodada(rodada)}</p>
          : <p className="c-sub c-rodada">{rotuloRodada(rodada)}</p>}
      </div>
      {erro && <p className="c-erro" role="alert">{erro}</p>}

      <Link href="/central/com-voce" className="c-porta c-voce">
        <div className="c-cab"><span><User size={14} weight="bold" />Com você</span><span>ver tudo<CaretRight size={14} weight="bold" /></span></div>
        <h2>{erro ? SEM_LER : comVoce.total === 0 ? "Nada esperando você agora" : comVoce.total === 1 ? "1 coisa espera o seu ok" : `${comVoce.total} coisas esperam o seu ok`}</h2>
        {!erro && comVoce.primeiros.length > 0 && (
          <ul>
            {comVoce.primeiros.map((i) => (
              <li key={i.id}>{i.titulo}<em>{i.tipo === "post" ? "postar" : ORIGEM_ROTULO[i.origem] || "decisão"}</em></li>
            ))}
          </ul>
        )}
      </Link>

      <div className="c-lado">
        <div className="c-dupla">
          <Link href="/central/com-o-claude" className="c-porta c-branca">
            <div className="c-cab"><span><Sparkle size={13} weight="bold" />Com o Claude</span></div>
            <h2>{erro ? SEM_LER : comClaude.totalFazendo === 0 ? "Nada em andamento" : `${comClaude.totalFazendo} fazendo agora`}</h2>
            {!erro && comClaude.fazendo.map((i) => (
              <div className="c-tarefa" key={i.id}>{i.titulo}{progressoLimpo(i.progresso) !== null && <div className="c-barra"><i style={{ width: `${progressoLimpo(i.progresso)}%` }} /></div>}</div>
            ))}
            {!erro && comClaude.prontos > 0 && <p className="c-tarefa"><b>{comClaude.prontos}</b> pronto{comClaude.prontos > 1 ? "s" : ""} pra revisar</p>}
          </Link>
          <Link href="/central/agendado" className="c-porta c-ceu">
            <div className="c-cab"><span><CalendarBlank size={13} weight="bold" />Agendado</span></div>
            <h2>{erro ? SEM_LER : resumo.totalHoje === 0 ? "Nada hoje" : `${resumo.totalHoje} hoje`}</h2>
            <div className="c-prox">{!erro && agendadoHoje.map((i) => <div key={i.id}><b>{horaCurta(i.prazo)}</b>{i.titulo}</div>)}</div>
          </Link>
        </div>

        <Link href="/central/comentarios" className="c-porta c-branca">
          <div className="c-cab"><span><ChatCircle size={13} weight="bold" />Comentários e mensagens</span><span>sem conexão ainda<CaretRight size={14} weight="bold" /></span></div>
          <p className="c-texto" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <InstagramLogo size={16} /><FacebookLogo size={16} /><TiktokLogo size={16} /> Chega na etapa 2, com o botão aprovar e enviar.
          </p>
        </Link>

        <div className="c-faixa">
          <div><small>Campanhas e vendas</small>Chega na etapa 3, com as vendas da Kiwify.</div>
        </div>
      </div>
    </div>
  );
}
