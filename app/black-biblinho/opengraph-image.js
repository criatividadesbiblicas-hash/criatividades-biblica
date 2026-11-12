import { ImageResponse } from "next/og";

// Imagem de compartilhamento da /black-biblinho (WhatsApp, Instagram, Facebook).
// Gerada no servidor: fundo noite, selo sol, nome da oferta e a janela da venda.

export const runtime = "edge";
export const alt = "Black Biblinho · Acesso Total: tudo de 2025 e 2026 numa compra só, de 23 a 30 de novembro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #141a2b 0%, #1d2540 100%)",
          color: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#ffc531", color: "#22303f", fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>
            BLACK FRIDAY · 23 A 30 DE NOVEMBRO
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1 }}>Black Biblinho</div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1, color: "#ffc531" }}>Acesso Total</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 30, lineHeight: 1.3, color: "rgba(255,255,255,0.85)", maxWidth: 980 }}>
            Tudo que a Criatividades Bíblicas já criou, numa compra só: 20 séries de estudo, 84 domingos de aula pronta.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "rgba(255,255,255,0.7)" }}>
          <div style={{ display: "flex" }}>Baby · Kids · Júnior · em PDF pra imprimir</div>
          <div style={{ display: "flex", fontWeight: 800, color: "#ffffff" }}>criatividadesbiblicas.com.br</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
