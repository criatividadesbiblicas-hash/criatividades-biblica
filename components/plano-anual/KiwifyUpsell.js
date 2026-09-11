"use client";

import Script from "next/script";

// Botão de upsell de um clique da Kiwify (snippet upsell-v2).
// A Kiwify cobra no cartão que a pessoa acabou de usar, sem pedir os dados de novo.
//
// Os IDs abaixo são lidos pelo script da Kiwify e NÃO podem mudar: o sufixo `kuUKSBr`
// é o produto (Plano Anual Biblinho). Trocar o produto significa trocar os três IDs.
//
// `upsellUrl`  — para onde a pessoa vai DEPOIS DE ACEITAR (página de obrigado da Kiwify).
// `downsellUrl` — para onde vai DEPOIS DE RECUSAR. Se ficarem vazios, a Kiwify usa o
// destino padrão configurado no produto. Ver COMO-CONFIGURAR.md.
//
// As cores vêm do mundo .pa: botão sol com texto tinta, como em toda a marca.
// O padrão da Kiwify é vermelho #E84B3C; se quiser voltar pra ele, troque as duas vars.
export default function KiwifyUpsell({ upsellUrl = "", downsellUrl = "" }) {
  return (
    <>
      <div
        id="kiwify-upsell-kuUKSBr"
        data-upsell-url={upsellUrl}
        data-downsell-url={downsellUrl}
        style={{ "--kiwify-upsell-accept-bg": "#ffc531", "--kiwify-upsell-accept-color": "#22303f" }}
        className="flex flex-col items-center gap-5"
      >
        <button
          type="button"
          id="kiwify-upsell-trigger-kuUKSBr"
          className="w-full max-w-xl rounded-full bg-pa-sol px-8 py-6 font-display text-[1.35rem] leading-tight text-pa-tinta shadow-[0_16px_36px_-12px_rgba(233,164,0,0.8)] transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#ffd15a] active:scale-[0.98] md:text-[1.6rem]"
        >
          Sim, quero material para o ano todo
        </button>
        <div
          id="kiwify-upsell-cancel-trigger-kuUKSBr"
          role="button"
          tabIndex={0}
          className="cursor-pointer text-[15px] font-semibold text-pa-tinta/55 underline decoration-pa-tinta/25 underline-offset-4 transition-colors hover:text-pa-tinta/80"
        >
          Não, prefiro recusar esta oferta
        </div>
      </div>
      <Script src="https://snippets.kiwify.com/upsell-v2/upsell.min.js" strategy="afterInteractive" />
    </>
  );
}
