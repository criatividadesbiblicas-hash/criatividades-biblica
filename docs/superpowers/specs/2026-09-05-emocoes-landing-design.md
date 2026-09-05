# Landing page /emocoes — análise e design

Data: 2026-09-05. Página-alvo: https://www.criatividadesbiblicas.com.br/emocoes (hoje em GreatPages).
Destino: rota `/emocoes` no projeto Next.js `criatividades-biblicas` (Vercel, deploy por push na `main`).

## 1. Análise da página atual

### O produto
"Jesus Cuida das Minhas Emoções" é um **estudo único digital** (PDFs pra imprimir), vendido por
**R$ 47** (de R$ 67) via Kiwify (`pay.kiwify.com.br/gnhrmc2`). Conteúdo real (conferido nos PDFs):

| Peça | Páginas | O que é |
|---|---|---|
| Cards das Emoções | 28 | 9 emoções (medo, tristeza, raiva, ansiedade, inveja, vergonha, repulsa, tédio, alegria), cada uma com versículo |
| Recurso visual Salmo 23 | 15 | História ilustrada, 1 lâmina por verso |
| Recurso visual (personagens) | 42 | Lâminas grandes pra contar a história |
| Plano de estudo e história | 9 | Roteiro: objetivo, versículo, dinâmica, louvores, encerramento |
| Caixa "Pergunta ou Desafio" | 14 | Caixinha pra montar + 20 fichas + gabarito |
| Atividades | 4 | 1 até 5 anos, 1 acima de 6 anos (cobrem todas as emoções) |
| Lembranças | 2 | Relógio + tag de pirulito |
| Orientações | 5 | Leitura exclusiva pra líderes e professores |
| Versículo de memorização | 1 + 4 | Padrão e ampliado (Salmos 145:20a) |
| Bônus versículos | 38 | Versículos ilustrados sobre emoções |

### Quem compra / pra quem
- **Quem decide e paga:** professora de EBD e ministério infantil, líder de célula de crianças, mãe cristã. Mulheres 25–55 (mesmo público das campanhas).
- **Quem usa:** a criança, dos pequenos (até 5) aos maiores (6+). O material fala com os dois públicos, e a página precisa também.
- **Momento:** Setembro Amarelo e a viralização do tema no TikTok (423k plays num vídeo sobre emoções) fazem desse produto a maior porta de entrada da marca, apesar de ser degrau 3 na escada de ofertas.

### Logo e imagens
- Logo do estudo: Jesus abraçando crianças + lettering "JESUS / cuida das minhas / EMOÇÕES" multicolor. O site serve em **400 px**; existe em 4419×6250.
- Mascote Biblinho + logo Criatividades Bíblicas (já no projeto novo).
- Mockup do livro (capa roxa de bolinhas) em 334 px; existe em 1410×2250.
- Personagens das emoções (cliparts Meryta, licença ok) usados em 3 recortes pequenos; existem em ~600–1100 px, todos os 9.
- Fotos das 4 professoras dos depoimentos (já em `public/depoimentos`).
- Vídeo YouTube `FdGA8e4ri7I` (mantido).

### O que está errado hoje
1. **Copy genérica e fora de foco.** "Estudo inovador e completo", "ferramenta perfeita". Os benefícios listados são de adulto corporativo ("aumento da produtividade", "organização e controle do tempo"), não de criança.
2. **Não mostra o produto.** As 9 emoções, o maior ativo, não aparecem. A lista "o que você encontrará" é texto puro; nenhuma prévia real.
3. **Fora da marca.** Azul-petróleo `#012f3f` + laranja `#e73912`, Montserrat/Roboto. Nada a ver com o site novo (Fraunces + Nunito, marfim).
4. **Imagens em baixa** (logo 400 px, livro 334 px) num produto cuja venda é visual.
5. **Preço escondido** até o fim; hero sem preço, sem garantia, sem "acesso imediato".
6. **Bloco "ATENÇÃO"** em caixa alta, tom de bronca, logo antes da compra.
7. **FAQ contradiz a entrega:** diz "login e senha por e-mail" e o bloco de atenção diz "não enviamos por e-mail".
8. Texto duplicado (OBS repetido), "um caixinha", título da seção "O QUE É ?" quebrado.

## 2. Direção de design (decidida)

- **Modo:** Persuade. Página de produto infantil, então vale a regra da memória: **viva, alegre, fundo claro, logo cheia em destaque, animação com bounce** (não a paleta contida do Plano Anual).
- **Mundo visual:** herda o site novo (Fraunces + Nunito, marfim, cacau, Nav/Footer, Reveal) e deixa **as cores do próprio produto liderarem**: cada emoção tem a cor do seu card (medo roxo, tristeza azul, raiva vermelho, ansiedade laranja, inveja verde-água, vergonha rosa, repulsa verde, tédio roxo-escuro, alegria amarelo) + o roxo de bolinhas da capa.
- **CTA único:** coral-deep do site (`#d6432e`), texto "Quero o estudo completo", repetido 4× (hero, meio, oferta, final).
- **Momento de motion autoral:** os personagens das 9 emoções flutuando com bounce escalonado no hero e uma faixa das emoções com wiggle no hover. Resto: Reveal suave. `prefers-reduced-motion` respeitado.
- **Prévias reais:** páginas dos PDFs rasterizadas (só as seguras; Atividade 1 e cards p.20+ têm Divertida Mente e ficam de fora).

## 3. Estrutura (preserva a ordem da página antiga)

1. Hero: logo do estudo + H1 + sub + CTA + linha de preço/garantia; livro + personagens flutuando.
2. Faixa das 9 emoções (nome + personagem + cor).
3. Por que falar de emoções (benefícios de criança) + vídeo (facade, carrega no clique).
4. O que vem dentro (a estrela): bento com prévias reais das 9 peças.
5. Como funciona em 3 passos.
6. Onde usar (EBD, célula, escola cristã, casa) + idades.
7. Depoimentos (4, com foto).
8. Oferta + garantia (selo real de 7 dias).
9. Versículo Provérbios 22:6.
10. Como você recebe (substitui o "ATENÇÃO").
11. FAQ.
12. CTA final.

## 4. Copy (PT-BR)

Ver `app/emocoes/page.js`, fonte única. Regras aplicadas: verbo da compradora no CTA, números > adjetivos, uma promessa por seção, "sem" como gatilho, preço + garantia repetidos no fim.

## 5. Implementação

- `app/emocoes/page.js` (server component, metadata + OG).
- `components/emocoes/VideoFacade.js` (client, carrega o iframe no clique).
- `components/emocoes/EmotionFloat.js` (personagens flutuando, CSS keyframes).
- Tokens das emoções e keyframes em `app/globals.css` (extensão durável do sistema).
- `app/materiais/page.js`: card Emoções passa a apontar pra `/emocoes` com imagem real.
- Assets em `public/emocoes/`.
- Verificação: build local, detector do impeccable, screenshot desktop/mobile, push → Vercel.
