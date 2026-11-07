// app/central/layout.js
import { Baloo_2, Quicksand } from "next/font/google";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-baloo", display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-quicksand", display: "swap" });

export const metadata = { title: "Central de Comando · Criatividades Bíblicas", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function LayoutCentral({ children }) {
  return <div className={`central ${baloo.variable} ${quicksand.variable}`}>{children}</div>;
}
