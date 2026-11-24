// app/central/layout.js
import { baloo, quicksand } from "@/app/fontes";


export const metadata = { title: "Central de Comando · Criatividades Bíblicas", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function LayoutCentral({ children }) {
  return <div className={`central ${baloo.variable} ${quicksand.variable}`}>{children}</div>;
}
