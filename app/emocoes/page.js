import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TestimonialCard from "@/components/TestimonialCard";
import FaqItem from "@/components/FaqItem";
import VideoFacade from "@/components/emocoes/VideoFacade";
import Tracking from "@/components/emocoes/Tracking";
import MiniCarrossel from "@/components/emocoes/MiniCarrossel";
import { SITE_URL } from "@/lib/site";
import {
  Tag,
  MoonStars,
  UsersThree,
  Sparkle,
  CheckCircle,
  ShieldCheck,
  Lightning,
  Printer,
  Church,
  HouseLine,
  Student,
  HandsPraying,
  FilePdf,
  EnvelopeSimpleOpen,
  LockKey,
  DownloadSimple,
} from "@phosphor-icons/react/dist/ssr";

const TITLE = "Jesus Cuida das Minhas Emoções | Criatividades Bíblicas";
const DESCRIPTION =
  "Estudo bíblico completo pra ensinar as 9 emoções às crianças: cards com versículo, história do Salmo 23, caixinha Pergunta ou Desafio, atividades e lembrancinhas. Pronto pra imprimir. R$ 57,90, acesso imediato.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/emocoes" },
  keywords: [
    "estudo bíblico infantil emoções", "emoções crianças bíblia", "ministério infantil emoções",
    "EBD emoções", "material bíblico infantil", "Jesus cuida das minhas emoções", "Criatividades Bíblicas",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/emocoes",
    siteName: "Criatividades Bíblicas",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/emocoes/og.png", width: 1200, height: 630, alt: "Jesus Cuida das Minhas Emoções — estudo bíblico infantil sobre as 9 emoções" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/emocoes/og.png"],
  },
  robots: { index: true, follow: true },
};

const KIWIFY_URL = "https://pay.kiwify.com.br/gnhrmc2";
const CTA = "Quero o estudo completo";

const EMOCOES = [
  { id: "medo", nome: "Medo", cor: "bg-emo-medo" },
  { id: "tristeza", nome: "Tristeza", cor: "bg-emo-tristeza" },
  { id: "raiva", nome: "Raiva", cor: "bg-emo-raiva" },
  { id: "ansiedade", nome: "Ansiedade", cor: "bg-emo-ansiedade" },
  { id: "inveja", nome: "Inveja", cor: "bg-emo-inveja" },
  { id: "vergonha", nome: "Vergonha", cor: "bg-emo-vergonha" },
  { id: "repulsa", nome: "Repulsa", cor: "bg-emo-repulsa" },
  { id: "tedio", nome: "Tédio", cor: "bg-emo-tedio" },
  { id: "alegria", nome: "Alegria", cor: "bg-emo-alegria" },
];

/* Personagens flutuando ao redor do livro no hero. Posições em % do container. */
const FLUTUANTES = [
  { id: "alegria", w: 150, className: "left-[-6%] top-[8%] md:w-[170px]", r: -8, dur: 5.2, delay: 0 },
  { id: "medo", w: 96, className: "right-[-4%] top-[4%]", r: 6, dur: 6.1, delay: 0.6 },
  { id: "tristeza", w: 104, className: "right-[-8%] top-[42%] hidden sm:block", r: 5, dur: 5.6, delay: 1.1 },
  { id: "raiva", w: 92, className: "left-[-4%] bottom-[8%] hidden sm:block", r: -6, dur: 4.9, delay: 0.3 },
  { id: "ansiedade", w: 120, className: "right-[2%] bottom-[-2%]", r: 4, dur: 5.8, delay: 0.9 },
  { id: "inveja", w: 130, className: "left-[2%] top-[46%] hidden md:block", r: -3, dur: 6.4, delay: 1.5 },
];

