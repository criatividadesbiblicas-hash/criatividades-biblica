# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Professoras e líderes do Ministério Infantil / Escola Bíblica Dominical de igrejas evangélicas no Brasil, quase sempre voluntárias, preparando a aula de domingo à noite ou no fim de semana, muitas vezes pelo celular. Secundário: mães que ensinam a Bíblia em casa. O comprador é quase sempre a própria professora (mulher, 25 a 55 anos).

## Product Purpose

A Criatividades Bíblicas produz material bíblico infantil pronto pra imprimir (apostila do professor com a fala pronta, atividades, quadro de história ilustrado, versículo, lembrancinha, carta pra família), em 3 faixas: Baby (1 a 3), Kids (4 a 6) e Júnior (7 a 10). Carro-chefe: Plano Anual Biblinho (R$ 497/ano). Packs avulsos são a porta de entrada.

Este site (Next.js na Vercel) hospeda as páginas de venda. A página `/arca-de-noe` vende o **Pack Arca de Noé: Aprendendo a Obedecer** (4 estudos, Kids + Júnior). Sucesso = compra pela Kiwify dentro da semana de lançamento (sáb 12/09 a qua 16/09/2026), CPA ≤ R$ 25 nos anúncios.

## Positioning

Aula inteira pronta, com a fala da professora escrita em linguagem de criança e um recurso visual grande (quadro de história) pra contar mostrando. Cada estudo é um marco da história, não a história inteira repetida. Concorrentes vendem atividades soltas; a CB vende a sequência de 4 domingos com progressão, nas 3 faixas etárias, com o mesmo visual.

## Operating Context

Compra pela Kiwify (Pix, boleto, cartão); acesso por e-mail à área da Kiwify; PDFs impressos em casa/igreja/gráfica (quadro e lembrancinha em papel 180g, atividades em sulfite). Tráfego vem do Instagram (41 mil seguidores), TikTok (12,5 mil) e Meta Ads. Pixel Meta 493199083223154 + Clarity; Purchase vem por webhook Kiwify → Supabase → API de Conversões.

## Capabilities and Constraints

- Pack Arca de Noé = material Kids + Júnior completo. Preço normal R$ 97; promocional de lançamento R$ 67 até 16/09/2026 23h59.
- **Bônus só na semana de lançamento: Pack Baby completo + acesso vitalício.** Fora da promoção, nem o Baby nem o acesso vitalício estão prometidos (prazo padrão de acesso: não decidido, não afirmar).
- Garantia de 7 dias (padrão Kiwify), sempre.
- Material é fechado (sem edição de texto/cores). Uso permitido dentro do ministério da compradora; proibido revender/repassar.
- Link do checkout ainda não existe (placeholder `pay.kiwify.com.br/ARCA-DE-NOE`).
- Página não deve ir ao ar antes da abertura (robots noindex; sem push no `main`, que publica na Vercel).
- Português do Brasil obrigatório (nunca PT-PT).

## Brand Commitments

- Nome e logo Criatividades Bíblicas (`public/marca/logo-horizontal.png`); mascote Biblinho.
- Voz: direta, alegre, de professora pra professora; frases curtas; nunca fria ou corporativa. Conteúdo infantil pede cor viva e fundo claro.
- Para esta página a dona pediu: **storytelling (dor → solução → bônus → preço; nada de preço ou bônus no topo), fontes arredondadas e limpas no estilo da capa (Baloo 2 + Quicksand, confirmado), paleta livre em relação à página /emocoes, sem "cara de IA".**

## Evidence on Hand

- Páginas reais do material renderizadas em `public/arca-de-noe/*.webp` (capas, apostila, atividades, quadro de história, versículos, lembrança, carta Querida Família).
- 4 depoimentos reais com foto em `public/depoimentos/` (Lorena Xavier, Claudia Alves, Kessia Alves, Maria Alcantara).
- Selo de garantia `public/emocoes/garantia.png`.
- Ausente (não inventar): prints de comentários/DMs (dona vai enviar 6 a 10), número de alunos/igrejas atendidas, vídeo do material.

## Product Principles

1. A professora precisa entender em segundos que a aula já vem pronta.
2. Mostrar página real antes de qualquer promessa; nada de mockup genérico.
3. Uma história por vez: cada peça de comunicação carrega um marco da narrativa.
4. Preço e bônus entram depois que o valor foi provado, nunca no topo.
5. Tudo o que é dito precisa ser verdade hoje (sem claims de acesso, prazo ou números que não existem).
