import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
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
