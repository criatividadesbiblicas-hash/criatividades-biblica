---
name: Criatividades Bíblicas — mundo Arca / Packs
description: Céu claro, mar fundo, sol nos botões e páginas reais em leque; o mundo visual das landings de Pack avulso, registrado a partir do build de /arca-de-noe.
colors:
  branco: "#ffffff"
  ceu-claro: "#eef7ff"
  ceu: "#bfe4ff"
  mar: "#1c86d6"
  fundo: "#0b57a0"
  abismo: "#083f78"
  sol: "#ffc531"
  sol-escuro: "#e9a400"
  coral: "#ea4d3d"
  madeira: "#b8783a"
  areia: "#f6e3c2"
  verde: "#4db15c"
  tinta: "#17324d"
typography:
  display:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.5vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Baloo 2, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 20px)"
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: "normal"
  body-card:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Quicksand, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  folha: "6px"
  capa: "10px"
  lamina: "14px"
  bloco: "1.1rem"
  caixa: "1.25rem"
  nota: "1.5rem"
  balao: "1.75rem"
  card: "2rem"
  card-lg: "2.25rem"
  pill: "9999px"
spacing:
  gutter: "1.25rem"
  gutter-md: "2rem"
  flow: "1.25rem"
  gap: "1.5rem"
  card: "1.5rem"
  card-lg: "2.5rem"
  section: "5rem"
  section-md: "7rem"
components:
  button-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-sol-hover:
    backgroundColor: "#ffd15a"
    textColor: "{colors.tinta}"
  button-coral:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.branco}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-coral-hover:
    backgroundColor: "#f05a4a"
    textColor: "{colors.branco}"
  nav-cta:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  card-peca:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  card-oferta:
    backgroundColor: "{colors.ceu-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card-lg}"
    padding: "0"
  balao-depoimento:
    backgroundColor: "{colors.branco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.balao}"
    padding: "{spacing.card}"
  nota-anotacao:
    backgroundColor: "{colors.ceu-claro}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.nota}"
    padding: "1.25rem"
  contador-bloco:
    backgroundColor: "{colors.ceu-claro}"
    textColor: "{colors.fundo}"
    rounded: "{rounded.bloco}"
    padding: "8px"
    width: "3.9rem"
  barra-contador:
    backgroundColor: "{colors.abismo}"
    textColor: "{colors.branco}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 20px"
  badge-escotilha:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    size: "44px"
---

# Design System: Criatividades Bíblicas — mundo Arca / Packs

> **Escopo e coexistência.** Este arquivo descreve o mundo **"Arca / Packs"**: a rota `/arca-de-noe` e as futuras páginas de Pack avulso da Criatividades Bíblicas. Ele vive inteiro dentro do escopo `.arca` (bloco no fim de `app/globals.css` + variáveis `--font-baloo` / `--font-quicksand` carregadas por `next/font` em `app/arca-de-noe/page.js`). A rota `/emocoes` e o restante do site usam **outro mundo** (Fraunces + Nunito, marfim `#fbf7f1`, coral `#f26b5e`, cacau `#2e1f17`, definido no primeiro `@theme` de `globals.css`) que **não é governado por este documento e não deve ser sobrescrito**. Os dois mundos coexistem no mesmo repositório: o base pinta o `body`; o `.arca` re-declara `--font-display`, `--font-body`, cor e fundo só dentro da landing, e `body:has(> .arca)` troca o fundo do documento pra branco pra não aparecer creme no overscroll. Uma terceira landing, `/plano-anual`, tem seção própria mais abaixo neste mesmo arquivo ("Mundo Plano Anual / Letra da capa"): ela também não compartilha token, fonte ou fundo com os outros dois mundos, e vive inteira dentro do escopo `.pa`.

## Overview

**Creative North Star: "A capa do material virou o mundo"**

A página é a capa do Pack aberta em tela cheia. O céu claro da capa vira o fundo do hero e das seções de respiro; o mar vira campos inteiros de azul (encharcados, sem card) onde a história é contada; o sol amarelo da capa vira o único botão que existe; a madeira da arca vira aro de escotilha. Nada aqui é "site infantil genérico": cada cor tem origem numa peça impressa que a professora vai segurar na mão, e as imagens são as páginas reais do material, nunca mockup.

A densidade é de história contada, não de vitrine: seções longas, uma ideia por bloco, um H2 curto em Baloo e um parágrafo em Quicksand por cena. A página vai afundando (branco → céu → mar → fundo → abismo) e emergindo de novo a cada virada da narrativa, e a transição entre profundidades é sempre uma onda SVG, nunca uma linha reta. O tom é alegre e de professora pra professora: cantos muito redondos, sombras azuladas e macias, capas que boiam devagar.

Rejeições confirmadas no build: fundo creme (o mundo é branco e azul), eyebrows/kickers acima dos títulos, grade de cards iguais com ícone, texto em gradiente e sombra dura deslocada.

**Key Characteristics:**
- Campos de cor inteiros (mar `#1c86d6`, fundo `#0b57a0`) em vez de cards sobre fundo neutro.
- Baloo 2 ExtraBold nos títulos, Quicksand Medium no texto; nenhuma outra face.
- Ondas SVG autorais como divisórias; quatro delas animadas.
- Páginas reais em leque (rotação 9° por folha) e escotilhas com aro de madeira.
- Sol `#ffc531` é o botão e o destaque; coral `#ea4d3d` só no preço e em pontos de atenção.
- Todo canto é redondo (mínimo 6px nas folhas, pílula nos botões); toda sombra é tingida de azul.

## Colors

Paleta amostrada da capa do material: dois azuis de superfície, três azuis de profundidade, um sol, um coral, e os tons de madeira/areia da arca.

