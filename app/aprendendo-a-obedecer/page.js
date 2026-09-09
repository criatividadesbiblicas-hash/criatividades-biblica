/*
  CONTRATO DE DIREÇÃO (impeccable) — Pack Arca de Noé
  THESIS: a professora entra numa cena de domingo e sai com a aula resolvida; a página é uma
  história (dor → virada → solução → prova → bônus → preço), e recusa o hero-de-oferta com preço,
  selo de desconto e bônus gritando no topo.
  OWN-WORLD: a capa do material como mundo. Céu claro e mar fundo em campos inteiros (drenched
  no hero e na virada), sol amarelo nos botões e nos destaques (frase-virada, números das
  escotilhas, ênfases do bônus), coral pra pontos de atenção, madeira nas escotilhas. Baloo 2 ExtraBold nos títulos, Quicksand no texto, cantos muito redondos,
  ondas SVG autorais como divisórias, páginas reais em leque. Fundo branco, nunca creme.
  STORY: "eu conheço esse domingo" → "obediência se ensina com história" → "essa aula já vem
  pronta, e é real" → "outras professoras usam" → "e ainda ganho o Baby e acesso vitalício" →
  "R$ 67 até quarta" → compra.
  FIRST VIEWPORT: título em três linhas à esquerda (Baloo), parágrafo curto, um botão amarelo
  "Quero ver como funciona"; à direita as capas Kids e Júnior boiando sobre uma onda animada
  que fecha o hero. Sem preço, sem bônus, sem contador.
  FORM: mundo PINADO pela cliente em 2026-09-08 ("fontes redondas no estilo da capa", storytelling
  dor > solução > bônus > preço); por regra da skill o pino vence o sorteio, que não foi rodado. Sinal autoral: a onda do mar em movimento e as escotilhas.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
  verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/
import Image from "next/image";
import { Baloo_2, Quicksand } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqItem from "@/components/FaqItem";
import Leque from "@/components/arca/Leque";
import Tracking from "@/components/arca/Tracking";
import { ContadorBlocos, BarraContador } from "@/components/arca/Contador";
import { promoAtiva } from "@/components/arca/promo";
import { CheckCircle, ShieldCheck, ArrowDown, Gift, Infinity as InfinityIcon } from "@phosphor-icons/react/dist/ssr";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-baloo", display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-quicksand", display: "swap" });

// URL pública desta página (subdomínio próprio dos Packs; o metadataBase do layout é o da /emocoes)
const HOST = "https://materiais.criatividadesbiblicas.com.br";
const PAGE_URL = `${HOST}/aprendendo-a-obedecer`;
const TITLE = "Pack Arca de Noé: Aprendendo a Obedecer | Criatividades Bíblicas";
const DESCRIPTION =
  "4 aulas completas sobre a Arca de Noé pra ensinar obediência às crianças de 4 a 10 anos: apostila com a fala da professora, atividades, quadro de história, versículo e lembrancinha. Kids e Júnior no mesmo Pack.";

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
    images: [{ url: `${HOST}/arca-de-noe/capa-kids.webp`, width: 1000, height: 1415, alt: "Pack Arca de Noé: Aprendendo a Obedecer" }],
  },
  robots: { index: false, follow: false }, // TODO: liberar (index: true) no dia da abertura
};

// TODO: trocar pelo link real do checkout do Pack na Kiwify (preço promocional R$ 67)
const KIWIFY_URL = "https://pay.kiwify.com.br/ARCA-DE-NOE";

// A página é re-renderizada no servidor a cada 10 min: depois de FIM_PROMO o preço, os bônus
// e os botões trocam sozinhos pra versão sem promoção (o contador faz o mesmo no cliente).
export const revalidate = 600;

const AULAS = [
  {
    n: 1,
    titulo: "Noé, o obediente",
    texto: "Todo mundo desobedecia. Noé ouviu e construiu um barco no seco, sem nunca ter visto chuva.",
    licao: "Obedecer é um jeito de amar a Deus.",
    verso: "Noé fez tudo exatamente como Deus lhe havia ordenado.",
    ref: "Gênesis 6:22",
    img: "/arca-de-noe/quadro-noe.webp",
  },
  {
    n: 2,
    titulo: "A obediência me protege",
    texto: "Quem entrou na arca ficou seguro. Ouvir Deus, os pais e a professora é lugar de cuidado.",
    licao: "Obedecer protege.",
    verso: "E o Senhor fechou a porta.",
    ref: "Gênesis 7:16",
    img: "/arca-de-noe/quadro-40dias.webp",
  },
  {
    n: 3,
    titulo: "Esperando com paciência",
    texto: "A chuva parou, a terra apareceu, e Noé ainda esperou a ordem de Deus pra abrir a porta.",
    licao: "Obedecer também é saber esperar.",
    verso: "Noé esperou mais sete dias.",
    ref: "Gênesis 8:10",
    img: "/arca-de-noe/quadro-pomba.webp",
  },
  {
    n: 4,
    titulo: "Precisamos ouvir e obedecer",
    texto: "O arco-íris é a promessa de um Deus que cumpre o que fala. Ouvir e fazer, junto.",
    licao: "Deus cumpre o que promete.",
    verso: "Se vocês me amam, obedecerão aos meus mandamentos.",
    ref: "João 14:15",
    img: "/arca-de-noe/quadro-arcoiris.webp",
  },
];

const PECAS = [
  {
    titulo: "Apostila da professora",
    texto: "Os 4 estudos com a fala escrita em linguagem de criança: roda de conversa, curiosidade bíblica, hora da história, aplicação, brincadeira e oração. 28 páginas no Kids, 31 no Júnior.",
    imagens: ["/arca-de-noe/apostila-1.webp", "/arca-de-noe/apostila-2.webp", "/arca-de-noe/apostila-3.webp", "/arca-de-noe/apostila-4.webp", "/arca-de-noe/apostila-5.webp"],
    grande: true,
  },
  {
    titulo: "Quadro de história",
    texto: "13 lâminas grandes pra contar mostrando: Noé, os filhos, os animais, os 40 dias, a pomba e o arco-íris.",
    imagens: ["/arca-de-noe/quadro-filhos.webp", "/arca-de-noe/quadro-noe.webp", "/arca-de-noe/quadro-capa.webp", "/arca-de-noe/quadro-animais.webp", "/arca-de-noe/quadro-arcoiris.webp"],
  },
  {
    titulo: "Atividades das crianças",
    texto: "Uma folha por estudo, em cada faixa. Pintar, carimbar com cotonete, colar algodão, montar o arco-íris.",
    imagens: ["/arca-de-noe/ativ-kids-1.webp", "/arca-de-noe/ativ-kids-2.webp", "/arca-de-noe/ativ-junior-2.webp", "/arca-de-noe/ativ-kids-3.webp", "/arca-de-noe/ativ-junior-4.webp"],
  },
  {
    titulo: "Versículo pra parede",
    texto: "João 14:15 em cartaz no Kids. No Júnior, um versículo por estudo, quatro no total.",
    imagens: ["/arca-de-noe/versiculo-junior-1.webp", "/arca-de-noe/versiculo-kids.webp", "/arca-de-noe/versiculo-junior-2.webp"],
    paisagem: true,
  },
  {
    titulo: "Lembrancinha de pulso",
    texto: "Relógio da Arca em papel 180g. A criança sai da aula com a história no braço e conta em casa.",
    imagens: ["/arca-de-noe/lembranca.webp"],
    paisagem: true,
  },
  {
    titulo: "Carta pra família",
    texto: "Uma página explicando o que a criança aprendeu na série e como continuar em casa. A aula não termina no domingo.",
    imagens: ["/arca-de-noe/querida-familia.webp"],
    largo: true,
  },
];

const ANOTACOES = [
  { lado: "esq", titulo: "A rotina da aula", texto: "Acolhimento, louvor, Bíblia, fixação e comunhão. Você sabe o que vem depois." },
  { lado: "dir", titulo: "O objetivo em uma frase", texto: "O que a criança precisa sair sabendo." },
  { lado: "esq", titulo: "A roda de conversa escrita", texto: "Em linguagem de criança. Você lê, adapta e conduz." },
  { lado: "dir", titulo: "As instruções em vermelho", texto: "Quando cantar, quando ler o balão, quando mostrar a figura." },
  { lado: "esq", titulo: "O versículo do mês", texto: "Entra aqui, com a explicação certa pra idade." },
];

const DEPOIMENTOS = [
  { name: "Lorena Xavier", role: "Professora no Ministério Kids", quote: "Trabalho excelente, material super apresentável e acessível para as crianças. Amei todo o suporte dado e atenção.", photo: "/depoimentos/lorena-xavier.jpg" },
  { name: "Claudia Alves", role: "Professora no Ministério Kids", quote: "Ótimo material. Conteúdo de fácil compreensão, muito criativo e com um visual de alta qualidade.", photo: "/depoimentos/claudia-alves.jpg" },
  { name: "Kessia Alves", role: "Professora EBD", quote: "Aborda de forma lúdica e didática os princípios da fé cristã, respeitando as necessidades de faixa etária, sempre com muita cor.", photo: "/depoimentos/kessia-alves.jpg" },
  { name: "Maria Alcantara", role: "Professora do Berçário", quote: "Consigo chamar e prender a atenção das crianças, mesmo tão pequenas. É um material simples, prático e objetivo.", photo: "/depoimentos/maria-alcantara.jpg" },
];

const montarFaq = () => [
  { q: "O que exatamente vem no Pack?", a: "O material completo de Kids (4 a 6 anos) e Júnior (7 a 10 anos) da história da Arca de Noé: apostila da professora com 4 estudos, atividades, quadro de história, versículos, lembrancinha e carta pra família." + (promoAtiva() ? " Comprando nesta semana, o Pack Baby (1 a 3 anos) vem junto e o acesso é vitalício." : "") },
  { q: "Serve pra quantas aulas?", a: "São 4 estudos por faixa. Um estudo por domingo dá um mês de aula. Se sua igreja tem Kids e Júnior separados, são 8 encontros prontos." },
  ...(promoAtiva() ? [{ q: "O bônus Baby é o material completo?", a: "Sim. Apostila, atividades, balão de história, lembrancinha e carta pra família, tudo adaptado pra 1 a 3 anos. É o mesmo material que vai no Plano Anual." }] : []),
  { q: "Onde eu recebo o material?", a: "Na sua área de acesso da Kiwify. Assim que o pagamento é aprovado, você recebe um e-mail com o link. Os arquivos ficam lá, pra baixar quantas vezes precisar." },
  { q: "Vou receber impresso?", a: "Não. O material é 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar." },
  { q: "Que papel eu uso pra imprimir?", a: "Quadro de história, versículo e lembrancinha ficam melhores em papel 180g. Atividades e apostila vão bem em sulfite comum." },
  { q: "Posso usar com toda a equipe da minha igreja?", a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos." },
  { q: "E se eu já tenho o Plano Anual?", a: "A Arca de Noé faz parte do Plano Anual 2026. Se você já é assinante, confira sua área antes de comprar. Este Pack é pra quem quer só essa história." },
  { q: "Tem garantia?", a: "Tem. 7 dias depois da compra pra pedir reembolso total, sem burocracia. É só mandar um e-mail." },
];

const montarJsonLd = (faq) => ({

  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Pack Arca de Noé: Aprendendo a Obedecer",
      description: DESCRIPTION,
      image: `${HOST}/arca-de-noe/capa-kids.webp`,
      brand: { "@type": "Brand", name: "Criatividades Bíblicas" },
      offers: { "@type": "Offer", price: promoAtiva() ? "67.00" : "97.00", priceCurrency: "BRL", priceValidUntil: promoAtiva() ? "2026-09-16" : undefined, availability: "https://schema.org/InStock", url: PAGE_URL },
    },
    { "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
});

/* ---------- peças visuais autorais ---------- */

