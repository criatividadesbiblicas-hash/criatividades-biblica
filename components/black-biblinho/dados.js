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

// A conta do valor (pedido da Thali em 20/11): o que cada parte custa separado, com os preços
// públicos de hoje. Plano Anual: página /plano-anual. História avulsa de 2025: packs na Kiwify
// (R$ 97 cada, Kids + Júnior). Emoções: página /emocoes. Nada inventado.
// 21/11: o Planner 2026 saiu da oferta (não faz sentido liberar um planner de 2026); o Planner 2027,
// em produção, entra de bônus quando ficar pronto e por isso fica FORA da soma.
export const VALOR = [
  { item: "Plano Anual 2026, no formato de sempre", detalhe: "assinatura, uma história por mês", preco: 597 },
  { item: "4 histórias de 2025, uma a uma", detalhe: "R$ 97 cada pack, como vendemos hoje", preco: 388 },
  { item: "Jesus Cuida das Minhas Emoções", detalhe: "o estudo das 9 emoções", preco: 57.9 },
];
export const VALOR_TOTAL = VALOR.reduce((t, v) => t + v.preco, 0);
export const BONUS = {
  nome: "Planner Ministério Infantil 2027",
  texto: "está sendo produzido e entra na sua área de membros assim que ficar pronto, sem pagar nada a mais",
};
export const moeda = (n) => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

// Bloco 1 · Plano Anual 2026: 12 temas (11 histórias diferentes; Zaqueu volta em novembro).
// Fonte: prévia "Plano Anual, temas e estudos 2025-2026" (PDF de 20 páginas feito com a Thali em 19/11/2026,
// mandado por ela em 21/11 como fonte oficial). Dezembro (Josias) entra na lista e na conta, como na prévia,
// mas sem capa e com a etiqueta "em produção" até ela avisar que ficou pronto.
// `historia` é a chave pra contar histórias diferentes entre os dois anos.
export const PLANO_2026 = [
  // Capas = página 1 da APOSTILA DO PROFESSOR Kids (pedido da Thali em 21/11; antes era a capa das atividades).
  // Zaqueu (mar) não tem apostila do professor em PDF único (estudos em arquivos separados, sem capa): fica a das atividades.
  { mes: "jan", tema: "Guarde seu coração", historia: "Parábola do Semeador", nome: "Parábola do Semeador", estudos: 4, junior: true, src: "/plano-anual/capa-prof-semeador.webp" },
  { mes: "fev", tema: "Eu escolho ser amigo de Deus", historia: "Na Fornalha", nome: "Na Fornalha", estudos: 4, junior: true, src: "/plano-anual/capa-prof-fornalha.webp" },
  { mes: "mar", tema: "Um encontro que muda o coração", historia: "Jesus e Zaqueu", nome: "Jesus e Zaqueu", estudos: 5, junior: true, src: "/plano-anual/capa-zaqueu.webp" },
  { mes: "abr", tema: "Aprendendo a obedecer", historia: "Arca de Noé", nome: "Arca de Noé", estudos: 4, junior: true, src: "/plano-anual/capa-prof-arca.webp" },
  { mes: "mai", tema: "Sou especial para Deus", historia: "Adão e Eva", nome: "Adão e Eva", estudos: 5, junior: true, src: "/plano-anual/capa-prof-adao-e-eva.webp" },
  { mes: "jun", tema: "O grande amor de Deus", historia: "Filho Pródigo", nome: "Filho Pródigo", estudos: 4, junior: true, src: "/plano-anual/capa-prof-filho-prodigo.webp" },
  { mes: "jul", tema: "Aprendendo a ser grato", historia: "Dez Leprosos", nome: "Dez Leprosos", estudos: 4, junior: false, src: "/plano-anual/capa-prof-dez-leprosos.webp" },
  { mes: "ago", tema: "O amor de Jesus por mim", historia: "Ovelha Perdida", nome: "Ovelha Perdida", estudos: 5, junior: false, src: "/plano-anual/capa-prof-ovelha-perdida.webp" },
  { mes: "set", tema: "Lidando com as minhas emoções", historia: "Elias no Monte Carmelo", nome: "Elias no Monte Carmelo", estudos: 4, junior: false, src: "/plano-anual/capa-prof-elias.webp" },
  { mes: "out", tema: "Crianças aprovadas por Deus", historia: "Daniel na cova dos leões", nome: "Daniel na cova dos leões", estudos: 4, junior: false, src: "/plano-anual/capa-prof-daniel.webp" },
  { mes: "nov", tema: "As Cores da Salvação", historia: "Jesus e Zaqueu", nome: "As Cores da Salvação", estudos: 5, junior: false, src: "/plano-anual/capa-prof-cores.webp" },
  { mes: "dez", tema: "Eu vivo o que a Bíblia diz", historia: "Rei Josias e o Livro Perdido", nome: "Rei Josias e o Livro Perdido", estudos: 4, junior: false, emProducao: true, nota: "entra na sua área de membros quando ficar pronto", src: null },
];

