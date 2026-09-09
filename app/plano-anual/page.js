/*
  CONTRATO DE DIREÇÃO — Plano Anual Biblinho (perene)
  THESIS: a professora entra numa sexta à noite sem aula e sai com o ano inteiro resolvido; a página
  é uma história (cena → diagnóstico → virada → roda das histórias → material real → prova → oferta)
  e recusa hero com preço, selo de desconto e contador.
  OWN-WORLD: "letra da capa" — Lilita One nos títulos, Nunito no texto; céu claro e branco em campos
  inteiros, verde campo nos destaques, sol nos botões, laranja no ponto de atenção. Páginas reais dos
  PDFs em leque; sinal autoral = a roda 3D das capas (sem número, sem ordem).
  FORM: mundo PINADO pela cliente em 2026-09-09 (direção A no companion visual; roda circular aprovada).
  FINISH: unreviewed is unfinished — build, revisão impeccable, capturas 1440/390, roda no toque, pixel.
*/
import Image from "next/image";
import { Lilita_One } from "next/font/google";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Roda from "@/components/plano-anual/Roda";
import Tracking from "@/components/plano-anual/Tracking";
import { KIWIFY_URL, OFERTA, HISTORIAS, FAQ } from "@/components/plano-anual/dados";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita", display: "swap" });

