import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, sessaoValida } from "./sessao";

// Sem sessão: vai pra tela de entrar (antes mostrava "página não encontrada", o que parecia site fora do ar).
export async function exigirSessao() {
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!sessaoValida(valor, process.env.CENTRAL_SEGREDO)) redirect("/central/entrar");
}
