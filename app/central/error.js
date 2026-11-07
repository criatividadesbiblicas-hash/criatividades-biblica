// app/central/error.js
"use client";

export default function ErroCentral({ reset }) {
  return (
    <div className="c-esqueleto">
      <section className="c-aviso" role="alert">
        <h2>Algo deu errado ao falar com o caderno</h2>
        <p>Tente de novo. Se continuar, me avise.</p>
        <p style={{ marginTop: 12 }}><button type="button" className="c-btn-sol" onClick={() => reset()}>Tentar de novo</button></p>
      </section>
    </div>
  );
}
