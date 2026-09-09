import { SITE_URL } from "@/lib/site";

// Host da landing /plano-anual: precisa bater com a constante HOST em app/plano-anual/page.js
// (a página é servida de materiais.criatividadesbiblicas.com.br, não do host padrão de SITE_URL).
const PLANO_ANUAL_HOST = "https://materiais.criatividadesbiblicas.com.br";

export default function sitemap() {
  const agora = new Date();
  return [
    { url: `${SITE_URL}/emocoes`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
    { url: `${PLANO_ANUAL_HOST}/plano-anual`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
  ];
}
