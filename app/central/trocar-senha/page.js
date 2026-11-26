// app/central/trocar-senha/page.js · trocar a senha da Central (obrigatório depois da senha provisória).
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, COOKIE_TROCA, sessaoValida, trocaValida } from "@/lib/central/sessao";
import FormTrocar from "@/components/central/FormTrocar";

export const dynamic = "force-dynamic";

export default async function PaginaTrocarSenha() {
  const jar = await cookies();
  const segredo = process.env.CENTRAL_SEGREDO;
  const logada = sessaoValida(jar.get(COOKIE)?.value, segredo);
  const provisoria = trocaValida(jar.get(COOKIE_TROCA)?.value, segredo);
  if (!logada && !provisoria) redirect("/central/entrar");
  return <main className="c-entrar"><FormTrocar obrigatoria={provisoria} /></main>;
}
