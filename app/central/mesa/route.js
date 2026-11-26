// Mesa de Postagens: página inteira (HTML próprio, com o visual do site novo). Só com a sessão da Central.
import { cookies } from "next/headers";
import { COOKIE, sessaoValida } from "@/lib/central/sessao";
import PAGINA from "@/lib/central/mesa/pagina.gerado";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const ok = sessaoValida((await cookies()).get(COOKIE)?.value, process.env.CENTRAL_SEGREDO);
  if (!ok) return Response.redirect(new URL("/central/entrar", req.url), 307);
  return new Response(PAGINA, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", "referrer-policy": "same-origin" },
  });
}
