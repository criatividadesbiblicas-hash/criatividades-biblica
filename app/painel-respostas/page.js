import PainelRespostas from "@/components/respostas/PainelRespostas";

// Painel do robô de respostas do Instagram (comentário → direct).
// Página isolada: não compartilha estado com as landings. Dados vêm da Edge Function cb-respostas (Supabase).
export const metadata = { title: "Respostas · Instagram", robots: { index: false, follow: false } };

export default function Page() {
  return <PainelRespostas />;
}
