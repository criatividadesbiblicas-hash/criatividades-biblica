// app/central/acoes.js
"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, DURACAO_S, novaSessao, senhaConfere, sessaoValida } from "@/lib/central/sessao";
import { marcarResolvido, criarPedido } from "@/lib/central/caderno";

export async function entrar(_estado, form) {
  const senha = process.env.CENTRAL_SENHA;
  const segredo = process.env.CENTRAL_SEGREDO;
  if (!senha || !segredo) return { erro: "A Central ainda não tem senha configurada." };
  if (!senhaConfere(form.get("senha"), senha)) {
    await new Promise((r) => setTimeout(r, 1500)); // atrasa quem tenta adivinhar
    return { erro: "Senha não confere. Tente de novo." };
  }
  (await cookies()).set(COOKIE, novaSessao(segredo), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/central", maxAge: DURACAO_S,
  });
  redirect("/central");
}

export async function feito(form) {
  if (!sessaoValida((await cookies()).get(COOKIE)?.value, process.env.CENTRAL_SEGREDO)) notFound();
  const id = String(form.get("id") || "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await marcarResolvido(id); // se falhar, o item continua na tela e mostra que nao funcionou
  revalidatePath("/central", "layout");
}

const sessaoOk = async () => sessaoValida((await cookies()).get(COOKIE)?.value, process.env.CENTRAL_SEGREDO);

export async function atualizarAgora() {
  if (!(await sessaoOk())) notFound();
  await criarPedido("atualizar");
  revalidatePath("/central", "layout");
}

export async function mandarRecado(_estado, form) {
  if (!(await sessaoOk())) notFound();
  const texto = String(form.get("texto") || "").trim();
  if (!texto) return { erro: "Escreva o recado antes de mandar.", ok: false };
  if (texto.length > 4000) return { erro: "O recado passou de 4.000 letras. Divida em dois.", ok: false };
  if (!(await criarPedido("recado", texto))) return { erro: "Não consegui guardar o recado agora. Tente de novo.", ok: false };
  revalidatePath("/central", "layout");
  return { erro: null, ok: true };
}
