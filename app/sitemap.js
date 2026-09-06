import { SITE_URL } from "@/lib/site";

export default function sitemap() {
  const agora = new Date();
  return [
    { url: `${SITE_URL}/emocoes`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
  ];
}
