// app/central/page.js
import { redirect } from "next/navigation";
import { exigirSessao } from "@/lib/central/acesso";
import { listarItens, ultimaRodada, estadoPedidos } from "@/lib/central/caderno";
import { resumoCapa, contadores } from "@/lib/central/itens";
import Moldura from "@/components/central/Moldura";
import Capa from "@/components/central/Capa";

export const dynamic = "force-dynamic";

export default async function PaginaCapa() {
  await exigirSessao();
  // 26/11: por enquanto a Central é só a Mesa de Postagens. As outras telas ficam guardadas (CENTRAL_PAGINAS_ANTIGAS=1 mostra).
  if (process.env.CENTRAL_PAGINAS_ANTIGAS !== "1") redirect("/central/mesa");
  const [{ itens, erro }, rodada, pedidos] = await Promise.all([listarItens(), ultimaRodada(), estadoPedidos()]);
  return (
    <Moldura ativa="capa" contadores={contadores(itens)} rodada={rodada}>
      <Capa resumo={resumoCapa(itens)} erro={erro} rodada={rodada} pedidos={pedidos} />
    </Moldura>
  );
}
