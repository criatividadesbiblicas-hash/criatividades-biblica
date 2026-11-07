import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { COOKIE, sessaoValida } from "./sessao";

export async function exigirSessao() {
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!sessaoValida(valor, process.env.CENTRAL_SEGREDO)) notFound();
}