const HOST = "https://materiais.criatividadesbiblicas.com.br";
const PAGE_URL = `${HOST}/plano-anual`;
const TITLE = "Plano Anual Biblinho: um ano de aula bíblica pronta | Criatividades Bíblicas";
const DESCRIPTION =
  "Uma história bíblica por mês, com a aula pronta pra Kids (4 a 6) e Júnior (7 a 10) e o material Baby de bônus: apostila com a fala da professora, quadro de história, atividades, versículo e lembrancinha. R$ 597 à vista ou 12x de R$ 61,74.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Criatividades Bíblicas",
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${HOST}/plano-anual/og.png`, width: 1200, height: 630, alt: "Plano Anual Biblinho" }],
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Plano Anual Biblinho",
      description: DESCRIPTION,
      image: `${HOST}/plano-anual/og.png`,
      brand: { "@type": "Brand", name: "Criatividades Bíblicas" },
      offers: { "@type": "Offer", price: String(OFERTA.precoNumero), priceCurrency: "BRL", availability: "https://schema.org/InStock", url: PAGE_URL },
    },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

/* ---------- peças locais ---------- */

function Botao({ href = KIWIFY_URL, children, className = "", externo = true }) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-pa-sol px-8 py-4 font-display text-lg leading-none text-pa-tinta shadow-[0_12px_28px_-10px_rgba(233,164,0,0.75)] transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#ffd15a] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

function H2({ children, className = "" }) {
  return <h2 className={`text-balance font-display text-[2rem] leading-[1.08] text-pa-tinta md:text-[2.75rem] ${className}`}>{children}</h2>;
}

function Texto({ children, className = "" }) {
  return <p className={`text-[17px] font-medium leading-relaxed text-pa-tinta/80 md:text-xl ${className}`}>{children}</p>;
}

export default function PlanoAnualPage() {
  return (
    <div className={`pa ${lilita.variable}`}>
      <Nav cta={{ label: "Quero o Plano Anual", href: "#oferta" }} links={[]} logoHref="/plano-anual" />
      <Tracking />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <main>
        {/* 1. Hero: a promessa, sem preço */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eaf6ff_100%)]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-10 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-20 md:pt-16">
            <div className="relative z-10">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-campo">Plano Anual Biblinho · Kids + Júnior · bônus Baby</p>
              <h1 className="mt-4 text-balance font-display text-[2.7rem] leading-[1.02] text-pa-tinta md:text-[4.1rem]">
                Cinquenta e dois domingos.
                <br />
                <span className="text-pa-campo">Uma história por mês.</span>
                <br />
                A aula já vem pronta.
              </h1>
              <Texto className="mt-6 max-w-[44ch]">
                Apostila com a fala da professora escrita, quadro de história, atividades, versículo e lembrancinha. Do berçário ao Júnior, na mesma história.
              </Texto>
              <div className="mt-8">
                <Botao href="#cena" externo={false}>
                  Quero ver como funciona <ArrowDown size={20} weight="bold" />
                </Botao>
              </div>
            </div>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg md:max-w-none">
              <Image src={HISTORIAS[0].src} alt="" width={900} height={1273} priority className="pa-flutua absolute left-[2%] top-[10%] hidden h-[72%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(11,60,100,0.45)] sm:block" style={{ "--r": "-8deg", "--dur": "7.5s", "--delay": "0.4s" }} />
              <Image src={HISTORIAS[1].src} alt={`Capa do material: ${HISTORIAS[1].nome}`} width={900} height={1273} priority className="pa-flutua absolute left-[30%] top-[2%] z-10 h-[86%] w-auto rounded-[12px] border-4 border-white shadow-[0_34px_54px_-18px_rgba(11,60,100,0.5)]" style={{ "--r": "2deg", "--dur": "6.4s" }} />
              <Image src={HISTORIAS[2].src} alt="" width={900} height={1273} priority className="pa-flutua absolute left-[60%] top-[12%] h-[70%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(11,60,100,0.45)]" style={{ "--r": "8deg", "--dur": "8.2s", "--delay": "1s" }} />
            </div>
          </div>
        </section>

        {/* 2. A cena: sexta à noite */}
        <section id="cena" className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <H2>Sexta-feira, 22h40.</H2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-pa-tinta/85 md:text-xl">
              <p>Eu ainda não sei o que vou ensinar domingo.</p>
              <p>
                O Pinterest está aberto em doze abas. A impressora está sem tinta. Amanhã tem três turmas na mesma manhã, e o berçário não recebe nada novo desde março. Eu vou improvisar de novo. Eu sempre dou um jeito.
              </p>
              <p>
                Domingo, na roda, eu pergunto quem lembra da história da semana passada. A menina que decorou o versículo não lembra quem era Zaqueu. O menino que participou de tudo não lembra nem que teve história.
              </p>
              <p className="font-display text-[1.6rem] leading-[1.15] text-pa-laranja md:text-[2.1rem]">Quanto do que eu ensino fica?</p>
            </div>
          </div>
        </section>

        {/* 3. O diagnóstico */}
        <section className="bg-pa-campo text-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <h2 className="text-balance font-display text-[2.2rem] leading-[1.06] md:text-[3.2rem]">
              Não é falta de esforço. <span className="text-pa-sol">É falta de sequência.</span>
            </h2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-white/90 md:text-xl">
              <p>Criança aprende com história. E história precisa de continuação.</p>
              <p>Uma aula solta por semana é semente sem terra: cai, brilha no domingo e seca na segunda. Quatro domingos dentro da mesma história é onde ela cria raiz. A criança volta sabendo onde parou, a família escuta a mesma história a semana inteira, e o versículo entra sem decoreba.</p>
            </div>
          </div>
        </section>

        {/* 4. A virada */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-6 pt-16 md:px-8 md:pt-24">
            <h2 className="text-balance font-display text-[2.4rem] leading-[1.02] text-pa-tinta md:text-[3.5rem]">
              Foi pra esse ano que existe o <span className="text-pa-campo">Plano Anual Biblinho.</span>
            </h2>
            <Texto className="mt-6 max-w-[60ch]">
              Uma história por mês, com quatro ou cinco domingos dentro dela. Kids e Júnior na mesma história, e o material Baby junto, de bônus. Sua igreja inteira aprendendo a mesma coisa no mesmo mês, do berçário ao Júnior.
            </Texto>
          </div>
        </section>

        {/* 5. A roda das histórias */}
        <section className="overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eaf6ff_55%,#dcefff_100%)]">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24">
            <H2 className="text-center">
              Uma história nova <span className="text-pa-campo">todo mês.</span>
            </H2>
            <Texto className="mx-auto mt-4 max-w-[56ch] text-center">
              Cada uma com quatro ou cinco domingos dentro, pra Kids e Júnior, com o Baby junto. A criança acompanha a mesma história o mês inteiro.
            </Texto>
            <div className="mt-8">
              <Roda historias={HISTORIAS} />
            </div>
          </div>
        </section>

        {/* Blocos 6 a 13 entram nas Tasks 7 e 8 */}
        <section id="oferta" className="bg-white py-16 text-center">
          <Botao>Quero o Plano Anual</Botao>
        </section>
      </main>
      <Footer showNav={false} />
    </div>
  );
}
