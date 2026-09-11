// O "cérebro" do painel: transforma números da conta em farol, funil, alertas
// e um texto em português explicando o que está acontecendo agora.

// Metas tiradas do histórico real desta conta (campanhas de set/2024 a jan/2025)
// e do preço líquido por venda (R$ 50,19 depois das taxas da Kiwify).
export const METAS = {
  ctr: { alvo: 2.0, limite: 1.2, maiorMelhor: true, rotulo: "CTR", ajuda: "De cada 100 pessoas que viram o anúncio, quantas clicaram. Abaixo de 1,2% o criativo não está segurando atenção." },
  cpc: { alvo: 0.6, limite: 1.0, maiorMelhor: false, rotulo: "Custo por clique", ajuda: "Quanto você paga por cada clique. A régua da sua conta em 2024/2025 foi R$ 0,45 a R$ 0,76." },
  cpm: { alvo: 15, limite: 25, maiorMelhor: false, rotulo: "CPM", ajuda: "Quanto custa aparecer 1.000 vezes. Sobe quando o público é pequeno ou muito disputado." },
  custo_lpv: { alvo: 1.0, limite: 2.0, maiorMelhor: false, rotulo: "Custo por visita", ajuda: "Quanto custa cada pessoa que realmente abriu a página de venda." },
  custo_checkout: { alvo: 6, limite: 10, maiorMelhor: false, rotulo: "Custo por checkout", ajuda: "Quanto custa cada pessoa que chegou a abrir o pagamento." },
  cpa: { alvo: 25, limite: 40, maiorMelhor: false, rotulo: "Custo por venda", ajuda: "Quanto você paga em anúncio por cada venda. Acima de R$ 40 a venda dá prejuízo." },
  roas: { alvo: 2.3, limite: 1.5, maiorMelhor: true, rotulo: "ROAS", ajuda: "Quantos reais voltam para cada real investido. Abaixo de 1 você gasta mais do que vende." },
  frequencia: { alvo: 1.8, limite: 2.5, maiorMelhor: false, rotulo: "Frequência", ajuda: "Quantas vezes a mesma pessoa viu seu anúncio. Acima de 2,5 o público está cansando." },
};

// Quanto volume cada métrica precisa ter para valer a pena olhar. Com pouca
// gente, CTR e ROAS oscilam à toa — pintar de vermelho ali só assusta sem motivo.
const BASE_MINIMA = {
  ctr: (m) => m.impressoes >= 500,
  cpm: (m) => m.impressoes >= 500,
  frequencia: (m) => m.impressoes >= 1000,
  cpc: (m) => m.cliques >= 20,
  custo_lpv: (m) => m.lpv >= 10,
  custo_checkout: (m) => m.checkouts >= 5,
  cpa: (m) => m.compras >= 1 || m.gasto >= 50,
  roas: (m) => m.compras >= 1 || m.gasto >= 50,
};

// Devolve o valor da métrica só quando há base suficiente para ela significar algo.
export function valorConfiavel(chave, metricas) {
  const basta = BASE_MINIMA[chave];
  if (basta && !basta(metricas)) return null;
  const v = metricas[chave];
  return v === null || v === undefined || !Number.isFinite(Number(v)) ? null : Number(v);
}

export function farol(chave, valor) {
  const m = METAS[chave];
  if (!m || valor === null || valor === undefined || !Number.isFinite(Number(valor))) return "neutro";
  const v = Number(valor);
  if (m.maiorMelhor) return v >= m.alvo ? "bom" : v >= m.limite ? "atencao" : "ruim";
  return v <= m.alvo ? "bom" : v <= m.limite ? "atencao" : "ruim";
}

const horas = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 36e5 : null);

const brl = (v) =>
  v === null || v === undefined || !Number.isFinite(Number(v))
    ? "–"
    : Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const n2 = (v) =>
  v === null || v === undefined || !Number.isFinite(Number(v))
    ? "–"
    : Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const pct = (v, casas = 1) =>
  v === null || v === undefined || !Number.isFinite(Number(v))
    ? "–"
    : Number(v).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + "%";