// Onda que fecha uma seção. `cor` é a cor da seção de baixo (a onda "sobe" por cima da de cima).
function Onda({ cor = "#ffffff", virada = false, className = "" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none relative h-[52px] w-full overflow-hidden md:h-[84px] ${className}`}>
      <svg
        className={`absolute bottom-0 left-0 h-full w-[200%] ${virada ? "" : "arca-onda"}`}
        viewBox="0 0 2880 100"
        preserveAspectRatio="none"
        fill={cor}
      >
        <path d="M0,60 C180,20 360,20 540,55 C720,90 900,90 1080,55 C1260,20 1440,20 1620,55 C1800,90 1980,90 2160,55 C2340,20 2520,20 2700,55 C2760,66 2820,72 2880,60 L2880,100 L0,100 Z" />
      </svg>
    </div>
  );
}

// Escotilha da arca: a lâmina do quadro de história vista pela janela redonda, com aro de madeira.
function Escotilha({ src, alt, n }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[15rem] [container-type:inline-size]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#d9a15f,#b8783a_55%,#8a5527)] shadow-[0_18px_34px_-14px_rgba(23,50,77,0.55)]" />
      <div className="absolute inset-[9%] overflow-hidden rounded-full ring-4 ring-arca-areia/70">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 22vw, 60vw" className="object-cover object-top" />
      </div>
      {[0, 90, 180, 270].map((g) => (
        <span
          key={g}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-arca-areia shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
          style={{ transform: `translate(-50%,-50%) rotate(${g + 45}deg) translateY(-47.5cqw)` }}
        />
      ))}
      <span className="absolute -left-1 -top-1 flex h-11 w-11 items-center justify-center rounded-full bg-arca-sol font-display text-xl font-extrabold text-arca-tinta shadow-[0_6px_14px_-4px_rgba(23,50,77,0.45)]">
        {n}
      </span>
    </div>
  );
}

function Botao({ href = KIWIFY_URL, children, className = "", externo = true, tom = "sol" }) {
  const cores =
    tom === "sol"
      ? "bg-arca-sol text-arca-tinta shadow-[0_12px_28px_-10px_rgba(233,164,0,0.75)] hover:bg-[#ffd15a]"
      : "bg-arca-coral text-white shadow-[0_12px_28px_-10px_rgba(234,77,61,0.7)] hover:bg-[#f05a4a]";
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-lg font-extrabold leading-none transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] ${cores} ${className}`}
    >
      {children}
    </a>
  );
}

