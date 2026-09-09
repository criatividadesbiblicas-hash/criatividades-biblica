// Dados estaticos da landing /plano-anual. Modulo SEM "use client": lido pelo servidor (page.js)
// e importado pelos testes. Imagens: paginas reais dos PDFs (ver public/plano-anual/*.webp.json).

export const KIWIFY_URL = "https://pay.kiwify.com.br/kuUKSBr";

export const OFERTA = {
  de: "R$ 1.164,00",
  por: "R$ 597,00",
  parcela: "12x de R$ 61,74",
  precoNumero: 597,
};

// Roda das historias: 8 capas Kids, SEM numero e SEM ordem de calendario (decisao da Thali, 2026-09-09).
export const HISTORIAS = [
  { slug: "semeador", nome: "Parábola do Semeador", estudos: 4, src: "/plano-anual/capa-semeador.webp" },
  { slug: "zaqueu", nome: "Jesus e Zaqueu", estudos: 5, src: "/plano-anual/capa-zaqueu.webp" },
  { slug: "arca", nome: "Arca de Noé", estudos: 4, src: "/plano-anual/capa-arca.webp" },
  { slug: "filho-prodigo", nome: "Filho Pródigo", estudos: 4, src: "/plano-anual/capa-filho-prodigo.webp" },
  { slug: "fornalha", nome: "Na Fornalha", estudos: 4, src: "/plano-anual/capa-fornalha.webp" },
  { slug: "ovelha-perdida", nome: "Ovelha Perdida", estudos: 5, src: "/plano-anual/capa-ovelha-perdida.webp" },
  { slug: "adao-e-eva", nome: "Adão e Eva", estudos: 4, src: "/plano-anual/capa-adao-e-eva.webp" },
  { slug: "dez-leprosos", nome: "Dez Leprosos", estudos: 4, src: "/plano-anual/capa-dez-leprosos.webp" },
];

// "Um mes por dentro": os 4 domingos da Arca (mesmos textos aprovados na landing do Pack).
export const AULAS_ARCA = [
  { n: 1, titulo: "Noé, o obediente", texto: "Todo mundo desobedecia. Noé ouviu e construiu um barco no seco, sem nunca ter visto chuva.", licao: "Obedecer é um jeito de amar a Deus.", verso: "Noé fez tudo exatamente como Deus lhe havia ordenado.", ref: "Gênesis 6:22", img: "/arca-de-noe/quadro-noe.webp" },
  { n: 2, titulo: "A obediência me protege", texto: "Quem entrou na arca ficou seguro. Ouvir Deus, os pais e a professora é lugar de cuidado.", licao: "Obedecer protege.", verso: "E o Senhor fechou a porta.", ref: "Gênesis 7:16", img: "/arca-de-noe/quadro-40dias.webp" },
  { n: 3, titulo: "Esperando com paciência", texto: "A chuva parou, a terra apareceu, e Noé ainda esperou a ordem de Deus pra abrir a porta.", licao: "Obedecer também é saber esperar.", verso: "Noé esperou mais sete dias.", ref: "Gênesis 8:10", img: "/arca-de-noe/quadro-pomba.webp" },
  { n: 4, titulo: "Precisamos ouvir e obedecer", texto: "O arco-íris é a promessa de um Deus que cumpre o que fala. Ouvir e fazer, junto.", licao: "Deus cumpre o que promete.", verso: "Se vocês me amam, obedecerão aos meus mandamentos.", ref: "João 14:15", img: "/arca-de-noe/quadro-arcoiris.webp" },
];

// "O que chega todo mes": leques misturando historias pra mostrar variedade.
export const PECAS = [
  { titulo: "Apostila da professora", texto: "Todos os estudos do mês com a fala escrita em linguagem de criança: roda de conversa, curiosidade bíblica, hora da história, aplicação, brincadeira e oração. Você lê, adapta e conduz.", imagens: ["/arca-de-noe/apostila-1.webp", "/plano-anual/semeador-apostila.webp", "/arca-de-noe/apostila-3.webp", "/arca-de-noe/apostila-4.webp", "/arca-de-noe/apostila-5.webp"], grande: true },
  { titulo: "Quadro de história", texto: "Lâminas grandes pra contar mostrando. A criança vê a cena enquanto ouve, e a história gruda.", imagens: ["/plano-anual/semeador-quadro.webp", "/arca-de-noe/quadro-noe.webp", "/plano-anual/prodigo-quadro.webp", "/arca-de-noe/quadro-animais.webp", "/arca-de-noe/quadro-arcoiris.webp"] },
  { titulo: "Atividades das crianças", texto: "Uma folha por estudo, em cada faixa. Pintar, recortar, colar, montar. A mão trabalha e a lição fica.", imagens: ["/arca-de-noe/ativ-kids-1.webp", "/plano-anual/zaqueu-atividade.webp", "/arca-de-noe/ativ-junior-2.webp", "/arca-de-noe/ativ-kids-3.webp", "/arca-de-noe/ativ-junior-4.webp"] },
  { titulo: "Versículo pra parede", texto: "O versículo do mês em cartaz. No Júnior, um por estudo. Decorar vira parte da sala.", imagens: ["/arca-de-noe/versiculo-junior-1.webp", "/arca-de-noe/versiculo-kids.webp", "/plano-anual/prodigo-versiculo.webp"], paisagem: true },
  { titulo: "Lembrancinha", texto: "Em papel 180g. A criança sai da aula com a história na mão e conta em casa.", imagens: ["/arca-de-noe/lembranca.webp", "/plano-anual/prodigo-lembranca.webp"], paisagem: true },
  { titulo: "Carta pra família", texto: "Uma página explicando o que a criança aprendeu no mês e como continuar em casa. A aula não termina no domingo.", imagens: ["/arca-de-noe/querida-familia.webp", "/plano-anual/zaqueu-familia.webp"], largo: true },
];

