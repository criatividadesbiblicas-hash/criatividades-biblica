// app/central/page.js
import { exigirSessao } from "@/lib/central/acesso";
import { listarItens, ultimaRodada } from "@/lib/central/caderno";
import { resumoCapa, contadores } from "@/lib/central/itens";
import Moldura from "@/components/central/Moldura";
import Capa from "@/components/central/Capa";

export const dynamic = "force-dynamic";

export default async function PaginaCapa() {
  await exigirSessao();
  const [{ itens, erro }, rodada] = await Promise.all([listarItens(), ultimaRodada()]);
  return (
    <Moldura ativa="capa" contadores={contadores(itens)} rodada={rodada}>
      <Capa resumo={resumoCapa(itens)} erro={erro} rodada={rodada} />
    </Moldura>
  );
}