// Capas que giram na roda: os 11 temas de 2026 que já têm capa (dezembro entra quando a Thali fizer a capa).
export const RODA_2026 = PLANO_2026.filter((h) => h.src).map((h, i) => ({ slug: `h${i}-${h.mes}`, nome: h.nome, estudos: h.estudos, src: h.src }));

// Bloco 2 · Biblioteca 2025: as 4 histórias da versão anterior do Plano que entram na plataforma
// (decisão da Thali em 19/11/2026, na prévia): Adão e Eva, Arca, Daniel, Filho Pródigo e Semeador de 2025
// foram repaginados e ficam só na versão 2026. As 4 têm Baby, Kids e Júnior (a Criação tem a apostila
// "Aprendendo com a Criação, 7 a 10 anos"; confirmado na prévia que ela mandou em 21/11).
export const BIBLIOTECA_2025 = [
  { historia: "A Criação", tema: "Como tudo começou", nome: "A Criação", estudos: 7, junior: true, src: "/black-biblinho/capa-prof-2025-criacao.webp" },
  { historia: "Ovelha Perdida", tema: "Jesus, o Bom Pastor", nome: "A Ovelha Perdida", estudos: 4, junior: true, src: "/black-biblinho/capa-prof-2025-ovelha-perdida.webp" },
  { historia: "Jesus anda sobre as águas", tema: "Medo e coragem", nome: "Jesus Anda sobre as Águas", estudos: 4, junior: true, src: "/black-biblinho/capa-prof-2025-aguas.webp" },
  { historia: "O Plano Perfeito, João 3.16", tema: "A salvação em João 3:16", nome: "O Plano Perfeito", estudos: 4, junior: true, src: "/black-biblinho/capa-prof-2025-plano-perfeito.webp" },
];

// O que a compradora vê na área de membros (tudo liberado na hora). Na página não se fala em "bloco"
// (pedido da Thali em 21/11: soa robótico); `n` serve só de chave.
export const BLOCOS = [
  {
    n: 1,
    titulo: "Plano Anual 2026",
    resumo: "12 temas, uma história bíblica por mês, com a aula pronta pra Baby e Kids em todos e Júnior em 6 deles.",
    detalhe: "Apostila do professor com a fala escrita, quadro de história, atividades, versículo para memorização, lembrança e o espaço Querida Família. De janeiro a novembro, tudo pronto. Dezembro (Eu Vivo o que a Bíblia Diz, com a história do rei Josias) está em produção e entra na sua área de membros assim que ficar pronto.",
  },
  {
    n: 2,
    titulo: "Biblioteca 2025",
    resumo: "4 histórias da versão anterior do Plano, numa pasta separada, com as 3 faixas etárias.",
    // 24/11 (Thali): sem "somando são 10 Júnior" e sem "as outras foram repaginadas"; só dizer as 3 faixas.
    detalhe: "A Criação, Jesus, o Bom Pastor (Ovelha Perdida), Jesus anda sobre as águas e O Plano Perfeito, todas com Baby, Kids e Júnior.",
  },
  {
    n: 3,
    titulo: "Jesus Cuida das Minhas Emoções",
    resumo: "O estudo das 9 emoções, o mais pedido da casa.",
    detalhe: "9 cards com versículo, a história do Salmo 23 em 15 lâminas, a caixinha Pergunta ou Desafio, atividades em duas faixas e lembranças. Mais de 1.000 famílias e professoras já usaram.",
  },
  {
    n: 4,
    titulo: "Plano de leitura anual",
    resumo: "Pra ler a Bíblia inteira em um ano, com a sua turma ou em casa.",
    detalhe: "Em PDF, pra imprimir ou usar no celular.",
  },
  // Bônus em destaque (pedido da Thali em 21/11): o Planner 2027 "Chamadas a Cuidar", já em produção,
  // entra na plataforma a qualquer momento pra quem comprar o Black Biblinho. Miolos reais da pasta do Planner.
  {
    n: 5,
    bonus: true,
    titulo: "Planner Ministério Infantil 2027",
    resumo: "Chamadas a Cuidar. Bônus de quem comprar o Black Biblinho: já está em produção e entra na sua área de membros a qualquer momento.",
    // Páginas internas reais (miolos da pasta do Planner, renderizados em 24/11 a pedido da Thali).
    paginas: [
      { src: "/black-biblinho/planner-minha-turma.webp", nome: "Minha turma" },
      { src: "/black-biblinho/planner-plano-de-aula.webp", nome: "Plano de aula" },
      { src: "/black-biblinho/planner-ideias-do-ano.webp", nome: "Ideias pro ano todo" },
      { src: "/black-biblinho/planner-culto-kids.webp", nome: "Plano do culto kids" },
      { src: "/black-biblinho/planner-equipe.webp", nome: "Equipe do ministério" },
    ],
    detalhe: "Pra organizar o ano do ministério: minha turma, lista de presença, escala, planejamento de aula e do mês, culto kids, equipe, reunião, financeiro e anotações. Em PDF, pra imprimir ou usar no tablet.",
  },
];

