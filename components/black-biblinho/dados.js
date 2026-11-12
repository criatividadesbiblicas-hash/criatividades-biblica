// Dados da página /black-biblinho (Black Friday 2026). Módulo SEM "use client".
// Fonte da oferta: NOV26-BLACK — Brief, Camada 1 (fechada em 02/11/2026).
// Fonte do inventário: pastas reais em F:/.../2 PLANO ANUAL/2025 e /2026 (lidas em 02/11 e 08/11).
// Toda capa é página 1 do PDF real (ver public/**/*.webp.json). Nada aqui é simulado.

// Checkout da Kiwify do produto "Black Biblinho · Acesso Total": a Thali cria o produto e manda
// o link. Enquanto não vier, fica este marcador (a página não publica com ele).
export const KIWIFY_URL = "https://pay.kiwify.com.br/SUBSTITUIR-black-biblinho";
// Link de convite do grupo VIP de WhatsApp (a Thali cria o grupo).
export const GRUPO_URL = "https://chat.whatsapp.com/SUBSTITUIR-grupo-vip";
export const PLANO_ANUAL_URL = "/plano-anual";

export const OFERTA = {
  nome: "Black Biblinho · Acesso Total",
  por: "R$ 297",
  precoNumero: 297,
  vip: "R$ 247",
  parcela: "em até 12x",
  garantiaDias: 7,
  // Âncora honesta: o único preço público comparável. Não é "de X por Y" do mesmo produto.
  ancora: { produto: "Plano Anual 2026, no formato de sempre", preco: "R$ 597" },
  abertura: "segunda, 23 de novembro",
  fim: "segunda, 30 de novembro, às 23h59",
  vipJanela: "de sexta 20 a domingo 22 de novembro",
};

// Bloco 1 · Plano Anual 2026: 11 temas (10 histórias diferentes; Zaqueu volta em novembro).
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
  { mes: "nov", tema: "As Cores da Salvação", historia: "Jesus e Zaqueu", nome: "As Cores da Salvação", estudos: 5, junior: false, emProducao: true, src: null },
];

// Capas que giram na roda: só as que existem (novembro ainda não tem capa Kids final).
export const RODA_2026 = PLANO_2026.filter((h) => h.src).map((h, i) => ({ slug: `h${i}-${h.mes}`, nome: h.nome, estudos: 4, src: h.src }));

