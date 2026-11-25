import { lilita } from "@/app/fontes";
import PainelRespostas from "@/components/respostas/PainelRespostas";

// Biblinho Carteiro: painel do robô que responde comentários do Instagram com um direct.
// Página isolada (escopo .cr), não compartilha estilo com as landings. Dados vêm da Edge Function cb-respostas (Supabase).
export const metadata = { title: "Biblinho Carteiro", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className={`cr ${lilita.variable}`}>
      <PainelRespostas />
    </div>
  );
}
