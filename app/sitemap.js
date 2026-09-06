import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const agora = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/emocoes`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/plano-anual`, lastModified: agora, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/materiais`, lastModified: agora, changeFrequency: "monthly", priority: 0.6 },
  ];
}
