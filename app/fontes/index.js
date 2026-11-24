// Fontes guardadas no próprio site (24/11/2026). Antes vinham do Google Fonts na hora do build,
// e a Vercel falhou 3 vezes seguidas ao baixá-las. Mesmas famílias, arquivos latin variáveis do
// Google Fonts (licença OFL), então o visual não muda.
import localFont from "next/font/local";

export const fraunces = localFont({
  src: "./fraunces-latin.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
});

export const nunito = localFont({
  src: "./nunito-latin.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
});

export const baloo = localFont({
  src: "./baloo2-latin.woff2",
  weight: "400 800",
  variable: "--font-baloo",
  display: "swap",
});

export const quicksand = localFont({
  src: "./quicksand-latin.woff2",
  weight: "300 700",
  variable: "--font-quicksand",
  display: "swap",
});

export const lilita = localFont({
  src: "./lilita-one-latin.woff2",
  weight: "400",
  variable: "--font-lilita",
  display: "swap",
});
