import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PlaceholderImage from "@/components/PlaceholderImage";
import TestimonialCard from "@/components/TestimonialCard";
import FaqItem from "@/components/FaqItem";
import {
  BookOpen,
  PaintBrush,
  Scissors,
  BookmarkSimple,
  Target,
  CheckCircle,
  XCircle,
  ShieldCheck,
  PlayCircle,
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Plano Anual Biblinho | Criatividades Bíblicas",
  description:
    "O ano inteiro de aula bíblica pronto, imprimível e coladinho no evangelho. Baby, Kids e Júnior. R$ 497 ou 12x de R$ 51,40.",
};

const KIWIFY_URL = "https://pay.kiwify.com.br/i2dvHIf";

const PARA_VOCE = [
  "Você dá aula na EBD, ministério infantil ou berçário, sozinha ou em equipe",
  "Você abre o Pinterest procurando aula bíblica e sai frustrada",
  "Você quer conteúdo bíblico de verdade, não só atividade colorida",
  "Você tem 3 faixas etárias na mesma manhã e precisa de material que converse entre si",
  "Você imprime seu próprio material, sem depender de produto físico pelo Correio",
];

const NAO_PARA_VOCE = [
  "Você quer material impresso entregue pronto na porta",
  "Você quer conteúdo neutro, sem Jesus no centro",
  "Você prefere improvisar semana a semana",
];

const INCLUI = [
  { icon: BookOpen, text: "Apostila do professor com roteiro completo por faixa etária" },
  { icon: PaintBrush, text: "Recurso visual da história, pronto para imprimir e mostrar em sala" },
  { icon: Scissors, text: "Lembrança recortável para Baby, Kids e Júnior" },
  { icon: BookmarkSimple, text: "Versículo de memorização em cartão imprimível" },
  { icon: Target, text: "Dinâmicas e aplicação divididas por idade" },
];