const BENEFICIOS = [
  {
    icon: Tag,
    titulo: "Dá nome ao que sente",
    texto: "Medo, raiva, vergonha. Quando a criança sabe o nome, ela consegue falar em vez de só explodir.",
  },
  {
    icon: MoonStars,
    titulo: "Lida melhor com o medo e a ansiedade",
    texto: "Ela aprende que Jesus cuida disso, e leva o versículo pra hora de dormir sozinha ou da prova na escola.",
  },
  {
    icon: UsersThree,
    titulo: "Entende o coleguinha",
    texto: "Quem reconhece a própria tristeza reconhece a do outro. A empatia começa aí.",
  },
  {
    icon: Sparkle,
    titulo: "Cresce com a autoestima firmada na Palavra",
    texto: "A criança descobre que sentir não é pecado, e que ela é cuidada em cada emoção.",
  },
];

const PECAS = [
  {
    titulo: "9 cards das emoções",
    texto: "Um card por emoção, com o personagem e um versículo pra criança guardar no coração.",
    tipo: "cards",
    cor: "bg-emo-alegria/25",
  },
  {
    titulo: "História ilustrada do Salmo 23",
    texto: "15 lâminas, uma pra cada trecho do salmo. Você conta a história mostrando.",
    imagem: "/emocoes/previews/salmo-historia.webp",
    tipo: "alta",
    cor: "bg-emo-tristeza/15",
  },
  {
    titulo: "Caixinha Pergunta ou Desafio",
    texto: "Molde da caixa, 20 fichas e gabarito. A dinâmica que fecha o encontro.",
    imagem: "/emocoes/previews/caixa-montada-v2.webp",
    tipo: "inteira",
    cor: "bg-emo-vergonha/30",
  },
  {
    titulo: "Roteiro do encontro",
    texto: "Objetivo, versículo, dinâmica, louvores e encerramento. Passo a passo, sem improviso.",
    imagem: "/emocoes/previews/plano-estudo.webp",
    cor: "bg-emo-medo/20",
  },
  {
    titulo: "2 atividades",
    texto: "Uma pra até 5 anos, outra pra 6 anos ou mais. As duas trabalham todas as emoções.",
    tipo: "carrossel",
    imagens: [
      { src: "/emocoes/previews/atividade-1.webp", legenda: "Atividade 1 · até 5 anos" },
      { src: "/emocoes/previews/atividade-2.webp", legenda: "Atividade 2 · 6 anos ou mais" },
      { src: "/emocoes/previews/atividade-area.webp", legenda: "O que cada atividade desenvolve" },
    ],
    cor: "bg-emo-inveja/20",
  },
  {
    titulo: "Lembrancinhas",
    texto: "Relógio e tag de pirulito pra criança levar a aula pra casa.",
    imagem: "/emocoes/previews/lembrancinhas.webp",
    tipo: "inteira",
    cor: "bg-emo-ansiedade/20",
  },
  {
    titulo: "Versículo de memorização",
    texto: "Salmos 145:20a em banner pra parede e em cartão pra mão.",
    imagem: "/emocoes/previews/versiculo.webp",
    tipo: "inteira",
    cor: "bg-emo-repulsa/20",
  },
  {
    titulo: "Orientações pra líderes",
    texto: "Leitura exclusiva sobre as emoções das crianças, pra você ler antes de dar a aula.",
    imagem: "/emocoes/previews/orientacoes.webp",
    cor: "bg-emo-medo/15",
  },
  {
    titulo: "Bônus: versículos ilustrados",
    texto: "Mais de 30 versículos sobre emoções, prontos pra imprimir e espalhar pela sala.",
    imagem: "/emocoes/previews/bonus-arte.webp",
    tipo: "inteira",
    cor: "bg-emo-alegria/30",
  },
];

const PASSOS = [
  {
    icon: Lightning,
    titulo: "Você compra pela Kiwify.",
    texto: "Pagamento aprovado, acesso liberado na hora. Sem esperar.",
  },
  {
    icon: DownloadSimple,
    titulo: "Você baixa os PDFs.",
    texto: "Tudo fica na sua área da Kiwify, pra baixar quantas vezes quiser.",
  },
  {
    icon: Printer,
    titulo: "Você imprime e dá a aula.",
    texto: "Recursos visuais em papel 180g, atividades em sulfite comum. Roteiro pronto.",
  },
];

