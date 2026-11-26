// app/central/acoes.js
"use server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, DURACAO_S, novaSessao, senhaConfere, sessaoValida, COOKIE_TROCA, DURACAO_TROCA_S, novaTroca, trocaValida } from "@/lib/central/sessao";
import { marcarResolvido, criarPedido } from "@/lib/central/caderno";
import { lerAcesso, gravarSenha } from "@/lib/central/acessoSenha";
import { confere, embaralhar, problemaNaSenhaNova } from "@/lib/central/senha";

const atrasar = () => new Promise((r) => setTimeout(r, 1500)); // atrasa quem tenta adivinhar
const opcoesCookie = (maxAge) => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/central", maxAge });

// Senha guardada no banco (embaralhada) vale primeiro. Enquanto não existir, vale a senha antiga da Vercel.
async function senhaCerta(digitada) {
  const acesso = await lerAcesso();
  if (acesso?.erro) return { erro: "Não consegui conferir a senha agora. Tente de novo em instantes." };
  if (acesso) return { ok: confere(digitada, acesso.senha_hash), trocar: acesso.trocar };
  return { ok: senhaConfere(digitada, process.env.CENTRAL_SENHA), trocar: false };
}

export async function entrar(_estado, form) {
  const segredo = process.env.CENTRAL_SEGREDO;
  if (!segredo) return { erro: "A Central ainda não tem senha configurada." };
  const r = await senhaCerta(form.get("senha"));
  if (r.erro) return { erro: r.erro };
  if (!r.ok) { await atrasar(); return { erro: "Senha não confere. Tente de novo." }; }
  const jar = await cookies();
  if (r.trocar) {
    jar.set(COOKIE_TROCA, novaTroca(segredo), opcoesCookie(DURACAO_TROCA_S));
    redirect("/central/trocar-senha");
  }
  jar.set(COOKIE, novaSessao(segredo), opcoesCookie(DURACAO_S));
  redirect("/central/mesa");
}

// Trocar a senha: obrigatório depois da senha provisória, ou quando ela quiser (aí pede a senha atual).
export async function trocarSenha(_estado, form) {
  const segredo = process.env.CENTRAL_SEGREDO;
  const jar = await cookies();
  const logada = sessaoValida(jar.get(COOKIE)?.value, segredo);
  const provisoria = trocaValida(jar.get(COOKIE_TROCA)?.value, segredo);
  if (!logada && !provisoria) return { erro: "O tempo pra trocar a senha acabou. Entre de novo.", ok: false };
  if (!provisoria) {
    const r = await senhaCerta(form.get("atual"));
    if (r.erro) return { erro: r.erro, ok: false };
    if (!r.ok) { await atrasar(); return { erro: "A senha atual não confere.", ok: false }; }
  }
  const problema = problemaNaSenhaNova(form.get("nova"), form.get("repetida"));
  if (problema) return { erro: problema, ok: false };
  if (!(await gravarSenha(embaralhar(form.get("nova"))))) return { erro: "Não consegui guardar a senha nova agora. Tente de novo.", ok: false };
  jar.set(COOKIE, novaSessao(segredo), opcoesCookie(DURACAO_S));
  jar.delete({ name: COOKIE_TROCA, path: "/central" });
  return { erro: null, ok: true };
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