### Primary
- **Mar** (`mar`, #1c86d6): a cor da história. Campo inteiro da seção da dor ("Domingo, nove e meia da manhã"), faixa final da página, span de destaque no H2 da solução ("Pack Arca de Noé"), lição de cada escotilha, linhas conectoras das anotações, anel de foco e polegar da barra de rolagem.
- **Fundo** (`fundo`, #0b57a0): o mar mais profundo. Campo inteiro da virada ("Se aprende com história") e do bônus; dígitos do contador; título das anotações.
- **Abismo** (`abismo`, #083f78): o azul mais escuro, usado uma vez com propósito: a barra fixa de contagem, pra que ela leia como "outra camada" sobre qualquer seção.

### Secondary
- **Sol** (`sol`, #ffc531): o botão. Todos os CTAs (hero, oferta, fechamento, nav, barra), a frase-virada em amarelo sobre o mar, os números das escotilhas, as ênfases `<strong>` do bônus, os ícones do bônus, o anel do avatar dos depoimentos e o anel da capa Baby na oferta. Também a cor de seleção de texto.
- **Sol escuro** (`sol-escuro`, #e9a400): não pinta superfície; é a cor base da sombra do botão sol (`rgba(233,164,0,0.75)`).

### Tertiary
- **Coral** (`coral`, #ea4d3d): ponto de atenção. O preço grande "R$ 67", o ícone "+" do FAQ, a mensagem de promoção encerrada. Existe um botão coral definido no código (`tom="coral"`), mas o build não o usa: o sol é o único botão em tela.
- **Verde** (`verde`, #4db15c): só o check de "incluído" na lista da oferta.
- **Madeira** (`madeira`, #b8783a): tom central do aro das escotilhas (gradiente radial #d9a15f → #b8783a → #8a5527).
- **Areia** (`areia`, #f6e3c2): anel interno da escotilha (a 70%) e os quatro rebites.

### Neutral
- **Branco** (`branco`, #ffffff): fundo do documento e das seções de "solução" (escotilhas, apostila anotada, oferta); fundo dos cards e das folhas do leque; texto sobre mar/fundo.
- **Céu claro** (`ceu-claro`, #eef7ff): superfície de respiro. Seções das peças, da prova social e do FAQ; fundo das notas de anotação, dos blocos do contador, da caixa de garantia e da casca do card de oferta; trilho da barra de rolagem.
- **Céu** (`ceu`, #bfe4ff): fim dos gradientes do hero e do fechamento; cor de todas as bordas (header, footer, FAQ).
- **Tinta** (`tinta`, #17324d): o texto. Títulos a 100%; corpo em opacidades fixas: 90% (citações), 85% (lista da oferta), 80% (parágrafos de abertura), 75% (texto de card, legendas, rodapés de seção), 78% (resposta do FAQ), 60% (footer secundário).

### Named Rules
**A Regra do Sol Único.** Amarelo é botão e destaque; nunca fundo de seção, nunca cor de texto corrido. Se há dois amarelos competindo num viewport, um deles vira tinta ou branco.

**A Regra do Mergulho.** A página muda de profundidade em degraus: branco/céu-claro → mar → fundo → (abismo só na barra). Nunca se pula de branco pra abismo, e nunca se volta do fundo direto pro mar; entre um degrau e outro há sempre uma onda.

**A Regra da Tinta Opaca.** Não existe cinza. Texto secundário é `tinta` com opacidade (80/75/60), e texto sobre azul é branco com opacidade (90/88/85).

## Typography

**Display Font:** Baloo 2 (pesos 600, 700, 800 via `next/font`, fallback `system-ui, sans-serif`)
**Body Font:** Quicksand (pesos 500, 600, 700 via `next/font`, fallback `system-ui, sans-serif`)

**Character:** as fontes da capa impressa. Baloo 2 ExtraBold é redonda, gorda e alegre sem ser infantilizada; Quicksand Medium é geométrica e limpa e mantém a leitura confortável em 17–20px no celular. A dupla nunca é servida em caixa alta (exceção única: rótulos de unidade sob os dígitos do contador).

### Hierarchy
- **Display** (800, 2.6rem → 4rem no `md`, line-height 1.02, tracking -0.015em, `text-balance`): só o H1 do hero, três linhas à esquerda. A mesma escala serve o H2 da solução (2.4rem → 3.5rem) porque ele nomeia o produto.
- **Headline** (800, 2rem → 2.75rem, line-height 1.08, tracking -0.01em, `text-balance`): H2 de cada seção. Tinta sobre claro, branco sobre azul (`claro`).
- **Frase-virada** (800, 1.75rem → 2.5rem, line-height 1.12, `sol`, largura máxima 22ch): o parágrafo em Baloo amarelo que fecha a seção da dor. Uma por página.
- **Title** (800, 1.45–1.6rem, `leading-tight`): H3 das peças, das escotilhas e do card de oferta. Títulos das anotações usam 1.125rem no mesmo peso, em `fundo`.
- **Lição / nome** (700, 1rem, Baloo): a lição de cada escotilha (em `mar`) e o nome nos depoimentos (em `tinta`). Único uso do peso 700 do display.
- **Body** (500, 17px → 20px, line-height 1.625): parágrafos de abertura de seção e blocos narrativos; largura máxima 44–58ch.
- **Body card** (500, 15px, line-height 1.625): texto dentro de cards, notas e listas. 16px nas citações dos depoimentos e no rodapé da oferta.
- **Small** (600–700, 13–14px): créditos, "De R$ 97 por", "A oferta acaba em", linhas de garantia sob o botão. Itálico de 14px só nas citações bíblicas das escotilhas.
- **Label** (700, 11px, tracking 0.06em, uppercase): apenas as unidades "dias / horas / min / seg" do contador.
- **Números** (Baloo 800, `tabular-nums`): dígitos do contador em 1.75rem `fundo`; preço em 3.5rem `coral`, `leading-none`; badge da escotilha em 1.25rem `tinta`.

### Named Rules
**A Regra do Título Nu.** O H2 abre a seção sozinho: sem eyebrow, sem kicker, sem etiqueta em caixa alta acima dele. O que vem antes de um título é uma onda ou espaço em branco.

**A Regra do Baloo Só Pesado.** Baloo 2 aparece em 800 (títulos, botões, números) ou 700 (lição, nome); nunca em 600 ou abaixo. Texto de leitura é Quicksand.

## Layout

Página única, rolagem vertical, contida em larguras que estreitam conforme a densidade do conteúdo: `max-w-7xl` (80rem) no hero e no header, `max-w-6xl` (72rem) nas seções com grade (escotilhas, peças, apostila anotada, bônus), `max-w-5xl` na prova social, `max-w-4xl` na oferta, `max-w-3xl` na seção da dor (texto corrido) e `max-w-2xl` no FAQ e no fechamento. Gutter horizontal de 1.25rem no celular e 2rem a partir de `md` (768px).

Ritmo vertical: seções de respiro com 5rem em cima e embaixo (7rem no `md`); oferta e FAQ com 4rem / 6rem. Seções que terminam em onda encurtam o padding de baixo (ex.: hero `pb-6/10`) e a seção seguinte começa com `pt-4/8`, porque a onda já ocupa 52px (84px no `md`). Dentro de um bloco de texto, parágrafos se separam por 1.25rem (`space-y-5`); H2 → parágrafo 1–1.5rem; parágrafo → CTA 2rem; H2 → grade 2.5–3rem.

Grades observadas: hero `1.1fr 1fr` a partir de `md` (texto à esquerda, capas à direita; empilha no celular com as capas depois do botão); escotilhas em 2 colunas a partir de 420px e 4 no `lg`, `gap-x-6 gap-y-12`; peças em 1 → 2 (`sm`) → 3 (`lg`) colunas com `gap-6`, onde a apostila ocupa 2 colunas e vira linha (`lg:flex-row`) e a carta ocupa a largura toda; apostila anotada em `1fr 1.15fr 1fr` no `md` (notas à esquerda, página no centro, notas à direita; no celular vira lista numerada abaixo da imagem); depoimentos em 2 colunas com o card ímpar deslocado 2rem pra baixo (`sm:mt-8`); oferta em `0.85fr 1.15fr`.

**Ordem da história (fixa).** A sequência das seções é parte do layout, não da copy: 1 hero (promessa, sem preço) → 2 dor (mar) → 3 virada (fundo) → 4 solução: o Pack e as 4 aulas em escotilhas (branco) → 5 o que vem: páginas em leque (céu claro) → 6 apostila anotada (branco) → 7 prova social (céu claro) → 8 bônus (fundo, só com promoção ativa) → 9 oferta com preço e contador (branco) → 10 FAQ (céu claro) → 11 fechamento (gradiente céu) → onda mar → footer. Preço, desconto, contador e bônus não existem antes da seção 8.

Breakpoints usados: 420px (escotilhas em 2 colunas), `sm` 640px, `md` 768px, `lg` 1024px. As capturas de referência foram tiradas a 500px e 1440px.

## Elevation & Depth

Híbrido com regra clara: **a profundidade principal é tonal** (os degraus branco → céu → mar → fundo → abismo), e **as sombras existem só pra descolar objetos de papel do fundo**: capas, folhas do leque, cards, escotilhas e botões. Toda sombra é grande no blur, negativa no spread e **tingida com o azul do mundo** (`rgba(11,87,160,…)` sobre claro, `rgba(8,63,120,…)` nas capas, `rgba(23,50,77,…)` na madeira) ou com a própria cor do botão. Não existe sombra preta pura sobre fundo claro, nem sombra dura com deslocamento visível.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 10px 30px -18px rgba(11,87,160,0.35)`): cards de peça e balões de depoimento sobre céu claro.
- **Card de oferta** (`0 24px 60px -30px rgba(11,87,160,0.5)`): a única elevação alta sobre branco; marca o card do preço.
- **Folha do leque** (`0 18px 30px -14px rgba(11,87,160,0.45)` + `ring-1` tinta a 10%): cada página real dentro de um leque.
- **Página anotada** (`0 30px 60px -26px rgba(11,87,160,0.55)` + `ring-1` tinta a 10%): a apostila grande no centro da seção 6.
- **Capa flutuante** (`0 28px 44px -18px rgba(8,63,120,0.55)` atrás, `0 34px 54px -18px rgba(8,63,120,0.6)` na frente): as duas capas do hero; a da frente tem sombra maior.
- **Capa na oferta** (`0 18px 36px -14px rgba(8,63,120,0.5)` / `0 24px 40px -14px rgba(8,63,120,0.55)`): versão menor do mesmo par.
- **Lâmina sobre azul** (`0 30px 60px -24px rgba(0,0,0,0.6)` + `ring-4` branco a 15%): a única sombra preta, e só porque está sobre `fundo`, onde azul não leria.
- **Botão sol** (`0 12px 28px -10px rgba(233,164,0,0.75)`); **botão coral** (`0 12px 28px -10px rgba(234,77,61,0.7)`); **CTA do header** (`0 8px 20px -10px rgba(233,164,0,0.8)`): a sombra é da cor do botão, um brilho, não uma projeção.
- **Aro da escotilha** (`0 18px 34px -14px rgba(23,50,77,0.55)`); **badge numérico** (`0 6px 14px -4px rgba(23,50,77,0.45)`); **rebite** (`0 1px 2px rgba(0,0,0,0.35)`, o único contato curto do mundo, com 10px de diâmetro).
- **Barra fixa** (`0 14px 36px -12px rgba(8,63,120,0.7)`): a pílula abissal flutuando sobre qualquer seção.

### Named Rules
**A Regra da Sombra Azul.** Sombra sobre fundo claro é sempre `rgba(11,87,160, 0.35–0.55)` ou `rgba(8,63,120, 0.5–0.6)` com spread negativo; preto só aparece sobre `fundo`/`abismo`, onde o azul não contrasta.

**A Regra do Brilho do Botão.** Botão não projeta sombra cinza: projeta a própria cor a 70–80%, 12px pra baixo, 28px de blur, -10px de spread.

## Shapes

Tudo é redondo, e o raio cresce com o tamanho do objeto: folhas do leque 6px, capas 8–10px, lâmina de fechamento 12px, página anotada 14px, blocos do contador 1.1rem, caixas pequenas (garantia, anotação mobile) 1.25rem, notas e lâmina da virada 1.5rem, balões de depoimento 1.75rem, cards de peça 2rem, card de oferta 2.25rem. Botões, badges, avatares, escotilhas, rebites e a barra fixa são pílulas ou círculos (`9999px`). Não há canto reto em nenhuma superfície do mundo; a única exceção são as próprias imagens das páginas impressas, que trazem seus cantos de papel e recebem 6px por cima.

Bordas são raras e sempre `ceu` (#bfe4ff, 1px): header, footer, linhas do FAQ. Anéis (`ring`) substituem bordas nos objetos de papel: 1px tinta a 10% nas folhas, 4px areia a 70% dentro da escotilha, 4px branco a 15% na lâmina sobre azul, 2px sol nos avatares, 4px sol na capa Baby (bônus), 1px mar a 15% nos blocos do contador.

**Divisórias em onda.** Nunca uma reta entre duas cores. O componente `Onda` é um `<svg viewBox="0 0 2880 100" preserveAspectRatio="none">` com um único `path` de seis cristas (`M0,60 C180,20 360,20 540,55 … L2880,100 L0,100 Z`), com 200% de largura e altura de 52px (84px no `md`). **Regra de direção:** a onda fica na base da seção de cima e é pintada com a **cor da seção de baixo** (`cor`): o mar de baixo sobe com cristas pra cima. Quando a onda precisa ir no topo da seção de baixo (peças, bônus), ela recebe `rotate-180` e o container leva o `bg` da seção de cima, produzindo a leitura inversa (a cor de cima escorre pra dentro). Ondas que **entram ou saem de um campo azul** animam (hero → mar, fundo → branco, bônus → branco, fechamento → mar); as demais são estáticas (`virada`).

**Balão de depoimento.** Card branco `1.75rem` com um quadrado de 24px rotacionado 45° (`rounded-[4px]`) preso 12px abaixo da borda, 2.5rem da esquerda: a cauda da fala.

**Escotilha.** Quadrado de até 15rem com `container-type: inline-size`. Aro: círculo com gradiente radial de madeira (`circle at 30% 25%`, #d9a15f → #b8783a a 55% → #8a5527). Janela: `inset 9%`, circular, `overflow-hidden`, `ring-4` areia a 70%, imagem `object-cover object-top`. Quatro rebites de 10px em areia nos ângulos 45°/135°/225°/315°, a `47.5cqw` do centro. Badge numérico de 44px em sol, Baloo 800 1.25rem tinta, ancorado 4px pra fora do canto superior esquerdo.

**Leque de páginas reais.** N folhas absolutas, centradas em `left: 50%`, `top: 6%`, `transform-origin: 50% 135%` (o pivô fica abaixo do card, como um leque na mão). Rotação `t × 9°`, onde `t = índice − (N−1)/2`; a folha central fica na frente (`z = 10 − round(|t| × 2)`). Largura por folha: retrato 46% (52% se for uma só), paisagem 62% (92% se for uma só). Container com proporção 4/3.3 (retrato), 4/3.6 (retrato única) ou 4/3 (paisagem), `overflow-visible`. Cada folha: `rounded-[6px]`, fundo branco, sombra "folha do leque".

## Components

### Buttons
Caráter: uma pílula de sol que sobe meio milímetro quando a mão passa. Só existe um botão por bloco.
- **Shape:** pílula (`9999px`), `inline-flex`, `gap-2` pra ícone Phosphor de 20px (`ArrowDown` no hero).
- **Primary (sol):** fundo `sol`, texto `tinta`, Baloo 800 18px `leading-none`, padding 16px × 32px, brilho `0 12px 28px -10px rgba(233,164,0,0.75)`. Largura total no celular dentro da oferta (`w-full sm:w-auto`).
- **Hover / Active:** `translateY(-2px)` + fundo `#ffd15a`, transição de `transform` e `background-color` em 200ms ease-out; `active` encolhe pra `scale(0.98)`. Foco: anel do mundo (3px `mar`, offset 3px).
- **Secondary (coral):** mesma forma, fundo `coral`, texto branco, hover `#f05a4a`, brilho coral. Definido pra pontos de atenção; **o build não o usa**, portanto é reserva, não padrão.
- **CTA do header:** sol, Baloo 800 15px, padding 10px × 20px, brilho menor. Sobe ao hover e clareia pra `#ffd15a`.
- **CTA da barra:** sol, Baloo 800 15px, padding 10px × 20px, sem sombra própria (a barra já tem), mesmo hover/active.
- **Rótulos:** "Quero ver a história ↓" (hero, âncora interna, sem `target`), "Quero o Pack" (header, âncora `#oferta`), "Quero o Pack por R$ 67" (oferta, fechamento, barra: link externo Kiwify com `target="_blank"`). Fora da promoção o rótulo vira "Quero o Pack por R$ 97".

### Cards / Containers
- **Card de peça:** `2rem` de raio, branco, sombra "card", `overflow-hidden`, leque no topo com padding 1.5rem, texto abaixo com padding 1.5rem (H3 1.5rem + parágrafo 15px a 75%). Variantes: `grande` (2 colunas, leque à esquerda a 58%) e `largo` (linha inteira, leque a 34–40%).
- **Balão de depoimento:** ver Shapes. Citação 16px a 90%, avatar 44px com `ring-2 sol`, nome Baloo 700 1rem, cargo 13px semibold a 75%.
- **Nota de anotação:** `1.5rem`, céu claro, padding 1.25rem, título Baloo 800 1.125rem em `fundo`, texto 15px; um traço de 18px × 2px em `mar` sai da lateral apontando pra página anotada. No celular vira lista com badge numérico de 32px em sol.
- **Card de oferta:** `2.25rem`, casca céu claro com sombra alta; faixa arco-íris de 8px no topo (`.arca-arcoiris`: gradiente 90° #ea4d3d → #ff9a3c → #ffc531 → #4db15c → #1c86d6 → #7d6bb5, o único gradiente colorido do mundo, usado uma vez como "promessa"); metade esquerda com as capas empilhadas (Júnior −6°, Kids +2°, Baby +6° com `ring-4 sol` quando há promoção), metade direita branca com padding 2rem (2.5rem no `md`): H3, lista com `CheckCircle` verde 22px, "De ~~R$ 97~~ por", preço coral 3.5rem, "pagamento único…", contador, botão, caixa de garantia (céu claro, 1.25rem, padding 1rem, selo de 64px).
- **Bloco do contador:** ver Countdown.

### Countdown (contador e barra fixa)
- **Blocos** (`ContadorBlocos`, só no card da oferta): quatro caixas `min-width 3.9rem`, céu claro, `1.1rem`, `ring-1 mar/15`, padding 8px; dígito Baloo 800 1.75rem `fundo` `tabular-nums`, rótulo 11px 700 uppercase 0.06em tinta a 75%; separador ":" em Baloo 800 1.25rem `mar` a 50%. Antes da hidratação reserva 4.5rem de altura; após o fim renderiza "A promoção encerrou. O Pack continua disponível pelo valor normal." em 14px 700 `coral`. `role="timer"`, `aria-live="off"`, atualiza a cada segundo.
- **Barra fixa** (`BarraContador`): `fixed inset-x-0 bottom-0 z-40`, padding 12px, pílula `max-w-2xl` em `abismo` com texto branco 14–15px ("**Bônus acaba em** 8d 03h 01min"; abaixo de um dia, "03h 01min 44s"), CTA sol à direita. Entra e sai por `translateY` (0 ↔ 120%) em 500ms `cubic-bezier(0.16,1,0.3,1)`.
- **Gate por IntersectionObserver:** a barra só é liberada depois que a sentinela `#bonus` cruzou 30% do viewport (`threshold: 0.3`, estado pegajoso: uma vez liberada, fica) e se esconde enquanto `#oferta` está visível (`threshold: 0.15`). Regra: **nenhum preço na tela antes do bônus**, nem pela barra. Sem promoção ativa (`r === null`) a barra não é renderizada.

### Navigation
- **Header** (Nav compartilhado, vestido pelo `.arca`): `sticky top-0 z-40`, 64px, fundo branco a 92% com `backdrop-blur`, borda inferior `ceu`; logo horizontal à esquerda (44px de altura) linkando pra própria landing; à direita só o CTA sol "Quero o Pack" (`#oferta`). Em modo landing (`links=[]`) não há menu nem hambúrguer: nenhuma saída da página.
- **Footer** (Footer compartilhado, `showNav={false}`): fundo branco, borda `ceu`, texto `tinta` (secundário a 60%), links clareiam pra `mar` no hover.
- **FAQ** (FaqItem compartilhado): linhas de 1px `ceu`, pergunta Baloo 600 16–18px `tinta`, ícone `Plus` 20px `coral` que gira 45° ao abrir, resposta 14px a 78% com transição de `grid-rows` em 300ms.

### Imagens do material (signature)
As páginas reais são o conteúdo, não decoração. Aparecem em quatro formas, todas com cantos redondos e sombra azul: **capas boiando** (hero, `arca-boia`), **leques** (peças, bônus), **escotilhas** (as 4 aulas) e **lâmina única** (virada, apostila anotada, fechamento). Nenhuma imagem é mockup nem ilustração genérica; `alt` descreve a peça ("Lâmina do quadro de história: …", "Páginas reais: …"), e imagens puramente decorativas (capa repetida na oferta, arco-íris do fechamento) levam `alt=""`.

### Motion
- **Flutuação** (`.arca-boia`): `translateY(0 → -10px)` com `rotate(var(--r) → var(--r) + 1.2deg)` em `cubic-bezier(0.45,0,0.2,1)`, `infinite`, duração `var(--dur, 6s)`, atraso `var(--delay, 0s)`, `will-change: transform`. Cada objeto tem ângulo e ritmo próprios: capa Júnior −7° / 7.5s / 0.6s de atraso, capa Kids 3° / 6.4s, lâmina da virada −2° / 8s, arco-íris do fechamento −3° / 6s. Nunca dois objetos no mesmo compasso.
- **Onda** (`.arca-onda`): o SVG de 200% de largura desliza `translateX(0 → -50%)` em 14s linear, infinito, dando a impressão de mar passando.
- **Microinterações:** botões 200ms ease-out (subir 2px + clarear), barra 500ms `cubic-bezier(0.16,1,0.3,1)`, FAQ 300ms ease-out.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` desliga `.arca-boia` e `.arca-onda` (`animation: none`), além da regra global do site que zera durações. Rolagem suave só com motion permitido.

### Superfícies do navegador
- **Seleção:** fundo `sol`, texto `tinta`.
- **Foco:** `outline: 3px solid mar`, `outline-offset: 3px`, `border-radius: 999px` (o anel é sempre pílula, combinando com os botões).
- **Barra de rolagem:** `scrollbar-color: mar ceu-claro`.
- **Links:** `text-underline-offset: 0.18em`.
- **Fundo do documento:** `body:has(> .arca) { background: #fff }`, pra que o overscroll não mostre o creme do mundo base.

### Comportamento pós-promoção
A verdade da oferta vem de `components/arca/promo.js`: `FIM_PROMO = "2026-09-16T23:59:59-03:00"` e `promoAtiva()`. A página exporta `revalidate = 600`, então o servidor re-renderiza a cada 10 minutos e, depois do fim: a seção `#bonus` some (fica só uma sentinela vazia pra ancorar a barra), a lista da oferta perde as duas linhas de bônus, "De R$ 97 por" e o contador desaparecem, o preço vira "R$ 97", os botões viram "Quero o Pack por R$ 97", a linha sob o botão do fechamento vira "7 dias de garantia · pagamento seguro pela Kiwify", o FAQ perde a pergunta do Baby, e o JSON-LD troca o preço e retira `priceValidUntil`. No cliente, o contador e a barra fazem o mesmo em tempo real (mensagem de encerramento / barra não renderiza). Regra: **nenhuma promessa da semana de lançamento (Baby, acesso vitalício, R$ 67) sobrevive ao `FIM_PROMO` em nenhum lugar da página.**

## Do's and Don'ts

### Do:
- **Do** escrever em português do Brasil, na voz de professora pra professora: frases curtas, "pra" em vez de "para", segunda pessoa direta ("Você abre a pasta e encontra isto."), nunca frio ou corporativo.
- **Do** manter a ordem da história: dor → virada → solução → prova → bônus → preço. Preço, desconto, contador, bônus e barra fixa só depois de `#bonus`.
- **Do** contar cada seção com um H2 nu em Baloo 800 e um parágrafo em Quicksand 500 de 17–20px; um botão sol por bloco, no máximo.
- **Do** mostrar página real antes de qualquer promessa: capas, leques, escotilhas e lâminas vêm de `public/arca-de-noe/*.webp`, com `alt` que diz o que é a peça.
- **Do** separar cores com `Onda` (cor da seção de baixo, 52/84px), animada quando entra ou sai de um campo azul.
- **Do** tingir toda sombra sobre claro com azul (`rgba(11,87,160,…)` ou `rgba(8,63,120,…)`), spread negativo, e dar aos botões o brilho da própria cor.
- **Do** usar raio proporcional ao objeto (6px folha → 2.25rem card de oferta) e pílula em tudo que é botão, badge, avatar ou barra.
- **Do** dar a cada objeto flutuante seu próprio `--r`, `--dur` e `--delay`, e respeitar `prefers-reduced-motion`.
- **Do** ler a verdade da oferta de `promoAtiva()` / `FIM_PROMO` e manter `revalidate = 600` em qualquer página de Pack com promoção datada.
- **Do** vestir Nav, Footer e FaqItem compartilhados pelo escopo `.arca` em vez de duplicar componentes.

### Don't:
- **Don't** usar fundo creme, marfim ou areia como superfície de seção (`#fbf7f1`, `#f3ede3` pertencem ao mundo /emocoes). Aqui as superfícies são branco, céu claro e os azuis.
- **Don't** colocar eyebrow, kicker ou etiqueta em caixa alta acima de um título. Caixa alta só nas unidades do contador.
- **Don't** montar grade de cards iguais com ícone em cima e frase embaixo; as 4 aulas são escotilhas com a lâmina real, e as peças são leques.
- **Don't** aplicar gradiente em texto. O único gradiente colorido é a faixa arco-íris de 8px no card de oferta; os gradientes de fundo são branco → céu.
- **Don't** usar sombra dura, deslocada ou preta sobre fundo claro; preto só na lâmina sobre `fundo`.
- **Don't** mostrar preço, "R$ 67", selo de desconto, contador ou bônus no hero, no header ou em qualquer seção antes de `#bonus`, nem pela barra fixa.
- **Don't** usar amarelo como fundo de seção ou como cor de parágrafo, nem coral como botão enquanto o sol estiver na tela.
- **Don't** trocar Baloo 2 / Quicksand por Fraunces / Nunito (ou qualquer outra face) dentro do `.arca`, nem usar Baloo abaixo do peso 700.
- **Don't** prometer Baby, acesso vitalício ou R$ 67 fora do `promoAtiva()`, nem afirmar prazo de acesso, número de alunos ou igrejas que não existem em `PRODUCT.md`.
- **Don't** usar mockup, ilustração genérica ou imagem gerada no lugar das páginas reais do material.

---

# Design System: Criatividades Bíblicas — mundo Plano Anual / "Letra da capa"

> **Escopo.** Este bloco descreve o mundo **"Plano Anual / Letra da capa"**: a rota perene `/plano-anual` (`app/plano-anual/page.js`), o carrossel `components/plano-anual/Roda.js` e os tokens `pa-*` no fim de `app/globals.css` (bloco `.pa`, logo depois do bloco `.arca`). É o terceiro mundo do repositório, peer do mundo "Arca / Packs" descrito acima e do mundo de `/emocoes` — nenhum dos três se sobrescreve; cada landing carrega sua própria classe raiz (`.arca`, `.pa`) ou o `@theme` base. As fontes são carregadas via `next/font`: Lilita One dentro do próprio `app/plano-anual/page.js` (só essa rota usa), Nunito em `app/layout.js` (compartilhada com o resto do site).

## Overview

**Creative North Star: "A letra da capa virou o mundo"**

A capa de cada apostila usa uma letra gorda e redonda pra gritar o nome da história; essa letra virou o H1 e os H2 da página. O argumento aqui não é "olha que bonito": é sequência — uma história por mês, quatro ou cinco domingos dentro dela — então o mundo visual fica quase todo em dois tons (branco e céu claro), sem competir com esse argumento, e usa cor cheia (`pa-campo`, verde) só nas duas seções que precisam de peso: o diagnóstico da dor e o bônus Baby. O sol amarelo, como no mundo Arca, é o único botão. O sinal autoral não é uma forma nem uma animação de fundo: é a **roda 3D das capas girando**, sem número e sem ordem — decisão trancada pela cliente em 2026-09-09 (spec, §2) porque a assinatura segue a trilha de quem assina, não o calendário civil.

Rejeições confirmadas no build: fundo creme, numeração ou ordem na roda (nada de "mês 1", nada de índice), preço, selo de desconto ou contador no hero ou em qualquer seção antes de `#oferta`, ilustração genérica no lugar de página real.

**Key characteristics:**
- Fundo quase sempre branco ou céu claro; verde campo só em dois campos inteiros de seção (diagnóstico, bônus).
- Lilita One (peso único, 400) nos títulos e nos números; Nunito no texto corrido.
- A roda 3D (`components/plano-anual/Roda.js`) como sinal autoral — não uma forma estática nem uma animação de fundo.
- Páginas reais dos PDFs, em leque ou em foto avulsa, nunca mockup nem ilustração gerada.
- Pílulas sol carregam toda badge/etiqueta da página (faixa etária, "Domingo N", "X estudos" da roda), sempre com texto tinta.

## Colors

| Token | Hex | Uso |
|---|---|---|
| `pa-branco` | `#ffffff` | fundo padrão do documento (`.pa { background }`, `body:has(> .pa)`); raramente aparece como classe utilitária porque o branco já é o fundo-base da página |
| `pa-ceu-claro` | `#eaf6ff` | fundo das seções de respiro ("o que chega todo mês", "três faixas, uma história", "como funciona"), casca do card de oferta, notas de anotação, balão de depoimento, caixa de garantia, véu da roda |
| `pa-ceu` | `#59b6f0` | token reservado da paleta aprovada pra detalhe/véu com opacidade; **o build atual não pinta nenhuma superfície com ele** — o véu da roda usa `pa-ceu-claro` no lugar. Reserva, não padrão |
| `pa-campo` | `#2a8a3e` | os dois campos inteiros de peso da página (diagnóstico "é falta de sequência", bônus Baby), span de destaque nos H2 ("todo mês.", "Plano Anual Biblinho."), ícone de check da oferta, traço conector das anotações |
| `pa-campo-escuro` | `#1f6b2f` | título das notas de anotação sobre céu claro — mais escuro que `pa-campo` pra manter contraste em texto pequeno |
| `pa-sol` | `#ffc531` | o botão, sempre; toda pílula/badge (faixa etária das três apostilas, "Domingo N" das quatro aulas, "X estudos" na legenda da roda), CTA do header, ícones do bônus, aro da capa Baby na oferta |
| `pa-laranja` | `#e8562a` | ponto de atenção único da página: a frase-virada da cena da dor, "Quanto do que eu ensino fica?" — a única linha em toda a página nessa cor |
| `pa-terra` | `#8a5a3c` | token reservado da paleta aprovada (madeira/terra); **não aparece em nenhuma superfície do build atual** |
| `pa-tinta` | `#22303f` | o texto: títulos a 100%, corpo em opacidades fixas (85/80/78/75/70/65/60%, conforme a seção) |

### Named Rules
**A Regra do Botão Sol.** Todo botão da página é `pa-sol` com texto `pa-tinta`, em pílula, sem exceção — não existe aqui um segundo tom de botão reservado, como o coral no mundo Arca.

**A Regra do Fundo Claro.** Fundo de seção é `pa-branco` ou `pa-ceu-claro`, nunca creme, marfim ou areia (essas cores pertencem a outros mundos do repositório). `pa-campo` cheio é reservado às duas seções de maior peso argumentativo; nenhuma seção usa `pa-sol` ou `pa-laranja` como fundo.

## Typography

**Display Font:** Lilita One (peso único 400 — **a fonte não publica outro peso**; carregada via `next/font/google` em `app/plano-anual/page.js` com `weight: "400"`. Ênfase vem de cor e tamanho, nunca de negrito ou itálico, porque não existe variante pra sintetizar)
**Body Font:** Nunito (carregada em `app/layout.js`, compartilhada com o resto do site, pesos `["400","500","600","700","800"]`. O peso 500 foi acrescentado especificamente pra suportar as classes `font-medium` usadas no corpo desta página; é inerte nas outras rotas — `font-medium` só aparece nesta página e em `/aprendendo-a-obedecer`, e essa última usa Quicksand, não Nunito, como fonte de corpo, já carregada com o peso 500 dela mesma)

### Hierarchy (levantada em `app/plano-anual/page.js` e `components/plano-anual/Roda.js`)
- **Display** (400, `text-balance`, leading 1.02–1.08): H1 do hero, três linhas (2,35rem abaixo de 360px, 2,7rem de 360px, 4,1rem no `md`), e o H2 que nomeia o produto na virada, "Foi pra esse ano que existe o Plano Anual Biblinho." (2,4rem → 3,5rem).
- **Headline** (400, leading 1.06–1.08): H2 padrão de cada seção, via o componente local `H2` (2rem → 2,75rem no `md`), e o H2 do diagnóstico sobre campo verde, "É falta de sequência." (2,2rem → 3,2rem).
- **Frase-virada** (400, leading 1.15, `pa-laranja`, largura contida): o parágrafo que fecha a cena da dor, "Quanto do que eu ensino fica?" (1,6rem → 2,1rem no `md`). Uma por página, mesma regra do mundo Arca.
- **Title** (400, leading tight, 1,3rem–1,6rem): H3 dos cards — aulas da Arca (1,35rem), peças do que chega todo mês (1,45rem), card de oferta (1,6rem), passos de "como funciona" (1,3rem) — e o nome da história em destaque na legenda da roda (1,35rem).
- **Anotação** (400, `text-lg`/18px, leading tight): título das notas laterais em "a fala já vem escrita".
- **Body** (Nunito, leading relaxed, 17px → 20px no `md`): parágrafos de abertura de seção e blocos narrativos, via o componente local `Texto` (largura máxima 44–60ch).
- **Body card** (Nunito, leading relaxed, 15px): texto dentro de cards de peça, notas de anotação, blockquotes das três faixas e da oferta.
- **Small** (Nunito, 12–14px): rótulo do hero (12px, uppercase, tracking 0.12em), citação em itálico dos versículos do quadro da Arca (14px), legendas de rodapé de bloco (13–14px: "arrasta pro lado ou usa as setas", "Pix, boleto ou cartão…"), e o número de estudos (13px) sob o nome de cada capa na fila estática que substitui a roda quando `prefers-reduced-motion` está ativo — mesmo tamanho da dica de arrasto, mesma legenda, só que sem o giro 3D.
- **Label / badge** (400, `text-sm`/14px a `text-base`/16px, sempre dentro de pílula `pa-sol`): "Domingo N", a faixa etária ("Baby · 1 a 3 anos"), "X estudos" na legenda da roda.
- **Números** (400, `leading-none`): preço grande da oferta (3,4rem, `pa-campo`); dígitos dos três passos de "como funciona" (text-xl dentro do círculo sol).

### Named Rules
**A Regra do Peso Único do Display.** Lilita One só existe em 400. Se um título precisa de mais peso visual, o recurso é tamanho ou cor (`pa-campo`, `pa-laranja`), nunca negrito forçado pelo navegador sobre uma fonte que não tem essa variante.

**A Regra do Corpo Redondo.** Nunito carrega o texto corrido em 400/500/600/700/800 (ver nota acima sobre o 500 acrescentado pra esta página); a letra é geométrica e redonda, mantendo a mesma leitura confortável em 17–20px do mundo Arca.

## Shapes

Raio cresce com o tamanho do objeto — mesma lógica do mundo Arca: capas da roda e do hero 12px, imagem grande da apostila anotada 14px, capas empilhadas da oferta 10px, caixas pequenas (nota de anotação no celular, caixa de garantia) 1,25rem, notas de anotação e blockquotes das faixas 1,5rem, balão de depoimento e cards de "como funciona" 1,75rem, card de peça e card das três faixas 2rem, casca do card de oferta 2,25rem. Botões, badges e avatares são pílula (`9999px`). Não há canto reto em nenhuma superfície do mundo; a exceção de sempre são as próprias páginas reais, que trazem canto de papel e recebem 12–14px por cima.

## Components

### Buttons
Um único formato, sem variante secundária — o mundo Arca reserva um botão coral que o build não usa; aqui não existe nem essa reserva. Pílula `pa-sol`, texto `pa-tinta` em Lilita One 18px `leading-none`, padding 16px × 32px, brilho `0 12px 28px -10px rgba(233,164,0,0.75)`; hover sobe 2px e clareia pra `#ffd15a`; `active` encolhe pra `scale(0.98)`. Um botão por bloco, componente local `Botao()` em `app/plano-anual/page.js`.

### A roda das histórias (sinal autoral)
`components/plano-anual/Roda.js`: carrossel 3D circular (CSS `perspective` + `rotateY`/`translateZ`), gira por arrasto (mouse e toque via Pointer Events), setas e teclado (`ArrowLeft`/`ArrowRight`), e encaixa na capa mais próxima ao soltar. A capa da frente fica nítida, com reflexo suave embaixo e uma legenda (`aria-live="polite"`) com o nome da história e o número de estudos; as capas laterais inclinam, encolhem e recebem um véu `pa-ceu-claro`; as de trás somem (opacidade 0.35). A matemática pura do giro (ângulo, passo, raio) vive em `components/plano-anual/roda-math.js`, coberta por testes (`roda-math.test.mjs`) — o raio do círculo é função do número de capas e da largura de cada uma (`raio(n, larguraCapa)`), então qualquer ajuste de tamanho muda a geometria inteira e pede conferência visual, não só a conta. Com `prefers-reduced-motion: reduce`, a roda vira uma fila horizontal estática com a capa central maior — nunca some, nunca quebra.

**A Regra da Roda Sem Calendário.** Nenhuma capa carrega número, ordem ou rótulo de mês — nem na roda, nem na legenda, nem em nenhum outro leque da página. Decisão trancada pela cliente: quem assina começa pela própria história 1 da trilha, não pelo mês 1 do calendário civil, então numerar a roda mentiria sobre a experiência de quem assina em outubro.

## Do's and Don'ts

### Do:
- **Do** escrever em português do Brasil, em segunda pessoa, frase curta antes de argumento: cena primeiro, diagnóstico depois, nunca o contrário.
- **Do** manter fundo branco ou céu claro em toda seção que não seja o diagnóstico ou o bônus; `pa-campo` cheio é reservado só a essas duas.
- **Do** usar Lilita One só em 400 e Nunito pro corpo; nenhuma outra face dentro do `.pa`.
- **Do** dar a cada H2 um parágrafo Nunito de 17–20px e no máximo um botão sol por bloco.
- **Do** mostrar página real de apostila em toda peça de prova (leques, faixas, apostila anotada); nunca ilustração genérica.
- **Do** manter a roda sem número, sem ordem e sem rótulo de mês, com `prefers-reduced-motion` sempre respeitado.
- **Do** conferir a roda pelo olho depois de qualquer ajuste de tamanho: o raio muda com a largura da capa (`raio(n, larguraCapa)` em `roda-math.js`), então a conta certa nem sempre parece certa na tela.
- **Do** vestir Nav, Footer e FaqItem compartilhados pelo escopo `.pa` (mesma técnica do `.arca`), em vez de duplicar componentes.

### Don't:
- **Don't** usar fundo creme, marfim ou areia como superfície de seção — essas cores pertencem a outros mundos do repositório.
- **Don't** numerar a roda, ordenar as histórias ou escrever "mês 1" em qualquer lugar da página: é uma decisão trancada pela cliente, não um detalhe de estilo.
- **Don't** mostrar preço, contador ou selo de desconto no hero ou em qualquer seção antes de `#oferta`: esta é uma página perene, sem prazo.
- **Don't** forçar negrito ou itálico em Lilita One — a fonte só existe em 400; use `pa-campo` ou `pa-laranja` pra dar peso a um título.
- **Don't** pintar `pa-ceu` ou `pa-terra` só "porque estão na paleta": são tokens reservados; se um dia forem usados de fato, esta seção precisa ser atualizada junto.
- **Don't** usar mockup, ilustração genérica ou imagem gerada no lugar das páginas reais do material — mesma regra do mundo Arca.
