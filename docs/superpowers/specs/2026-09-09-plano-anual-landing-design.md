# Landing do Plano Anual Biblinho — design aprovado

Data: 2026-09-09
Status: aprovado pela Thali em conversa (seções 1 a 4), pronto pra plano de implementação
Rota: `app/plano-anual/page.js` → https://materiais.criatividadesbiblicas.com.br/plano-anual

## 1. O que é e por que existe

Página de venda perene do **Plano Anual Biblinho**, o carro-chefe da Criatividades Bíblicas. Substitui, como destino de tráfego, a página atual do GreatPages (`criatividadesbiblicas.com.br/planoanualbiblinho`), que é um catálogo sem história e sem dor. A Thali troca o link/botão da página antiga quando esta estiver no ar.

Modelo de referência: a landing do Pack Arca de Noé (`app/aprendendo-a-obedecer/page.js`), que a Thali aprovou pelo storytelling e pelas fontes redondas. Esta página herda a espinha narrativa e o método (páginas reais do material, sem ilustração gerada), mas tem mundo visual próprio.

## 2. Decisões trancadas (2026-09-09)

| Tema | Decisão |
|---|---|
| Produto | Assinatura de 12 meses. Uma história por mês, liberada mês a mês a partir da compra. Quem assina começa pela história 1 (Parábola do Semeador) e avança uma por mês, independente do calendário civil. |
| Oferta | Plano Anual **Kids (4 a 6) + Júnior (7 a 10)**. **Bônus: material Baby (1 a 3) o ano inteiro**, sem custo, pra todas as faixas serem trabalhadas. |
| Preço | De R$ 1.164,00 por **R$ 597,00 à vista** ou **12x de R$ 61,74**. |
| Checkout | https://pay.kiwify.com.br/kuUKSBr (repassar UTM). |
| Prazo | **Nenhum.** Página perene: sem contador, sem data, sem "só nesta semana". O bônus Baby é permanente. |
| Tráfego | Orgânico (IG 41k, TikTok, lista, compradores do Arca e do Emoções) + Meta Ads R$ 200/dia. Campanha e criativos são rodada futura. |
| Persona | As duas: abre pela professora que dá a aula, cresce pra líder/igreja inteira. Storytelling "apelativo", tocando na dor, mostrando linguagem, estrutura e história do material. |
| Publicação | Repo Next.js (`sandbox/site/criatividades-biblicas`), host `materiais.criatividadesbiblicas.com.br`, deploy Vercel. Índice liberado pro Google desde o primeiro dia. |
| Prova social | Depoimentos NOVOS que a Thali vai mandar. Nada genérico, nada dos 4 antigos. Publicar com primeiro nome + inicial do sobrenome. Bloco desligado até chegarem. |
| Escopo desta rodada | **Só a página publicada.** Documento de estratégia, copies, criativos e campanha Meta ficam pra rodadas seguintes. |

## 3. Narrativa: os 13 blocos

Tom: segunda pessoa, frases curtas, cena antes de argumento. Português do Brasil. Nada de "transforme sua EBD", nada de emoji, nada de selo de desconto gritando. O texto abaixo é rascunho de direção; a copy final é escrita na implementação seguindo este esqueleto.

1. **Hero (sem preço, sem bônus, sem selo).** Rótulo pequeno: "Plano Anual Biblinho · Kids + Júnior · bônus Baby". Título em três linhas: "Cinquenta e dois domingos. / Uma história por mês. / A aula já vem pronta." Parágrafo de duas linhas (apostila com a fala escrita, quadro de história, atividades, versículo, lembrancinha; do berçário ao Júnior na mesma história). Um botão amarelo "Quero ver como funciona" que rola pra `#cena`. À direita, três capas reais em leque (duas no celular).

2. **A cena (`#cena`).** Primeira pessoa, curta e dura. "Sexta, 22h40. Eu ainda não sei o que vou ensinar domingo." Pinterest aberto, impressora sem tinta, três turmas na mesma manhã, o berçário sem nada novo desde março. Domingo: a criança que ouviu Zaqueu não lembra quem era Zaqueu. Fecha com a pergunta: "Quanto do que eu ensino fica?"

3. **O diagnóstico.** "Não é falta de esforço. É falta de sequência." Criança aprende com história, e história precisa de continuação. Uma aula solta por semana é semente sem terra. Quatro domingos dentro da mesma história é onde ela cria raiz. Campo de cor cheio (drenched) pra marcar a virada.

4. **A virada.** "Foi pra esse ano que existe o Plano Anual Biblinho." Uma história por mês, quatro ou cinco domingos dentro dela, Kids e Júnior na mesma história, o Baby junto. "Sua igreja inteira aprendendo a mesma coisa no mesmo mês."

