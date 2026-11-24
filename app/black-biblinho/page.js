/*
  CONTRATO DE DIREÇÃO — Black Biblinho · Acesso Total (Black Friday 2026, até 30/11)
  THESIS: a professora que passou o ano garimpando atividade solta descobre que tudo que a
  Criatividades Bíblicas criou em 2025 e 2026 cabe numa compra só, liberada na hora, só até 30/11.
  A página conta o que entra (4 blocos, com capas e páginas reais), diz com clareza o que NÃO entra
  (Júnior em parte, dezembro depois) e só então mostra preço, prazo e botão.
  OWN-WORLD: o mesmo mundo .pa da landing do Plano Anual (Lilita One + Nunito, céu claro, campo, sol),
  vestido de noite nas pontas (hero, números e fechamento em azul-noite), porque é Black Friday e
  porque a página é pra adulto. Sem preto puro, sem véu escuro no meio.
  FASES: venda (preço, contador até 30/11, Kiwify) → fechada. Sem pré-abertura: pelo método ADP a
  página que recebe a D é a de venda, com botão, desde o primeiro dia (decisão da Thali em 15/11).
  A fase vem da data (fuso de Brasília); ?fase=fechada serve só pra conferir antes do dia.
  HONESTIDADE: contagem igual à prévia oficial do Plano Anual (16 séries, 71 domingos; 21/11), âncora só com o preço
  público do Plano Anual (R$ 597), "em até 12x" sem valor da parcela, nada simulado, nenhum depoimento.
*/
import Image from "next/image";
import Link from "next/link";
import { Lilita_One } from "next/font/google";
import { CheckCircle, Clock, LockSimpleOpen, ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqItem from "@/components/FaqItem";
import Roda from "@/components/plano-anual/Roda";
import Leque from "@/components/arca/Leque";
import Tracking from "@/components/black-biblinho/Tracking";
import { ContadorBlocos, BarraContador } from "@/components/black-biblinho/Contador";
import { faseDaUrl } from "@/components/black-biblinho/fase";
import { KIWIFY_URL, PLANO_ANUAL_URL, OFERTA, VALOR, VALOR_TOTAL, BONUS, moeda, PLANO_2026, RODA_2026, BIBLIOTECA_2025, BLOCOS, NUMEROS, FAQ, DOMINGOS, SERIES, JUNIOR } from "@/components/black-biblinho/dados";
import { PECAS, FAIXAS } from "@/components/plano-anual/dados";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita", display: "swap" });

// 24/11 (Thali): textos próprios desta página pra duas peças. Versículo é "para memorização" (não "pra parede")
// e a lembrança não fala de papel: são jogos pedagógicos, coroas, relógios, e a criança leva a história pra casa.
const TEXTOS_PECAS = {
  "Versículo pra parede": { titulo: "Versículo para memorização", texto: "O versículo do mês em cartaz. No Júnior, um por estudo. A turma decora e ele vira parte da sala." },
  Lembrancinha: { titulo: "Lembrança", texto: "Jogos pedagógicos, coroas, relógios e outras peças pra montar. A criança sai da aula com a história na mão e conta em casa." },
  // 24/11 (Thali): apostila "escrita para a criança" (não "de criança"), aplicação na linguagem da faixa;
  // quadro de história com o texto atrás pro professor ler enquanto a criança vê a imagem.
  "Apostila do professor": { texto: "Cada estudo com a fala escrita para a criança, na linguagem da faixa etária: roda de conversa, curiosidade bíblica, hora da história, aplicação, brincadeira e oração. Você lê, adapta e conduz." },
  "Quadro de história": { texto: "Enquanto a criança vê a imagem, o professor lê o texto escrito atrás da lâmina. Assim você ministra a Palavra de Deus com segurança, e a história gruda." },
  // 24/11 (Thali): não é "carta pra família", é o espaço Querida Família, dentro do livro de atividades.
  "Carta pra família": { titulo: "Querida Família", texto: "No livro de atividades que a criança leva no fim do mês, um espaço contando o que ela aprendeu em cada estudo e o que desenvolveu em cada atividade." },
};
const PECAS_BB = PECAS.map((p) => ({ ...p, ...(TEXTOS_PECAS[p.titulo] || {}) }));

// 24/11 (Thali): três faixas com cor viva, idade no lugar de "colo/roda" e o que vem em cada uma.
// Júnior de 7 a 9 anos (mudou em 24/11). Cores das faixas iguais às do site novo (água, menta, rosa). Versículo: 1 por série no Baby e Kids, 1 por estudo no Júnior.
const FAIXAS_BB = [
  { ...FAIXAS[0], idade: "1 a 3 anos", chamada: "Versão para bebês", cor: "#90d8e4", ponto: "#4aa8ee", letreiro: "bb-letreiro--agua", onde: `em todas as ${SERIES} séries`,
    vem: ["Apostila do professor com a fala escrita em frases curtas, do jeito que o bebê entende", "Quadro de história com o texto atrás pro professor", "Atividade em cada estudo", "Versículo para memorização, um por série"] },
  { ...FAIXAS[1], idade: "4 a 6 anos", chamada: "Para crianças de 4 a 6 anos", cor: "#d8e4c0", ponto: "#2fb56b", letreiro: "bb-letreiro--sol", onde: `em todas as ${SERIES} séries`,
    vem: ["Apostila do professor com a fala escrita na linguagem da idade", "Quadro de história com o texto atrás pro professor", "Atividade em cada estudo", "Versículo para memorização, um por série"] },
  { ...FAIXAS[2], idade: "7 a 9 anos", chamada: "Para a turma de 7 a 9 anos", cor: "#f0a89c", ponto: "#8b5cf6", letreiro: "bb-letreiro--coral", onde: `em ${JUNIOR} séries`,
    vem: ["Apostila do professor com a fala escrita pra quem já lê", "Quadro de história com o texto atrás pro professor", "Atividade em cada estudo", "Versículo para memorização, um por estudo"] },
];

// A fase depende do relógio: a página é montada a cada visita, nunca congelada no build.
export const dynamic = "force-dynamic";

const HOST = "https://materiais.criatividadesbiblicas.com.br";
const PAGE_URL = `${HOST}/black-biblinho`;
const TITLE = "Black Biblinho · Acesso Total | Criatividades Bíblicas";
const DESCRIPTION =
  `Black Biblinho · Acesso Total: tudo que a Criatividades Bíblicas já criou, numa compra só. ${SERIES} séries de estudo, ${DOMINGOS} domingos de aula pronta, Baby, Kids e Júnior, mais o Emoções e o plano de leitura. Só até 30 de novembro.`;

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

// 24/11 (Thali): títulos com as letras do site oficial novo (letreiro de contorno marinho e sombra dura).
function H2({ children, className = "", cor = "" }) {
  return <h2 className={`bb-letreiro text-balance text-[2.1rem] md:text-[3rem] ${cor} ${className}`}>{children}</h2>;
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

// Chamada principal, muda com a fase. Na venda leva pra Kiwify; fechada, pro Plano Anual de sempre.
// No hero (rolar=true) o botão não leva pro checkout: desce pra seção do que entra, sem preço
// (decisão da Thali em 20/11: a pessoa precisa ver tudo que recebe antes de chegar no pagamento;
// 21/11: a conta do valor foi pro fim da página, depois de todo o material).
function Chamada({ fase, className = "", rolar = false }) {
  if (fase === "venda" && rolar) {
    return (
      <div className={className}>
        <Botao href="#entra" externo={false}>Quero o Acesso Total</Botao>
        <p className="mt-3 text-[14px] font-semibold text-current/70">Veja tudo que entra. Leva 1 minuto.</p>
      </div>
    );
  }
  if (fase === "venda") {
    return (
      <div className={className}>
        <Botao href={KIWIFY_URL}>Quero o Acesso Total · {OFERTA.por}</Botao>
        <p className="mt-3 text-[14px] font-semibold text-current/70">À vista ou {OFERTA.parcela} · Pix ou cartão · {OFERTA.garantiaDias} dias de garantia</p>
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
  // 21/11 (Thali): no topo, as capas mais recentes e mais coloridas: Daniel (out), As Cores da Salvação (nov, no centro) e Elias (set).
  const capasHero = [RODA_2026[9], RODA_2026[10], RODA_2026[8]];

  return (
    <div className={`pa bb ${lilita.variable}`}>
      <FaixaTopo fase={fase} />
      <Nav cta={{ href: "#oferta", label: fase === "venda" ? "Quero o Acesso Total" : "Plano Anual" }} links={[]} logoHref="/black-biblinho" />
      <Tracking fase={fase} />

      <main>
        {/* 1. Hero noturno: o que é, pra quem, e o relógio */}
        <section className="relative overflow-hidden bg-bb-noite text-white">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_10%,rgba(255,197,49,0.18)_0%,rgba(255,197,49,0)_60%),radial-gradient(60%_50%_at_10%_90%,rgba(89,182,240,0.14)_0%,rgba(89,182,240,0)_60%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16 xl:grid-cols-[1.25fr_1fr]">
            <div>
              <Selo>Black Friday · só até {OFERTA.fimCurto}</Selo>
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
                Chega de montar aula no sábado à noite. Abre, imprime, dá aula. Só até {OFERTA.fimCurto}, e não volta.
              </p>
              <div className="mt-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/60">{fase === "venda" ? "Fecha em" : `Fechou em ${OFERTA.fimCurto}`}</p>
                {fase === "venda" ? <ContadorBlocos escuro className="mt-3" /> : null}
              </div>
              <Chamada fase={fase} rolar className="mt-8 text-white" />
            </div>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg xl:max-w-none">
              <Image src={capasHero[0].src} alt="" width={900} height={1273} className="pa-flutua absolute left-[2%] top-[10%] hidden h-[72%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)] sm:block" style={{ "--r": "-8deg", "--dur": "7.5s", "--delay": "0.4s" }} />
              <Image src={capasHero[1].src} alt={`Capa do material: ${capasHero[1].nome}`} width={900} height={1273} priority className="pa-flutua absolute left-[30%] top-[2%] z-10 h-[86%] w-auto rounded-[12px] border-4 border-white shadow-[0_34px_54px_-18px_rgba(0,0,0,0.65)]" style={{ "--r": "2deg", "--dur": "6.4s" }} />
              <Image src={capasHero[2].src} alt="" width={900} height={1273} className="pa-flutua absolute left-[60%] top-[12%] h-[70%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)]" style={{ "--r": "8deg", "--dur": "8.2s", "--delay": "1s" }} />
            </div>
          </div>
        </section>

        {/* 2. O que entra (sem falar em "bloco": pedido da Thali em 21/11). A conta do valor fica no fim,
            depois de a pessoa ver todo o material (pedido dela em 21/11: primeiro o que recebe, por último o preço). */}
        <section id="entra" className="scroll-mt-20 bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Selo>O que entra</Selo>
            <H2 className="mt-5">Todo o material, <span className="bb-marca">liberado na hora.</span></H2>

            {/* Plano Anual 2026 */}
            <article className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)]">
              <div className="px-6 pt-8 md:px-10">
                <h3 className="font-display text-[1.6rem] leading-tight text-pa-tinta md:text-[2.1rem]">{BLOCOS[0].titulo}</h3>
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
                      <span className="block text-[12px] font-semibold text-pa-tinta/60">{h.tema}{h.nota ? ` · ${h.nota}` : ""}</span>
                    </span>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${h.emProducao ? "bg-pa-laranja/15 text-pa-laranja" : h.junior ? "bg-pa-campo/15 text-pa-campo-escuro" : "bg-pa-ceu/30 text-pa-tinta/70"}`}>
                      {h.emProducao ? "em produção" : h.junior ? "3 faixas" : "Baby · Kids"}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Biblioteca 2025 */}
            <article className="mt-6 overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] md:p-10">
              <h3 className="font-display text-[1.6rem] leading-tight text-pa-tinta md:text-[2.1rem]">{BLOCOS[1].titulo}</h3>
              <p className="mt-2 max-w-[62ch] text-[16px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[1].resumo} {BLOCOS[1].detalhe}</p>
              <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
                {BIBLIOTECA_2025.map((h) => (
                  <li key={h.historia} className="flex flex-col">
                    <Image src={h.src} alt={`Capa 2025: ${h.nome}`} width={720} height={1019} sizes="(min-width: 640px) 22vw, 45vw" className="w-full rounded-[10px] border-2 border-white shadow-[0_14px_26px_-14px_rgba(11,60,100,0.45)] ring-1 ring-pa-tinta/10" />
                    <span className="mt-3 text-[14px] font-bold leading-tight text-pa-tinta">{h.nome}</span>
                    <span className="text-[12px] font-semibold leading-snug text-pa-tinta/60">{h.tema}</span>
                    <span className="mt-1 text-[12px] font-semibold text-pa-tinta/55">{h.estudos} estudos · {h.junior ? "3 faixas" : "Baby e Kids"}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* 24/11 (Thali): Emoções e plano de leitura lado a lado, meia página cada; embaixo, o bônus em
                destaque com páginas de dentro do Planner. */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <article className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-[19rem] items-center justify-center bg-[#f3eefb] p-6 md:h-[21rem]">
                  <Image src="/emocoes/livro.png" alt="Capa do estudo Jesus Cuida das Minhas Emoções" width={693} height={1108} className="h-60 w-auto drop-shadow-[0_18px_24px_rgba(74,42,122,0.35)] transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 md:h-72" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-[1.6rem] leading-tight text-[#4a2a7a] md:text-[1.9rem]">{BLOCOS[2].titulo}</h3>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[2].resumo} {BLOCOS[2].detalhe}</p>
                </div>
              </article>
              <article className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex h-[19rem] items-center justify-center bg-[#eaf6ff] p-6 md:h-[21rem]">
                  <Image src="/black-biblinho/plano-de-leitura.webp" alt="Página do plano de leitura anual" width={1200} height={848} className="w-full max-w-[340px] rounded-[0.75rem] shadow-[0_18px_24px_-14px_rgba(11,60,100,0.35)] ring-1 ring-pa-tinta/10 transition-transform duration-300 group-hover:rotate-1 group-hover:scale-105" />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-[1.6rem] leading-tight text-[#1c86d6] md:text-[1.9rem]">{BLOCOS[3].titulo}</h3>
                  <p className="mt-2 text-[16px] font-medium leading-relaxed text-pa-tinta/80">{BLOCOS[3].resumo} {BLOCOS[3].detalhe}</p>
                </div>
              </article>
            </div>

            <article className="relative mt-6 overflow-hidden rounded-[2rem] bg-[#fff6e3] shadow-[0_14px_36px_-18px_rgba(138,90,60,0.45)] ring-4 ring-pa-sol">
              <div className="grid items-center gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
                <div className="flex justify-center">
                  <Image src="/black-biblinho/planner-2027.webp" alt="Capa do Planner Ministério Infantil 2027, Chamadas a Cuidar" width={900} height={1273} className="pa-flutua h-72 w-auto rounded-[10px] border-4 border-white shadow-[0_22px_34px_-14px_rgba(138,90,60,0.5)] md:h-80" style={{ "--r": "-3deg", "--dur": "7s" }} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-pa-laranja px-4 py-1.5 font-display text-[15px] uppercase tracking-[0.08em] text-white">
                    <Sparkle size={15} weight="fill" /> Bônus
                  </span>
                  <h3 className="mt-4 font-display text-[1.9rem] leading-[1.05] text-pa-tinta md:text-[2.6rem]">{BLOCOS[4].titulo}</h3>
                  <p className="mt-3 max-w-[60ch] text-[16px] font-medium leading-relaxed text-pa-tinta/80 md:text-[17px]">{BLOCOS[4].resumo} {BLOCOS[4].detalhe}</p>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-pa-sol/70 px-6 pb-8 pt-6 md:px-10">
                <p className="font-display text-[1.15rem] text-pa-terra">Uma espiada por dentro</p>
                <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {BLOCOS[4].paginas.map((p, i) => (
                    <li key={p.src} className="group flex flex-col items-center">
                      <Image src={p.src} alt={`Página do Planner: ${p.nome}`} width={720} height={1023} sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw" className={`w-full rounded-[10px] border-4 border-white shadow-[0_14px_24px_-12px_rgba(138,90,60,0.5)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0 ${i % 2 ? "rotate-2" : "-rotate-2"}`} />
                      <span className="mt-3 text-center text-[14px] font-extrabold text-pa-tinta">{p.nome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
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
            <H2 cor="bb-letreiro--ceu">O que vem dentro de <span className="bb-marca bb-marca--agua">cada sequência.</span></H2>
            <Texto className="mt-4 max-w-[58ch]">Tudo isso vem em cada história, pronto pra imprimir em casa, na igreja ou na gráfica.</Texto>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS_BB.map((p) => (
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

        {/* 6. Três faixas, uma história (24/11: letras e cores do site novo, cartão de contorno marinho) */}
        <section className="bg-[#f3f7fb]">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>Três faixas, <span className="bb-marca">uma história.</span></H2>
            <Texto className="mt-6 max-w-[60ch]">O mesmo estudo do Filho Pródigo, escrito três vezes: uma versão para bebês, uma para crianças de 4 a 6 anos e uma para a turma de 7 a 9 anos. A linguagem muda. A história, não.</Texto>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {FAIXAS_BB.map((f, i) => (
                <article key={f.faixa} className={`bb-cartao group flex flex-col overflow-hidden bg-white transition-transform duration-300 hover:-translate-y-1.5 ${i === 1 ? "md:rotate-1" : i === 2 ? "md:-rotate-1" : ""}`}>
                  <div className="flex items-end justify-between gap-3 border-b-[3px] border-[#1d1a4f] px-6 pb-4 pt-5" style={{ background: f.cor }}>
                    <p className={`bb-letreiro ${f.letreiro} text-[2.4rem]`}>{f.faixa}</p>
                    <p className="mb-1 rounded-full border-2 border-[#1d1a4f] bg-white px-3 py-1 font-display text-[15px] text-[#1d1a4f]">{f.idade}</p>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-[#1d1a4f] bg-white">
                    <Image src={f.src} alt={`Página da apostila ${f.faixa}: Hora da História do Filho Pródigo`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display text-[1.3rem] leading-tight text-[#1d1a4f]">{f.chamada}</p>
                    <p className="mt-1 text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#4b487c]">{f.onde}</p>
                    <ul className="mt-4 space-y-2.5">
                      {f.vem.map((v) => (
                        <li key={v} className="flex items-start gap-2.5 text-[15px] font-semibold leading-snug text-[#1d1a4f]/85">
                          <span aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-[#1d1a4f]" style={{ background: f.ponto }} /> {v}
                        </li>
                      ))}
                    </ul>
                    <blockquote className="mt-5 rounded-[1.25rem] p-4 text-[14px] font-medium italic leading-relaxed text-[#1d1a4f]/85" style={{ background: f.cor + "55" }}>“{f.trecho}”</blockquote>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Por que só agora + a conta do valor (24/11, Thali: destaque separado que chama atenção, com o Biblinho fazendo a conta) */}
        <section id="valor" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
            <div className="bb-cartao relative bg-[#fff6d6] px-6 pb-10 pt-12 md:px-12 md:pb-12 md:pt-14">
              <span className="absolute -top-5 left-6 rotate-[-4deg] rounded-full border-[3px] border-[#1d1a4f] bg-[#f06060] px-5 py-2 font-display text-[15px] uppercase tracking-[0.08em] text-white shadow-[0_5px_0_#1d1a4f] md:left-12">Só na Black Friday</span>
              <H2 cor="bb-letreiro--sol">Por que isso só existe <span className="bb-marca bb-marca--rosa">na Black Friday.</span></H2>
              <div className="mt-7 grid gap-5 text-[16px] font-medium leading-relaxed text-[#1d1a4f]/85 md:grid-cols-3">
                <p className="rounded-[1.25rem] border-2 border-[#1d1a4f] bg-white p-5"><strong className="mb-1 block font-display text-[1.2rem] font-normal text-[#0c78b8]">No resto do ano</strong>O Plano Anual é uma assinatura: {OFERTA.ancora.preco} por um ano, com uma história liberada por mês, na ordem. Assim a igreja inteira acompanha a mesma história no mesmo mês.</p>
                <p className="rounded-[1.25rem] border-2 border-[#1d1a4f] bg-white p-5"><strong className="mb-1 block font-display text-[1.2rem] font-normal text-[#f06060]">Na Black Friday</strong>A gente abre tudo de uma vez: o ano de 2026, a biblioteca de 2025, o Emoções e o plano de leitura, com o Planner 2027 de bônus assim que ficar pronto.</p>
                <p className="rounded-[1.25rem] border-2 border-[#1d1a4f] bg-white p-5"><strong className="mb-1 block font-display text-[1.2rem] font-normal text-[#17753f]">Depois do dia 30</strong>Em 2027 o Plano Anual é novo, com histórias que não estão aqui, e esta oferta não se repete. Quem prefere mês a mês tem o <Link href={PLANO_ANUAL_URL} className="font-bold text-[#0c78b8] underline underline-offset-4">Plano Anual de sempre</Link>.</p>
              </div>

              <div className="mt-12 grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
                <div className="relative mx-auto w-full max-w-[20rem]">
                  <Image src="/black-biblinho/biblinho-calculadora.webp" alt="O Biblinho fazendo a conta numa calculadora" width={752} height={800} className="pa-flutua h-auto w-full" style={{ "--r": "-2deg", "--dur": "6.5s" }} />
                </div>
                <div>
                  <h3 className="bb-letreiro bb-letreiro--ceu text-[2rem] md:text-[2.4rem]">Faça a conta.</h3>
                  <p className="mt-3 text-[16px] font-medium leading-relaxed text-[#1d1a4f]/80 md:text-[17px]">Tudo que você acabou de ver já existe e é vendido separado, pelos preços de hoje. Somando, dá isto:</p>
                  <ul className="mt-5 divide-y-2 divide-dashed divide-[#1d1a4f]/15 rounded-[1.25rem] border-2 border-[#1d1a4f] bg-white px-5 py-1">
                    {VALOR.map((v) => (
                      <li key={v.item} className="flex items-baseline justify-between gap-4 py-3.5">
                        <span>
                          <span className="block text-[16px] font-bold text-[#1d1a4f]">{v.item}</span>
                          <span className="block text-[13px] font-semibold text-[#4b487c]">{v.detalhe}</span>
                        </span>
                        <span className="shrink-0 font-display text-[1.2rem] text-[#1d1a4f]/80 tabular-nums">{moeda(v.preco)}</span>
                      </li>
                    ))}
                    <li className="flex items-baseline justify-between gap-4 py-3.5">
                      <span className="text-[16px] font-extrabold text-[#1d1a4f]">Separado, tudo isso custa</span>
                      <span className="shrink-0 font-display text-[1.5rem] text-[#1d1a4f] tabular-nums line-through decoration-[#f06060] decoration-4">{moeda(Math.round(VALOR_TOTAL))}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border-[3px] border-[#1d1a4f] bg-bb-noite px-6 py-7 text-white shadow-[0_6px_0_rgb(29_26_79/0.25)] md:px-8">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/60">Na Black Friday, até {OFERTA.fimCurto}</p>
                <p className="mt-2 flex flex-wrap items-end gap-x-3">
                  <span className="font-display text-[3rem] leading-none text-pa-sol md:text-[3.6rem]">{OFERTA.por}</span>
                  <span className="pb-1 text-[16px] font-bold text-white/85">tudo junto, liberado de uma vez</span>
                </p>
                <p className="mt-3 text-[16px] font-medium leading-relaxed text-white/85 md:text-[17px]">
                  Menos da metade do que custa o Plano Anual sozinho, e você leva {DOMINGOS} domingos de aula pronta, {SERIES} séries, as três faixas, o Emoções e o plano de leitura. Ou {OFERTA.parcela}.
                </p>
                <p className="mt-3 text-[15px] font-medium leading-relaxed text-white/75">
                  E de bônus: o {BONUS.nome} {BONUS.texto}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Oferta */}
        <section id="oferta" className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <H2 className="text-center">{fase === "fechada" ? "A Black Friday fechou." : "Quanto custa o Acesso Total."}</H2>
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
                      <ContadorBlocos className="mt-2" />
                      <Botao href={KIWIFY_URL} className="mt-7 w-full sm:w-auto">Quero o Acesso Total</Botao>
                      <p className="mt-3 text-[13px] font-semibold text-pa-tinta/70">Pix ou cartão · pagamento seguro pela Kiwify · acesso no e-mail da compra</p>
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
                { n: 2, t: "Tudo abre na hora.", d: "Plano Anual 2026, Biblioteca 2025, Emoções e plano de leitura, tudo na mesma área de membros. Baixa e imprime o que for usar." },
                { n: 3, t: "Dezembro e o Planner 2027 chegam depois.", d: "O tema de dezembro, Eu Vivo o que a Bíblia Diz, e o Planner Ministério Infantil 2027 entram na sua área de membros quando ficarem prontos, sem pagar nada a mais. De janeiro a novembro já está tudo lá." },
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
            <h2 className="bb-letreiro bb-letreiro--sol mt-8 text-balance text-[2rem] md:text-[2.75rem]">
              {fase === "fechada" ? "Até a próxima." : "Segunda, 30 de novembro, 23h59. Depois, não volta."}
            </h2>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-white/80 md:text-xl">
              {fase === "fechada" ? "O Plano Anual segue no formato de sempre, uma história por mês." : `${DOMINGOS} domingos de aula pronta, na sua mão, hoje.`}
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
