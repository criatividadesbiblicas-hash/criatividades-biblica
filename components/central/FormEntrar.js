// components/central/FormEntrar.js
"use client";
import { useActionState } from "react";
import { entrar } from "@/app/central/acoes";

export default function FormEntrar() {
  const [estado, acao, enviando] = useActionState(entrar, { erro: null });
  return (
    <form action={acao}>
      <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
      <h1 style={{ fontSize: 24, lineHeight: 1.1 }}>Central de Comando</h1>
      <label htmlFor="senha" style={{ fontSize: 14, fontWeight: 700 }}>Senha</label>
      <input id="senha" name="senha" type="password" autoComplete="current-password" required />
      {estado?.erro && <p className="c-erro" role="alert">{estado.erro}</p>}
      <button className="c-btn-sol" type="submit" disabled={enviando} style={{ justifyContent: "center", padding: "12px 16px", fontSize: 16 }}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