// Bloco 2 · Biblioteca 2025: 9 histórias completas na versão anterior do Plano.
// Josias (2025) tem só o estudo 1, sem apostila: entra como nota, não como história.
// Júnior em 2025 só existe a partir da Arca (Criação e Adão e Eva: só Baby e Kids).
export const BIBLIOTECA_2025 = [
  { historia: "A Criação", nome: "A Criação, como tudo começou", estudos: 7, junior: false, src: "/black-biblinho/capa-2025-criacao.webp" },
  { historia: "Adão e Eva", nome: "Adão e Eva, identidade", estudos: 4, junior: false, src: "/black-biblinho/capa-2025-adao-e-eva.webp" },
  { historia: "Arca de Noé", nome: "Arca de Noé", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-arca.webp" },
  { historia: "Ovelha Perdida", nome: "Ovelha Perdida", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-ovelha-perdida.webp" },
  { historia: "Daniel na cova dos leões", nome: "Daniel na cova dos leões", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-daniel.webp" },
  { historia: "Filho Pródigo", nome: "Filho Pródigo", estudos: 5, junior: true, src: "/black-biblinho/capa-2025-filho-prodigo.webp" },
  { historia: "Jesus anda sobre as águas", nome: "Jesus anda sobre as águas", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-aguas.webp" },
  { historia: "O Plano Perfeito, João 3.16", nome: "O Plano Perfeito, João 3.16", estudos: 4, junior: true, src: "/black-biblinho/capa-2025-plano-perfeito.webp" },
  { historia: "Parábola do Semeador", nome: "Parábola do Semeador", estudos: 5, junior: true, src: "/black-biblinho/capa-2025-semeador.webp" },
];

// Os 4 blocos que a compradora vê na área de membros (tudo liberado na hora).
export const BLOCOS = [
  {
    n: 1,
    titulo: "Plano Anual 2026",
    resumo: "11 temas, uma história bíblica por mês, com a aula pronta pra Baby e Kids em todos e Júnior em 6.",
    detalhe: "Apostila do professor com a fala escrita, quadro de história, atividades, versículo, lembrancinha e carta pra família. Novembro (As Cores da Salvação) está em produção e dezembro (Natal) ainda vai ser feito: os dois entram na sua área de membros assim que ficarem prontos.",
  },
  {
    n: 2,
    titulo: "Biblioteca 2025",
    resumo: "9 histórias completas da versão anterior do Plano, em bloco separado.",
    detalhe: "Baby e Kids em todas, Júnior em 7. Seis dessas histórias também existem em 2026, em versão diferente: você escolhe a que combina mais com a sua turma. Inclui ainda o estudo 1 da série do Rei Josias.",
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
// Domingos = soma dos estudos prontos: 2026 sem novembro (em produção) + Biblioteca 2025.
// Josias (2025, só o estudo 1) não conta nem como história nem como domingo.
export const DOMINGOS_2026 = PLANO_2026.filter((h) => !h.emProducao).reduce((t, h) => t + h.estudos, 0);
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
  { q: "Recebo tudo na hora ou vai liberando aos poucos?", a: "Tudo na hora. Assim que o pagamento é aprovado, a Kiwify manda o acesso pro seu e-mail e os 4 blocos já estão liberados na área de membros. Só novembro e dezembro de 2026 entram depois, quando ficarem prontos." },
  { q: "O material Júnior vem em todas as histórias?", a: "Não, e a gente prefere dizer antes. Em 2026 o Júnior (7 a 10 anos) existe em 6 dos 11 temas: Semeador, Fornalha, Zaqueu, Arca de Noé, Adão e Eva e Filho Pródigo. Em 2025, existe da Arca em diante (7 das 9 histórias). Baby e Kids estão em todas." },
  { q: "A Biblioteca 2025 é a mesma coisa repetida?", a: "Não. É a versão anterior do Plano, com linguagem e diagramação de 2025, entregue em bloco separado. Seis histórias existem nos dois anos (Semeador, Arca, Adão e Eva, Filho Pródigo, Ovelha Perdida e Daniel), em versões diferentes. As outras quatro só existem em 2025: Criação, Jesus anda sobre as águas, O Plano Perfeito e o estudo 1 de Josias." },
  { q: "Já tenho o Jesus Cuida das Minhas Emoções. Compensa?", a: "O Emoções é 1 dos 4 blocos. Os outros 3 (Plano Anual 2026, Biblioteca 2025, Planner e plano de leitura) são novos pra você, e sozinho o Plano Anual 2026 custa R$ 597 no formato de sempre." },
  { q: "Sou assinante do Plano Anual. E agora?", a: "Fala com a gente no Direct do @criatividadesbiblicas antes de comprar. A gente olha o que você já recebeu e te diz, com sinceridade, se vale a pena." },
  { q: "E novembro e dezembro de 2026?", a: "Novembro (As Cores da Salvação, com Zaqueu) está em produção. Dezembro (Natal) ainda vai ser feito. Os dois entram na sua área de membros assim que saírem, sem pagar nada a mais." },
  { q: "Vai voltar depois do dia 30?", a: "Não. O Black Biblinho existe só nesta Black Friday, de 23 a 30 de novembro. Depois disso o Plano Anual volta ao formato de sempre, uma história por mês, e em 2027 o material é novo, com histórias que não estão aqui." },
  { q: "Vou receber impresso?", a: "Não. É 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar. Quadro de história, versículo e lembrancinha ficam melhores em papel 180g; apostila e atividades vão bem em sulfite comum." },
  { q: "Posso usar com a equipe da minha igreja?", a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos." },
  { q: "Tem garantia?", a: "Tem. 7 dias depois da compra pra pedir o reembolso total direto na Kiwify, a mesma plataforma do pagamento. Sem precisar explicar o motivo." },
  { q: "Moro num estado com fuso diferente. Até que horas vai?", a: "Fecha segunda, 30 de novembro, às 23h59 no horário de Brasília. No Acre, Amazonas e Mato Grosso, por exemplo, fecha mais cedo no relógio de casa." },
];
