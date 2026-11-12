"use client";

import { useEffect } from "react";
import Script from "next/script";

// Rastreamento da página /black-biblinho (mesmo pixel e Clarity das outras páginas da casa).
// - Meta Pixel: PageView, ViewContent, InitiateCheckout (clique na Kiwify) e Lead (clique no aviso pelo Instagram, na pré-abertura)
// - Repasse de UTM/src/sck da URL pros links do checkout
// O Purchase vem pelo servidor (webhook Kiwify → Supabase → API de Conversões).

const PIXEL_ID = "493199083223154";
const CLARITY_ID = "ydn96d2tri";
const PRODUTO = {
  content_name: "Black Biblinho · Acesso Total",
  content_ids: ["black-biblinho"],
  content_type: "product",
  value: 297,
  currency: "BRL",
};

function fire(evento, dados = PRODUTO) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", evento, dados);
  }
}

export default function Tracking({ fase }) {
  useEffect(() => {
    let qs = window.location.search.replace(/^\?/, "");
    // ?fase= é só pra conferência interna: não vai pro checkout.
    qs = qs.split("&").filter((p) => p && !p.startsWith("fase=")).join("&");
    try {
      if (qs) sessionStorage.setItem("cb_qs", qs);
      else qs = sessionStorage.getItem("cb_qs") || "";
    } catch {
      /* navegador sem storage */
    }
    document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach((a) => {
      if (qs && !a.dataset.cbQs) {
        a.href += (a.href.includes("?") ? "&" : "?") + qs;
        a.dataset.cbQs = "1";
      }
      a.addEventListener("click", () => fire("InitiateCheckout"));
    });
    document.querySelectorAll('a[href*="instagram.com"]').forEach((a) => {
      a.addEventListener("click", () => fire("Lead", { content_name: "Aviso de abertura pelo Instagram", content_category: fase }));
    });

    let tentativas = 0;
    const t = setInterval(() => {
      tentativas += 1;
      if (typeof window.fbq === "function") {
        fire("ViewContent");
        clearInterval(t);
      } else if (tentativas > 40) {
        clearInterval(t);
      }
    }, 250);
    return () => clearInterval(t);
  }, [fase]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
      {CLARITY_ID ? (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      ) : null}
    </>
  );
}
