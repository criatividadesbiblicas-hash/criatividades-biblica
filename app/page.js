import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PlaceholderImage from "@/components/PlaceholderImage";
import TestimonialCard from "@/components/TestimonialCard";
import {
  BookOpen,
  PaintBrush,
  Scissors,
  BookmarkSimple,
  Target,
  ShieldCheck,
  PlayCircle,
  ArrowRight,
  Gift,
} from "@phosphor-icons/react/dist/ssr";

const INCLUI = [
  { icon: BookOpen, text: "Apostila do professor com roteiro completo por faixa etária" },
  { icon: PaintBrush, text: "Recurso visual da história, pronto para imprimir e mostrar em sala" },
  { icon: Scissors, text: "Lembrança recortável para Baby, Kids e Júnior" },
  { icon: BookmarkSimple, text: "Versículo de memorização em cartão imprimível" },
  { icon: Target, text: "Dinâmicas e aplicação divididas por idade" },
];

const PASSOS = [
  {
    numero: "1",
    titulo: "Você assina.",
    texto: "Pagamento à vista ou em 12x. Acesso liberado na hora, sem esperar.",
  },
  {
    numero: "2",
    titulo: "Todo mês, um novo material aparece no seu portal.",
    texto: "Você recebe um aviso por e-mail. Baixa em PDF e imprime em casa ou na papelaria.",
  },
  {
    numero: "3",
    titulo: "Você abre a apostila e dá a aula.",
    texto: "Roteiro, dinâmica, recurso visual e lembrança prontos. Preparação de horas virou minutos.",
  },
];