5. **A roda das histórias (sinal autoral).** Título "Uma história nova todo mês." Carrossel 3D circular com 8 capas reais (Kids): a da frente grande e nítida com reflexo suave e o nome + nº de estudos embaixo; as laterais inclinadas, menores, com véu de céu; as de trás somem. Gira por arrasto (mouse e toque) e por setas, encaixa na próxima. **Sem numeração, sem ordem, sem "mês 1".** Aprovado em mockup interativo (`.superpowers/brainstorm/1817-1788970290/content/04-roda.html`).

6. **Um mês por dentro.** Usa a Arca de Noé (32 páginas já renderizadas em `public/arca-de-noe/`). Os 4 domingos como quatro janelas: estudo, lição em uma frase, versículo, lâmina do quadro. Prova de que "sequência" é concreto.

7. **O que chega todo mês.** Seis peças, cada uma com leque de páginas reais e uma linha do que resolve na prática: apostila da professora, quadro de história, atividades das crianças, versículo pra parede, lembrancinha, carta pra família. Misturar histórias diferentes nos leques pra mostrar variedade.

8. **A fala já vem escrita.** Página real do Estudo 1 Kids da Arca com anotações apontando: rotina da aula, roda de conversa escrita, objetivo em uma frase, instruções em vermelho, versículo do mês. Reaproveita o componente/estilo do Arca.

9. **Três faixas, uma história.** A mesma cena da Arca nas três apostilas (Baby, Kids, Júnior) lado a lado, com um trecho literal de cada faixa. Mostra o argumento "linguagem certa pra idade".

10. **Bônus Baby.** Bloco próprio: "Do berçário ao Júnior, todo mês." Material Baby completo o ano inteiro (apostila, atividades, balão de história, lembrancinha, carta pra família), sem custo. Sem prazo.

11. **Quem já usa.** Depoimentos novos (pendentes). Nome + inicial, avatar de iniciais nas cores da paleta. Enquanto não chegam, o bloco não renderiza (lista vazia = seção oculta).

12. **Oferta (`#oferta`).** Título "Quanto custa um ano de aula pronta." Lista: material Kids completo (12 histórias) · material Júnior completo (12 histórias) · bônus: material Baby completo (12 histórias). Âncora "R$ 1.164,00" riscada, "R$ 597,00 à vista" em destaque, "ou 12x de R$ 61,74". Botão amarelo "Quero o Plano Anual" → checkout. Linha abaixo: "Pix, boleto ou cartão · 7 dias de garantia". **Sem contador.**

13. **Como funciona + garantia + FAQ + fechamento.** Três passos: compra na Kiwify → acesso à primeira história na hora → uma nova a cada mês, por 12 meses. Garantia de 7 dias. FAQ (objeções): o que vem exatamente; começa por qual história; recebo tudo de uma vez?; impresso?; que papel; posso usar com a equipe da igreja?; já comprei um Pack avulso, e agora?; e depois dos 12 meses?; garantia. Fechamento: "Domingo que vem pode ser sobre o Semeador." + botão.

Navegação: menu só com logo + botão "Quero o Plano Anual" (→ `#oferta`), rodapé sem links de saída (mesma regra da Arca).

## 4. Mundo visual: direção A, "Letra da capa"

Aprovado em mockup (`.superpowers/brainstorm/1817-1788970290/content/01-mundo-visual-v2.html`).

- **Display:** Lilita One (peso único), títulos e números. É a letra gorda e redonda das capas do material.
- **Texto:** Nunito 500/700/800. Redonda e limpa.
- **Paleta** (tokens `pa-*` no `globals.css`):

| Token | Hex | Uso |
|---|---|---|
| `pa-branco` | `#ffffff` | fundo padrão |
| `pa-ceu-claro` | `#eaf6ff` | fundos de seção alternados, hero |
| `pa-ceu` | `#59b6f0` | detalhes, véu da roda (com opacidade) |
| `pa-campo` | `#2a8a3e` | destaque no título, números, pílulas |
| `pa-sol` | `#ffc531` | **botões, sempre** |
| `pa-laranja` | `#e8562a` | ponto de atenção (frase-virada) |
| `pa-terra` | `#8a5a3c` | detalhe raro (madeira/terra) |
| `pa-tinta` | `#22303f` | texto |

- **Regras:** fundo branco ou céu claro, **nunca creme**; cantos bem redondos (capa 12px, bloco 1.1rem, caixa 1.25rem, pílula 999px); botão sempre sol com texto tinta; contorno branco de letra só em selos/números, nunca em texto corrido; páginas reais em vez de ilustração gerada; uma cor de destaque por seção.
- **Motion:** roda 3D com transição `cubic-bezier(.22,.8,.26,1)`, capas do hero flutuando devagar, reveal suave ao rolar. Tudo desliga com `prefers-reduced-motion` (a roda vira fila estática com a capa central maior).
- **Escopo CSS:** classe raiz `.pa` na página; Nav e Footer compartilhados vestidos por `.pa header/footer` sem alterar os componentes (mesma técnica do `.arca`).