// Quanto do dia já passou, no fuso de São Paulo — serve para saber se o gasto
// de hoje está no ritmo certo ou correndo rápido demais.
export function fracaoDoDia(agora = new Date()) {
  const emSP = new Date(agora.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  return (emSP.getHours() * 60 + emSP.getMinutes()) / 1440;
}

export function montarFunil(m) {
  const etapas = [
    { chave: "impressoes", rotulo: "Viram o anúncio", valor: m.impressoes, unidade: "aparições" },
    { chave: "cliques", rotulo: "Clicaram", valor: m.cliques, custo: m.cpc },
    { chave: "lpv", rotulo: "Abriram a página", valor: m.lpv, custo: m.custo_lpv },
    { chave: "checkouts", rotulo: "Foram pagar", valor: m.checkouts, custo: m.custo_checkout },
    { chave: "compras", rotulo: "Compraram", valor: m.compras, custo: m.cpa },
  ];

  return etapas.map((e, i) => {
    const anterior = i > 0 ? etapas[i - 1].valor : null;
    return { ...e, taxa: anterior ? (e.valor / anterior) * 100 : null };
  });
}

// Taxas de passagem médias das campanhas antigas desta conta: a régua honesta
// para dizer se uma etapa está vazando ou se sempre foi assim.
export function reguaHistorica(historico = []) {
  const bons = historico.filter((h) => h.compras > 0 && h.cliques > 20);
  if (!bons.length) return null;
  const soma = bons.reduce(
    (a, h) => ({
      gasto: a.gasto + h.gasto,
      cliques: a.cliques + h.cliques,
      lpv: a.lpv + h.lpv,
      checkouts: a.checkouts + h.checkouts,
      compras: a.compras + h.compras,
      impressoes: a.impressoes + h.impressoes,
    }),
    { gasto: 0, cliques: 0, lpv: 0, checkouts: 0, compras: 0, impressoes: 0 },
  );

  return {
    ctr: soma.impressoes ? (soma.cliques / soma.impressoes) * 100 : null,
    cpc: soma.cliques ? soma.gasto / soma.cliques : null,
    cpm: soma.impressoes ? (soma.gasto / soma.impressoes) * 1000 : null,
    clique_para_lpv: soma.cliques ? (soma.lpv / soma.cliques) * 100 : null,
    lpv_para_checkout: soma.lpv ? (soma.checkouts / soma.lpv) * 100 : null,
    checkout_para_compra: soma.checkouts ? (soma.compras / soma.checkouts) * 100 : null,
    cpa: soma.compras ? soma.gasto / soma.compras : null,
    campanhas: bons.length,
  };
}

// ——— Alertas: regras que pedem uma decisão sua ———

export function montarAlertas(dados) {
  const alertas = [];
  const regua = reguaHistorica(dados.historico);

  const campanhasAtivas = (dados.campanhas || []).filter((c) => c.ativo);
  const conjuntosAtivos = campanhasAtivas.flatMap((c) => c.conjuntos.filter((cj) => cj.ativo));
  const anunciosAtivos = conjuntosAtivos.flatMap((cj) => cj.anuncios.filter((a) => a.ativo));

  if (!campanhasAtivas.length) {
    alertas.push({
      nivel: "info",
      titulo: "Nenhuma campanha rodando",
      texto: "A conta não está gastando nada agora. Enquanto estiver assim, o painel só mostra histórico.",
    });
    return alertas;
  }

  for (const c of campanhasAtivas) {
    const idade = horas(c.comecou_em || c.criada_em);
    if (idade !== null && idade < 48) {
      alertas.push({
        nivel: "info",
        titulo: "Campanha em aprendizado: " + c.nome.split("|")[0].trim(),
        texto:
          "Subiu há " +
          (idade < 1 ? Math.round(idade * 60) + " minutos" : Math.round(idade) + " horas") +
          ". Nas primeiras 48 horas o Meta ainda está testando quem responde melhor: os números oscilam e pausar ou editar agora reinicia esse aprendizado. O certo é não mexer.",
      });
    }
  }

  for (const cj of conjuntosAtivos) {
    const m = cj.metricas;
    if (m.gasto >= 50 && m.compras === 0) {
      alertas.push({
        nivel: "critico",
        titulo: "Conjunto gastou sem vender: " + cj.nome.split("|")[0].trim(),
        texto:
          "Já foram " + brl(m.gasto) + " e nenhuma venda atribuída. Sua regra é pausar o conjunto ao bater R$ 100 sem venda" +
          (m.gasto >= 100 ? " — esse limite já foi ultrapassado." : ". Acompanhe de perto."),
      });
    }
    if (m.frequencia > METAS.frequencia.limite && m.impressoes > 2000) {
      alertas.push({
        nivel: "atencao",
        titulo: "Público cansando: " + cj.nome.split("|")[0].trim(),
        texto:
          "Cada pessoa já viu o anúncio " +
          m.frequencia.toFixed(1) +
          " vezes. Quando passa de 2,5, o custo sobe porque você está insistindo com quem já decidiu que não. Troque o criativo ou amplie o público.",
      });
    }
    if (cj.orcamento_dia && cj.hoje.gasto === 0 && horas(cj.criado_em) > 6) {
      alertas.push({
        nivel: "atencao",
        titulo: "Conjunto ativo sem gastar: " + cj.nome.split("|")[0].trim(),
        texto: "Está ligado mas não gastou nada hoje. Costuma ser público pequeno demais, lance baixo ou anúncio em análise.",
      });
    }
  }

  for (const a of anunciosAtivos) {
    const m = a.metricas;
    if (m.impressoes >= 1000 && m.ctr !== null && m.ctr < 1) {
      alertas.push({
        nivel: "atencao",
        titulo: "Criativo fraco: " + a.nome.split("|").slice(-1)[0].trim(),
        texto:
          "CTR de " + pct(m.ctr, 2) + " em " + m.impressoes.toLocaleString("pt-BR") +
          " aparições. Sua regra é pausar anúncio abaixo de 1% depois de 1.000 impressões — esse já passou do ponto.",
      });
    }
  }

  const p = dados.periodo;
  if (p.gasto > 100 && p.roas !== null && p.roas < 1) {
    alertas.push({
      nivel: "critico",
      titulo: "Está saindo mais dinheiro do que entrando",
      texto:
        "No período, " + brl(p.gasto) + " investidos trouxeram " + brl(p.receita) +
        " em vendas (ROAS " + p.roas.toFixed(2) + "). Abaixo de 1 cada dia de anúncio aumenta o prejuízo.",
    });
  }

  // O diagnóstico mais útil: separar problema de anúncio de problema de página.
  if (regua && p.checkouts >= 10) {
    const taxa = (p.compras / p.checkouts) * 100;
    if (regua.checkout_para_compra && taxa < regua.checkout_para_compra * 0.5) {
      alertas.push({
        nivel: "critico",
        titulo: "O problema não é o anúncio — é o checkout",
        texto:
          "De " + p.checkouts + " pessoas que abriram o pagamento, " +
          (p.compras === 1 ? "só 1 comprou" : "só " + p.compras + " compraram") + " (" + pct(taxa) +
          "). Nas suas campanhas antigas essa passagem era de " + pct(regua.checkout_para_compra) +
          ". Quem chega ao pagamento e desiste não é problema de criativo: é preço, forma de pagamento, confiança na página ou algo quebrado no checkout.",
      });
    }
  }

  const ordem = { critico: 0, atencao: 1, info: 2 };
  return alertas.sort((a, b) => ordem[a.nivel] - ordem[b.nivel]);
}

// ——— O texto de abertura: "o que está acontecendo agora" ———

export function montarLeitura(dados) {
  const ativas = (dados.campanhas || []).filter((c) => c.ativo);
  const conjuntosAtivos = ativas.flatMap((c) => c.conjuntos.filter((cj) => cj.ativo));
  const orcamentoDia = conjuntosAtivos.reduce((s, cj) => s + (cj.orcamento_dia || 0), 0);
  const hoje = dados.hoje;
  const p = dados.periodo;
  const regua = reguaHistorica(dados.historico);
  const linhas = [];

  if (!ativas.length) {
    return {
      estado: "parado",
      titulo: "Nada rodando agora",
      linhas: [
        "Nenhuma campanha está ativa, então a conta não está gastando nem vendendo por anúncio neste momento.",
        dados.historico?.length
          ? "O que aparece abaixo é o histórico: serve para você comparar a próxima campanha com o que já deu certo aqui dentro."
          : "Assim que uma campanha subir, este painel passa a mostrar o que está acontecendo.",
      ],
    };
  }

  const nomes = ativas.map((c) => c.nome.split("|")[0].trim()).join(" e ");
  const maisNova = ativas
    .map((c) => ({ c, h: horas(c.comecou_em || c.criada_em) }))
    .filter((x) => x.h !== null)
    .sort((a, b) => a.h - b.h)[0];

  linhas.push(
    ativas.length === 1
      ? "Você tem 1 campanha no ar (" + nomes + "), com " + conjuntosAtivos.length + " conjuntos e orçamento de " + brl(orcamentoDia) + " por dia."
      : "Você tem " + ativas.length + " campanhas no ar (" + nomes + "), somando " + conjuntosAtivos.length + " conjuntos e " + brl(orcamentoDia) + " por dia.",
  );

  // Ritmo do gasto: comparo o que já saiu hoje com o quanto do dia já passou.
  const fracao = fracaoDoDia();
  const esperado = orcamentoDia * fracao;
  if (orcamentoDia > 0) {
    const ritmo = esperado > 0 ? hoje.gasto / esperado : 0;
    const texto =
      "Hoje já foram " + brl(hoje.gasto) + " de " + brl(orcamentoDia) + " previstos para o dia" +
      (ritmo > 1.25
        ? " — está gastando mais rápido que o normal para esta hora, o orçamento deve acabar antes da noite."
        : ritmo < 0.5 && fracao > 0.3
          ? " — está gastando devagar para esta hora, sinal de público apertado ou anúncio disputando pouco."
          : " — ritmo normal para esta hora do dia.");
    linhas.push(texto);
  }

  if (maisNova && maisNova.h < 48) {
    linhas.push(
      "A campanha " + maisNova.c.nome.split("|")[0].trim() + " subiu há " +
        (maisNova.h < 1 ? Math.round(maisNova.h * 60) + " minutos" : Math.round(maisNova.h) + " horas") +
        ", então ainda está em aprendizado. Números de menos de 48 horas não decidem nada: espere acumular pelo menos 1.000 aparições por anúncio antes de julgar.",
    );
  }

  if (hoje.compras > 0) {
    linhas.push(
      "Hoje saíram " + hoje.compras + (hoje.compras === 1 ? " venda" : " vendas") + " (" + brl(hoje.receita) +
        "), a um custo de " + brl(hoje.cpa) + " por venda. " +
        (hoje.cpa <= METAS.cpa.alvo
          ? "Está dentro da sua meta de R$ 25 por venda."
          : hoje.cpa <= METAS.cpa.limite
            ? "Acima da meta de R$ 25, mas ainda abaixo do teto de R$ 40."
            : "Acima do teto de R$ 40: nesse preço a venda não se paga."),
    );
  } else if (hoje.gasto > 0) {
    const fase = hoje.checkouts > 0 ? "Já teve " + hoje.checkouts + " pessoa(s) abrindo o pagamento, então o caminho está funcionando — falta fechar." : hoje.lpv > 0 ? "Gente já chegou na página (" + hoje.lpv + " visitas), mas ninguém abriu o pagamento ainda." : "Ainda ninguém chegou na página de venda hoje.";
    linhas.push("Nenhuma venda registrada hoje. " + fase);
  }

  // Onde o funil está vazando, comparado com a régua da própria conta.
  if (regua && p.cliques > 30) {
    const taxas = [
      { nome: "do clique até abrir a página", atual: p.cliques ? (p.lpv / p.cliques) * 100 : null, ref: regua.clique_para_lpv, culpa: "a página está demorando para abrir ou o link está pesado no celular" },
      { nome: "da página até o pagamento", atual: p.lpv ? (p.checkouts / p.lpv) * 100 : null, ref: regua.lpv_para_checkout, culpa: "a página de venda não está convencendo: oferta, preço ou botão de compra" },
      { nome: "do pagamento até a compra", atual: p.checkouts ? (p.compras / p.checkouts) * 100 : null, ref: regua.checkout_para_compra, culpa: "o checkout está travando ou o preço final assusta na hora de pagar" },
    ].filter((t) => t.atual !== null && t.ref);

    const pior = taxas.map((t) => ({ ...t, razao: t.atual / t.ref })).sort((a, b) => a.razao - b.razao)[0];
    if (pior && pior.razao < 0.6) {
      linhas.push(
        "O maior vazamento está na passagem " + pior.nome + ": hoje " + pct(pior.atual) +
          " contra " + pct(pior.ref) + " das suas campanhas antigas. Provável causa: " + pior.culpa + ".",
      );
    } else if (pior && pior.razao >= 0.9) {
      linhas.push("O funil está passando em todas as etapas em linha com o histórico da conta — nenhuma etapa está vazando de forma anormal.");
    }
  }

  const estado = p.roas !== null && p.gasto > 100 ? (p.roas >= METAS.roas.alvo ? "bom" : p.roas >= 1 ? "atencao" : "ruim") : "aprendendo";

  return {
    estado,
    titulo:
      estado === "bom" ? "Campanha no azul" :
      estado === "atencao" ? "Rodando, mas ainda não se paga" :
      estado === "ruim" ? "Gastando mais do que vendendo" :
      "No ar, ainda juntando dados",
    linhas,
  };
}