export const ANOTACOES = [
  { lado: "esq", titulo: "A rotina da aula", texto: "Acolhimento, louvor, Bíblia, fixação e comunhão. Você sabe o que vem depois." },
  { lado: "dir", titulo: "O objetivo em uma frase", texto: "O que a criança precisa sair sabendo." },
  { lado: "esq", titulo: "A roda de conversa escrita", texto: "Em linguagem de criança. Você lê, adapta e conduz." },
  { lado: "dir", titulo: "As instruções em vermelho", texto: "Quando cantar, quando ler o balão, quando mostrar a figura." },
  { lado: "esq", titulo: "O versículo do mês", texto: "Entra aqui, com a explicação certa pra idade." },
];

// "Tres faixas, uma historia": a Hora da Historia do Estudo 1 da Arca nas tres apostilas.
// Os trechos abaixo sao TRANSCRITOS das paginas renderizadas (conferir na Task 1, Step 2) — nao inventar.
export const FAIXAS = [
  { faixa: "Baby", idade: "1 a 3 anos", src: "/plano-anual/arca-baby-hora.webp", trecho: "A Bíblia conta que o mundo estava fazendo coisas que deixou o coração de Deus triste, porque as pessoas estavam desobedecendo muito a Deus." },
  { faixa: "Kids", idade: "4 a 6 anos", src: "/plano-anual/arca-kids-hora.webp", trecho: "A Bíblia conta que o mundo ficou cheio de pecado, porque as pessoas estavam desobedecendo muito a Deus." },
  { faixa: "Júnior", idade: "7 a 10 anos", src: "/plano-anual/arca-junior-hora.webp", trecho: "Mas ele escolheu fazer o certo e obedeceu a Deus, mesmo quando ninguém ao seu redor fazia isso." },
];

// Depoimentos REAIS enviados pela Thali. Enquanto vazio, a secao nao renderiza.
// Formato: { name: "Nome I.", iniciais: "NI", cor: "bg-pa-campo", role: "...", quote: "..." }
export const DEPOIMENTOS = [];

export const FAQ = [
  { q: "O que exatamente vem no Plano Anual?", a: "Doze histórias bíblicas, uma por mês, com o material completo de Kids (4 a 6 anos) e Júnior (7 a 10 anos): apostila da professora com todos os estudos, atividades, quadro de história, versículos, lembrancinha e carta pra família. E, de bônus, o material Baby (1 a 3 anos) das mesmas doze histórias." },
  { q: "Começo por qual história?", a: "Pela Parábola do Semeador. Todo assinante começa pela primeira história da trilha e recebe uma nova a cada mês, na ordem, independente do mês em que assinou." },
  { q: "Recebo tudo de uma vez?", a: "Não. A primeira história é liberada na hora e as outras chegam uma por mês, durante 12 meses. É assim que a igreja inteira acompanha a mesma história no mesmo mês." },
  { q: "Vou receber impresso?", a: "Não. O material é 100% digital, em PDF. Você imprime em casa, na igreja ou numa gráfica, só o que for usar." },
  { q: "Que papel eu uso pra imprimir?", a: "Quadro de história, versículo e lembrancinha ficam melhores em papel 180g. Atividades e apostila vão bem em sulfite comum." },
  { q: "Posso usar com toda a equipe da minha igreja?", a: "Sim, dentro do seu ministério. O que não pode é revender ou repassar os PDFs em grupos." },
  { q: "Já comprei um Pack avulso. E agora?", a: "Os Packs avulsos são histórias do Plano Anual vendidas separadas. Se você já tem alguma, ela vai aparecer de novo na sua trilha quando chegar o mês dela. O Plano compensa a partir da segunda história." },
  { q: "E depois dos 12 meses?", a: "Você continua com acesso a tudo que recebeu. Pra seguir recebendo histórias novas, é só renovar." },
  { q: "Tem garantia?", a: "Tem. 7 dias depois da compra pra pedir reembolso total, sem burocracia. É só mandar um e-mail." },
];
