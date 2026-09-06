"use client";

import { useEffect } from "react";
import Script from "next/script";

// Rastreamento da landing /emocoes (Criatividades Bíblicas)
// - Meta Pixel 493199083223154: PageView, ViewContent e InitiateCheckout (clique nos botões da Kiwify)
// - Repasse de UTM/src/sck da URL pros links do checkout (Kiwify grava e o webhook devolve no Purchase)
// - Microsoft Clarity (mapa de calor), quando CLARITY_ID estiver preenchido
// O Purchase NÃO é disparado aqui: vem pelo servidor (webhook Kiwify → Supabase → API de Conversões).

const PIXEL_ID = "493199083223154";
const CLARITY_ID = ""; // ex.: "abcd1234ef" — Clarity → Settings → Setup → o código depois de clarity.ms/tag/
const PRODUTO = {
  content_name: "Jesus Cuida das Minhas Emocoes",
  content_ids: ["gnhrmc2"],
  content_type: "product",
  value: 57.9,
  currency: "BRL",
};

function fire(evento) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", evento, PRODUTO);
  }
}

export default function Tracking() {
  useEffect(() => {
    // 1) guarda os parâmetros da URL (utm_*, src, sck) e repassa pros links do checkout
    let qs = window.location.search.replace(/^\?/, "");
    try {
      if (qs) sessionStorage.setItem("cb_qs", qs);
      else qs = sessionStorage.getItem("cb_qs") || "";
    } catch {
      /* navegador sem storage */
    }
    const links = document.querySelectorAll('a[href*="pay.kiwify.com.br"]');
    links.forEach((a) => {
      if (qs && !a.dataset.cbQs) {
        a.href += (a.href.includes("?") ? "&" : "?") + qs;
        a.dataset.cbQs = "1";
      }
      a.addEventListener("click", () => fire("InitiateCheckout"));
    });

    // 2) ViewContent assim que o pixel estiver pronto (o script carrega em paralelo)
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
  }, []);

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
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
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
