// Dados da página /black-biblinho (Black Friday 2026). Módulo SEM "use client".
// Fonte da oferta: NOV26-BLACK — Brief, Camada 1 (fechada em 02/11/2026; VIP retirado em 12/11/2026).
// Fonte do inventário: pastas reais em F:/.../2 PLANO ANUAL/2025 e /2026 (lidas em 02/11 e 08/11).
// Toda capa é página 1 do PDF real (ver public/**/*.webp.json). Nada aqui é simulado.

// Checkout da Kiwify do produto "Black Biblinho · Acesso Total" (link mandado pela Thali em 20/11/2026).
export const KIWIFY_URL = "https://pay.kiwify.com.br/1SY5Uom";
// Sem pré-abertura e sem grupo VIP (decisões da Thali em 12/11 e 15/11/2026): a página vende
// desde a publicação, com um único preço, até o fim do prazo.
export const PLANO_ANUAL_URL = "/plano-anual";

export const OFERTA = {
  nome: "Black Biblinho · Acesso Total",
  por: "R$ 297",
  precoNumero: 297,
  parcela: "em até 12x",
  garantiaDias: 7,
  // Âncora honesta: o único preço público comparável. Não é "de X por Y" do mesmo produto.
  ancora: { produto: "Plano Anual 2026, no formato de sempre", preco: "R$ 597" },
  fim: "segunda, 30 de novembro, às 23h59",
  fimCurto: "30 de novembro",
};

// A conta do valor (pedido da Thali em 20/11): o que cada bloco custa separado, com os preços
// públicos de hoje. Plano Anual: página /plano-anual. História avulsa de 2025: packs na Kiwify
// (R$ 97 cada, Kids + Júnior). Emoções: página /emocoes. Planner: Kiwify. Nada inventado.
export const VALOR = [
  { item: "Plano Anual 2026, no formato de sempre", detalhe: "assinatura, uma história por mês", preco: 597 },
  { item: "4 histórias de 2025, uma a uma", detalhe: "R$ 97 cada pack, como vendemos hoje", preco: 388 },
  { item: "Jesus Cuida das Minhas Emoções", detalhe: "o estudo das 9 emoções", preco: 57.9 },
  { item: "Planner MI 2026 e plano de leitura", detalhe: "o Planner vendido de novembro a fevereiro", preco: 37.9 },
];
export const VALOR_TOTAL = VALOR.reduce((t, v) => t + v.preco, 0);
export const moeda = (n) => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

// Bloco 1 · Plano Anual 2026: 12 temas (11 histórias diferentes; Zaqueu volta em novembro).
// Fonte: prévia "Plano Anual, temas e estudos 2025-2026" (PDF de 20 páginas feito com a Thali em 19/11/2026,
// mandado por ela em 21/11 como fonte oficial). Dezembro (Josias) entra na lista e na conta, como na prévia,
// mas sem capa e com a etiqueta "em produção" até ela avisar que ficou pronto.
// `historia` é a chave pra contar histórias diferentes entre os dois anos.
export const PLANO_2026 = [
  { mes: "jan", tema: "Guarde seu coração", historia: "Parábola do Semeador", nome: "Parábola do Semeador", estudos: 4, junior: true, src: "/plano-anual/capa-semeador.webp" },
  { mes: "fev", tema: "Eu escolho ser amigo de Deus", historia: "Na Fornalha", nome: "Na Fornalha", estudos: 4, junior: true, src: "/plano-anual/capa-fornalha.webp" },
  { mes: "mar", tema: "Um encontro que muda o coração", historia: "Jesus e Zaqueu", nome: "Jesus e Zaqueu", estudos: 5, junior: true, src: "/plano-anual/capa-zaqueu.webp" },
  { mes: "abr", tema: "Aprendendo a obedecer", historia: "Arca de Noé", nome: "Arca de Noé", estudos: 4, junior: true, src: "/plano-anual/capa-arca.webp" },
  { mes: "mai", tema: "Sou especial para Deus", historia: "Adão e Eva", nome: "Adão e Eva", estudos: 5, junior: true, src: "/plano-anual/capa-adao-e-eva.webp" },
  { mes: "jun", tema: "O grande amor de Deus", historia: "Filho Pródigo", nome: "Filho Pródigo", estudos: 4, junior: true, src: "/plano-anual/capa-filho-prodigo.webp" },
  { mes: "jul", tema: "Aprendendo a ser grato", historia: "Dez Leprosos", nome: "Dez Leprosos", estudos: 4, junior: false, src: "/plano-anual/capa-dez-leprosos.webp" },
  { mes: "ago", tema: "O amor de Jesus por mim", historia: "Ovelha Perdida", nome: "Ovelha Perdida", estudos: 5, junior: false, src: "/plano-anual/capa-ovelha-perdida.webp" },
  { mes: "set", tema: "Lidando com as minhas emoções", historia: "Elias no Monte Carmelo", nome: "Elias no Monte Carmelo", estudos: 4, junior: false, src: "/plano-anual/capa-elias.webp" },
  { mes: "out", tema: "Crianças aprovadas por Deus", historia: "Daniel na cova dos leões", nome: "Daniel na cova dos leões", estudos: 4, junior: false, src: "/plano-anual/capa-daniel.webp" },
  { mes: "nov", tema: "As Cores da Salvação", historia: "Jesus e Zaqueu", nome: "As Cores da Salvação", estudos: 5, junior: false, src: "/plano-anual/capa-cores.webp" },
  { mes: "dez", tema: "Eu vivo o que a Bíblia diz", historia: "Rei Josias e o Livro Perdido", nome: "Rei Josias e o Livro Perdido", estudos: 4, junior: false, emProducao: true, nota: "entra na sua área de membros quando ficar pronto", src: null },
];

