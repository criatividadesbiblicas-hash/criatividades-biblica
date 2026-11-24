import { fraunces, nunito } from "@/app/fontes";
import "./globals.css";



import { SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Criatividades Bíblicas | Plano Anual Biblinho",
  description:
    "O ano inteiro de aula bíblica infantil, pronto e imprimível. Material para Baby, Kids e Júnior, criativo e lúdico, sem tirar o impacto do evangelho.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