function H2({ children, className = "", claro = false }) {
  return (
    <h2 className={`text-balance font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.01em] md:text-[2.75rem] ${claro ? "text-white" : "text-arca-tinta"} ${className}`}>
      {children}
    </h2>
  );
}

export default function ArcaDeNoePage() {
  const promo = promoAtiva();
  const FAQ = montarFaq();
  const JSON_LD = montarJsonLd(FAQ);
  return (
    <div className={`arca ${baloo.variable} ${quicksand.variable}`}>
      <Nav cta={{ label: "Quero o Pack", href: "#oferta" }} links={[]} logoHref="/aprendendo-a-obedecer" />
      <Tracking />
      <BarraContador href={KIWIFY_URL} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <main>
        {/* 1. Hero: a promessa, sem preço */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_35%,#bfe4ff_100%)]">
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-6 pt-10 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-10 md:pt-16">
            <div className="relative z-10">
              <h1 className="text-balance font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.015em] text-arca-tinta md:text-[4rem]">
                Sua turma vai aprender a obedecer com a história de Noé.
              </h1>
              <p className="mt-6 max-w-[44ch] text-[17px] font-medium leading-relaxed text-arca-tinta/80 md:text-xl">
                Quatro domingos, uma história só. A fala da professora vem escrita, o quadro de história vem ilustrado,
                a atividade vem no ponto. Pra crianças de 4 a 10 anos.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Botao href="#historia" externo={false}>
                  Quero ver a história <ArrowDown size={20} weight="bold" />
                </Botao>
                <p className="text-[15px] font-semibold text-arca-tinta/75">Kids (4 a 6) e Júnior (7 a 10), no mesmo Pack.</p>
              </div>
            </div>

            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg md:max-w-none">
              <Image
                src="/arca-de-noe/capa-junior.webp"
                alt="Capa do material Júnior: Arca de Noé, Aprendendo a Obedecer"
                width={1000}
                height={1415}
                priority
                className="arca-boia absolute left-[4%] top-[8%] h-[74%] w-auto rounded-[10px] shadow-[0_28px_44px_-18px_rgba(8,63,120,0.55)]"
                style={{ "--r": "-7deg", "--dur": "7.5s", "--delay": "0.6s" }}
              />
              <Image
                src="/arca-de-noe/capa-kids.webp"
                alt="Capa do material Kids: Arca de Noé, Aprendendo a Obedecer"
                width={1000}
                height={1415}
                priority
                className="arca-boia absolute left-[34%] top-[2%] z-10 h-[86%] w-auto rounded-[10px] shadow-[0_34px_54px_-18px_rgba(8,63,120,0.6)]"
                style={{ "--r": "3deg", "--dur": "6.4s" }}
              />
            </div>
          </div>
          <Onda cor="#1c86d6" />
        </section>

        {/* 2. A dor: a cena de domingo */}
        <section id="historia" className="bg-arca-mar text-white">
          <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
            <H2 claro>Domingo, nove e meia da manhã.</H2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-white/90 md:text-xl">
              <p>
                Você preparou a aula na sexta à noite, depois do trabalho. Imprimiu, recortou, separou o giz de cera.
                Na hora da história, metade da turma está olhando pra porta. Um puxa o cabelo do outro. A que sabe o
                versículo de cor é a mesma que não obedece a mãe na saída.
              </p>
              <p>Você explica de novo, com calma. Explica pela terceira vez. E volta pra casa se perguntando se alguma coisa ficou.</p>
            </div>
            <p className="mt-10 max-w-[22ch] font-display text-[1.75rem] font-extrabold leading-[1.12] text-arca-sol md:text-[2.5rem]">
              Não é falta de esforço seu. É que obediência não se aprende com bronca.
            </p>
          </div>
          <Onda cor="#0b57a0" virada />
        </section>

        {/* 3. A virada: se aprende com história */}
        <section className="bg-arca-fundo text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-4 md:grid-cols-[1fr_0.9fr] md:px-8 md:pb-20 md:pt-8">
            <div>
              <H2 claro>Se aprende com história.</H2>
              <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-white/88 md:text-xl">
                <p>
                  E não tem história melhor que a de um homem que construiu um barco no seco, porque Deus mandou. Todo
                  mundo em volta rindo. Ele, martelando. Quando a chuva veio, a porta fechou e ele estava dentro.
                </p>
                <p>
                  A criança não esquece isso. Ela leva o Noé pra escola, pra hora de guardar o brinquedo, pra noite em que
                  a mãe diz "agora não".
                </p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm md:max-w-none">
              <Image
                src="/arca-de-noe/quadro-40dias.webp"
                alt="Lâmina do quadro de história: a arca no meio da chuva, 40 dias e 40 noites"
                width={900}
                height={1273}
                className="arca-boia relative w-full rounded-[1.5rem] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] ring-4 ring-white/15"
                style={{ "--r": "-2deg", "--dur": "8s" }}
              />
            </div>
          </div>
          <Onda cor="#ffffff" />
        </section>

        {/* 4. A solução: o Pack e as 4 aulas */}
        <section id="pack" className="bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-8 pt-8 md:px-8 md:pt-12">
            <h2 className="text-balance font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.015em] text-arca-tinta md:text-[3.5rem]">
              Foi pra esse domingo que existe o <span className="text-arca-mar">Pack Arca de Noé: Aprendendo a Obedecer.</span>
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] font-medium leading-relaxed text-arca-tinta/80 md:text-xl">
              Quatro aulas prontas, uma por domingo, pra Kids (4 a 6) e Júnior (7 a 10). Cada domingo é um marco da
              história e uma lição de obediência diferente. A criança acompanha Noé do chamado ao arco-íris.
            </p>
          </div>

          <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 md:px-8 md:pb-28">
            <ol className="grid gap-x-6 gap-y-12 min-[420px]:grid-cols-2 lg:grid-cols-4">
              {AULAS.map((a) => (
                <li key={a.n} className="flex flex-col items-center text-center">
                  <Escotilha src={a.img} alt={`Lâmina do quadro de história: ${a.titulo}`} n={a.n} />
                  <h3 className="mt-6 font-display text-[1.45rem] font-extrabold leading-tight text-arca-tinta">{a.titulo}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-arca-tinta/75">{a.texto}</p>
                  <p className="mt-3 font-display text-base font-bold text-arca-mar">{a.licao}</p>
                  <p className="mt-3 text-[14px] italic leading-relaxed text-arca-tinta/75">
                    "{a.verso}" <span className="not-italic font-bold">{a.ref}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. O que vem: páginas reais em leque */}
        <section className="bg-arca-ceu-claro">
          <Onda cor="#eef7ff" virada className="-mt-px rotate-180 bg-white" />
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-4 md:px-8 md:pb-28">
            <H2>Você abre a pasta e encontra isto.</H2>
            <p className="mt-4 max-w-[56ch] text-[17px] font-medium leading-relaxed text-arca-tinta/80 md:text-xl">
              Kids e Júnior, cada um com o material completo. As imagens abaixo são as páginas de verdade, sem mockup.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS.map((p) => (
                <article
                  key={p.titulo}
                  className={`flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,87,160,0.35)] ${p.grande ? "sm:col-span-2 lg:col-span-2 lg:flex-row" : ""} ${p.largo ? "sm:col-span-2 lg:col-span-3 sm:flex-row" : ""}`}
                >
                  <div className={`px-6 pt-6 ${p.grande ? "lg:w-[58%] lg:pb-6" : ""} ${p.largo ? "sm:w-[40%] sm:pb-6 lg:w-[34%] lg:px-10" : ""}`}>
                    <Leque imagens={p.imagens} alt={`Páginas reais: ${p.titulo}`} paisagem={p.paisagem} />
                  </div>
                  <div className={`p-6 pt-3 ${p.grande ? "lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:pt-6" : ""} ${p.largo ? "sm:flex sm:w-[60%] sm:flex-col sm:justify-center sm:pt-6 lg:w-[66%] lg:pr-16" : ""}`}>
                    <h3 className="font-display text-[1.5rem] font-extrabold leading-tight text-arca-tinta">{p.titulo}</h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-arca-tinta/75">{p.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Apostila anotada */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <H2>A fala da professora já vem escrita.</H2>
            <p className="mt-4 max-w-[56ch] text-[17px] font-medium leading-relaxed text-arca-tinta/80 md:text-xl">
              Esta é a página do Estudo 1 do Kids, sem retoque. Você lê, adapta o que quiser e conduz.
            </p>
            <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_1.15fr_1fr]">
              <ul className="hidden flex-col gap-6 md:flex md:pt-10">
                {ANOTACOES.filter((a) => a.lado === "esq").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-arca-ceu-claro p-5 after:absolute after:right-[-18px] after:top-7 after:h-0.5 after:w-[18px] after:bg-arca-mar">
                    <span className="block font-display text-lg font-extrabold leading-tight text-arca-fundo">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-arca-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <Image
                src="/arca-de-noe/anotada.webp"
                alt="Página real do Estudo 1 da apostila Kids: rotina, objetivo, roda de conversa e explorando a Bíblia"
                width={1300}
                height={1839}
                className="w-full rounded-[14px] shadow-[0_30px_60px_-26px_rgba(11,87,160,0.55)] ring-1 ring-arca-tinta/10"
              />
              <ul className="hidden flex-col gap-6 md:flex md:pt-32">
                {ANOTACOES.filter((a) => a.lado === "dir").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-arca-ceu-claro p-5 before:absolute before:left-[-18px] before:top-7 before:h-0.5 before:w-[18px] before:bg-arca-mar">
                    <span className="block font-display text-lg font-extrabold leading-tight text-arca-fundo">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-arca-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-3 md:hidden">
                {ANOTACOES.map((a, i) => (
                  <li key={a.titulo} className="flex gap-3 rounded-[1.25rem] bg-arca-ceu-claro p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arca-sol font-display text-base font-extrabold text-arca-tinta">{i + 1}</span>
                    <span>
                      <span className="block font-display text-lg font-extrabold leading-tight text-arca-fundo">{a.titulo}</span>
                      <span className="mt-1 block text-[15px] font-medium leading-relaxed text-arca-tinta/75">{a.texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Prova social */}
        <section className="bg-arca-ceu-claro">
          <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-28">
            <H2>Quem dá aula com o material.</H2>
            <p className="mt-4 max-w-[56ch] text-[17px] font-medium leading-relaxed text-arca-tinta/80 md:text-xl">
              Mais de 41 mil seguidoras acompanham a Criatividades Bíblicas no Instagram. Algumas contam como é dar aula com o material.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {DEPOIMENTOS.map((d, i) => (
                <li key={d.name} className={`relative rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(11,87,160,0.35)] ${i % 2 ? "sm:mt-8" : ""}`}>
                  <span aria-hidden="true" className="absolute -bottom-3 left-10 h-6 w-6 rotate-45 rounded-[4px] bg-white" />
                  <blockquote className="text-[16px] font-medium leading-relaxed text-arca-tinta/90">"{d.quote}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Image src={d.photo} alt={d.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover ring-2 ring-arca-sol" />
                    <span>
                      <span className="block font-display text-base font-bold text-arca-tinta">{d.name}</span>
                      <span className="block text-[13px] font-semibold text-arca-tinta/75">{d.role}</span>
                    </span>
                  </figcaption>
                </li>
              ))}
            </ul>
            {/* TODO: bloco de prints de comentários/DMs reais (Thali vai mandar 6-10 prints) */}
          </div>
        </section>

        {/* 8. Bônus: só agora */}
        {promoAtiva() ? (
        <section id="bonus" className="bg-arca-fundo text-white">
          <Onda cor="#0b57a0" virada className="-mt-px rotate-180 bg-arca-ceu-claro" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-4 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-24 md:pt-8">
            <div className="relative mx-auto w-full max-w-sm">
              <Leque imagens={["/arca-de-noe/ativ-baby-1.webp", "/arca-de-noe/capa-baby.webp", "/arca-de-noe/ativ-baby-4.webp"]} alt="Páginas reais do Pack Baby" />
            </div>
            <div>
              <H2 claro>E tem mais, só nesta semana.</H2>
              <p className="mt-5 text-[17px] font-medium leading-relaxed text-white/88 md:text-xl">
                Quem compra até quarta, 16 de setembro, leva junto o <strong className="text-arca-sol">Pack Baby</strong> (1 a
                3 anos) completo, do jeito que vai no Plano Anual: apostila, atividades, balão de história, lembrancinha e
                carta pra família. E fica com <strong className="text-arca-sol">acesso vitalício</strong> a tudo.
              </p>
              <ul className="mt-7 space-y-3 text-[16px] font-semibold">
                <li className="flex items-start gap-3">
                  <Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-arca-sol" />
                  Pack Baby completo, a mesma história pro berçário
                </li>
                <li className="flex items-start gap-3">
                  <InfinityIcon size={24} weight="bold" className="mt-0.5 shrink-0 text-arca-sol" />
                  Acesso vitalício: usa este ano, no ano que vem e com a próxima turma
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck size={24} weight="fill" className="mt-0.5 shrink-0 text-arca-sol" />
                  Sua igreja inteira, do berçário ao Júnior, na mesma história no mesmo mês
                </li>
              </ul>
              <p className="mt-6 text-[15px] font-medium text-white/85">Depois de quarta, o Baby e o acesso vitalício saem da oferta.</p>
            </div>
          </div>
          <Onda cor="#ffffff" />
        </section>
        ) : (
          <div id="bonus" aria-hidden="true" />
        )}

        {/* 9. Oferta: o preço, por fim */}
        <section id="oferta" className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <H2 className="text-center">Quanto custa.</H2>
            <div className="mt-10 overflow-hidden rounded-[2.25rem] bg-arca-ceu-claro shadow-[0_24px_60px_-30px_rgba(11,87,160,0.5)]">
              <div aria-hidden="true" className="arca-arcoiris h-2 w-full" />
              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative flex items-center justify-center p-8 md:p-10">
                  <div className="relative h-72 w-full max-w-[16rem] md:h-96 md:max-w-[20rem]">
                    <Image src="/arca-de-noe/capa-junior.webp" alt="" width={1000} height={1415} className="absolute left-0 top-4 h-[85%] w-auto -rotate-6 rounded-[8px] shadow-[0_18px_36px_-14px_rgba(8,63,120,0.5)]" />
                    <Image src="/arca-de-noe/capa-kids.webp" alt="Capa Kids" width={1000} height={1415} className="absolute left-[22%] top-0 z-10 h-[92%] w-auto rotate-2 rounded-[8px] shadow-[0_24px_40px_-14px_rgba(8,63,120,0.55)]" />
                    {promo ? (
                      <Image src="/arca-de-noe/capa-baby.webp" alt="Capa Baby, bônus" width={1000} height={1415} className="absolute bottom-0 right-0 z-20 h-[48%] w-auto rotate-6 rounded-[8px] shadow-[0_18px_36px_-14px_rgba(8,63,120,0.5)] ring-4 ring-arca-sol" />
                    ) : null}
                  </div>
                </div>
                <div className="bg-white p-8 md:p-10">
                  <h3 className="font-display text-[1.6rem] font-extrabold leading-tight text-arca-tinta">Pack Arca de Noé: Aprendendo a Obedecer</h3>
                  <ul className="mt-5 space-y-2.5 text-[15px] font-medium text-arca-tinta/85">
                    {[
                      "Material Kids (4 a 6) completo",
                      "Material Júnior (7 a 10) completo",
                      ...(promoAtiva() ? ["Bônus da semana: Pack Baby (1 a 3) completo", "Bônus da semana: acesso vitalício"] : []),
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-arca-verde" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {promoAtiva() ? (
                    <p className="mt-8 text-[15px] font-semibold text-arca-tinta/75">
                      De <s>R$ 97</s> por
                    </p>
                  ) : null}
                  <p className="mt-1 flex flex-wrap items-end gap-x-3">
                    <span className="font-display text-[3.5rem] font-extrabold leading-none text-arca-coral">{promoAtiva() ? "R$ 67" : "R$ 97"}</span>
                    <span className="pb-2 text-[15px] font-semibold text-arca-tinta/75">pagamento único, Pix, boleto ou cartão</span>
                  </p>

                  {promoAtiva() ? (
                    <>
                      <p className="mt-6 text-[14px] font-bold text-arca-tinta/75">A oferta acaba em</p>
                      <ContadorBlocos className="mt-2" />
                    </>
                  ) : null}

                  <Botao className="mt-7 w-full sm:w-auto">{promoAtiva() ? "Quero o Pack por R$ 67" : "Quero o Pack por R$ 97"}</Botao>

                  <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] bg-arca-ceu-claro p-4">
                    <Image src="/emocoes/garantia.png" alt="Selo: 7 dias de garantia ou seu dinheiro de volta" width={454} height={390} className="w-16 shrink-0" />
                    <p className="text-[14px] font-medium leading-relaxed text-arca-tinta/80">
                      <strong className="font-bold text-arca-tinta">7 dias de garantia.</strong> Se o material não for o que você esperava,
                      devolvemos o valor inteiro. Sem burocracia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-[60ch] text-center text-[16px] font-medium leading-relaxed text-arca-tinta/75">
              Como funciona: você compra pela Kiwify, o acesso chega no seu e-mail assim que o pagamento é aprovado, você
              baixa os PDFs e imprime. Comprou de manhã, dá a aula no domingo.
            </p>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="bg-arca-ceu-claro">
          <div className="mx-auto max-w-2xl px-5 py-20 md:px-8 md:py-24">
            <H2>Perguntas que sempre chegam.</H2>
            <div className="mt-8">
              {FAQ.map((item) => (
                <FaqItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* 11. Fechamento */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#eef7ff_0%,#bfe4ff_100%)] text-center">
          <div className="relative mx-auto max-w-2xl px-5 pb-12 pt-20 md:pb-16 md:pt-28">
            <Image
              src="/arca-de-noe/quadro-arcoiris.webp"
              alt=""
              width={900}
              height={1273}
              className="arca-boia mx-auto h-48 w-auto rounded-[12px] shadow-[0_18px_40px_-16px_rgba(11,87,160,0.5)]"
              style={{ "--dur": "6s", "--r": "-3deg" }}
            />
            <H2 className="mt-8">A aula de domingo pode ser sobre Noé.</H2>
            <p className="mt-3 text-[17px] font-medium text-arca-tinta/75 md:text-xl">Compra agora, baixa em minutos, imprime hoje.</p>
            <Botao className="mt-8">{promoAtiva() ? "Quero o Pack por R$ 67" : "Quero o Pack por R$ 97"}</Botao>
            <p className="mt-4 text-[14px] font-semibold text-arca-tinta/75">
              {promoAtiva() ? "Bônus Baby e acesso vitalício até quarta, 16/09 · 7 dias de garantia" : "7 dias de garantia · pagamento seguro pela Kiwify"}
            </p>
          </div>
          <Onda cor="#1c86d6" />
          <div className="h-6 bg-arca-mar" aria-hidden="true" />
        </section>
      </main>
      <Footer showNav={false} />
    </div>
  );
}
