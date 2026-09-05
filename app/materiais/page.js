import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PlaceholderImage from "@/components/PlaceholderImage";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Outros materiais | Criatividades Bíblicas",
  description: "Packs avulsos, Materiais Baby, Emoções e Planner. Conheça toda a linha Criatividades Bíblicas.",
};

const ITENS = [
  {
    nome: "Biblinho Packs",
    descricao: "Histórias avulsas, no mesmo formato do Plano Anual. Ótimo pra começar antes de assinar o ano.",
    href: "https://www.criatividadesbiblicas.com.br/biblinhopacks",
    imagem: "/produtos/pack-biblinho.png",
  },
  {
    nome: "Materiais Baby",
    descricao: "Conteúdo especializado para a faixa de 0 a 3 anos, com dinâmicas sensoriais e recortes simples.",
    href: "https://www.criatividadesbiblicas.com.br/materiaisbaby",
    imagem: "/produtos/biblinho-baby.png",
  },
  {
    nome: "Jesus Cuida das Minhas Emoções",
    descricao: "Estudo completo das 9 emoções com a Bíblia: cards, história do Salmo 23, caixinha de perguntas, atividades e lembrancinhas.",
    href: "/emocoes",
    imagem: "/emocoes/logo-estudo.png",
  },
  {
    nome: "Planner Não Temas",
    descricao: "Planeje o ano bíblico inteiro do seu ministério com um planner pensado pra professoras.",
    href: "https://www.criatividadesbiblicas.com.br/planner2026naotemas",
    imagem: "/produtos/planner-ministerio-infantil.png",
  },
];

export default function MateriaisPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-16 md:pt-20">
          <div className="mx-auto max-w-4xl px-4 pb-12 text-center md:px-8 md:pb-16">
            <Reveal>
              <h1 className="font-display text-4xl font-semibold text-cacau md:text-5xl">
                Outros materiais
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-cacau/70">
                Ainda não é hora do Plano Anual? Comece por um destes.
              </p>
              <Link
                href="/plano-anual#oferta"
                className="mt-6 inline-block text-sm font-bold text-coral-deep hover:underline"
              >
                Ou veja o Plano Anual completo
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="px-4 pb-24 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {ITENS.map((item, i) => (
              <Reveal key={item.nome} delay={i * 0.06}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand/50 bg-white transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(46,31,23,0.2)]"
                >
                  {item.imagem ? (
                    <div className="flex aspect-[16/9] items-center justify-center border-b border-sand/30 bg-sand-light p-6">
                      <Image
                        src={item.imagem}
                        alt={item.nome}
                        width={800}
                        height={450}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <PlaceholderImage label={item.label} aspect="aspect-[16/9]" className="rounded-none border-0 border-b" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-lg font-semibold text-cacau">{item.nome}</h2>
                      <ArrowUpRight
                        size={18}
                        weight="bold"
                        className="shrink-0 text-cacau/40 transition-colors group-hover:text-coral-deep"
                      />
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-cacau/70">{item.descricao}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
