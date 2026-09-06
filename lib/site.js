// URL pública do site (sem barra no fim). Usada em canonical, Open Graph, sitemap e robots.
// Em produção, defina NEXT_PUBLIC_SITE_URL na Vercel quando o domínio próprio estiver ligado.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://emocoes.criatividadesbiblicas.com.br").replace(/\/$/, "");