const ONDE = [
  { icon: Church, titulo: "EBD e ministério infantil", texto: "Um encontro completo, do louvor à lembrancinha." },
  { icon: HandsPraying, titulo: "Célula de crianças", texto: "A caixinha de perguntas rende conversa em grupo pequeno." },
  { icon: Student, titulo: "Escola cristã", texto: "Roteiro e atividades por idade, prontos pra sala." },
  { icon: HouseLine, titulo: "Em casa, com os filhos", texto: "Uma emoção por semana, com a Bíblia aberta na mesa." },
];

const DEPOIMENTOS = [
  {
    name: "Lorena Xavier",
    role: "Professora no Ministério Kids",
    quote:
      "Trabalho excelente, material super apresentável e acessível para as crianças. Amei todo o suporte dado e atenção.",
    photo: "/depoimentos/lorena-xavier.jpg",
  },
  {
    name: "Claudia Alves",
    role: "Professora no Ministério Kids",
    quote: "Ótimo material. Conteúdo de fácil compreensão, muito criativo e com um visual de alta qualidade.",
    photo: "/depoimentos/claudia-alves.jpg",
  },
  {
    name: "Kessia Alves",
    role: "Professora EBD",
    quote:
      "Aborda de forma lúdica e didática os princípios da fé cristã, respeitando as necessidades de faixa etária, sempre com muita cor.",
    photo: "/depoimentos/kessia-alves.jpg",
  },
  {
    name: "Maria Alcantara",
    role: "Professora do Berçário",
    quote:
      "Consigo chamar e prender a atenção das crianças, mesmo tão pequenas. É um material simples, prático e objetivo.",
    photo: "/depoimentos/maria-alcantara.jpg",
  },
];

const ENTREGA = [
  {
    icon: FilePdf,
    titulo: "É digital, em PDF.",
    texto: "Nada vai pelo correio. Você imprime em casa, na igreja ou na papelaria.",
  },
  {
    icon: EnvelopeSimpleOpen,
    titulo: "O acesso chega no seu e-mail.",
    texto: "Assim que o pagamento é aprovado, a Kiwify envia o link da sua área de acesso. Os arquivos ficam lá, não em anexo.",
  },
  {
    icon: Lightning,
    titulo: "Acesso imediato.",
    texto: "Comprou de manhã, imprime à tarde, usa no domingo.",
  },
  {
    icon: LockKey,
    titulo: "O material é fechado.",
    texto: "Não fazemos alterações de tamanho, frases ou cores. O que você vê aqui é o que você recebe.",
  },
];

const FAQ = [
  {
    q: "Onde eu recebo o material?",
    a: "Na sua área de acesso da Kiwify. Assim que o pagamento é aprovado, você recebe um e-mail com o link. Os arquivos ficam lá, disponíveis pra baixar quantas vezes precisar.",
  },
  {
    q: "Vou receber impresso?",
    a: "Não. O material é 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar.",
  },
  {
    q: "Serve pra qual idade?",
    a: "As atividades vêm em duas versões: uma pra crianças de até 5 anos e outra pra 6 anos ou mais. Cards, história e caixinha servem pra turma inteira.",
  },
  {
    q: "Que papel eu uso pra imprimir?",
    a: "Recursos visuais e cards ficam melhores em papel 180g. Atividades e fichas vão bem em sulfite comum. Tudo funciona também em preto e branco.",
  },
  {
    q: "Posso usar com toda a equipe da minha igreja?",
    a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos.",
  },
  {
    q: "Tem garantia?",
    a: "Tem. 7 dias depois da compra pra você pedir reembolso total, sem burocracia. É só mandar um e-mail.",
  },
  {
    q: "Tem suporte se eu tiver dúvida?",
    a: "Sim. Você fala com a gente por e-mail ou pelo Instagram, e o material vem com orientações de uso pra líderes.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Jesus Cuida das Minhas Emoções",
      description: DESCRIPTION,
      image: `${SITE_URL}/emocoes/og.png`,
      brand: { "@type": "Brand", name: "Criatividades Bíblicas" },
      category: "Material bíblico infantil (digital, PDF)",
      offers: {
        "@type": "Offer",
        price: "57.90",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/emocoes`,
        seller: { "@type": "Organization", name: "Criatividades Bíblicas" },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "Organization",
      name: "Criatividades Bíblicas",
      url: SITE_URL,
      logo: `${SITE_URL}/emocoes/logo-wordmark.png`,
      sameAs: ["https://www.instagram.com/criatividadesbiblicas", "https://www.tiktok.com/@criatividadesbiblicas"],
    },
  ],
};

function BotaoComprar({ className = "" }) {
  return (
    <a
      href={KIWIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full bg-coral-deep px-8 py-4 text-base font-bold text-white shadow-[0_10px_28px_-8px_rgba(214,67,46,0.65)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] ${className}`}
    >
      {CTA}
    </a>
  );
}

