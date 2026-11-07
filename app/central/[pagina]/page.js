// app/central/[pagina]/page.js
import { notFound } from "next/navigation";
import { exigirSessao } from "@/lib/central/acesso";
import { listarItens, ultimaRodada } from "@/lib/central/caderno";
import { PAGINAS, itensDaPagina, contadores } from "@/lib/central/itens";
import Moldura from "@/components/central/Moldura";
import Lista from "@/components/central/Lista";

export const dynamic = "force-dynamic";

export default async function PaginaInterna({ params }) {
  const { pagina } = await params;
  await exigirSessao();
  if (!Object.hasOwn(PAGINAS, pagina)) notFound();
  const [{ itens, erro }, rodada] = await Promise.all([listarItens(), ultimaRodada()]);
  return (
    <Moldura ativa={pagina} contadores={contadores(itens)} rodada={rodada}>
      <Lista pagina={pagina} itens={itensDaPagina(itens, pagina)} erro={erro} />
    </Moldura>
  );
}
