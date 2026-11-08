// app/central/recados/page.js
import { exigirSessao } from "@/lib/central/acesso";
import { listarItens, ultimaRodada, estadoPedidos } from "@/lib/central/caderno";
import { contadores } from "@/lib/central/itens";
import Moldura from "@/components/central/Moldura";
import { FormRecado, Acompanhar } from "@/components/central/Pedidos";
import { diaCurto, horaCurta } from "@/components/central/formato";

export const dynamic = "force-dynamic";

const SELO = {
  novo: <span className="c-selo c-azul">na fila</span>,
  fazendo: <span className="c-selo c-azul">o Claude está fazendo</span>,
  feito: <span className="c-selo c-verde">respondido</span>,
  erro: <span className="c-selo c-coral">não deu certo</span>,
};

export default async function PaginaRecados() {
  await exigirSessao();
  const [{ itens }, rodada, pedidos] = await Promise.all([listarItens(), ultimaRodada(), estadoPedidos()]);
  const andando = pedidos.recados.some((r) => r.situacao === "novo" || r.situacao === "fazendo");
  return (
    <Moldura ativa="recados" contadores={contadores(itens)} rodada={rodada}>
      <Acompanhar ativo={andando || pedidos.atualizando} />
      <div>
        <h1 className="c-ola">Recado pro Claude</h1>
        <p className="c-sub">Peça pelo celular, o Claude do seu PC faz e responde aqui. Tudo na mesma conversa, então um recado continua o outro.</p>
      </div>
      {pedidos.pcLigado === false && <p className="c-erro" role="status">Seu PC está desligado ou sem internet. Os recados ficam na fila até ele ligar.</p>}
      <FormRecado pcLigado={pedidos.pcLigado} />
      <p className="c-sub">Publicar, enviar, gastar, mexer em campanha ou apagar não acontece por recado: vira um cartão em Com você, pro seu ok.</p>
      {pedidos.erro && <p className="c-erro" role="alert">Não consegui ler os recados agora.</p>}
      {pedidos.recados.map((r) => (
        <article className="c-folha" key={r.id}>
          <div className="c-meta">{diaCurto(r.criado_em)} · {horaCurta(r.criado_em)}{SELO[r.situacao]}</div>
          <p className="c-texto c-recado-dela">{r.texto}</p>
          {r.resposta && <p className="c-texto c-recado-resposta">{r.resposta}</p>}
        </article>
      ))}
    </Moldura>
  );
}