// Números que puxam pra compra, todos reais (pedido dela em 09/11: nome curto e números que atraem).
// Mesma conta da prévia oficial (capa do PDF): 12 temas de 2026 (52 estudos, dezembro incluído, como ela
// decidiu em 19/11) + 4 histórias de 2025 (19 estudos) = 71 domingos e 16 séries.
export const DOMINGOS_2026 = PLANO_2026.reduce((t, h) => t + h.estudos, 0);
export const DOMINGOS_2025 = BIBLIOTECA_2025.reduce((t, h) => t + h.estudos, 0);
export const DOMINGOS = DOMINGOS_2026 + DOMINGOS_2025;
export const SERIES = PLANO_2026.length + BIBLIOTECA_2025.length;
// 24/11 (Thali): "o total do Júnior, temos 10 materiais" = 6 temas de 2026 + 4 histórias da Biblioteca 2025.
export const JUNIOR = PLANO_2026.filter((h) => h.junior).length + BIBLIOTECA_2025.filter((h) => h.junior).length;
export const NUMEROS = [
  { n: String(DOMINGOS), t: "domingos de aula pronta, com a fala do professor escrita" },
  { n: String(SERIES), t: "séries de estudo, uma história bíblica em cada" },
  { n: String(JUNIOR), t: "materiais Júnior, pra turma de 7 a 9 anos" },
  { n: "12", t: "temas do Plano Anual 2026, uma história bíblica por mês" },
];

export const FAQ = [
  { q: "Recebo tudo na hora ou vai liberando aos poucos?", a: "Tudo na hora. Assim que o pagamento é aprovado, a Kiwify manda o acesso pro seu e-mail e tudo já está liberado na área de membros. Só dezembro de 2026 (Eu Vivo o que a Bíblia Diz) e o Planner 2027 entram depois, quando ficarem prontos." },
  { q: "Quantos materiais Júnior vêm no Acesso Total?", a: "São 10 materiais Júnior (7 a 9 anos). Seis são do Plano Anual 2026: Semeador, Fornalha, Zaqueu, Arca de Noé, Adão e Eva e Filho Pródigo. Os outros quatro são da Biblioteca 2025: A Criação, Ovelha Perdida, Jesus anda sobre as águas e O Plano Perfeito. Baby e Kids estão em todas as histórias." },
  { q: "A Biblioteca 2025 é a mesma coisa repetida?", a: "Não. É a versão anterior do Plano, com linguagem e diagramação de 2025, entregue numa pasta separada, com 4 histórias: A Criação, Jesus, o Bom Pastor (Ovelha Perdida), Jesus anda sobre as águas e O Plano Perfeito. Só a Ovelha Perdida existe nos dois anos, com temas diferentes. As 4 vêm com as 3 faixas etárias." },
  { q: "Já tenho o Jesus Cuida das Minhas Emoções. Compensa?", a: "O Emoções é uma parte. O Plano Anual 2026, a Biblioteca 2025 e o plano de leitura são novos pra você, e sozinho o Plano Anual 2026 custa R$ 597 no formato de sempre." },
  { q: "Sou assinante do Plano Anual. E agora?", a: "Fala com a gente no Direct do @criatividadesbiblicas antes de comprar. A gente olha o que você já recebeu e te diz, com sinceridade, se vale a pena." },
  { q: "E dezembro de 2026 e o Planner 2027?", a: "Os dois estão em produção e entram na sua área de membros assim que saírem, sem pagar nada a mais. O tema de dezembro é Eu Vivo o que a Bíblia Diz, com a história do rei Josias e o livro perdido. O Planner Ministério Infantil 2027 é bônus de quem comprar o Black Biblinho. Novembro (As Cores da Salvação, com Zaqueu) já está pronto e liberado na hora." },
  { q: "Vai voltar depois do dia 30?", a: "Não. O Black Biblinho existe só nesta Black Friday, até 30 de novembro. Depois disso o Plano Anual volta ao formato de sempre, uma história por mês, e em 2027 o material é novo, com histórias que não estão aqui." },
  { q: "Vou receber impresso?", a: "Não. É 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar." },
  { q: "Posso usar com a equipe da minha igreja?", a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos." },
  { q: "Tem garantia?", a: "Tem. 7 dias depois da compra pra pedir o reembolso total direto na Kiwify, a mesma plataforma do pagamento. Sem precisar explicar o motivo." },
  { q: "Moro num estado com fuso diferente. Até que horas vai?", a: "Fecha segunda, 30 de novembro, às 23h59 no horário de Brasília. No Acre, Amazonas e Mato Grosso, por exemplo, fecha mais cedo no relógio de casa." },
];
