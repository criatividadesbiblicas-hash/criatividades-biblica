/*
  CONTRATO DE DIREÇÃO — Black Biblinho · Acesso Total (Black Friday 2026, 23 a 30/11)
  THESIS: a professora que passou o ano garimpando atividade solta descobre que tudo que a
  Criatividades Bíblicas criou em 2025 e 2026 cabe numa compra só, liberada na hora, só nesta semana.
  A página conta o que entra (4 blocos, com capas e páginas reais), diz com clareza o que NÃO entra
  (Júnior em parte, novembro e dezembro depois) e só então mostra preço, prazo e botão.
  OWN-WORLD: o mesmo mundo .pa da landing do Plano Anual (Lilita One + Nunito, céu claro, campo, sol),
  vestido de noite nas pontas (hero, números e fechamento em azul-noite), porque é Black Friday e
  porque a página é pra adulto. Sem preto puro, sem véu escuro no meio.
  FASES: pre (sem preço, botão leva pro grupo VIP) → venda (preço, contador, Kiwify) → fechada.
  A fase vem da data (fuso de Brasília); ?fase= serve só pra conferir antes do dia.
  HONESTIDADE: contagem do inventário real (14 histórias, 6 em duas versões), âncora só com o preço
  público do Plano Anual (R$ 597), "em até 12x" sem valor da parcela, nada simulado, nenhum depoimento.
*/
import Image from "next/image";
import Link from "next/link";
import { Lilita_One } from "next/font/google";
import { ArrowDown, CheckCircle, Clock, LockSimpleOpen, ShieldCheck, WhatsappLogo, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqItem from "@/components/FaqItem";
import Roda from "@/components/plano-anual/Roda";
import Leque from "@/components/arca/Leque";
import Tracking from "@/components/black-biblinho/Tracking";
import { ContadorBlocos, BarraContador } from "@/components/black-biblinho/Contador";
import { faseDaUrl } from "@/components/black-biblinho/fase";
import { KIWIFY_URL, GRUPO_URL, PLANO_ANUAL_URL, OFERTA, PLANO_2026, RODA_2026, BIBLIOTECA_2025, BLOCOS, NUMEROS, FAQ, DOMINGOS, SERIES } from "@/components/black-biblinho/dados";
import { PECAS, FAIXAS } from "@/components/plano-anual/dados";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita", display: "swap" });

// A fase depende do relógio: a página é montada a cada visita, nunca congelada no build.
export const dynamic = "force-dynamic";

const HOST = "https://materiais.criatividadesbiblicas.com.br";
const PAGE_URL = `${HOST}/black-biblinho`;
const TITLE = "Black Biblinho · Acesso Total | Criatividades Bíblicas";
const DESCRIPTION =
  `Black Biblinho · Acesso Total: tudo que a Criatividades Bíblicas já criou, numa compra só. ${SERIES} séries de estudo, ${DOMINGOS} domingos de aula pronta, Baby, Kids e Júnior, mais o Emoções, o Planner e o plano de leitura. Só de 23 a 30 de novembro.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, siteName: "Criatividades Bíblicas", locale: "pt_BR", type: "website" },
  robots: { index: true, follow: true },
};

/* ---------- peças locais ---------- */

function Botao({ href, children, className = "", externo = true, tom = "sol" }) {
  const cor = tom === "sol"
    ? "bg-pa-sol text-pa-tinta shadow-[0_12px_28px_-10px_rgba(233,164,0,0.75)] hover:bg-[#ffd15a]"
    : "bg-[#25d366] text-white shadow-[0_12px_28px_-10px_rgba(37,211,102,0.6)] hover:bg-[#2ee077]";
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-lg leading-none transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${cor} ${className}`}
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

