// Política de privacidade (aprovada pela Thali em 24/11/2026).
// Texto-fonte no cofre: 06 Ferramentas/Política de privacidade (rascunho).md
// Exigida pelo Pinterest pra liberar o aplicativo de publicação. Página só de texto, sem rastreamento.

export const metadata = {
  title: "Política de privacidade | Criatividades Bíblicas",
  description:
    "Quais dados o Criatividades Bíblicas usa, pra que servem e como pedir pra ver, corrigir ou apagar os seus.",
  alternates: { canonical: "https://materiais.criatividadesbiblicas.com.br/privacidade" },
};

const EMAIL = "criatividadesbiblicas@gmail.com";
const WHATSAPP = "https://wa.me/5527992941881";

function Item({ n, titulo, children }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold text-cacau md:text-2xl">
        {n}. {titulo}
      </h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-cacau/80">{children}</div>
    </section>
  );
}

const Link = ({ href, children }) => (
  <a href={href} className="font-semibold text-coral-deep underline underline-offset-2">
    {children}
  </a>
);

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-ivory font-body">
      <div className="mx-auto max-w-2xl px-4 py-14 md:px-8 md:py-20">
        <p className="text-sm font-bold uppercase tracking-wider text-coral-deep">Criatividades Bíblicas</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cacau md:text-5xl">
          Política de privacidade
        </h1>
        <p className="mt-3 text-sm text-cacau/60">Atualizado em 24 de novembro de 2026.</p>
        <p className="mt-6 text-lg leading-relaxed text-cacau/80">
          Sem letra miúda: aqui a gente conta quais dados usa, pra que servem e como você pede pra apagar os seus.
        </p>

        <Item n={1} titulo="Quem cuida dos seus dados">
          <p>
            Este site é do Criatividades Bíblicas Ltda, CNPJ 65.250.676/0001-89. Pra falar com a gente sobre os
            seus dados, escreva pra <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> ou chame no{" "}
            <Link href={WHATSAPP}>WhatsApp</Link>, de segunda a sexta, das 8h às 17h.
          </p>
        </Item>

        <Item n={2} titulo="Quando você compra um material">
          <p>
            A compra acontece na Kiwify, fora deste site. A Kiwify passa pra gente o seu nome, o seu e-mail, o seu
            telefone e o material que você comprou. Usamos esses dados pra entregar o material, tirar suas dúvidas e
            avisar sobre o que você comprou. Os dados do pagamento (cartão, Pix ou boleto) ficam só com a Kiwify: a
            gente não vê nem guarda.
          </p>
        </Item>

        <Item n={3} titulo="Como o site mede as visitas">
          <p>Pra saber se as páginas estão ajudando quem chega aqui, usamos duas ferramentas:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Pixel da Meta:</strong> registra visitas, cliques e compras. Com ele a gente sabe se os anúncios
              no Facebook e no Instagram estão funcionando e pode mostrar anúncios pra quem já passou por aqui. Quando
              você compra, também avisamos a Meta da compra, com o seu e-mail e telefone codificados, sem que dê pra
              ler.
            </li>
            <li>
              <strong>Microsoft Clarity:</strong> mostra como as pessoas usam a página (cliques, rolagem e gravações
              da navegação, com os campos digitados escondidos). Com ele a gente descobre o que precisa melhorar.
            </li>
          </ul>
          <p>Essas ferramentas são da Meta e da Microsoft, e cada uma tem as suas próprias regras de privacidade.</p>
        </Item>

        <Item n={4} titulo="Cookies">
          <p>
            As ferramentas de medição usam cookies, que são arquivos guardados no seu navegador pra reconhecer a sua
            visita. Você pode apagar ou bloquear os cookies nas configurações do navegador, e as páginas continuam
            funcionando.
          </p>
        </Item>

        <Item n={5} titulo="Nossas redes sociais">
          <p>
            O Criatividades Bíblicas publica conteúdo no Instagram, no Facebook, no TikTok e no Pinterest. Pra
            publicar com mais agilidade, usamos as ferramentas oficiais dessas redes ligadas só às nossas próprias
            contas. Por elas a gente publica os nossos posts e vê os números dos nossos posts. Não coletamos, não
            guardamos e não vendemos dados de outras pessoas dessas redes.
          </p>
        </Item>

        <Item n={6} titulo="Pra quem os dados vão">
          <p>
            Só pras ferramentas citadas aqui (Kiwify, Meta, Microsoft e as redes sociais), pro que está escrito nesta
            página. A gente não vende nem repassa os seus dados pra mais ninguém.
          </p>
        </Item>

        <Item n={7} titulo="Por quanto tempo guardamos">
          <p>
            Pelo tempo em que você tiver acesso ao material comprado e pelo que a lei mandar guardar (por exemplo, nota
            fiscal). Depois disso, apagamos.
          </p>
        </Item>

        <Item n={8} titulo="Crianças">
          <p>
            Este site é feito pra adultos: professores, líderes, mães e pais. A gente não pede dados de crianças.
          </p>
        </Item>

        <Item n={9} titulo="Como pedir pra ver, corrigir ou apagar os seus dados">
          <p>
            É só escrever pra <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> com o assunto &ldquo;Meus dados&rdquo; e
            dizer o que você precisa. Respondemos em até 15 dias. Esse é um direito seu, garantido pela Lei Geral de
            Proteção de Dados (LGPD).
          </p>
        </Item>

        <Item n={10} titulo="Quando este texto mudar">
          <p>Se alguma coisa mudar, a versão nova aparece nesta página, com a data no começo.</p>
        </Item>
      </div>
    </main>
  );
}
