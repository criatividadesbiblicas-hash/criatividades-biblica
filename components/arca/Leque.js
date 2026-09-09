import Image from "next/image";

// Leque de páginas reais do material: as folhas abrem em arco a partir de um ponto
// abaixo do card. A do meio fica na frente. Página única fica maior.
export default function Leque({ imagens, alt = "Páginas do material", paisagem = false, className = "" }) {
  const n = imagens.length;
  const meio = (n - 1) / 2;
  const w = paisagem ? 900 : 828;
  const h = paisagem ? 636 : 1170;
  const largura = n === 1 ? (paisagem ? "w-[92%]" : "w-[52%]") : paisagem ? "w-[62%]" : "w-[46%]";
  return (
    <div className={`relative w-full overflow-visible ${paisagem ? "aspect-[4/3]" : n === 1 ? "aspect-[4/3.6]" : "aspect-[4/3.3]"} ${className}`}>
      {imagens.map((src, i) => {
        const t = i - meio;
        const z = 10 - Math.round(Math.abs(t) * 2);
        return (
          <Image
            key={src}
            src={src}
            alt={i === Math.floor(meio) ? alt : ""}
            width={w}
            height={h}
            sizes="(min-width: 1024px) 22vw, 45vw"
            className={`absolute left-1/2 top-[6%] rounded-[6px] bg-white shadow-[0_18px_30px_-14px_rgba(11,87,160,0.45)] ring-1 ring-arca-tinta/10 ${largura}`}
            style={{ zIndex: z, transformOrigin: "50% 135%", transform: `translateX(-50%) rotate(${t * 9}deg)` }}
          />
        );
      })}
    </div>
  );
}
