// Mesa de Postagens: regras puras (sem rede), pra rodar igual no servidor e nos testes.

export const NOME_REDE = { ig: "Instagram", tt: "TikTok", pin: "Pinterest" };
export const REDES = Object.keys(NOME_REDE);

// Regras da casa conferidas em toda legenda (memórias de feedback da Thali).
export function regrasLegenda(txt = "") {
  const tags = (txt.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  return [
    [!/—/.test(txt), "Sem travessão"],
    [!/\b(verdade|é real|pequenos|plantar a semente)\b/i.test(txt), "Sem palavras proibidas (verdade, é real, pequenos...)"],
    [tags === 5, `Exatamente 5 hashtags (tem ${tags})`],
    [!/R\$\s?\d/.test(txt), "Sem preço no post"],
    [!/arca de no[eé]/i.test(txt), "Sem Arca de Noé"],
    [!/\ba Criatividades\b/i.test(txt), "\"O Criatividades Bíblicas\", no masculino"],
  ];
}
export const legendaPassa = (txt) => regrasLegenda(txt).every(([ok]) => ok);

export const HORA_OK = /^([01]?\d|2[0-3])h([0-5]\d)?$/;
export const DIA_OK = /^\d{4}-\d{2}-\d{2}$/;

// O que ainda impede agendar. Lista vazia = pode.
export function faltaPraAgendar(post, { dia, hora, redes } = {}) {
  const f = [];
  if (!post) return ["post não encontrado"];
  if (post.capas?.length && !post.capa) f.push("escolher a capa");
  if (!DIA_OK.test(dia || "")) f.push("o dia");
  if (!HORA_OK.test(hora || "")) f.push("o horário");
  if (!Array.isArray(redes) || !redes.length || redes.some((r) => !REDES.includes(r))) f.push("onde vai sair");
  if (post.situacao === "aguardando") {
    const faltam = (post.cards || []).filter((c) => !c.ok).length;
    if (faltam) f.push(`aprovar ${faltam} ${faltam === 1 ? "card" : "cards"}`);
    if (!post.legenda_ok) f.push("aprovar a legenda");
  }
  for (const r of redes || []) {
    const t = post.legendas?.[r] ?? post.legendas?.ig;
    if (t && !legendaPassa(t)) { f.push("corrigir a legenda"); break; }
  }
  return f;
}

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export function diaLegivel(iso) {
  if (!DIA_OK.test(iso || "")) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  return `${DIAS_SEMANA[d.getUTCDay()]} ${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}
export function listaRedes(redes = []) {
  const n = redes.map((r) => NOME_REDE[r] || r);
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} e ${n.at(-1)}` : n[0] || "";
}

const TIPO_LEGIVEL = {
  semana: "Planejar uma semana",
  mudar_post: "Mudar um post (pela aba Pedido)",
  ajuste_card: "Ajuste num card",
  ajuste_post: "Mudança no post inteiro",
  ajuste_legenda: "Ajuste na legenda",
  ajuste_pronto: "Ajuste num post pronto",
  comentario_ideia: "Comentário numa ideia",
  montar_semana: "Montar a semana com as ideias aprovadas",
  agendar: "Agendar",
};
export const tipoLegivel = (t) => TIPO_LEGIVEL[t] || t;

// Texto do recado que o vigia do PC entrega pro Claude (cabe nos 4.000 caracteres da Central).
export function textoRecado({ id, tipo, texto, dados = {} }, post) {
  const linhas = [`[Mesa de Postagens] Pedido ${id} · ${tipoLegivel(tipo)}`];
  if (post) linhas.push(`Post: ${post.titulo} (slug ${post.slug}, versão ${post.versao})`);
  if (dados.card) linhas.push(`Card: ${dados.card}`);
  if (dados.tipo === "sentido") linhas.push("Tipo: mudar o sentido do post (refazer texto dos cards, capa e legenda)");
  if (dados.tipo === "todos") linhas.push("Tipo: o mesmo ajuste em todos os cards");
  if (dados.rede) linhas.push(`Legenda: ${NOME_REDE[dados.rede] || dados.rede}`);
  if (dados.semana) linhas.push(`Semana: ${dados.semana}`);
  if (dados.fontes?.length) linhas.push(`Pesquisar em: ${dados.fontes.join("; ")}`);
  if (dados.ideia) linhas.push(`Ideia: ${dados.ideia}`);
  if (dados.ideias?.length) linhas.push(`Ideias aprovadas:\n- ${dados.ideias.join("\n- ")}`);
  if (texto) linhas.push(`O que ela pediu: "${texto}"`);
  linhas.push("Siga ferramentas/mesa/ATENDER.md. Recado não publica, não agenda e não gasta.");
  return linhas.join("\n").slice(0, 3990);
}