## 5. Arquitetura

```
app/plano-anual/page.js            server component; metadata, JSON-LD, 13 blocos
components/plano-anual/Roda.js     "use client"; carrossel 3D (arrasto, toque, setas, reduced-motion)
components/plano-anual/Tracking.js "use client"; ViewContent no load + InitiateCheckout no clique (content_id "plano-anual")
components/plano-anual/dados.js    sem diretiva; HISTORIAS (8 capas), PECAS, AULAS_ARCA, FAIXAS, FAQ, DEPOIMENTOS (vazio até chegar)
components/arca/Leque.js           reaproveitado como está
components/FaqItem.js, Nav.js, Footer.js  reaproveitados
app/globals.css                    bloco `.pa` com tokens e keyframes
public/plano-anual/*.webp          capas e páginas renderizadas (+ sidecar .webp.json de procedência)
next.config.mjs                    remover redirect `/plano-anual` → `/emocoes`; adicionar `/planoanualbiblinho` → `/plano-anual` (host materiais)
```

Fluxo de dados: tudo estático em `dados.js`; a página não busca nada em runtime. Depoimentos entram editando `dados.js`.

Pixel/Clarity: já carregados no layout; `Tracking.js` só dispara eventos. Botões de checkout levam `?src=materiais&sck=plano-anual` mais as UTMs que chegarem na URL (mesma função do Arca).

SEO: `title` "Plano Anual Biblinho: um ano de aula bíblica pronta | Criatividades Bíblicas"; `description` com Kids + Júnior + bônus Baby + preço; canonical absoluto no host materiais; OG image própria 1200×630 (três capas em leque sobre céu claro); JSON-LD `Product` com `Offer` price 597 BRL; `robots index: true`.

## 6. Assets: como gerar

Script em scratchpad (PyMuPDF, mesmo método do Arca `export_arca.py`):
- Capas Kids das 8 histórias: página 1 dos PDFs "CAPA DAS ATIVIDADES KIDS" em `F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL/2026/<n> <TEMA>/2 KIDS/2 APOSTILA*/` → `public/plano-anual/capa-<slug>.webp` (largura 900).
- Páginas dos leques: reaproveitar `public/arca-de-noe/*.webp` + 2 a 3 páginas de outras histórias (Semeador, Zaqueu, Pródigo) por peça, pra variedade.
- Três faixas: página da mesma cena nas apostilas Baby/Kids/Júnior da Arca (já existe Kids; renderizar Baby e Júnior).
- OG image: composição HTML → Chrome headless → PNG 1200×630.
- Cada `.webp` ganha sidecar `.json` com origem (PDF, página, data), como no Arca.

## 7. Erros e estados

- Roda: sem JS ou com reduced-motion → fila horizontal estática, capa central maior; nunca página quebrada. Imagem que falhar mostra placeholder céu claro com o nome da história.
- Depoimentos vazios → seção não renderiza (sem "em breve").
- Checkout: link absoluto; se a URL de UTM vier vazia, botão ainda funciona.
- Fonte Google fora do ar → fallback `system-ui` declarado no next/font.

## 8. Verificação antes de publicar

1. `npm run build` sem erro e sem warning novo.
2. Revisão de acabamento da skill **impeccable** (agente revisor separado) com veredito registrado em `DESIGN.md`/`.impeccable/`.
3. Capturas de página inteira em 1440 px e 390 px (Chrome headless), conferidas bloco a bloco.
4. Roda testada com mouse, toque (emulação mobile) e teclado (setas); reduced-motion conferido.
5. Todos os botões apontam pro checkout correto com UTM; eventos ViewContent/InitiateCheckout aparecem no console de teste do Pixel.
6. Linter de PT-BR nos textos (nada de português de Portugal).
7. Capturas enviadas pra Thali **antes** do push. Push na `main` só depois do "pode publicar" dela.

## 9. Pendências que não bloqueiam

- Depoimentos reais (Thali vai mandar). Ligar bloco 11 quando chegarem.
- Histórias 9 a 12 do ano ainda não definidas na pasta (a 12 é a Natividade, em pipeline). A página não depende disso porque a roda não numera e usa 8 capas.
- Trocar o link da página antiga do GreatPages pra nova (ação da Thali).

## 10. Fora de escopo desta rodada

Documento de estratégia (funil, calendário de conteúdo, e-mails/WhatsApp), copies de anúncio e orgânico, criativos renderizados, campanha Meta (R$ 200/dia), imagens do checkout Kiwify. Cada um vira uma rodada própria depois que a página estiver no ar.