function Selo({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-pa-sol px-4 py-1.5 font-display text-[13px] uppercase tracking-[0.08em] text-pa-tinta ${className}`}>
      <Sparkle size={14} weight="fill" /> {children}
    </span>
  );
}

// Chamada principal, muda com a fase. Na pré-abertura leva pro grupo VIP; na venda, pra Kiwify.
function Chamada({ fase, className = "" }) {
  if (fase === "venda") {
    return (
      <div className={className}>
        <Botao href={KIWIFY_URL}>Quero o Acesso Total · {OFERTA.por}</Botao>
        <p className="mt-3 text-[14px] font-semibold text-current/70">À vista ou {OFERTA.parcela} · Pix ou cartão · {OFERTA.garantiaDias} dias de garantia</p>
      </div>
    );
  }
  if (fase === "pre") {
    return (
      <div className={className}>
        <Botao href={GRUPO_URL} tom="zap"><WhatsappLogo size={22} weight="fill" /> Entrar no grupo VIP</Botao>
        <p className="mt-3 text-[14px] font-semibold text-current/70">Abre pro público {OFERTA.abertura}. No grupo, você vê 72 horas antes e paga {OFERTA.vip}.</p>
      </div>
    );
  }
  return (
    <div className={className}>
      <Botao href={PLANO_ANUAL_URL} externo={false}>Ver o Plano Anual de sempre</Botao>
      <p className="mt-3 text-[14px] font-semibold text-current/70">O Black Biblinho fechou em 30 de novembro e não volta.</p>
    </div>
  );
}

// Faixa fina no topo, antes do cabeçalho.
function FaixaTopo({ fase }) {
  const txt = {
    pre: <>Black Biblinho abre <strong className="text-pa-sol">{OFERTA.abertura}</strong>. Quem está no grupo VIP vê antes e paga menos.</>,
    venda: <>Black Biblinho no ar até <strong className="text-pa-sol">{OFERTA.fim}</strong>, horário de Brasília. Depois não volta.</>,
    fechada: <>A Black Friday fechou. O Plano Anual continua no formato de sempre.</>,
  }[fase];
  return (
    <div className="bg-bb-noite px-4 py-2.5 text-center text-[13px] font-semibold text-white/90 md:text-[14px]">
      <Clock size={15} weight="bold" className="mr-1.5 inline-block align-[-2px] text-pa-sol" /> {txt}
    </div>
  );
}

/* ---------- página ---------- */

export default async function BlackBiblinhoPage({ searchParams }) {
  const sp = await searchParams;
  const fase = faseDaUrl(sp);
  const capasHero = [RODA_2026[2], RODA_2026[0], RODA_2026[9]]; // Zaqueu, Semeador, Daniel (2026)

  return (
    <div className={`pa bb ${lilita.variable}`}>
      <FaixaTopo fase={fase} />
      <Nav cta={{ href: "#oferta", label: fase === "venda" ? "Quero o Acesso Total" : fase === "pre" ? "Ver a oferta" : "Plano Anual" }} links={[]} logoHref="/black-biblinho" />
      <Tracking fase={fase} />

      <main>
        {/* 1. Hero noturno: o que é, pra quem, e o relógio */}
        <section className="relative overflow-hidden bg-bb-noite text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_10%,rgba(255,197,49,0.18)_0%,rgba(255,197,49,0)_60%),radial-gradient(60%_50%_at_10%_90%,rgba(89,182,240,0.14)_0%,rgba(89,182,240,0)_60%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16 xl:grid-cols-[1.25fr_1fr]">
            <div>
              <Selo>Black Friday · 23 a 30 de novembro</Selo>
              <h1 className="mt-5 font-display leading-[0.95]">
                <span className="block text-[3.4rem] text-white min-[360px]:text-[3.8rem] md:text-[5.5rem]">Black Biblinho</span>
                <span className="mt-1 block text-[2.2rem] text-pa-sol md:text-[3.2rem]">Acesso Total</span>
              </h1>
              <p className="mt-6 max-w-[48ch] text-[18px] font-semibold leading-snug text-white md:text-[22px]">
                Tudo que a Criatividades Bíblicas já criou pra sua turma, liberado de uma vez.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {[`${DOMINGOS} domingos de aula pronta`, `${SERIES} séries de estudo`, "Baby, Kids e Júnior", "tudo na hora, em PDF"].map((t) => (
                  <li key={t} className="rounded-full bg-white/10 px-4 py-2 text-[14px] font-extrabold text-white ring-1 ring-white/15">{t}</li>
                ))}
              </ul>
              <p className="mt-5 max-w-[48ch] text-[17px] font-medium leading-relaxed text-white/85 md:text-xl">
                Chega de montar aula no sábado à noite. Abre, imprime, dá aula. Só nesta semana, e não volta.
              </p>
              <div className="mt-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/60">{fase === "pre" ? "Abre em" : fase === "venda" ? "Fecha em" : "Fechou em 30 de novembro"}</p>
                {fase !== "fechada" ? <ContadorBlocos fase={fase} escuro className="mt-3" /> : null}
              </div>
              <Chamada fase={fase} className="mt-8 text-white" />
              <a href="#entra" className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-white/80 underline-offset-4 hover:text-pa-sol hover:underline">
                Ver tudo que entra <ArrowDown size={18} weight="bold" />
              </a>
            </div>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg xl:max-w-none">
              <Image src={capasHero[0].src} alt="" width={900} height={1273} className="pa-flutua absolute left-[2%] top-[10%] hidden h-[72%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)] sm:block" style={{ "--r": "-8deg", "--dur": "7.5s", "--delay": "0.4s" }} />
              <Image src={capasHero[1].src} alt={`Capa do material: ${capasHero[1].nome}`} width={900} height={1273} priority className="pa-flutua absolute left-[30%] top-[2%] z-10 h-[86%] w-auto rounded-[12px] border-4 border-white shadow-[0_34px_54px_-18px_rgba(0,0,0,0.65)]" style={{ "--r": "2deg", "--dur": "6.4s" }} />
              <Image src={capasHero[2].src} alt="" width={900} height={1273} className="pa-flutua absolute left-[60%] top-[12%] h-[70%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)]" style={{ "--r": "8deg", "--dur": "8.2s", "--delay": "1s" }} />
            </div>
          </div>
        </section>

        {/* 2. A cena: o ano que passou */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <H2>Quantas histórias a sua turma ouviu este ano?</H2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-pa-tinta/85 md:text-xl">
              <p>
                Se a resposta demorou, você sabe como foi o ano: uma atividade solta aqui, um vídeo do YouTube ali, a aula montada no sábado à noite. A criança até gosta, mas no domingo seguinte não lembra onde parou.
              </p>
              <p>
                O Plano Anual Biblinho resolve isso com uma história por mês, quatro ou cinco domingos dentro dela, a fala do professor já escrita. Só que ele é uma assinatura: a história chega mês a mês, e custa {OFERTA.ancora.preco}.
              </p>
              <p className="font-display text-[1.6rem] leading-[1.15] text-pa-laranja md:text-[2.1rem]">
                Nesta Black Friday, tudo isso chega de uma vez: {DOMINGOS} domingos de aula pronta, pra usar no ritmo da sua turma.
              </p>
            </div>
          </div>
        </section>

        {/* 3. O que entra: 4 blocos */}
        <section id="entra" className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Selo>O que entra</Selo>
            <H2 className="mt-4">Quatro blocos, liberados na hora.</H2>
            <Texto className="mt-4 max-w-[60ch]">
              Tudo é página real dos nossos PDFs. O que está em produção ou ainda não existe está escrito aqui, não escondido.
            </Texto>

            {/* Bloco 1: Plano Anual 2026 */}
            <article className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)]">
              <div className="px-6 pt-8 md:px-10">
                <p className="font-display text-sm uppercase tracking-[0.1em] text-pa-campo-escuro">Bloco 1</p>
                <h3 className="mt-1 font-display text-[1.6rem] leading-tight text-pa-tinta md:text-[2.1rem]">{BLOCOS[0].titulo}</h3>
                <p className="mt-2 max-w-[62ch] text-[16px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[0].resumo} {BLOCOS[0].detalhe}</p>
              </div>
              <div className="mt-2">
                <Roda historias={RODA_2026} />
              </div>
              <ul className="grid gap-2 px-6 pb-8 sm:grid-cols-2 md:px-10 xl:grid-cols-3">
                {PLANO_2026.map((h) => (
                  <li key={h.mes} className="flex items-center gap-3 rounded-[1rem] bg-pa-ceu-claro px-4 py-3">
                    <span className="w-8 shrink-0 font-display text-sm uppercase text-pa-campo-escuro">{h.mes}</span>
                    <span className="flex-1 text-[15px] font-semibold leading-snug text-pa-tinta">
                      {h.nome}
                      <span className="block text-[12px] font-semibold text-pa-tinta/60">{h.tema}</span>
                    </span>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${h.emProducao ? "bg-pa-laranja/15 text-pa-laranja" : h.junior ? "bg-pa-campo/15 text-pa-campo-escuro" : "bg-pa-ceu/30 text-pa-tinta/70"}`}>
                      {h.emProducao ? "em produção" : h.junior ? "3 faixas" : "Baby · Kids"}
                    </span>
                  </li>
                ))}
                <li className="flex items-center gap-3 rounded-[1rem] bg-pa-ceu-claro px-4 py-3">
                  <span className="w-8 shrink-0 font-display text-sm uppercase text-pa-campo-escuro">dez</span>
                  <span className="flex-1 text-[15px] font-semibold leading-snug text-pa-tinta">
                    Natal
                    <span className="block text-[12px] font-semibold text-pa-tinta/60">entra na sua área de membros quando ficar pronto</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-pa-laranja/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-pa-laranja">a fazer</span>
                </li>
              </ul>
            </article>

            {/* Bloco 2: Biblioteca 2025 */}
            <article className="mt-6 overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] md:p-10">
              <p className="font-display text-sm uppercase tracking-[0.1em] text-pa-campo-escuro">Bloco 2</p>
              <h3 className="mt-1 font-display text-[1.6rem] leading-tight text-pa-tinta md:text-[2.1rem]">{BLOCOS[1].titulo}</h3>
              <p className="mt-2 max-w-[62ch] text-[16px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[1].resumo} {BLOCOS[1].detalhe}</p>
              <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
                {BIBLIOTECA_2025.map((h) => (
                  <li key={h.historia} className="flex flex-col">
                    <Image src={h.src} alt={`Capa 2025: ${h.nome}`} width={720} height={1019} sizes="(min-width: 1024px) 11vw, 30vw" className="w-full rounded-[8px] border-2 border-white shadow-[0_14px_26px_-14px_rgba(11,60,100,0.45)] ring-1 ring-pa-tinta/10" />
                    <span className="mt-2 text-[12px] font-bold leading-tight text-pa-tinta/80">{h.nome}</span>
                    <span className="text-[11px] font-semibold text-pa-tinta/55">{h.estudos} estudos · {h.junior ? "3 faixas" : "Baby e Kids"}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Blocos 3 e 4 */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] sm:flex-row">
                <div className="flex items-center justify-center bg-[#f3eefb] p-6 sm:w-[42%]">
                  <Image src="/emocoes/livro.png" alt="Capa do estudo Jesus Cuida das Minhas Emoções" width={693} height={1108} className="h-56 w-auto drop-shadow-[0_18px_24px_rgba(74,42,122,0.35)] sm:h-64" />
                </div>
                <div className="p-6 sm:flex sm:w-[58%] sm:flex-col sm:justify-center md:p-8">
                  <p className="font-display text-sm uppercase tracking-[0.1em] text-pa-campo-escuro">Bloco 3</p>
                  <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-pa-tinta">{BLOCOS[2].titulo}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[2].resumo} {BLOCOS[2].detalhe}</p>
                </div>
              </article>
              <article className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] sm:flex-row">
                <div className="flex items-center justify-center bg-[#fff6e3] p-6 sm:w-[42%]">
                  <Image src="/produtos/planner-ministerio-infantil.png" alt="Planner Ministério Infantil" width={400} height={320} className="w-full max-w-[220px] rounded-[1rem] shadow-[0_18px_24px_-14px_rgba(138,90,60,0.45)]" />
                </div>
                <div className="p-6 sm:flex sm:w-[58%] sm:flex-col sm:justify-center md:p-8">
                  <p className="font-display text-sm uppercase tracking-[0.1em] text-pa-campo-escuro">Bloco 4</p>
                  <h3 className="mt-1 font-display text-[1.45rem] leading-tight text-pa-tinta">{BLOCOS[3].titulo}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[3].resumo} {BLOCOS[3].detalhe}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 4. Os números, do jeito que a pasta é */}
        <section className="bg-bb-noite text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-16">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {NUMEROS.map((n) => (
                <div key={n.t} className="text-center lg:text-left">
                  <dt className="font-display text-[3.2rem] leading-none text-pa-sol md:text-[3.5rem]">{n.n}</dt>
                  <dd className="mt-2 text-[15px] font-semibold leading-snug text-white/80">{n.t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 5. O que vem em cada história: páginas reais */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>O que vem dentro de cada história.</H2>
            <Texto className="mt-4 max-w-[58ch]">As imagens são páginas reais do material, sem retoque. Você imprime em casa, na igreja ou na gráfica.</Texto>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS.map((p) => (
                <article key={p.titulo} className="flex flex-col overflow-hidden rounded-[2rem] bg-pa-ceu-claro">
                  <div className="px-6 pt-6">
                    <Leque imagens={p.imagens.slice(0, 3)} alt={`Páginas reais: ${p.titulo}`} paisagem={p.paisagem} />
                  </div>
                  <div className="p-6 pt-3">
                    <h3 className="font-display text-[1.35rem] leading-tight text-pa-tinta">{p.titulo}</h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Três faixas, uma história */}
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
                  <blockquote className="p-6 text-[15px] font-medium italic leading-relaxed text-pa-tinta/85">“{f.trecho}”</blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Por que só agora */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <H2>Por que isso só existe na Black Friday.</H2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-pa-tinta/85 md:text-xl">
              <p>
                No resto do ano, o Plano Anual é uma assinatura: {OFERTA.ancora.preco} por um ano, com uma história liberada por mês, na ordem. É assim que a igreja inteira acompanha a mesma história no mesmo mês.
              </p>
              <p>
                Na Black Friday a gente abre tudo de uma vez: o ano de 2026, a biblioteca de 2025, o Emoções, o Planner e o plano de leitura, por {OFERTA.por}. Em 2027 o Plano Anual é novo, com histórias que não estão aqui, e esta oferta não se repete.
              </p>
              <p>
                Se você prefere receber mês a mês, o <Link href={PLANO_ANUAL_URL} className="font-bold text-pa-campo-escuro underline underline-offset-4">Plano Anual de sempre</Link> continua lá. Se você quer o material todo na mão agora, é aqui.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Oferta */}
        <section id="oferta" className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <H2 className="text-center">{fase === "fechada" ? "A Black Friday fechou." : fase === "pre" ? "Abre segunda, 23 de novembro." : "Quanto custa o Acesso Total."}</H2>
            <div className="mt-10 overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_60px_-30px_rgba(11,60,100,0.45)]">
              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative flex items-center justify-center bg-bb-noite p-8 md:p-10">
                  <div className="relative h-72 w-full max-w-[16rem] md:h-96 md:max-w-[20rem]">
                    <Image src={RODA_2026[3].src} alt="" width={900} height={1273} className="absolute left-0 top-4 h-[85%] w-auto -rotate-6 rounded-[10px] border-4 border-white shadow-[0_18px_36px_-14px_rgba(0,0,0,0.6)]" />
                    <Image src={RODA_2026[5].src} alt="Capas do material" width={900} height={1273} className="absolute left-[22%] top-0 z-10 h-[92%] w-auto rotate-2 rounded-[10px] border-4 border-white shadow-[0_24px_40px_-14px_rgba(0,0,0,0.65)]" />
                    <Image src={BIBLIOTECA_2025[2].src} alt="Capa da Biblioteca 2025" width={720} height={1019} className="absolute bottom-0 right-0 z-20 h-[48%] w-auto rotate-6 rounded-[10px] shadow-[0_18px_36px_-14px_rgba(0,0,0,0.6)] ring-4 ring-pa-sol" />
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <Selo>Black Biblinho</Selo>
                  <h3 className="mt-3 font-display text-[1.6rem] leading-tight text-pa-tinta">Acesso Total</h3>
                  <ul className="mt-5 space-y-2.5 text-[15px] font-medium text-pa-tinta/85">
                    {BLOCOS.map((b) => (
                      <li key={b.n} className="flex items-start gap-2.5"><CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-pa-campo" /><span><strong className="font-bold text-pa-tinta">{b.titulo}.</strong> {b.resumo}</span></li>
                    ))}
                    <li className="flex items-start gap-2.5"><LockSimpleOpen size={22} weight="fill" className="mt-0.5 shrink-0 text-pa-campo" />Tudo liberado na hora, na área de membros da Kiwify</li>
                  </ul>

                  {fase === "venda" ? (
                    <>
                      <p className="mt-8 text-[15px] font-semibold text-pa-tinta/75">Só o {OFERTA.ancora.produto}: {OFERTA.ancora.preco}. Na Black Friday, tudo isso por</p>
                      <p className="mt-1 flex flex-wrap items-end gap-x-3">
                        <span className="font-display text-[3.4rem] leading-none text-pa-campo">{OFERTA.por}</span>
                        <span className="pb-2 text-[15px] font-semibold text-pa-tinta/75">à vista</span>
                      </p>
                      <p className="mt-1 text-[17px] font-bold text-pa-tinta">ou {OFERTA.parcela}</p>
                      <p className="mt-6 text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-tinta/60">Fecha em</p>
                      <ContadorBlocos fase={fase} className="mt-2" />
                      <Botao href={KIWIFY_URL} className="mt-7 w-full sm:w-auto">Quero o Acesso Total</Botao>
                      <p className="mt-3 text-[13px] font-semibold text-pa-tinta/70">Pix ou cartão · pagamento seguro pela Kiwify · acesso no e-mail da compra</p>
                    </>
                  ) : fase === "pre" ? (
                    <>
                      <p className="mt-8 text-[15px] font-semibold text-pa-tinta/75">Abre pro público {OFERTA.abertura}. Quem está no grupo VIP compra {OFERTA.vipJanela}, com {OFERTA.vip} em vez do preço cheio.</p>
                      <p className="mt-6 text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-tinta/60">Abre em</p>
                      <ContadorBlocos fase={fase} className="mt-2" />
                      <Botao href={GRUPO_URL} tom="zap" className="mt-7 w-full sm:w-auto"><WhatsappLogo size={22} weight="fill" /> Entrar no grupo VIP</Botao>
                      <p className="mt-3 text-[13px] font-semibold text-pa-tinta/70">Grupo no WhatsApp, só com avisos da oferta. Você sai quando quiser.</p>
                    </>
                  ) : (
                    <>
                      <p className="mt-8 text-[15px] font-semibold text-pa-tinta/75">A oferta fechou em 30 de novembro. O Plano Anual continua no formato de sempre, uma história por mês.</p>
                      <Botao href={PLANO_ANUAL_URL} externo={false} className="mt-7 w-full sm:w-auto">Ver o Plano Anual</Botao>
                    </>
                  )}

                  <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                    <ShieldCheck size={40} weight="fill" className="shrink-0 text-pa-campo" />
                    <p className="text-[14px] font-medium leading-relaxed text-pa-tinta/80"><strong className="font-bold text-pa-tinta">{OFERTA.garantiaDias} dias de garantia.</strong> Se o material não for o que você esperava, o reembolso é pedido direto na Kiwify. Sem precisar explicar.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Como funciona */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
            <H2 className="text-center">Como funciona.</H2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, t: "Você compra pela Kiwify.", d: "Pix ou cartão, à vista ou em até 12x. O acesso chega no seu e-mail assim que o pagamento é aprovado." },
                { n: 2, t: "Os 4 blocos abrem na hora.", d: "Plano Anual 2026, Biblioteca 2025, Emoções, Planner e plano de leitura, tudo na mesma área de membros. Baixa e imprime o que for usar." },
                { n: 3, t: "Novembro e dezembro chegam depois.", d: "As Cores da Salvação e o Natal entram na sua área de membros quando ficarem prontos, sem pagar nada a mais." },
              ].map((p) => (
                <li key={p.n} className="rounded-[1.75rem] bg-pa-ceu-claro p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pa-sol font-display text-xl text-pa-tinta">{p.n}</span>
                  <h3 className="mt-4 font-display text-[1.3rem] leading-tight text-pa-tinta">{p.t}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-20">
            <H2>Antes de você perguntar.</H2>
            <div className="mt-8">
              {FAQ.map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
            </div>
          </div>
        </section>

        {/* 11. Fechamento noturno */}
        <section id="fim" className="bg-bb-noite text-center text-white">
          <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
            <Image src={RODA_2026[7].src} alt="" width={900} height={1273} className="pa-flutua mx-auto h-52 w-auto rounded-[12px] border-4 border-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]" style={{ "--dur": "6s", "--r": "-3deg" }} />
            <h2 className="mt-8 text-balance font-display text-[2rem] leading-[1.08] md:text-[2.75rem]">
              {fase === "fechada" ? "Até a próxima." : fase === "pre" ? "Segunda, 23 de novembro, abre." : "Segunda, 30 de novembro, 23h59. Depois, não volta."}
            </h2>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-white/80 md:text-xl">
              {fase === "fechada" ? "O Plano Anual segue no formato de sempre, uma história por mês." : `${DOMINGOS} domingos de aula pronta, na sua mão, nesta semana.`}
            </p>
            <Chamada fase={fase} className="mt-8 text-white" />
          </div>
        </section>
      </main>
      <Footer showNav={false} />
      {fase === "venda" ? <BarraContador /> : null}
    </div>
  );
}