const DEPOIMENTOS = [
  {
    name: "Lorena Xavier",
    role: "Professora Kids Ministry",
    quote: "Trabalho excelente, material super apresentável e acessível.",
    photo: "/depoimentos/lorena-xavier.jpg",
  },
  {
    name: "Claudia Alves",
    role: "Professora Kids Ministry",
    quote: "Conteúdo de fácil compreensão, muito criativo.",
    photo: "/depoimentos/claudia-alves.jpg",
  },
  {
    name: "Kessia Alves",
    role: "Professora EBD",
    quote: "Aborda de forma lúdica e didática, as crianças amam.",
    photo: "/depoimentos/kessia-alves.jpg",
  },
  {
    name: "Maria Alcantara",
    role: "Professora Berçário",
    quote: "Sou apaixonada por ele. Tem uma linguagem fácil de entender.",
    photo: "/depoimentos/maria-alcantara.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden pt-16 md:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 md:grid-cols-[1.15fr_1fr] md:px-8 md:pb-28">
            <Reveal>
              <span className="inline-block rounded-full bg-mustard/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cacau/70">
                Plano Anual Biblinho
              </span>
              <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.15] text-cacau md:text-4xl">
                O ano inteiro de aula bíblica, pronto e imprimível.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cacau/75 md:text-lg">
                Todo mês, uma nova história bíblica com estudos e lembranças para Baby, Kids e Júnior. Pronto pra imprimir e usar.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/plano-anual#oferta"
                  className="rounded-full bg-coral-deep px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Quero meu ano pronto
                </Link>
                <Link
                  href="#o-que-voce-leva"
                  className="flex items-center gap-1.5 text-base font-bold text-cacau/70 transition-colors hover:text-coral-deep"
                >
                  Ver o que vem no plano
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[2rem] bg-sand-light p-10 shadow-[0_24px_60px_-20px_rgba(46,31,23,0.25)]">
                <Image
                  src="/produtos/estudos-unicos.png"
                  alt="Biblinho: estudos únicos para todas as idades"
                  width={800}
                  height={600}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. Faixa de credibilidade */}
        <section className="border-y border-sand/40 bg-sand-light">
          <Reveal>
            <p className="mx-auto max-w-3xl px-4 py-8 text-center text-xs font-bold uppercase tracking-wide text-cacau/70 sm:text-sm md:px-8">
              +1.000 professoras já compraram os materiais &middot; 2 anos ensinando a geração que vem aí
            </p>
          </Reveal>
        </section>

        {/* 3. A dor / momento de virada */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-semibold leading-snug text-cacau md:text-3xl">
              Chega de virar sábado à noite procurando aula bíblica no Pinterest.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cacau/70">
              Você merece chegar no domingo com a aula pronta, não montada às pressas. O Biblinho existe pra isso.
            </p>
          </Reveal>
        </section>

        {/* Lead magnet: Aula da Criação grátis */}
        <section className="px-4 pb-20 md:px-8 md:pb-28">
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-mustard/50 bg-sand-light p-8 text-center md:flex-row md:gap-8 md:p-10 md:text-left">
            <Gift size={40} weight="light" className="shrink-0 text-mustard" />
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-cacau md:text-2xl">
                Ainda não conhece o Biblinho? Comece de graça.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-cacau/70">
                A Aula da Criação é uma história completa, no mesmo formato do Plano Anual: apostila, recurso visual e lembrança. Sem custo.
              </p>
            </div>
            <a
              href="mailto:criatividadesbiblicas@gmail.com?subject=Quero%20a%20Aula%20da%20Cria%C3%A7%C3%A3o%20gr%C3%A1tis&body=Oi!%20Vim%20pelo%20site%20e%20quero%20receber%20a%20aula%20b%C3%ADblica%20gratuita%20da%20Cria%C3%A7%C3%A3o."
              className="shrink-0 rounded-full border-2 border-cacau/20 bg-white px-6 py-3 text-sm font-bold text-cacau transition-colors hover:border-mustard hover:text-mustard"
            >
              Quero a aula grátis
            </a>
          </Reveal>
        </section>

        {/* 4. O que você leva */}
        <section id="o-que-voce-leva" className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Um ano inteiro de aula bíblica dentro do seu portal.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-cacau/70">
                Todo mês, uma nova história bíblica completa para as três faixas etárias que você atende.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {INCLUI.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon size={22} weight="light" className="mt-0.5 shrink-0 text-coral-deep" />
                    <span className="text-sm leading-relaxed text-cacau/80">{text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-14 grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-sand-light p-6">
                    <Image
                      src="/produtos/biblinho-baby.png"
                      alt="Biblinho Baby"
                      width={500}
                      height={500}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-center text-sm font-bold text-cacau/75">Baby · até 3 anos</p>
                </div>
                <div className="flex flex-col gap-3">
                  <PlaceholderImage label="Foto: pilha de material Kids (4-6 anos)" aspect="aspect-square" />
                  <p className="text-center text-sm font-bold text-cacau/75">Kids · 4-6 anos</p>
                </div>
                <div className="flex flex-col gap-3">
                  <PlaceholderImage label="Foto: pilha de material Júnior (7-9 anos)" aspect="aspect-square" />
                  <p className="text-center text-sm font-bold text-cacau/75">Júnior · 7-9 anos</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 5. Como funciona */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Como funciona, em 3 passos.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {PASSOS.map((passo, i) => (
                <Reveal key={passo.numero} delay={i * 0.08}>
                  <span className="font-display text-4xl font-semibold text-mustard">
                    {passo.numero}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-cacau">
                    {passo.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cacau/70">{passo.texto}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Tour do portal */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <PlaceholderImage
                label="Print de tela: portal com o menu dos 12 meses (ou vídeo de 60s do tour)"
                aspect="aspect-video"
                className="w-full"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Veja por dentro do seu portal.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-cacau/70">
                Um tour rápido pra você ver exatamente onde vai entrar, onde vai baixar, e como o material chega até você.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-cacau/60">
                <PlayCircle size={20} weight="light" />
                Vídeo de 60 segundos
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Quem sou eu */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,320px)_1fr]">
            <Reveal>
              <PlaceholderImage label="Foto sua, sorrindo, luz natural" aspect="aspect-[4/5]" className="w-full" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Oi, eu sou a criadora do Biblinho.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-cacau/75">
                Sou professora e fundei o Criatividades Bíblicas porque cansei de ver professoras dedicadas passando o sábado inteiro tentando montar uma boa aula bíblica.
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-cacau/75">
                O Biblinho nasceu da minha própria sala de aula. Tudo o que está no plano foi testado com crianças de verdade antes de virar apostila.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 8. Prova social */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Professoras que já usam o Biblinho.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DEPOIMENTOS.map((d, i) => (
                <Reveal key={d.name} delay={i * 0.06}>
                  <TestimonialCard {...d} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Oferta resumida */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-3xl rounded-3xl border border-sand/50 bg-sand-light p-8 text-center md:p-12">
            <h2 className="font-display text-2xl font-semibold text-cacau md:text-3xl">
              Plano Anual Biblinho
            </h2>
            <p className="mt-3 text-lg text-cacau/60 line-through">De R$ 1.149,80</p>
            <p className="mt-1 font-display text-4xl font-semibold text-coral-deep md:text-5xl">
              R$ 497 à vista
            </p>
            <p className="mt-1 text-sm text-cacau/70">ou 12x de R$ 51,40 no cartão</p>

            <Link
              href="/plano-anual#oferta"
              className="mt-8 inline-block rounded-full bg-coral-deep px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Quero meu ano pronto
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-olive">
              <ShieldCheck size={20} weight="light" />
              Garantia de 7 dias
            </div>
          </Reveal>
        </section>

        {/* 11. Escada de resgate */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-cacau md:text-3xl">
                Ainda não é hora de assinar o ano inteiro?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-cacau/70">
                Comece por uma história avulsa, ou conheça os materiais especiais para Baby e Emoções.
              </p>
              <Link
                href="/materiais"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border-2 border-cacau/20 px-6 py-3 text-sm font-bold text-cacau transition-colors hover:border-coral-deep hover:text-coral-deep"
              >
                Ver outros materiais
                <ArrowRight size={16} weight="bold" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* 12. CTA final */}
        <section className="px-4 py-20 text-center md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-2xl">
            <Image
              src="/marca/biblinho-mascote-grande.png"
              alt=""
              width={261}
              height={261}
              className="mx-auto h-16 w-16"
            />
            <h2 className="mt-4 font-display text-3xl font-semibold text-cacau md:text-4xl">
              Sua próxima aula pode ser hoje.
            </h2>
            <p className="mt-3 text-base text-cacau/70">
              Assine agora e em minutos você já baixou o material do mês.
            </p>
            <Link
              href="/plano-anual#oferta"
              className="mt-8 inline-block rounded-full bg-coral-deep px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Quero meu ano pronto
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
