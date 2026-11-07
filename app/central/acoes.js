// app/central/acoes.js
"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, DURACAO_S, novaSessao, senhaConfere, sessaoValida } from "@/lib/central/sessao";
import { marcarResolvido } from "@/lib/central/caderno";

export async function entrar(_estado, form) {
  const senha = process.env.CENTRAL_SENHA;
  const segredo = process.env.CENTRAL_SEGREDO;
  if (!senha || !segredo) return { erro: "A Central ainda não tem senha configurada." };
  if (!senhaConfere(form.get("senha"), senha)) return { erro: "Senha não confere. Tente de novo." };
  (await cookies()).set(COOKIE, novaSessao(segredo), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/central", maxAge: DURACAO_S,
  });
  redirect("/central");
}

export async function feito(form) {
  if (!sessaoValida((await cookies()).get(COOKIE)?.value, process.env.CENTRAL_SEGREDO)) notFound();
  const id = String(form.get("id") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await marcarResolvido(id);
  revalidatePath("/central", "layout");
}
