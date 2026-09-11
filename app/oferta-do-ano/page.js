/*
  CONTRATO DE DIREÇÃO — Oferta do ano (upsell de pós-compra)
  THESIS: a pessoa acabou de comprar e está com o cartão na mão. A página tranquiliza
  primeiro ("sua compra está confirmada"), faz a ponte entre o que ela comprou e o ano
  inteiro, e pede UM clique. Quem sai daqui sem aceitar sai pelo link de recusa, não
  por um menu.
  OWN-WORLD: o mesmo mundo .pa da landing — Lilita One + Nunito, céu claro, verde campo,
  botão sol. Páginas e capas reais dos PDFs.
  FORM: página curta e sem saída. Sem menu, sem rodapé com links, sem âncoras. A única
  decisão possível é aceitar ou recusar.
  HONESTIDADE: o preço aqui é o mesmo da página pública (R$ 597), por decisão da Thali.
  Então NÃO existe desconto exclusivo, contador nem "só nesta tela" — o argumento é a
  conveniência do clique e o fato de o material que ela comprou ser uma das doze histórias.
  Inventar urgência aqui seria mentir para quem acabou de confiar.
*/
import Image from "next/image";
import { Lilita_One } from "next/font/google";
import { CheckCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import KiwifyUpsell from "@/components/plano-anual/KiwifyUpsell";
import { OFERTA, HISTORIAS, PECAS } from "@/components/plano-anual/dados";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita", display: "swap" });

export const metadata = {
  title: "Uma oferta para o seu ano | Criatividades Bíblicas",
  description: "O material que você acabou de garantir é uma das doze histórias do Plano Anual Biblinho.",
  // Página de funil: não deve aparecer em busca nem ser compartilhada solta.
  robots: { index: false, follow: false },
};

export default function OfertaDoAnoPage() {
  return (
    <div className={`pa ${lilita.variable} min-h-screen bg-white`}>
      <main>
        {/* 1. Confirmação — tranquilizar antes de oferecer qualquer coisa */}
        <section className="bg-pa-campo-escuro text-white">
          <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-5 md:px-8">
            <CheckCircle size={32} weight="fill" className="shrink-0 text-pa-sol" />
            <p className="text-[16px] font-semibold leading-snug md:text-[17px]">
              Sua compra está confirmada. O acesso já está indo para o seu e-mail.
            </p>
          </div>
        </section>

        {/* 2. A ponte */}
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eaf6ff_100%)]">
          <div className="mx-auto max-w-3xl px-5 pb-12 pt-14 text-center md:px-8 md:pt-20">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-campo-escuro">
              Antes de você fechar esta página
            </p>
            <h1 className="mt-4 text-balance font-display text-[2.1rem] leading-[1.04] text-pa-tinta min-[360px]:text-[2.4rem] md:text-[3.05rem]">
              O material que você acabou de garantir
              <br />
              <span className="text-pa-campo">é uma das doze histórias do ano.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[54ch] text-[17px] font-medium leading-relaxed text-pa-tinta/80 md:text-xl">
              O Plano Anual Biblinho é essa mesma experiência, doze vezes. Uma história nova por mês,
              com quatro ou cinco domingos dentro dela, para Kids e Júnior, com o material Baby junto.
            </p>

            <div className="relative mx-auto mt-10 h-[230px] w-full max-w-lg md:h-[300px]">
              <Image src={HISTORIAS[0].src} alt="" width={900} height={1273} className="absolute left-[6%] top-[8%] h-[78%] w-auto -rotate-[9deg] rounded-[12px] border-4 border-white shadow-[0_26px_44px_-18px_rgba(11,60,100,0.45)]" />
              <Image src={HISTORIAS[1].src} alt="Capas do material do Plano Anual" width={900} height={1273} className="absolute left-[33%] top-0 z-10 h-[92%] w-auto rotate-[2deg] rounded-[12px] border-4 border-white shadow-[0_32px_52px_-18px_rgba(11,60,100,0.5)]" />
              <Image src={HISTORIAS[2].src} alt="" width={900} height={1273} className="absolute left-[60%] top-[8%] h-[78%] w-auto rotate-[9deg] rounded-[12px] border-4 border-white shadow-[0_26px_44px_-18px_rgba(11,60,100,0.45)]" />
            </div>
          </div>
        </section>

        {/* 3. O que chega todo mês — compacto, só os nomes */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
            <h2 className="text-center font-display text-[1.7rem] leading-tight text-pa-tinta md:text-[2.2rem]">
              Todo mês, isso chega pronto.
            </h2>
            <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              {PECAS.map((p) => (
                <li key={p.titulo} className="flex items-start gap-3 rounded-[1.1rem] bg-pa-ceu-claro px-5 py-4">
                  <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-pa-campo" />
                  <span className="text-[15px] font-semibold leading-snug text-pa-tinta">{p.titulo}</span>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-6 max-w-[52ch] text-center text-[15px] font-medium leading-relaxed text-pa-tinta/75">
              Nas três faixas: Kids de 4 a 6, Júnior de 7 a 10, e o Baby de 1 a 3 anos de bônus.
            </p>
          </div>
        </section>

        {/* 4. A conta e o clique */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
            <div className="rounded-[2rem] bg-white p-7 shadow-[0_24px_56px_-28px_rgba(11,60,100,0.45)] md:p-10">
              <h2 className="text-center font-display text-[1.7rem] leading-tight text-pa-tinta md:text-[2.2rem]">
                Doze histórias, uma por mês.
              </h2>

              <p className="mt-7 text-center text-[15px] font-semibold text-pa-tinta/70">
                Comprando as doze como Pack avulso, <s>{OFERTA.de}</s>
              </p>
              <p className="mt-1 text-center">
                <span className="font-display text-[3rem] leading-none text-pa-campo md:text-[3.6rem]">{OFERTA.por}</span>
              </p>
              {/* Sem "menos de R$ 50 por mês" aqui: o widget da Kiwify injeta logo abaixo o
                  seletor com o valor real da parcela, e os dois números juntos se contradiziam. */}
              <p className="mt-2 text-center text-[15px] font-semibold text-pa-tinta/70">
                à vista ou parcelado, como você preferir
              </p>

              <div className="mt-8">
                <KiwifyUpsell />
              </div>

              <p className="mt-7 text-center text-[14px] font-medium leading-relaxed text-pa-tinta/70">
                É um clique. A cobrança entra no mesmo cartão que você acabou de usar,
                sem precisar digitar nada de novo.
              </p>

              <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                <ShieldCheck size={40} weight="fill" className="shrink-0 text-pa-campo" />
                <p className="text-[14px] font-medium leading-relaxed text-pa-tinta/80">
                  <strong className="font-bold text-pa-tinta">7 dias de garantia.</strong> Se o material não for
                  o que você esperava, devolvemos o valor inteiro. Sem burocracia.
                </p>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-[50ch] text-center text-[14px] font-medium leading-relaxed text-pa-tinta/60">
              Recusar não afeta em nada a compra que você já fez. O material que você garantiu
              continua seu, e o acesso já está no seu e-mail.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