// Capas que giram na roda: os 11 temas de 2026 que já têm capa (dezembro entra quando a Thali fizer a capa).
export const RODA_2026 = PLANO_2026.filter((h) => h.src).map((h, i) => ({ slug: `h${i}-${h.mes}`, nome: h.nome, estudos: h.estudos, src: h.src }));

// Bloco 2 · Biblioteca 2025: as 4 histórias da versão anterior do Plano que entram na plataforma
// (decisão da Thali em 19/11/2026, na prévia): Adão e Eva, Arca, Daniel, Filho Pródigo e Semeador de 2025
// foram repaginados e ficam só na versão 2026. As 4 têm Baby, Kids e Júnior (a Criação tem a apostila
// "Aprendendo com a Criação, 7 a 10 anos"; confirmado na prévia que ela mandou em 21/11).
export const BIBLIOTECA_2025 = [
  { historia: "A Criação", tema: "Como tudo começou", nome: "A Criação", estudos: 7, junior: true, src: "/black-biblinho/capa-2025-criacao.webp" },
  { historia: "Ovelha Perdida", tema: "Jesus, o Bom Pastor", nome: "A Ovelha Perdida", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-ovelha-perdida.webp" },
  { historia: "Jesus anda sobre as águas", tema: "Medo e coragem", nome: "Jesus Anda sobre as Águas", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-aguas.webp" },
  { historia: "O Plano Perfeito, João 3.16", tema: "A salvação em João 3:16", nome: "O Plano Perfeito", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-plano-perfeito.webp" },
];

// Os 4 blocos que a compradora vê na área de membros (tudo liberado na hora).
export const BLOCOS = [
  {
    n: 1,
    titulo: "Plano Anual 2026",
    resumo: "12 temas, uma história bíblica por mês, com a aula pronta pra Baby e Kids em todos e Júnior em 6.",
    detalhe: "Apostila do professor com a fala escrita, quadro de história, atividades, versículo, lembrancinha e carta pra família. De janeiro a novembro, tudo pronto. Dezembro (Eu Vivo o que a Bíblia Diz, com a história do rei Josias) está em produção e entra na sua área de membros assim que ficar pronto.",
  },
  {
    n: 2,
    titulo: "Biblioteca 2025",
    resumo: "4 histórias da versão anterior do Plano, em bloco separado.",
    detalhe: "A Criação, Jesus, o Bom Pastor (Ovelha Perdida), Jesus anda sobre as águas e O Plano Perfeito, com Baby, Kids e Júnior. As outras histórias de 2025 foram repaginadas e estão no Plano Anual 2026.",
  },
  {
    n: 3,
    titulo: "Jesus Cuida das Minhas Emoções",
    resumo: "O estudo das 9 emoções, o mais pedido da casa.",
    detalhe: "9 cards com versículo, a história do Salmo 23 em 15 lâminas, a caixinha Pergunta ou Desafio, atividades em duas faixas e lembrancinhas. Mais de 890 famílias e professoras já usaram.",
  },
  {
    n: 4,
    titulo: "Planner Ministério Infantil 2026 e Plano de leitura anual",
    resumo: "Pra organizar o ano da sua turma e a sua leitura da Bíblia.",
    detalhe: "O Planner que a gente vende de novembro a fevereiro e o plano de leitura anual, em PDF, pra imprimir ou usar no celular.",
  },
];

// Números que puxam pra compra, todos reais (pedido dela em 09/11: nome curto e números que atraem).
// Mesma conta da prévia oficial (capa do PDF): 12 temas de 2026 (52 estudos, dezembro incluído, como ela
// decidiu em 19/11) + 4 histórias de 2025 (19 estudos) = 71 domingos e 16 séries.
export const DOMINGOS_2026 = PLANO_2026.reduce((t, h) => t + h.estudos, 0);
export const DOMINGOS_2025 = BIBLIOTECA_2025.reduce((t, h) => t + h.estudos, 0);
export const DOMINGOS = DOMINGOS_2026 + DOMINGOS_2025;
export const SERIES = PLANO_2026.length + BIBLIOTECA_2025.length;
export const NUMEROS = [
  { n: String(DOMINGOS), t: "domingos de aula pronta, com a fala do professor escrita" },
  { n: String(SERIES), t: "séries de estudo, uma história bíblica em cada" },
  { n: "3", t: "faixas: Baby, Kids e Júnior" },
  { n: "4", t: "blocos liberados na hora, em PDF" },
];

export const FAQ = [
  { q: "Recebo tudo na hora ou vai liberando aos poucos?", a: "Tudo na hora. Assim que o pagamento é aprovado, a Kiwify manda o acesso pro seu e-mail e os 4 blocos já estão liberados na área de membros. Só dezembro de 2026 (Eu Vivo o que a Bíblia Diz) entra depois, quando ficar pronto." },
  { q: "O material Júnior vem em todas as histórias?", a: "Não, e a gente prefere dizer antes. Em 2026 o Júnior (7 a 10 anos) existe em 6 dos 12 temas: Semeador, Fornalha, Zaqueu, Arca de Noé, Adão e Eva e Filho Pródigo. Na Biblioteca 2025, as 4 histórias têm as três faixas. Baby e Kids estão em todas." },
  { q: "A Biblioteca 2025 é a mesma coisa repetida?", a: "Não. É a versão anterior do Plano, com linguagem e diagramação de 2025, entregue em bloco separado, com 4 histórias: A Criação, Jesus, o Bom Pastor (Ovelha Perdida), Jesus anda sobre as águas e O Plano Perfeito. Só a Ovelha Perdida existe nos dois anos, com temas diferentes. As outras histórias de 2025 foram repaginadas e estão no Plano Anual 2026." },
  { q: "Já tenho o Jesus Cuida das Minhas Emoções. Compensa?", a: "O Emoções é 1 dos 4 blocos. Os outros 3 (Plano Anual 2026, Biblioteca 2025, Planner e plano de leitura) são novos pra você, e sozinho o Plano Anual 2026 custa R$ 597 no formato de sempre." },
  { q: "Sou assinante do Plano Anual. E agora?", a: "Fala com a gente no Direct do @criatividadesbiblicas antes de comprar. A gente olha o que você já recebeu e te diz, com sinceridade, se vale a pena." },
  { q: "E dezembro de 2026?", a: "O tema de dezembro é Eu Vivo o que a Bíblia Diz, com a história do rei Josias e o livro perdido. Está em produção e entra na sua área de membros assim que sair, sem pagar nada a mais. Novembro (As Cores da Salvação, com Zaqueu) já está pronto e liberado na hora." },
  { q: "Vai voltar depois do dia 30?", a: "Não. O Black Biblinho existe só nesta Black Friday, até 30 de novembro. Depois disso o Plano Anual volta ao formato de sempre, uma história por mês, e em 2027 o material é novo, com histórias que não estão aqui." },
  { q: "Vou receber impresso?", a: "Não. É 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar. Quadro de história, versículo e lembrancinha ficam melhores em papel 180g; apostila e atividades vão bem em sulfite comum." },
  { q: "Posso usar com a equipe da minha igreja?", a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos." },
  { q: "Tem garantia?", a: "Tem. 7 dias depois da compra pra pedir o reembolso total direto na Kiwify, a mesma plataforma do pagamento. Sem precisar explicar o motivo." },
  { q: "Moro num estado com fuso diferente. Até que horas vai?", a: "Fecha segunda, 30 de novembro, às 23h59 no horário de Brasília. No Acre, Amazonas e Mato Grosso, por exemplo, fecha mais cedo no relógio de casa." },
];