const PASSOS = [
  { numero: "1", titulo: "Você assina.", texto: "Pagamento à vista ou em 12x. Acesso liberado na hora." },
  {
    numero: "2",
    titulo: "Todo mês, um novo material aparece no seu portal.",
    texto: "Você recebe um aviso por e-mail e baixa o PDF pra imprimir.",
  },
  {
    numero: "3",
    titulo: "Você abre a apostila e dá a aula.",
    texto: "Roteiro, dinâmica, recurso visual e lembrança prontos.",
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

const FAQ = [
  {
    q: "Recebo o material impresso?",
    a: "Não. Todo material é 100% digital em PDF. Você imprime em casa, na igreja ou numa papelaria. Assim mantemos o preço acessível e você imprime só o que vai usar.",
  },
  {
    q: "Preciso ter impressora colorida?",
    a: "Não é obrigatório. O material foi pensado para funcionar bem também impresso em preto e branco.",
  },
  {
    q: "Se eu assinar hoje, tenho acesso aos meses anteriores?",
    a: "Sim. Ao assinar, você recebe imediatamente todos os meses já publicados no ano.",
  },
  {
    q: "Posso usar em mais de uma igreja ou sala?",
    a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar o PDF em grupos.",
  },
  {
    q: "Meu login vale por quanto tempo?",
    a: "Enquanto sua assinatura estiver ativa, já que o plano é anual. Você pode renovar no fim do ano.",
  },
  {
    q: "Tem suporte se eu tiver dúvida?",
    a: "Sim, você tem suporte por e-mail e um portal com toda a orientação de uso do material.",
  },
  {
    q: "E se eu comprar e não gostar?",
    a: "Você tem 7 dias de garantia total. É só me mandar um e-mail e devolvo 100% do valor.",
  },
  {
    q: "Serve para crianças com necessidades especiais?",
    a: "As atividades foram pensadas para inclusão, e muitas professoras adaptam facilmente para seus contextos.",
  },
  {
    q: "Como funciona para igrejas com equipe grande de professoras?",
    a: "Um login serve para toda a equipe do mesmo ministério. Se sua igreja tem várias equipes independentes, me chame por e-mail para uma condição especial.",
  },
  {
    q: "Onde faço login depois de comprar?",
    a: "Você recebe o acesso por e-mail assim que a compra é aprovada, com login direto na plataforma Kiwify.",
  },
];

export default function PlanoAnualPage() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. Hero */}
        <section className="pt-16 md:pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 md:grid-cols-[1.15fr_1fr] md:px-8 md:pb-24">
            <Reveal>
              <span className="inline-block rounded-full bg-mustard/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cacau/70">
                Plano Anual Biblinho
              </span>
              <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.15] text-cacau md:text-4xl">
                O ano inteiro de aula bíblica, coladinho no evangelho.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cacau/75 md:text-lg">
                Todo mês, uma história bíblica com estudos, dinâmicas e lembranças para Baby, Kids e Júnior. Baixa, imprime, aplica.
              </p>
              <a
                href={KIWIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-coral-deep px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Quero meu ano pronto
              </a>
              <p className="mt-3 text-xs font-semibold text-cacau/50">
                R$ 497 à vista ou 12x de R$ 51,40 · garantia de 7 dias · acesso imediato
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[2rem] bg-sand-light p-8 shadow-[0_24px_60px_-20px_rgba(46,31,23,0.25)]">
                <Image
                  src="/produtos/plano-anual-hero.png"
                  alt="Plano Anual Biblinho: Baby até 3 anos, Kids 4-6 anos, Júnior 7-9 anos"
                  width={800}
                  height={280}
                  priority
                  className="w-full object-contain"
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

        {/* 3. É pra você se */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <h2 className="text-center font-display text-2xl font-semibold text-cacau md:text-3xl">
                Este plano é pra você se...
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <Reveal delay={0.05}>
                <ul className="flex flex-col gap-4">
                  {PARA_VOCE.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle size={22} weight="light" className="mt-0.5 shrink-0 text-olive" />
                      <span className="text-sm leading-relaxed text-cacau/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="flex flex-col gap-4">
                  {NAO_PARA_VOCE.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle size={22} weight="light" className="mt-0.5 shrink-0 text-cacau/40" />
                      <span className="text-sm leading-relaxed text-cacau/60">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 4. O que você leva */}
        <section id="o-que-voce-leva" className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Um ano inteiro de aula bíblica dentro do seu portal.
              </h2>
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
          </div>
        </section>

        {/* 5. Como funciona */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Como funciona, em 3 passos.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {PASSOS.map((passo, i) => (
                <Reveal key={passo.numero} delay={i * 0.08}>
                  <span className="font-display text-4xl font-semibold text-mustard">{passo.numero}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-cacau">{passo.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cacau/70">{passo.texto}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Tour do portal */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
                Veja por dentro do seu portal.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-cacau/70">
                Um tour rápido pra você ver onde entra, onde baixa, e como o material chega até você.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-cacau/60">
                <PlayCircle size={20} weight="light" />
                Vídeo de 60 segundos
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <PlaceholderImage
                label="Print de tela: portal com o menu dos 12 meses"
                aspect="aspect-video"
                className="w-full"
              />
            </Reveal>
          </div>
        </section>

        {/* 8. Prova social */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="inline-block rounded-full bg-mustard/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cacau/70">
                Quem já usa
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-cacau md:text-4xl">
                Professoras que já usam o Biblinho.
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

        {/* 9. Oferta + garantia */}
        <section id="oferta" className="px-4 py-20 md:px-8 md:py-28">
          <Reveal className="mx-auto max-w-2xl rounded-3xl border-2 border-coral/30 bg-sand-light p-8 text-center md:p-12">
            <h2 className="font-display text-2xl font-semibold text-cacau md:text-3xl">
              Plano Anual Biblinho
            </h2>

            <ul className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5 text-left">
              {[
                "12 novas histórias bíblicas ao longo do ano",
                "Material para 3 faixas etárias: Baby, Kids e Júnior",
                "Acesso imediato ao portal",
                "Suporte por e-mail",
                "Novo material todo mês, direto no seu login",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle size={18} weight="light" className="mt-0.5 shrink-0 text-olive" />
                  <span className="text-sm text-cacau/80">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-lg text-cacau/50 line-through">De R$ 1.149,80</p>
            <p className="font-display text-4xl font-semibold text-coral-deep md:text-5xl">
              R$ 497 à vista
            </p>
            <p className="mt-1 text-sm text-cacau/70">ou 12x de R$ 51,40 no cartão</p>

            <a
              href={KIWIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block w-full rounded-full bg-coral-deep px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
            >
              Quero meu ano pronto
            </a>

            <div className="mx-auto mt-8 flex max-w-sm items-start gap-3 rounded-2xl bg-white p-4 text-left">
              <ShieldCheck size={26} weight="light" className="mt-0.5 shrink-0 text-olive" />
              <p className="text-sm leading-relaxed text-cacau/75">
                <strong className="text-cacau">Garantia de 7 dias.</strong> Se em 7 dias você não sentir que vale cada centavo, devolvemos 100% do valor. Sem burocracia.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 10. FAQ */}
        <section className="bg-sand-light px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-cacau md:text-4xl">
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

        {/* 11. CTA final */}
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
            <a
              href={KIWIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-coral-deep px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(214,67,46,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Quero meu ano pronto
            </a>
            <p className="mt-3 text-xs font-semibold text-cacau/50">
              Pagamento seguro pela Kiwify · 7 dias de garantia
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