function Preco({ className = "" }) {
  return (
    <p className={`text-xs font-semibold text-cacau/55 ${className}`}>
      Acesso imediato · garantia de 7 dias
    </p>
  );
}

function CardsLeque() {
  const trio = [
    { id: "medo", cls: "-rotate-6 translate-y-3" },
    { id: "alegria", cls: "z-10 -translate-y-1" },
    { id: "tristeza", cls: "rotate-6 translate-y-3" },
  ];
  return (
    <div className="flex items-end justify-center px-4 pt-6">
      {trio.map((c, i) => (
        <Image
          key={c.id}
          src={`/emocoes/cards/${c.id}.webp`}
          alt={`Card da emoção ${c.id}`}
          width={640}
          height={905}
          className={`w-[34%] rounded-xl shadow-[0_18px_40px_-16px_rgba(46,31,23,0.45)] ${c.cls} ${i === 1 ? "" : "-mx-3"}`}
        />
      ))}
    </div>
  );
}

export default function EmocoesPage() {
  return (
    <>
      <Nav cta={{ label: CTA, href: "#oferta" }} links={[]} logoHref="/emocoes" />
      <Tracking />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <main>
        {/* 1. Hero */}
        <section className="emo-dots relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(255,222,87,0.35),transparent_70%),radial-gradient(50%_50%_at_90%_30%,rgba(148,116,170,0.28),transparent_70%),radial-gradient(45%_40%_at_60%_100%,rgba(72,180,173,0.22),transparent_70%)]"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 md:grid-cols-[1.05fr_1fr] md:px-8 md:pb-24 md:pt-16">
            <Reveal>
              <Image
                src="/emocoes/logo-wordmark.png"
                alt="Jesus Cuida das Minhas Emoções"
                width={900}
                height={900}
                priority
                className="h-auto w-44 md:w-52"
              />
              <h1 className="mt-6 text-balance font-display text-[2.25rem] font-semibold leading-[1.1] text-cacau md:text-[3.25rem]">
                Ensine as 9 emoções com a Bíblia aberta.
              </h1>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-cacau/75 md:text-lg">
                Um estudo completo, pronto pra imprimir, que ajuda a criança a dar nome ao que sente e a descobrir o
                que Jesus diz sobre cada emoção. Pra EBD, célula, escola cristã ou em casa.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3">
                <BotaoComprar />
                <Preco />
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-cacau/70">
                <li className="flex items-center gap-2">
                  <Lightning size={18} weight="fill" className="text-emo-ansiedade" />
                  Acesso na hora
                </li>
                <li className="flex items-center gap-2">
                  <Printer size={18} weight="fill" className="text-emo-tristeza" />
                  Imprime em casa
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={18} weight="fill" className="text-emo-repulsa" />
                  7 dias de garantia
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md md:max-w-none">
                <div className="absolute inset-x-[12%] inset-y-[6%] rounded-[3rem] bg-white/70 shadow-[0_30px_80px_-30px_rgba(74,42,122,0.35)]" />
                <Image
                  src="/emocoes/livro.png"
                  alt="Apostila Jesus Cuida das Minhas Emoções"
                  width={689}
                  height={1100}
                  priority
                  className="emo-float absolute left-1/2 top-1/2 h-[88%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_30px_40px_rgba(46,31,23,0.30)]"
                  style={{ "--dur": "7s", "--r": "0deg" }}
                />
                {FLUTUANTES.map((f) => (
                  <Image
                    key={f.id}
                    src={`/emocoes/emo/${f.id}.png`}
                    alt=""
                    width={f.w}
                    height={f.w}
                    className={`emo-float absolute h-auto drop-shadow-[0_10px_18px_rgba(46,31,23,0.22)] ${f.className}`}
                    style={{ width: f.w, "--dur": `${f.dur}s`, "--delay": `${f.delay}s`, "--r": `${f.r}deg` }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. As 9 emoções */}
        <section className="px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                As 9 emoções que a criança mais sente. Cada uma com o que a Bíblia diz.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cacau/70 md:text-lg">
                Não é só "fique feliz". É medo, tristeza, raiva, ansiedade, inveja, vergonha, repulsa, tédio e alegria,
                cada uma com um personagem e um versículo pra criança guardar.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9 md:gap-4">
                {EMOCOES.map((e) => (
                  <li
                    key={e.id}
                    className="emo-wiggle-hover group flex flex-col items-center rounded-2xl bg-white p-3 pt-4 shadow-[0_2px_16px_-4px_rgba(46,31,23,0.10)] transition-transform hover:-translate-y-1"
                  >
                    <div className="flex h-20 w-full items-end justify-center">
                      <Image
                        src={`/emocoes/emo/${e.id}.png`}
                        alt={`Personagem da emoção ${e.nome}`}
                        width={140}
                        height={140}
                        className="max-h-20 w-auto"
                      />
                    </div>
                    <span className={`mt-3 h-1.5 w-8 rounded-full ${e.cor}`} aria-hidden="true" />
                    <span className="mt-2 text-xs font-extrabold uppercase tracking-wide text-cacau/80">
                      {e.nome}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 3. Por que + vídeo */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Toda criança sente. Poucas sabem o que fazer com isso.
              </h2>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-cacau/75 md:text-lg">
                Birra na saída da igreja, choro sem explicação, medo de dormir sozinha, vergonha de falar na frente
                da turma. Atrás de cada um desses momentos tem uma emoção que a criança ainda não sabe nomear. Quando
                ela aprende o nome, e descobre que Jesus cuida disso, o que era birra vira conversa.
              </p>
              <ul className="mt-8 flex flex-col gap-5">
                {BENEFICIOS.map(({ icon: Icon, titulo, texto }) => (
                  <li key={titulo} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-coral-deep shadow-[0_2px_10px_-2px_rgba(46,31,23,0.15)]">
                      <Icon size={20} weight="fill" />
                    </span>
                    <span>
                      <span className="block font-bold text-cacau">{titulo}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-cacau/70">{texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <VideoFacade videoId="FdGA8e4ri7I" title="Veja o material por dentro" />
              <p className="mt-4 text-center text-sm font-semibold text-cacau/60">
                Vídeo curto mostrando o estudo montado, peça por peça.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4. O que vem dentro */}
        <section id="o-que-vem-dentro" className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Tudo o que vem dentro do estudo.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cacau/70 md:text-lg">
                9 peças prontas pra imprimir. Você baixa hoje e usa no próximo encontro. As imagens abaixo são páginas
                reais do material.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS.map((p, i) => {
                const span =
                  p.tipo === "cards"
                    ? "sm:col-span-2"
                    : p.tipo === "alta"
                      ? "lg:row-span-2"
                      : p.tipo === "larga"
                        ? "sm:col-span-2 lg:col-span-1"
                        : "";
                return (
                  <Reveal key={p.titulo} delay={(i % 3) * 0.06} className={span}>
                    <article
                      className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] ${p.cor} shadow-[0_2px_16px_-4px_rgba(46,31,23,0.08)]`}
                    >
                      <div
                        className={`flex flex-1 items-center justify-center overflow-hidden ${
                          p.tipo === "alta" ? "px-8 pt-8" : p.tipo === "cards" ? "" : "px-8 pt-8"
                        }`}
                      >
                        {p.tipo === "cards" ? (
                          <CardsLeque />
                        ) : p.tipo === "carrossel" ? (
                          <MiniCarrossel imagens={p.imagens} alt={`Prévia: ${p.titulo}`} />
                        ) : p.tipo === "inteira" ? (
                          <Image
                            src={p.imagem}
                            alt={`Prévia: ${p.titulo}`}
                            width={828}
                            height={1170}
                            className="max-h-[420px] w-auto rounded-xl object-contain shadow-[0_18px_40px_-16px_rgba(46,31,23,0.35)]"
                          />
                        ) : p.tipo === "alta" ? (
                          <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-t-xl shadow-[0_18px_40px_-16px_rgba(46,31,23,0.35)]">
                            <Image
                              src={p.imagem}
                              alt={`Prévia: ${p.titulo}`}
                              fill
                              sizes="(min-width: 1024px) 30vw, 90vw"
                              className="object-cover object-top"
                            />
                          </div>
                        ) : (
                          <Image
                            src={p.imagem}
                            alt={`Prévia: ${p.titulo}`}
                            width={p.tipo === "larga" ? 1170 : 828}
                            height={p.tipo === "larga" ? 828 : 1170}
                            className={`w-full rounded-t-xl object-cover object-top shadow-[0_18px_40px_-16px_rgba(46,31,23,0.35)] ${
                              p.tipo === "alta" ? "max-h-[440px]" : "max-h-[240px]"
                            }`}
                          />
                        )}
                      </div>
                      <div className="p-6 pt-5">
                        <h3 className="font-display text-xl font-semibold text-cacau">{p.titulo}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-cacau/75">{p.texto}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-12 flex flex-col items-center gap-3 text-center">
              <BotaoComprar />
              <Preco />
            </Reveal>
          </div>
        </section>

        {/* 5. Como funciona */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="max-w-xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Da compra à aula, em 3 passos.
              </h2>
            </Reveal>
            <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
              {PASSOS.map(({ icon: Icon, titulo, texto }, i) => (
                <Reveal key={titulo} delay={i * 0.08}>
                  <li className="relative h-full rounded-[1.75rem] bg-white p-7 shadow-[0_2px_16px_-4px_rgba(46,31,23,0.10)]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emo-alegria/40 text-cacau">
                      <Icon size={24} weight="fill" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-cacau">{titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cacau/70">{texto}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Onde usar */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_1fr]">
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Feito pra EBD. E pra muito além dela.
              </h2>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-cacau/75 md:text-lg">
                As atividades vêm separadas por idade: até 5 anos e a partir dos 6. Cards, história e caixinha servem
                pra turma inteira, dos pequenos aos maiores.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {ONDE.map(({ icon: Icon, titulo, texto }, i) => {
                  const tints = ["bg-emo-alegria/35", "bg-emo-inveja/25", "bg-emo-vergonha/40", "bg-emo-medo/25"];
                  return (
                    <li key={titulo} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tints[i]} text-cacau`}
                      >
                        <Icon size={20} weight="fill" />
                      </span>
                      <span>
                        <span className="block font-bold text-cacau">{titulo}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-cacau/70">{texto}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 -rotate-3 rounded-[2rem] bg-emo-alegria/40" />
                <Image
                  src="/emocoes/previews/salmo-vale-v2.webp"
                  alt="Lâmina do Salmo 23: ainda que eu ande pelo vale da sombra da morte"
                  width={828}
                  height={1170}
                  className="relative w-full rounded-[1.5rem] shadow-[0_24px_60px_-24px_rgba(46,31,23,0.45)]"
                />
                <Image
                  src="/emocoes/emo/vergonha.png"
                  alt=""
                  width={220}
                  height={132}
                  className="emo-float absolute -bottom-6 -left-8 w-40 drop-shadow-[0_10px_18px_rgba(46,31,23,0.22)]"
                  style={{ "--dur": "5.5s", "--r": "-4deg" }}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Depoimentos */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="max-w-2xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Quem já usa o material da Criatividades Bíblicas.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {DEPOIMENTOS.map((d, i) => (
                <Reveal key={d.name} delay={i * 0.06}>
                  <TestimonialCard {...d} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Oferta + garantia */}
        <section id="oferta" className="emo-dots px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-40px_rgba(74,42,122,0.35)]">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative flex items-center justify-center bg-emo-capa/10 p-8 md:p-10">
                <Image
                  src="/emocoes/livro.png"
                  alt="Apostila Jesus Cuida das Minhas Emoções"
                  width={689}
                  height={1100}
                  className="w-52 drop-shadow-[0_24px_36px_rgba(46,31,23,0.30)] md:w-60"
                />
              </div>
              <div className="p-8 md:p-10">
                <h2 className="text-balance font-display text-2xl font-semibold leading-tight text-cacau md:text-3xl">
                  Estudo completo Jesus Cuida das Minhas Emoções
                </h2>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {[
                    "9 cards das emoções com versículo",
                    "História ilustrada do Salmo 23 (15 lâminas)",
                    "Caixinha Pergunta ou Desafio com 20 fichas",
                    "Roteiro do encontro, 2 atividades e lembrancinhas",
                    "Orientações pra líderes + bônus de versículos ilustrados",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-emo-repulsa" />
                      <span className="text-sm text-cacau/85">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm text-cacau/55">
                    De <s className="font-semibold">R$ 97,00</s> por
                  </p>
                  <span className="rounded-full bg-emo-alegria/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-cacau">
                    40% off
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="whitespace-nowrap font-display text-5xl font-semibold text-coral-deep">R$ 57,90</p>
                  <p className="pb-2 text-sm text-cacau/60">
                    pagamento único
                  </p>
                </div>
                <p className="mt-1 text-sm text-cacau/70">Sem mensalidade. Compra uma vez, usa quantas vezes quiser.</p>

                <BotaoComprar className="mt-6 w-full sm:w-auto" />

                <div className="mt-8 flex items-center gap-4 rounded-2xl bg-sand-light p-4">
                  <Image
                    src="/emocoes/garantia.png"
                    alt="Selo: 7 dias de garantia ou seu dinheiro de volta"
                    width={454}
                    height={390}
                    className="w-20 shrink-0"
                  />
                  <p className="text-sm leading-relaxed text-cacau/75">
                    <strong className="text-cacau">Garantia de 7 dias.</strong> Se o material não for o que você
                    esperava, devolvemos 100% do valor. Sem burocracia.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 9. Versículo */}
        <section className="px-4 pb-20 md:px-8 md:pb-28">
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Image
              src="/marca/versiculo-proverbios-22-6.png"
              alt="Ensina a criança no caminho em que deve andar, e, ainda quando for velho, não se desviará dele. Provérbios 22:6"
              width={684}
              height={205}
              className="w-full max-w-xl"
            />
          </Reveal>
        </section>

        {/* 10. Como você recebe */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="max-w-xl">
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Como você recebe o material.
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {ENTREGA.map(({ icon: Icon, titulo, texto }, i) => (
                <Reveal key={titulo} delay={i * 0.05}>
                  <li className="flex h-full items-start gap-4 rounded-2xl bg-white p-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emo-tristeza/15 text-emo-tristeza">
                      <Icon size={20} weight="fill" />
                    </span>
                    <span>
                      <span className="block font-bold text-cacau">{titulo}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-cacau/70">{texto}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* 11. FAQ */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
                Perguntas frequentes
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <div>
                {FAQ.map((item) => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* 12. CTA final */}
        <section className="emo-dots relative overflow-hidden px-4 py-20 text-center md:px-8 md:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,222,87,0.40),transparent_70%)]"
          />
          <Reveal className="relative mx-auto max-w-2xl">
            <Image
              src="/emocoes/emo/alegria.png"
              alt=""
              width={560}
              height={464}
              className="emo-float mx-auto w-40"
              style={{ "--dur": "5s" }}
            />
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-cacau md:text-4xl">
              A próxima aula sobre emoções pode ser neste domingo.
            </h2>
            <p className="mt-3 text-base text-cacau/70 md:text-lg">
              Compra agora, baixa em minutos e imprime hoje.
            </p>
            <BotaoComprar className="mt-8" />
            <p className="mt-3 text-xs font-semibold text-cacau/55">
              R$ 57,90 · garantia de 7 dias · pagamento seguro pela Kiwify
            </p>
          </Reveal>
        </section>
      </main>
      <Footer showNav={false} />
    </>
  );
}
