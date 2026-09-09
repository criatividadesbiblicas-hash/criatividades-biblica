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
import { ArrowDown, CheckCircle, Gift } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Roda from "@/components/plano-anual/Roda";
import Tracking from "@/components/plano-anual/Tracking";
import Leque from "@/components/arca/Leque";
import FaqItem from "@/components/FaqItem";
import { KIWIFY_URL, OFERTA, HISTORIAS, FAQ, AULAS_ARCA, PECAS, ANOTACOES, FAIXAS, DEPOIMENTOS } from "@/components/plano-anual/dados";

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
          {/* A coluna do titulo so divide o hero em duas a partir de xl: em 768-1279px a coluna
              de 1.1fr dava 344-570px, e o titulo de 65.6px quebrava em 6 a 8 linhas. */}
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-10 md:px-8 md:pb-20 md:pt-16 xl:grid-cols-[1.1fr_1fr]">
            <div className="relative z-10">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-campo-escuro">Plano Anual Biblinho · Baby, Kids e Júnior</p>
              <h1 className="mt-4 text-balance font-display text-[2.7rem] leading-[1.02] text-pa-tinta md:text-[4.1rem]">
                <span className="whitespace-nowrap">Cinquenta e dois</span> domingos.
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
            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg xl:max-w-none">
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
        {/* Campo verde escuro: sobre pa-campo (#2a8a3e) nenhuma cor de texto passa de 4,37:1,
            entao nem o corpo branco alcancava AA. pa-campo-escuro leva o corpo pra 5,6:1. */}
        <section className="bg-pa-campo-escuro text-white">
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
            <div className="mt-6">
              <Roda historias={HISTORIAS} />
            </div>
          </div>
        </section>

        {/* 6. Um mês por dentro: os 4 domingos da Arca */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>Um mês por dentro.</H2>
            <Texto className="mt-4 max-w-[58ch]">
              Pega a Arca de Noé. Cada domingo é um marco da história e uma lição diferente. A criança acompanha Noé do chamado ao arco-íris, e no fim do mês sabe contar tudo.
            </Texto>
            <ol className="mt-12 grid gap-x-6 gap-y-10 min-[420px]:grid-cols-2 lg:grid-cols-4">
              {AULAS_ARCA.map((a) => (
                <li key={a.n} className="flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border-4 border-white shadow-[0_18px_34px_-14px_rgba(11,60,100,0.35)]">
                    <Image src={a.img} alt={`Lâmina do quadro de história: ${a.titulo}`} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover object-[center_40%]" />
                    <span className="absolute left-3 top-3 rounded-full bg-pa-sol px-3 py-1 font-display text-sm text-pa-tinta">Domingo {a.n}</span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.35rem] leading-tight text-pa-tinta">{a.titulo}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</p>
                  <p className="mt-3 font-display text-base text-pa-campo-escuro">{a.licao}</p>
                  <p className="mt-2 text-[14px] italic leading-relaxed text-pa-tinta/75">
                    “{a.verso}” <span className="not-italic font-bold">{a.ref}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7. O que chega todo mês: páginas reais em leque */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>O que chega todo mês.</H2>
            <Texto className="mt-4 max-w-[56ch]">Kids e Júnior, cada um com o material completo, e o Baby de bônus. As imagens abaixo são páginas de verdade, sem mockup.</Texto>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS.map((p) => (
                <article key={p.titulo} className={`flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] ${p.grande ? "sm:col-span-2 lg:col-span-2 lg:flex-row" : ""} ${p.largo ? "sm:col-span-2 lg:col-span-3 sm:flex-row" : ""}`}>
                  <div className={`px-6 pt-6 ${p.grande ? "lg:w-[58%] lg:pb-6" : ""} ${p.largo ? "sm:w-[40%] sm:pb-6 lg:w-[34%] lg:px-10" : ""}`}>
                    <Leque imagens={p.imagens} alt={`Páginas reais: ${p.titulo}`} paisagem={p.paisagem} />
                  </div>
                  <div className={`p-6 pt-3 ${p.grande ? "lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:pt-6" : ""} ${p.largo ? "sm:flex sm:w-[60%] sm:flex-col sm:justify-center sm:pt-6 lg:w-[66%] lg:pr-16" : ""}`}>
                    <h3 className="font-display text-[1.45rem] leading-tight text-pa-tinta">{p.titulo}</h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 8. A fala já vem escrita */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>A fala da professora já vem escrita.</H2>
            <Texto className="mt-4 max-w-[56ch]">Esta é uma página real da apostila Kids, sem retoque. Você lê, adapta o que quiser e conduz.</Texto>
            <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_1.15fr_1fr]">
              <ul className="hidden flex-col gap-6 md:flex md:pt-10">
                {ANOTACOES.filter((a) => a.lado === "esq").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-pa-ceu-claro p-5 after:absolute after:right-[-18px] after:top-7 after:h-0.5 after:w-[18px] after:bg-pa-campo">
                    <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <Image src="/arca-de-noe/anotada.webp" alt="Página real do Estudo 1 da apostila Kids: rotina, objetivo, roda de conversa e explorando a Bíblia" width={1300} height={1839} className="w-full rounded-[14px] shadow-[0_30px_60px_-26px_rgba(11,60,100,0.5)] ring-1 ring-pa-tinta/10" />
              <ul className="hidden flex-col gap-6 md:flex md:pt-32">
                {ANOTACOES.filter((a) => a.lado === "dir").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-pa-ceu-claro p-5 before:absolute before:left-[-18px] before:top-7 before:h-0.5 before:w-[18px] before:bg-pa-campo">
                    <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-3 md:hidden">
                {ANOTACOES.map((a, i) => (
                  <li key={a.titulo} className="flex gap-3 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pa-sol font-display text-base text-pa-tinta">{i + 1}</span>
                    <span>
                      <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                      <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Três faixas, uma história */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>Três faixas, uma história.</H2>
            <Texto className="mt-4 max-w-[58ch]">A mesma Hora da História da Arca, escrita três vezes: pro colo, pra roda e pra turma que já lê. A linguagem muda. A história, não.</Texto>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {FAIXAS.map((f) => (
                <article key={f.faixa} className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={f.src} alt={`Página real da apostila ${f.faixa}: Hora da História da Arca de Noé`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover object-top" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-pa-sol px-3 py-1 font-display text-sm text-pa-tinta">{f.faixa} · {f.idade}</span>
                  </div>
                  <blockquote className="p-6 text-[15px] font-medium italic leading-relaxed text-pa-tinta/85">"{f.trecho}"</blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Bônus Baby (permanente) */}
        <section id="bonus" className="bg-pa-campo-escuro text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
            <div className="relative mx-auto w-full max-w-sm">
              <Leque imagens={["/arca-de-noe/ativ-baby-1.webp", "/arca-de-noe/capa-baby.webp", "/arca-de-noe/ativ-baby-4.webp"]} alt="Páginas reais do material Baby" />
            </div>
            <div>
              <h2 className="text-balance font-display text-[2rem] leading-[1.08] md:text-[2.75rem]">Do berçário ao Júnior, todo mês.</h2>
              <p className="mt-5 text-[17px] font-medium leading-relaxed text-white/90 md:text-xl">
                Junto com o Plano vai o <strong className="text-pa-sol">material Baby completo</strong> (1 a 3 anos) de todas as doze histórias: apostila, atividades, balão de história, lembrancinha e carta pra família. Sem custo. Pra ninguém ficar de fora.
              </p>
              <ul className="mt-7 space-y-3 text-[16px] font-semibold">
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />O berçário recebe a mesma história que o Kids e o Júnior, no mesmo mês</li>
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />Linguagem de colo: frases curtas, gesto, repetição, oração simples</li>
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />Uma igreja, uma história, três faixas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 11. Quem já usa (só com depoimentos reais) */}
        {DEPOIMENTOS.length > 0 ? (
          <section className="bg-white">
            <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
              <H2>Quem dá aula com o Plano.</H2>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DEPOIMENTOS.map((d, i) => (
                  <li key={d.name} className={`relative rounded-[1.75rem] bg-pa-ceu-claro p-6 ${i % 3 === 1 ? "lg:mt-8" : ""}`}>
                    <blockquote className="text-[16px] font-medium leading-relaxed text-pa-tinta/90">“{d.quote}”</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${d.cor}`}>{d.iniciais}</span>
                      <span>
                        <span className="block font-display text-base text-pa-tinta">{d.name}</span>
                        <span className="block text-[13px] font-semibold text-pa-tinta/75">{d.role}</span>
                      </span>
                    </figcaption>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* 12. Oferta */}
        <section id="oferta" className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <H2 className="text-center">Quanto custa um ano de aula pronta.</H2>
            <div className="mt-10 overflow-hidden rounded-[2.25rem] bg-pa-ceu-claro shadow-[0_24px_60px_-30px_rgba(11,60,100,0.45)]">
              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative flex items-center justify-center p-8 md:p-10">
                  <div className="relative h-72 w-full max-w-[16rem] md:h-96 md:max-w-[20rem]">
                    <Image src={HISTORIAS[2].src} alt="" width={900} height={1273} className="absolute left-0 top-4 h-[85%] w-auto -rotate-6 rounded-[10px] border-4 border-white shadow-[0_18px_36px_-14px_rgba(11,60,100,0.45)]" />
                    <Image src={HISTORIAS[0].src} alt="Capas do material" width={900} height={1273} className="absolute left-[22%] top-0 z-10 h-[92%] w-auto rotate-2 rounded-[10px] border-4 border-white shadow-[0_24px_40px_-14px_rgba(11,60,100,0.5)]" />
                    <Image src="/arca-de-noe/capa-baby.webp" alt="Capa Baby, bônus" width={1000} height={1415} className="absolute bottom-0 right-0 z-20 h-[48%] w-auto rotate-6 rounded-[10px] shadow-[0_18px_36px_-14px_rgba(11,60,100,0.45)] ring-4 ring-pa-sol" />
                  </div>
                </div>
                <div className="bg-white p-8 md:p-10">
                  <h3 className="font-display text-[1.6rem] leading-tight text-pa-tinta">Plano Anual Biblinho</h3>
                  <ul className="mt-5 space-y-2.5 text-[15px] font-medium text-pa-tinta/85">
                    {["Material Kids (4 a 6) completo, 12 histórias", "Material Júnior (7 a 10) completo, 12 histórias", "Bônus: material Baby (1 a 3) completo, 12 histórias", "Uma história nova por mês, durante 12 meses"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5"><CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-pa-campo" />{item}</li>
                    ))}
                  </ul>
                  <p className="mt-8 text-[15px] font-semibold text-pa-tinta/75">De <s>{OFERTA.de}</s> por</p>
                  <p className="mt-1 flex flex-wrap items-end gap-x-3">
                    <span className="font-display text-[3.4rem] leading-none text-pa-campo">{OFERTA.por}</span>
                    <span className="pb-2 text-[15px] font-semibold text-pa-tinta/75">à vista</span>
                  </p>
                  <p className="mt-1 text-[17px] font-bold text-pa-tinta">ou {OFERTA.parcela}</p>
                  <Botao className="mt-7 w-full sm:w-auto">Quero o Plano Anual</Botao>
                  <p className="mt-3 text-[13px] font-semibold text-pa-tinta/70">Pix, boleto ou cartão · pagamento seguro pela Kiwify</p>
                  <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                    <Image src="/emocoes/garantia.png" alt="Selo: 7 dias de garantia ou seu dinheiro de volta" width={454} height={390} className="w-16 shrink-0" />
                    <p className="text-[14px] font-medium leading-relaxed text-pa-tinta/80"><strong className="font-bold text-pa-tinta">7 dias de garantia.</strong> Se o material não for o que você esperava, devolvemos o valor inteiro. Sem burocracia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13a. Como funciona */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
            <H2 className="text-center">Como funciona.</H2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, t: "Você assina pela Kiwify.", d: "Pix, boleto ou cartão. O acesso chega no seu e-mail assim que o pagamento é aprovado." },
                { n: 2, t: "A primeira história abre na hora.", d: "Parábola do Semeador: apostila, quadro, atividades, versículo, lembrancinha e carta pra família. Baixa, imprime, dá a aula." },
                { n: 3, t: "Todo mês, uma história nova.", d: "Durante 12 meses. Kids, Júnior e Baby na mesma história, no mesmo mês." },
              ].map((p) => (
                <li key={p.n} className="rounded-[1.75rem] bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pa-sol font-display text-xl text-pa-tinta">{p.n}</span>
                  <h3 className="mt-4 font-display text-[1.3rem] leading-tight text-pa-tinta">{p.t}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 13b. FAQ */}
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-20">
            <H2>Perguntas que sempre chegam.</H2>
            <div className="mt-8">
              {FAQ.map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
            </div>
          </div>
        </section>

        {/* 13c. Fechamento */}
        <section className="bg-[linear-gradient(180deg,#eaf6ff_0%,#dcefff_100%)] text-center">
          <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
            <Image src={HISTORIAS[0].src} alt="" width={900} height={1273} className="pa-flutua mx-auto h-52 w-auto rounded-[12px] border-4 border-white shadow-[0_18px_40px_-16px_rgba(11,60,100,0.45)]" style={{ "--dur": "6s", "--r": "-3deg" }} />
            <H2 className="mt-8">Domingo que vem pode ser sobre o Semeador.</H2>
            <Texto className="mt-3">Assina hoje, baixa em minutos, imprime amanhã.</Texto>
            <Botao className="mt-8">Quero o Plano Anual</Botao>
            <p className="mt-4 text-[14px] font-semibold text-pa-tinta/70">{OFERTA.por} à vista ou {OFERTA.parcela} · 7 dias de garantia</p>
          </div>
        </section>
      </main>
      <Footer showNav={false} />
    </div>
  );
}
