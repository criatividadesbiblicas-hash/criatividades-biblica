import Image from "next/image";
import Link from "next/link";
import { InstagramLogo, TiktokLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-sand/40 bg-sand-light">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div>
          <Image
            src="/marca/logo-horizontal.png"
            alt="Criatividades Bíblicas"
            width={600}
            height={315}
            className="h-10 w-auto"
          />
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-cacau/70">
            Material bíblico infantil criativo e lúdico, sem tirar o impacto do evangelho.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cacau/50">Navegação</p>
          <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-cacau/80">
            <Link href="/" className="hover:text-coral-deep">
              Início
            </Link>
            <Link href="/plano-anual" className="hover:text-coral-deep">
              Plano Anual Biblinho
            </Link>
            <Link href="/materiais" className="hover:text-coral-deep">
              Outros materiais
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-cacau/50">Contato</p>
          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-cacau/80">
            <a
              href="mailto:criatividadesbiblicas@gmail.com"
              className="flex items-center gap-2 hover:text-coral-deep"
            >
              <EnvelopeSimple size={18} />
              criatividadesbiblicas@gmail.com
            </a>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.instagram.com/criatividadesbiblicas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-coral-deep"
              >
                <InstagramLogo size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@criatividadesbiblicas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-coral-deep"
              >
                <TiktokLogo size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-sand/40 px-4 py-5 text-center text-xs text-cacau/50 md:px-8">
        © {new Date().getFullYear()} Criatividades Bíblicas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
