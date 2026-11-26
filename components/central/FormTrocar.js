"use client";
import { useActionState, useState } from "react";
import { trocarSenha } from "@/app/central/acoes";

const rotulo = { fontSize: 14, fontWeight: 700 };

export default function FormTrocar({ obrigatoria: inicial }) {
  // Guarda como a tela abriu: depois de trocar, o servidor já vê a sessão nova e manda "false".
  const [obrigatoria] = useState(inicial);
  const [estado, acao, enviando] = useActionState(trocarSenha, { erro: null, ok: false });
  if (estado?.ok) {
    return (
      <div className="c-form-trocar" style={{ display: "grid", gap: 14 }}>
        <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
        <h1 style={{ fontSize: 24, lineHeight: 1.1 }}>Senha trocada</h1>
        <p style={{ margin: 0 }}>Daqui pra frente, entre com a senha nova. {obrigatoria ? "Já pode apagar o arquivo da senha provisória da sua Área de Trabalho." : ""}</p>
        <a className="c-btn-sol" href="/central/mesa" style={{ justifyContent: "center", padding: "12px 16px", fontSize: 16, textDecoration: "none" }}>Abrir a Mesa de Postagens</a>
      </div>
    );
  }
  return (
    <form action={acao}>
      <img src="/marca/logo-horizontal.png" alt="Criatividades Bíblicas" />
      <h1 style={{ fontSize: 24, lineHeight: 1.1 }}>{obrigatoria ? "Crie a sua senha" : "Trocar a senha"}</h1>
      {obrigatoria && <p style={{ margin: 0, fontSize: 14 }}>Você entrou com a senha provisória. Escolha agora a sua senha, com pelo menos 8 letras ou números.</p>}
      {!obrigatoria && (
        <>
          <label htmlFor="atual" style={rotulo}>Senha atual</label>
          <input id="atual" name="atual" type="password" autoComplete="current-password" required />
        </>
      )}
      <label htmlFor="nova" style={rotulo}>Senha nova (pelo menos 8)</label>
      <input id="nova" name="nova" type="password" autoComplete="new-password" minLength={8} required />
      <label htmlFor="repetida" style={rotulo}>Repita a senha nova</label>
      <input id="repetida" name="repetida" type="password" autoComplete="new-password" minLength={8} required />
      {estado?.erro && <p className="c-erro" role="alert">{estado.erro}</p>}
      <button className="c-btn-sol" type="submit" disabled={enviando} style={{ justifyContent: "center", padding: "12px 16px", fontSize: 16 }}>
        {enviando ? "Guardando..." : "Guardar a senha nova"}
      </button>
      {!obrigatoria && <a href="/central/mesa" style={{ fontSize: 14, textAlign: "center" }}>Voltar pra Mesa</a>}
    </form>
  );
}
