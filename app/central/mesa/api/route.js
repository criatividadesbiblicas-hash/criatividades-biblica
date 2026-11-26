// API da Mesa de Postagens: GET = tudo que a tela mostra; POST = o que a Thali faz. Só com a sessão da Central.
import { cookies } from "next/headers";
import { COOKIE, sessaoValida } from "@/lib/central/sessao";
import { estadoMesa, acaoMesa } from "@/lib/central/mesa";

export const dynamic = "force-dynamic";
const json = (d, status = 200) => Response.json(d, { status, headers: { "cache-control": "no-store" } });
const sessaoOk = async () => sessaoValida((await cookies()).get(COOKIE)?.value, process.env.CENTRAL_SEGREDO);

export async function GET() {
  if (!(await sessaoOk())) return json({ erro: "Entre na Central de novo." }, 401);
  try {
    const estado = await estadoMesa();
    return json(estado, estado.erro ? 503 : 200);
  } catch {
    return json({ erro: "Não consegui ler a Mesa agora. Tente de novo em instantes." }, 503);
  }
}

export async function POST(req) {
  if (!(await sessaoOk())) return json({ erro: "Entre na Central de novo." }, 401);
  let corpo;
  try { corpo = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
  try {
    const r = await acaoMesa(corpo);
    if (r.erro) return json(r, 400);
    return json({ ok: true, estado: await estadoMesa() });
  } catch (e) {
    return json({ erro: e?.message?.startsWith("banco") ? "Não consegui salvar agora. Tente de novo." : e?.message || "Não consegui salvar agora." }, 503);
  }
}
