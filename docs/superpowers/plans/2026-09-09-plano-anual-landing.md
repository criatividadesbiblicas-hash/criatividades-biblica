# Landing do Plano Anual Biblinho — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar a página de venda perene do Plano Anual Biblinho em `materiais.criatividadesbiblicas.com.br/plano-anual`, com storytelling em 13 blocos, roda 3D das capas e páginas reais do material.

**Architecture:** Nova rota no app Next.js existente (`app/plano-anual/page.js`, server component) que monta 13 seções a partir de dados estáticos (`components/plano-anual/dados.js`). Um único componente cliente novo (`Roda.js`) faz o carrossel 3D; a matemática dele fica num módulo puro testável (`roda-math.js`). Tracking, Leque, FaqItem, Nav e Footer são reaproveitados do Arca. Assets vêm de PDFs reais renderizados por script Python.

**Tech Stack:** Next.js 15.5 (app router, `next/font/google`, `next/image`), React 19, Tailwind v4 (`@theme`), Node 20+ (`node --test`), Python 3 + PyMuPDF (assets), Chrome headless (OG image e capturas), Vercel (deploy via push na `main`).

**Spec:** `docs/superpowers/specs/2026-09-09-plano-anual-landing-design.md`

## Global Constraints

- Repo: `C:\Users\thali\Desktop\sandbox\site\criatividades-biblicas` (todos os caminhos abaixo são relativos a ele).
- Idioma de toda copy: **português do Brasil**. Proibido português de Portugal ("está a passar", "de seguida", "ecrã", "miúdos", "ficheiro").
- Oferta exata: **De R$ 1.164,00 por R$ 597,00 à vista ou 12x de R$ 61,74**. Plano = Kids (4 a 6) + Júnior (7 a 10). Bônus permanente = material Baby (1 a 3) o ano inteiro.
- Checkout: `https://pay.kiwify.com.br/kuUKSBr`. **Sem contador, sem data, sem "só nesta semana".**
- Fontes: Lilita One (display) + Nunito (texto). Paleta `pa-*` da spec §4. Fundo branco ou céu claro, nunca creme. Botões sempre `pa-sol` com texto `pa-tinta`.
- Nenhuma imagem gerada por IA; só páginas reais dos PDFs + logo da marca. Todo `.webp` novo tem sidecar `.webp.json` com origem.
- Roda das histórias: **sem numeração, sem ordem**, 8 capas Kids.
- Depoimentos: só reais, enviados pela Thali; enquanto `DEPOIMENTOS` estiver vazio a seção não renderiza.
- Nunca fazer `git push` sem autorização explícita da Thali ("pode publicar"). Commits locais são livres.
- Arquivos com acentos: escrever com a ferramenta Write/Edit, nunca heredoc no Bash (o console Windows corrompe).
- Chrome headless: `"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new`.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `scripts/plano-anual-assets.py` | Renderiza páginas dos PDFs → `public/plano-anual/*.webp` + sidecars; `--preview` para escolher páginas; `--check` valida saída |
| `scripts/plano-anual-og.html` | Composição da OG image 1200×630 (três capas sobre céu claro) |
| `public/plano-anual/` | capas das 8 histórias, páginas extras dos leques, três faixas da Arca, `og.png` |
| `app/globals.css` | bloco `.pa` (tokens, fontes, keyframes, Nav/Footer/FAQ vestidos) |
| `next.config.mjs` | libera `/plano-anual`; redireciona `/planoanualbiblinho` (host materiais) |
| `components/plano-anual/dados.js` | HISTORIAS, AULAS_ARCA, PECAS, ANOTACOES, FAIXAS, DEPOIMENTOS, FAQ, OFERTA, textos fixos |
| `components/plano-anual/roda-math.js` | funções puras da roda (índice da frente, encaixe, estado por capa, raio) |
| `components/plano-anual/roda-math.test.mjs` | testes `node --test` |
| `components/plano-anual/dados.test.mjs` | testes `node --test` dos dados (arquivos existem, preço, FAQ) |
| `components/plano-anual/Roda.js` | componente cliente do carrossel 3D |
| `components/plano-anual/Tracking.js` | Pixel/Clarity + repasse de UTM (cópia do Arca com produto trocado) |
| `app/plano-anual/page.js` | página (13 blocos, metadata, JSON-LD) |
| `package.json` | script `"test": "node --test components/**/*.test.mjs"` |

---

### Task 1: Assets reais dos PDFs

**Files:**
- Create: `scripts/plano-anual-assets.py`
- Create: `public/plano-anual/*.webp` + `*.webp.json` (gerados)

**Interfaces:**
- Produces: arquivos com estes nomes exatos, usados por `dados.js` na Task 3:
  - capas (largura 900): `capa-semeador.webp`, `capa-fornalha.webp`, `capa-zaqueu.webp`, `capa-arca.webp`, `capa-adao-e-eva.webp`, `capa-filho-prodigo.webp`, `capa-dez-leprosos.webp`, `capa-ovelha-perdida.webp`
  - extras dos leques (largura 828): `semeador-apostila.webp`, `semeador-quadro.webp`, `zaqueu-atividade.webp`, `zaqueu-familia.webp`, `prodigo-quadro.webp`, `prodigo-versiculo.webp`, `prodigo-lembranca.webp`
  - três faixas da Arca (largura 1300): `arca-baby-hora.webp`, `arca-kids-hora.webp`, `arca-junior-hora.webp`

- [ ] **Step 1: Criar o script com modo preview**

`scripts/plano-anual-assets.py`:

```python
"""Renderiza paginas reais dos PDFs do Plano Anual 2026 para public/plano-anual/.
Uso:
  python scripts/plano-anual-assets.py --preview   # PNGs das paginas 1-14 das apostilas da Arca em _preview/
  python scripts/plano-anual-assets.py             # gera os .webp finais + sidecars
  python scripts/plano-anual-assets.py --check     # valida que todos os arquivos existem com largura certa
"""
import json, os, sys, glob, datetime
import pymupdf  # pip install pymupdf
from PIL import Image

BASE = r"F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL/2026"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "plano-anual")
os.makedirs(OUT, exist_ok=True)

def pdf(rel_glob):
    hits = glob.glob(os.path.join(BASE, rel_glob))
    if not hits:
        raise SystemExit(f"PDF nao encontrado: {rel_glob}")
    return hits[0]

# (nome, glob relativo a BASE, pagina 1-based, largura final)
CAPAS = [
    ("capa-semeador",       "1 PARABOLA DO SEMEADOR/2 KIDS/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES KIDS*.pdf", 1, 900),
    ("capa-fornalha",       "2 NA FORNALHA/2 KIDS/2 APOSTILA E ATIVIDADES/CAPA DE ATIVIDADES*.pdf", 1, 900),
    ("capa-zaqueu",         "3 JESUS E ZAQUEU/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("capa-arca",           "4 ARCA DE NOE/2 KIDS/2 APOSTILA/KIDS CAPA DE ATIVIDADES*.pdf", 1, 900),
    ("capa-adao-e-eva",     "5 AD*O E EVA/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("capa-filho-prodigo",  "6 FILHO PRODIGO/2 KIDS/2 APOSTILA/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("capa-dez-leprosos",   "7 DEZ LEPROSOS/2 KIDS/2 APOSTILA/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("capa-ovelha-perdida", "8 OVELHA PERDIDA/KIDS/2 apostila/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
]
EXTRAS = [
    ("semeador-apostila", "1 PARABOLA DO SEMEADOR/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 9, 828),
    ("semeador-quadro",   "1 PARABOLA DO SEMEADOR/2 KIDS/1 RECURSOS VISUAIS/KIDS - QUADRO DE HISTORIA*.pdf", 2, 828),
    ("zaqueu-atividade",  "3 JESUS E ZAQUEU/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS ATIVIDADE DO ESTUDO 1*.pdf", 1, 828),
    ("zaqueu-familia",    "3 JESUS E ZAQUEU/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS QUERIDA FAMILIA*.pdf", 1, 828),
    ("prodigo-quadro",    "6 FILHO PRODIGO/2 KIDS/1 RECURSO/KIDS QUADRO DE HIST*RIA*.pdf", 2, 828),
    ("prodigo-versiculo", "6 FILHO PRODIGO/2 KIDS/1 RECURSO/KIDS VERS*CULO*.pdf", 1, 828),
    ("prodigo-lembranca", "6 FILHO PRODIGO/2 KIDS/3 LEMBRAN*A/KIDS LEMBRAN*A*.pdf", 1, 828),
]
# Pagina da "Hora da Historia" do Estudo 1 em cada apostila da Arca.
# Preencher depois de olhar _preview/ (rodar --preview). Valores iniciais = palpite; o --preview confirma.
APOSTILAS_ARCA = {
    "arca-baby-hora":   ("4 ARCA DE NOE/1 BABY/2 APOSTILA/BABY APOSTILA PROFESSOR*.pdf", 10),
    "arca-kids-hora":   ("4 ARCA DE NOE/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 10),
    "arca-junior-hora": ("4 ARCA DE NOE/3 JUNIOR/2 APOSTILA/J*NIOR APOSTILA PROFESSOR*.pdf", 10),
}

def render(rel, page, width, dest_png):
    doc = pymupdf.open(pdf(rel))
    pg = doc[page - 1]
    zoom = width / pg.rect.width
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(dest_png)
    return pdf(rel)

def salvar(nome, rel, page, width):
    tmp = os.path.join(OUT, nome + ".png")
    origem = render(rel, page, width, tmp)
    img = Image.open(tmp).convert("RGB")
    img.save(os.path.join(OUT, nome + ".webp"), "WEBP", quality=82, method=6)
    os.remove(tmp)
    side = {
        "prompt": f"Origem: pagina {page} do PDF real '{os.path.basename(origem)}' (Criatividades Biblicas, 2 PLANO ANUAL/2026), renderizada com PyMuPDF via scripts/plano-anual-assets.py. Nao e imagem gerada por IA.",
        "createdAt": datetime.datetime.utcnow().isoformat() + "Z",
    }
    with open(os.path.join(OUT, nome + ".webp.json"), "w", encoding="utf-8") as f:
        json.dump(side, f, ensure_ascii=False, indent=2)
    print("ok", nome, img.size)

def preview():
    pdir = os.path.join(OUT, "_preview"); os.makedirs(pdir, exist_ok=True)
    for nome, (rel, _) in APOSTILAS_ARCA.items():
        doc = pymupdf.open(pdf(rel))
        for p in range(1, min(15, len(doc)) + 1):
            doc[p - 1].get_pixmap(matrix=pymupdf.Matrix(0.6, 0.6)).save(os.path.join(pdir, f"{nome}-p{p:02d}.png"))
        print("preview", nome, len(doc), "paginas")

def check():
    esperados = {n: w for n, _, _, w in CAPAS + EXTRAS}
    esperados.update({n: 1300 for n in APOSTILAS_ARCA})
    erros = 0
    for n, w in esperados.items():
        f = os.path.join(OUT, n + ".webp")
        if not os.path.exists(f) or not os.path.exists(f + ".json"):
            print("FALTA", n); erros += 1; continue
        real = Image.open(f).size[0]
        if abs(real - w) > 2:
            print("LARGURA", n, real, "esperado", w); erros += 1
    print("check:", "OK" if erros == 0 else f"{erros} problema(s)")
    sys.exit(1 if erros else 0)

if __name__ == "__main__":
    if "--preview" in sys.argv: preview()
    elif "--check" in sys.argv: check()
    else:
        for n, rel, p, w in CAPAS + EXTRAS: salvar(n, rel, p, w)
        for n, (rel, p) in APOSTILAS_ARCA.items(): salvar(n, rel, p, 1300)
```

- [ ] **Step 2: Rodar o preview e escolher as páginas da "Hora da História"**

Run: `python scripts/plano-anual-assets.py --preview`
Expected: `preview arca-baby-hora N paginas` (3 linhas) e PNGs em `public/plano-anual/_preview/`.

Abrir com a ferramenta Read os PNGs `arca-kids-hora-p08.png` a `p12.png` (e o mesmo para baby/junior) e localizar a página com o título **"HORA DA HISTÓRIA"** do Estudo 1 (a que tem `MOSTRE A FIGURA 1`). Atualizar os três números em `APOSTILAS_ARCA` com a página encontrada. Apagar `_preview/` depois: `rm -rf public/plano-anual/_preview`.

- [ ] **Step 3: Gerar os assets finais**

Run: `python scripts/plano-anual-assets.py`
Expected: 18 linhas `ok <nome> (largura, altura)`.

- [ ] **Step 4: Validar**

Run: `python scripts/plano-anual-assets.py --check`
Expected: `check: OK`, exit 0.

Abrir com Read `public/plano-anual/capa-semeador.webp` e `arca-kids-hora.webp` para conferir visualmente que são a capa do Semeador e a página da Hora da História.

- [ ] **Step 5: Commit**

```bash
git add scripts/plano-anual-assets.py public/plano-anual
git commit -m "plano-anual: assets reais dos PDFs (8 capas, extras dos leques, tres faixas da Arca)"
```

---

### Task 2: Tokens CSS, fontes e rota liberada

**Files:**
- Modify: `app/globals.css` (acrescentar no fim)
- Modify: `next.config.mjs:9-19`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces: classes utilitárias Tailwind `bg-pa-*`, `text-pa-*`, `ring-pa-*`; classe raiz `.pa`; animação `.pa-flutua` (vars `--r`, `--dur`, `--delay`); vestimenta de `header`, `footer` e FAQ dentro de `.pa`. A página (Task 6) precisa aplicar `className="pa <var da fonte Lilita>"` na raiz e definir `--font-lilita` via `next/font`.

- [ ] **Step 1: Acrescentar o bloco `.pa` no fim de `app/globals.css`**

```css
/* Landing /plano-anual: mundo "Letra da capa" (Lilita One + Nunito; ceu claro, campo, sol) */
@theme {
  --color-pa-branco: #ffffff;
  --color-pa-ceu-claro: #eaf6ff;
  --color-pa-ceu: #59b6f0;
  --color-pa-campo: #2a8a3e;
  --color-pa-campo-escuro: #1f6b2f;
  --color-pa-sol: #ffc531;
  --color-pa-laranja: #e8562a;
  --color-pa-terra: #8a5a3c;
  --color-pa-tinta: #22303f;
}

.pa {
  --font-display: var(--font-lilita), "Lilita One", system-ui, sans-serif;
  --font-body: var(--font-nunito), "Nunito", system-ui, sans-serif;
  font-family: var(--font-body);
  color: var(--color-pa-tinta);
  background: #ffffff;
  scrollbar-color: var(--color-pa-campo) var(--color-pa-ceu-claro);
}
.pa ::selection { background: var(--color-pa-sol); color: var(--color-pa-tinta); }
.pa :focus-visible { outline: 3px solid var(--color-pa-campo); outline-offset: 3px; border-radius: 999px; }
.pa a { text-underline-offset: 0.18em; }
body:has(> .pa) { background: #ffffff; }

/* sinal do dia: capas flutuando devagar */
@keyframes pa-flutua {
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50% { transform: translateY(-9px) rotate(calc(var(--r, 0deg) + 1deg)); }
}
.pa-flutua {
  animation: pa-flutua var(--dur, 7s) cubic-bezier(0.45, 0, 0.2, 1) infinite;
  animation-delay: var(--delay, 0s);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .pa-flutua { animation: none; }
}

/* Cabecalho e rodape compartilhados, vestidos com o mundo do Plano Anual */
.pa header { background: rgba(255, 255, 255, 0.92); border-color: #cfe7f7; }
.pa header a[href="#oferta"] {
  background: #ffc531; color: #22303f; font-family: var(--font-display); font-weight: 400; font-size: 16px;
  letter-spacing: 0.01em; box-shadow: 0 8px 20px -10px rgba(233, 164, 0, 0.8);
}
.pa header a[href="#oferta"]:hover { background: #ffd15a; }
.pa footer { background: #ffffff; border-color: #cfe7f7; }
.pa footer p, .pa footer a, .pa footer div { color: #22303f; }
.pa footer .text-cacau\/50, .pa footer .text-cacau\/70 { color: rgba(34, 48, 63, 0.6); }
.pa footer a:hover { color: #2a8a3e; }
.pa footer > div:last-child { border-color: #cfe7f7; }

/* FAQ compartilhado vestido */
.pa .border-sand\/50 { border-color: #cfe7f7; }
.pa button span.font-display { color: #22303f; font-weight: 400; }
.pa button svg.text-coral-deep { color: #2a8a3e; }
.pa .text-cacau\/75 { color: rgba(34, 48, 63, 0.78); }
```

- [ ] **Step 2: Liberar a rota no `next.config.mjs`**

Substituir o array de redirects por:

```js
    return [
      // Subdomínio dos Packs e do Plano Anual (materiais.criatividadesbiblicas.com.br)
      { source: "/", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/materiais", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/materiais/:path*", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/planoanualbiblinho", has: materiais, destination: "/plano-anual", permanent: false },
      { source: "/emocoes", has: materiais, destination: "https://emocoes.criatividadesbiblicas.com.br/emocoes", permanent: false },
      { source: "/arca-de-noe", destination: "/aprendendo-a-obedecer", permanent: false },
      // Domínio principal ainda em construção → Emoções (a rota /plano-anual agora é servida em qualquer host)
      { source: "/", destination: "/emocoes", permanent: false },
      { source: "/materiais", destination: "/emocoes", permanent: false },
      { source: "/materiais/:path*", destination: "/emocoes", permanent: false },
    ];
```

(Removidas as duas linhas `/plano-anual` e `/plano-anual/:path*` → `/emocoes`.)

- [ ] **Step 3: Script de teste no `package.json`**

Em `"scripts"` acrescentar: `"test": "node --test components/plano-anual/*.test.mjs"`.

- [ ] **Step 4: Verificar que o build ainda passa**

Run: `npm run build`
Expected: termina com a tabela de rotas, sem `Error`. (`/plano-anual` ainda cai na página antiga do rebrand, isso é esperado até a Task 6.)

- [ ] **Step 5: Commit**

```bash
git add app/globals.css next.config.mjs package.json
git commit -m "plano-anual: tokens .pa, fontes, rota liberada e script de teste"
```

---

### Task 3: Dados da página (`dados.js`) com teste

**Files:**
- Create: `components/plano-anual/dados.js`
- Create: `components/plano-anual/dados.test.mjs`

**Interfaces:**
- Produces (todos `export const`, módulo **sem** `"use client"`):
  - `KIWIFY_URL: string`
  - `OFERTA = { de: "R$ 1.164,00", por: "R$ 597,00", parcela: "12x de R$ 61,74", precoNumero: 597 }`
  - `HISTORIAS: { slug, nome, estudos, src }[]` (8 itens; `src` = `/plano-anual/capa-<slug>.webp`)
  - `AULAS_ARCA: { n, titulo, texto, licao, verso, ref, img }[]` (4)
  - `PECAS: { titulo, texto, imagens: string[], grande?, paisagem?, largo? }[]` (6)
  - `ANOTACOES: { lado: "esq"|"dir", titulo, texto }[]` (5)
  - `FAIXAS: { faixa, idade, src, trecho }[]` (3)
  - `DEPOIMENTOS: { name, iniciais, cor, role, quote }[]` (vazio por enquanto)
  - `FAQ: { q, a }[]` (9)

- [ ] **Step 1: Escrever o teste**

`components/plano-anual/dados.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HISTORIAS, AULAS_ARCA, PECAS, FAIXAS, FAQ, OFERTA, KIWIFY_URL, DEPOIMENTOS } from "./dados.js";

const pub = (src) => join(process.cwd(), "public", src);

test("oferta e checkout exatos", () => {
  assert.equal(OFERTA.de, "R$ 1.164,00");
  assert.equal(OFERTA.por, "R$ 597,00");
  assert.equal(OFERTA.parcela, "12x de R$ 61,74");
  assert.equal(OFERTA.precoNumero, 597);
  assert.equal(KIWIFY_URL, "https://pay.kiwify.com.br/kuUKSBr");
});

test("8 historias com capa existente e sem numeracao", () => {
  assert.equal(HISTORIAS.length, 8);
  for (const h of HISTORIAS) {
    assert.ok(existsSync(pub(h.src)), `capa faltando: ${h.src}`);
    assert.ok(!/^\d|m[eê]s \d/i.test(h.nome), `nome numerado: ${h.nome}`);
    assert.ok(h.estudos >= 4 && h.estudos <= 5);
  }
});

test("todas as imagens referenciadas existem", () => {
  const srcs = [
    ...AULAS_ARCA.map((a) => a.img),
    ...PECAS.flatMap((p) => p.imagens),
    ...FAIXAS.map((f) => f.src),
  ];
  for (const s of srcs) assert.ok(existsSync(pub(s)), `imagem faltando: ${s}`);
});

test("faq cobre as objecoes da spec", () => {
  const perguntas = FAQ.map((f) => f.q.toLowerCase()).join(" | ");
  for (const chave of ["exatamente", "qual história", "de uma vez", "impresso", "papel", "equipe", "pack", "12 meses", "garantia"]) {
    assert.ok(perguntas.includes(chave), `FAQ sem pergunta sobre: ${chave}`);
  }
});

test("depoimentos: array (vazio ate a Thali mandar)", () => {
  assert.ok(Array.isArray(DEPOIMENTOS));
  for (const d of DEPOIMENTOS) assert.match(d.name, /^[^\s]+( [^\s]+)? [A-ZÀ-Ú]\.$/, "nome deve ser 'Nome I.'");
});

test("nada de portugues de Portugal nos textos", () => {
  const tudo = JSON.stringify({ AULAS_ARCA, PECAS, FAIXAS, FAQ });
  for (const pt of ["está a ", "de seguida", "ecrã", "miúdos", "ficheiro", "estás a "]) {
    assert.ok(!tudo.includes(pt), `PT-PT encontrado: ${pt}`);
  }
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL com `Cannot find module './dados.js'`.

- [ ] **Step 3: Escrever `components/plano-anual/dados.js`**

```js
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
  { faixa: "Baby", idade: "1 a 3 anos", src: "/plano-anual/arca-baby-hora.webp", trecho: "TRANSCREVER 1 frase da pagina arca-baby-hora.webp" },
  { faixa: "Kids", idade: "4 a 6 anos", src: "/plano-anual/arca-kids-hora.webp", trecho: "TRANSCREVER 1 frase da pagina arca-kids-hora.webp" },
  { faixa: "Júnior", idade: "7 a 10 anos", src: "/plano-anual/arca-junior-hora.webp", trecho: "TRANSCREVER 1 frase da pagina arca-junior-hora.webp" },
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
```

**Antes do Step 4:** abrir com Read `public/plano-anual/arca-baby-hora.webp`, `arca-kids-hora.webp` e `arca-junior-hora.webp` e substituir os três `trecho` por uma frase literal de cada página (a da fala da professora contando a história). Sem isso o bloco 9 mente.

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: 6 testes, `# pass 6`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add components/plano-anual/dados.js components/plano-anual/dados.test.mjs
git commit -m "plano-anual: dados da pagina (historias, pecas, faixas, faq, oferta) com testes"
```

---

### Task 4: Roda 3D (matemática pura + componente cliente)

**Files:**
- Create: `components/plano-anual/roda-math.js`
- Create: `components/plano-anual/roda-math.test.mjs`
- Create: `components/plano-anual/Roda.js`

**Interfaces:**
- `roda-math.js` exporta:
  - `normalizar(a: number): number` → ângulo em (-180, 180]
  - `passo(n: number): number` → 360/n
  - `indiceDaFrente(ang: number, n: number): number` → 0..n-1
  - `encaixar(ang: number, n: number): number` → múltiplo de `passo(n)` mais próximo
  - `estadoCapa(i: number, ang: number, n: number): { angulo, veu, oculta, z }`
  - `raio(n: number, larguraCapa: number): number` → px
- `Roda.js` exporta default `Roda({ historias })` onde `historias = HISTORIAS` de `dados.js`. Componente `"use client"`.

- [ ] **Step 1: Teste da matemática**

`components/plano-anual/roda-math.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, passo, indiceDaFrente, encaixar, estadoCapa, raio } from "./roda-math.js";

test("normalizar leva qualquer angulo para (-180, 180]", () => {
  assert.equal(normalizar(0), 0);
  assert.equal(normalizar(190), -170);
  assert.equal(normalizar(-190), 170);
  assert.equal(normalizar(720), 0);
});

test("passo e indice da frente com 8 capas", () => {
  assert.equal(passo(8), 45);
  assert.equal(indiceDaFrente(0, 8), 0);
  assert.equal(indiceDaFrente(45, 8), 1);
  assert.equal(indiceDaFrente(-45, 8), 7);
  assert.equal(indiceDaFrente(20, 8), 0);
  assert.equal(indiceDaFrente(25, 8), 1);
  assert.equal(indiceDaFrente(360 * 3 + 90, 8), 2);
});

test("encaixar arredonda para o multiplo do passo", () => {
  assert.equal(encaixar(20, 8), 0);
  assert.equal(encaixar(25, 8), 45);
  assert.equal(encaixar(-70, 8), -90);
});

test("estadoCapa: frente nitida, fundo oculto, z decresce com o angulo", () => {
  const frente = estadoCapa(0, 0, 8);
  assert.equal(frente.angulo, 0);
  assert.equal(frente.veu, 0);
  assert.equal(frente.oculta, false);
  assert.equal(frente.z, 100);
  const lado = estadoCapa(1, 0, 8);
  assert.equal(lado.angulo, 45);
  assert.ok(lado.veu > 0.2 && lado.veu < 0.4);
  assert.equal(lado.oculta, false);
  const fundo = estadoCapa(4, 0, 8);
  assert.equal(Math.abs(fundo.angulo), 180);
  assert.equal(fundo.oculta, true);
  assert.ok(fundo.z < lado.z && lado.z < frente.z);
});

test("raio cresce com o numero de capas e a largura", () => {
  assert.ok(raio(8, 240) > raio(6, 240));
  assert.ok(raio(8, 300) > raio(8, 240));
  assert.equal(raio(8, 240), Math.round(120 / Math.tan(Math.PI / 8)) + 40);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: os 5 testes de roda-math FALHAM com `Cannot find module './roda-math.js'`; os 6 de dados passam.

- [ ] **Step 3: Implementar `roda-math.js`**

```js
// Matematica pura da roda 3D das historias (sem DOM, testavel com node --test).
export const normalizar = (a) => ((a % 360) + 540) % 360 - 180;
export const passo = (n) => 360 / n;
export const indiceDaFrente = (ang, n) => ((Math.round(ang / passo(n)) % n) + n) % n;
export const encaixar = (ang, n) => Math.round(ang / passo(n)) * passo(n);
export function estadoCapa(i, ang, n) {
  const angulo = normalizar(i * passo(n) - ang);
  const t = Math.abs(angulo) / 180; // 0 = frente, 1 = fundo
  return {
    angulo,
    veu: Math.min(0.78, t * 1.15),
    oculta: t > 0.62,
    z: Math.round(100 - Math.abs(angulo)),
  };
}
// Raio pra n capas de `larguraCapa` px nao se sobreporem, com folga de 40px.
export const raio = (n, larguraCapa) => Math.round(larguraCapa / 2 / Math.tan(Math.PI / n)) + 40;
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: `# pass 11`, `# fail 0`.

- [ ] **Step 5: Escrever o componente `Roda.js`**

```jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { passo, indiceDaFrente, encaixar, estadoCapa, raio } from "./roda-math";

const LARGURA = 220; // px da capa em desktop
const SENSIBILIDADE = 0.28; // graus por pixel arrastado

// Carrossel 3D circular das capas. Sem numero, sem ordem. Gira por arrasto (mouse/toque),
// setas e teclado. Com prefers-reduced-motion vira uma fila estatica com a capa central maior.
export default function Roda({ historias }) {
  const n = historias.length;
  const R = raio(n, LARGURA);
  const [ang, setAng] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [reduzido, setReduzido] = useState(false);
  const inicio = useRef({ x: 0, ang: 0 });
  const frente = indiceDaFrente(ang, n);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzido(mq.matches);
    const f = (e) => setReduzido(e.matches);
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const girar = (delta) => setAng((a) => encaixar(a, n) + delta * passo(n));

  const onPointerDown = (e) => {
    inicio.current = { x: e.clientX, ang };
    setArrastando(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!arrastando) return;
    setAng(inicio.current.ang + (e.clientX - inicio.current.x) * SENSIBILIDADE);
  };
  const onPointerUp = () => {
    if (!arrastando) return;
    setArrastando(false);
    setAng((a) => encaixar(a, n));
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") girar(1);
    if (e.key === "ArrowLeft") girar(-1);
  };

  if (reduzido) {
    return (
      <div className="flex items-end justify-center gap-4 overflow-x-auto px-4 py-6">
        {historias.map((h, i) => (
          <figure key={h.slug} className={`shrink-0 text-center ${i === 2 ? "w-56" : "w-36 opacity-80"}`}>
            <Image src={h.src} alt={`Capa: ${h.nome}`} width={900} height={1273} className="rounded-[12px] border-4 border-white shadow-[0_18px_40px_-16px_rgba(11,60,100,0.35)]" />
            <figcaption className="mt-2 text-sm font-bold">{h.nome}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="select-none">
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Histórias do Plano Anual"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative mx-auto h-[420px] w-full max-w-5xl touch-pan-y outline-none [perspective:1400px] [perspective-origin:50%_40%] md:h-[470px] ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 left-1/2 h-24 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(42,138,62,0.16),rgba(42,138,62,0))]"
        />
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
          style={{
            transform: `translateZ(-${R}px) rotateY(${-ang}deg)`,
            transition: arrastando ? "none" : "transform .55s cubic-bezier(.22,.8,.26,1)",
          }}
        >
          {historias.map((h, i) => {
            const s = estadoCapa(i, ang, n);
            return (
              <figure
                key={h.slug}
                className="absolute [backface-visibility:hidden] [transform-style:preserve-3d]"
                style={{
                  width: LARGURA,
                  left: -LARGURA / 2,
                  top: -150,
                  zIndex: s.z,
                  opacity: s.oculta ? 0.35 : 1,
                  transform: `rotateY(${i * passo(n)}deg) translateZ(${R}px)`,
                }}
              >
                <div className="relative">
                  <Image
                    src={h.src}
                    alt={i === frente ? `Capa: ${h.nome}` : ""}
                    width={900}
                    height={1273}
                    sizes="220px"
                    priority={i < 3}
                    draggable={false}
                    className="pointer-events-none block w-full rounded-[12px] border-4 border-white shadow-[0_22px_48px_rgba(11,60,100,0.28)]"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[12px] bg-pa-ceu-claro transition-opacity duration-300" style={{ opacity: s.veu }} />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 right-0 top-full mt-1.5 h-[70px] rounded-[12px] opacity-[0.14] blur-[1px] [mask-image:linear-gradient(#000,transparent)]"
                    style={{ background: `url(${h.src}) center top / 100% auto no-repeat`, transform: "scaleY(-1)" }}
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      <p className="min-h-[3.25rem] text-center" aria-live="polite">
        <span className="block font-display text-[1.35rem] text-pa-tinta">{historias[frente].nome}</span>
        <span className="block text-sm font-semibold text-pa-tinta/70">{historias[frente].estudos} estudos</span>
      </p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button type="button" onClick={() => girar(-1)} aria-label="História anterior" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pa-tinta shadow-[0_6px_16px_rgba(11,60,100,0.16)] transition-colors hover:bg-pa-sol">
          <CaretLeft size={22} weight="bold" />
        </button>
        <button type="button" onClick={() => girar(1)} aria-label="Próxima história" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-pa-tinta shadow-[0_6px_16px_rgba(11,60,100,0.16)] transition-colors hover:bg-pa-sol">
          <CaretRight size={22} weight="bold" />
        </button>
      </div>
      <p className="mt-3 text-center text-[13px] font-semibold text-pa-tinta/60">arrasta pro lado ou usa as setas</p>
    </div>
  );
}
```

- [ ] **Step 6: Conferir que compila**

Run: `npm run build`
Expected: sem erro. (O componente ainda não é usado; a página entra na Task 6.)

- [ ] **Step 7: Commit**

```bash
git add components/plano-anual/roda-math.js components/plano-anual/roda-math.test.mjs components/plano-anual/Roda.js
git commit -m "plano-anual: roda 3D das historias (matematica testada + componente cliente)"
```

---

### Task 5: Tracking da página

**Files:**
- Create: `components/plano-anual/Tracking.js`

**Interfaces:**
- Produces: default export `Tracking()` (componente cliente, sem props). Dispara `PageView`, `ViewContent` e `InitiateCheckout` no Pixel `493199083223154`, carrega Clarity `ydn96d2tri`, repassa `utm_*`/`src`/`sck` da URL pros links `pay.kiwify.com.br`.

- [ ] **Step 1: Criar o arquivo**

Copiar `components/arca/Tracking.js` para `components/plano-anual/Tracking.js` e trocar somente:

```js
// Rastreamento da landing /plano-anual (materiais.criatividadesbiblicas.com.br; mesmo pixel e Clarity da /emocoes e do Arca)
const PRODUTO = {
  content_name: "Plano Anual Biblinho",
  content_ids: ["plano-anual"],
  content_type: "product",
  value: 597,
  currency: "BRL",
};
```

Tudo o mais (função `fire`, `useEffect`, scripts do Pixel e do Clarity, `noscript`) fica idêntico ao original.

- [ ] **Step 2: Verificar a diferença**

Run: `diff components/arca/Tracking.js components/plano-anual/Tracking.js`
Expected: só as linhas do comentário de cabeçalho e do objeto `PRODUTO` mudam.

- [ ] **Step 3: Commit**

```bash
git add components/plano-anual/Tracking.js
git commit -m "plano-anual: tracking (pixel, clarity, utm) com produto proprio"
```

---

### Task 6: Página, blocos 1 a 5 (hero, cena, diagnóstico, virada, roda)

**Files:**
- Modify: `app/plano-anual/page.js` (substituir o conteúdo inteiro; a versão antiga do rebrand sai)

**Interfaces:**
- Consumes: `dados.js` (Task 3), `Roda` (Task 4), `Tracking` (Task 5), `Nav`, `Footer`, tokens `.pa` (Task 2).
- Produces: componentes locais `Botao`, `H2`, `Secao` reutilizados pelas Tasks 7 e 8 (mesmo arquivo).

- [ ] **Step 1: Escrever o esqueleto + blocos 1 a 5**

`app/plano-anual/page.js`:

```jsx
/*
  CONTRATO DE DIREÇÃO — Plano Anual Biblinho (perene)
  THESIS: a professora entra numa sexta à noite sem aula e sai com o ano inteiro resolvido; a página
  é uma história (cena → diagnóstico → virada → roda das histórias → material real → prova → oferta)
  e recusa hero com preço, selo de desconto e contador.
  OWN-WORLD: "letra da capa" — Lilita One nos títulos, Nunito no texto; céu claro e branco em campos
  inteiros, verde campo nos destaques, sol nos botões, laranja no ponto de atenção. Páginas reais dos
  PDFs em leque; sinal autoral = a roda 3D das capas (sem número, sem ordem).
  FORM: mundo PINADO pela cliente em 2026-09-09 (direção A no companion visual; roda circular aprovada).
  FINISH: unreviewed is unfinished — build, revisão impeccable, capturas 1440/390, roda no toque, pixel.
*/
import Image from "next/image";
import { Lilita_One } from "next/font/google";
import { ArrowDown, CheckCircle, Gift } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FaqItem from "@/components/FaqItem";
import Leque from "@/components/arca/Leque";
import Roda from "@/components/plano-anual/Roda";
import Tracking from "@/components/plano-anual/Tracking";
import { KIWIFY_URL, OFERTA, HISTORIAS, AULAS_ARCA, PECAS, ANOTACOES, FAIXAS, DEPOIMENTOS, FAQ } from "@/components/plano-anual/dados";

const lilita = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita", display: "swap" });

const HOST = "https://materiais.criatividadesbiblicas.com.br";
const PAGE_URL = `${HOST}/plano-anual`;
const TITLE = "Plano Anual Biblinho: um ano de aula bíblica pronta | Criatividades Bíblicas";
const DESCRIPTION =
  "Uma história bíblica por mês, com a aula pronta pra Kids (4 a 6) e Júnior (7 a 10) e o material Baby de bônus: apostila com a fala da professora, quadro de história, atividades, versículo e lembrancinha. R$ 597 à vista ou 12x de R$ 61,74.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Criatividades Bíblicas",
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${HOST}/plano-anual/og.png`, width: 1200, height: 630, alt: "Plano Anual Biblinho" }],
  },
  robots: { index: true, follow: true },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Plano Anual Biblinho",
      description: DESCRIPTION,
      image: `${HOST}/plano-anual/og.png`,
      brand: { "@type": "Brand", name: "Criatividades Bíblicas" },
      offers: { "@type": "Offer", price: String(OFERTA.precoNumero), priceCurrency: "BRL", availability: "https://schema.org/InStock", url: PAGE_URL },
    },
    { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

/* ---------- peças locais ---------- */

function Botao({ href = KIWIFY_URL, children, className = "", externo = true }) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-pa-sol px-8 py-4 font-display text-lg leading-none text-pa-tinta shadow-[0_12px_28px_-10px_rgba(233,164,0,0.75)] transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#ffd15a] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

function H2({ children, className = "" }) {
  return <h2 className={`text-balance font-display text-[2rem] leading-[1.08] text-pa-tinta md:text-[2.75rem] ${className}`}>{children}</h2>;
}

function Texto({ children, className = "" }) {
  return <p className={`text-[17px] font-medium leading-relaxed text-pa-tinta/80 md:text-xl ${className}`}>{children}</p>;
}

export default function PlanoAnualPage() {
  return (
    <div className={`pa ${lilita.variable}`}>
      <Nav cta={{ label: "Quero o Plano Anual", href: "#oferta" }} links={[]} logoHref="/plano-anual" />
      <Tracking />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <main>
        {/* 1. Hero: a promessa, sem preço */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eaf6ff_100%)]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-10 md:grid-cols-[1.1fr_1fr] md:px-8 md:pb-20 md:pt-16">
            <div className="relative z-10">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-pa-campo">Plano Anual Biblinho · Kids + Júnior · bônus Baby</p>
              <h1 className="mt-4 text-balance font-display text-[2.7rem] leading-[1.02] text-pa-tinta md:text-[4.1rem]">
                Cinquenta e dois domingos.
                <br />
                <span className="text-pa-campo">Uma história por mês.</span>
                <br />
                A aula já vem pronta.
              </h1>
              <Texto className="mt-6 max-w-[44ch]">
                Apostila com a fala da professora escrita, quadro de história, atividades, versículo e lembrancinha. Do berçário ao Júnior, na mesma história.
              </Texto>
              <div className="mt-8">
                <Botao href="#cena" externo={false}>
                  Quero ver como funciona <ArrowDown size={20} weight="bold" />
                </Botao>
              </div>
            </div>
            <div className="relative mx-auto aspect-[5/4] w-full max-w-lg md:max-w-none">
              <Image src={HISTORIAS[0].src} alt="" width={900} height={1273} priority className="pa-flutua absolute left-[2%] top-[10%] hidden h-[72%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(11,60,100,0.45)] sm:block" style={{ "--r": "-8deg", "--dur": "7.5s", "--delay": "0.4s" }} />
              <Image src={HISTORIAS[1].src} alt={`Capa do material: ${HISTORIAS[1].nome}`} width={900} height={1273} priority className="pa-flutua absolute left-[30%] top-[2%] z-10 h-[86%] w-auto rounded-[12px] border-4 border-white shadow-[0_34px_54px_-18px_rgba(11,60,100,0.5)]" style={{ "--r": "2deg", "--dur": "6.4s" }} />
              <Image src={HISTORIAS[2].src} alt="" width={900} height={1273} priority className="pa-flutua absolute left-[60%] top-[12%] h-[70%] w-auto rounded-[12px] border-4 border-white shadow-[0_28px_44px_-18px_rgba(11,60,100,0.45)]" style={{ "--r": "8deg", "--dur": "8.2s", "--delay": "1s" }} />
            </div>
          </div>
        </section>

        {/* 2. A cena: sexta à noite */}
        <section id="cena" className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <H2>Sexta-feira, 22h40.</H2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-pa-tinta/85 md:text-xl">
              <p>Eu ainda não sei o que vou ensinar domingo.</p>
              <p>
                O Pinterest está aberto em doze abas. A impressora está sem tinta. Amanhã tem três turmas na mesma manhã, e o berçário não recebe nada novo desde março. Eu vou improvisar de novo. Eu sempre dou um jeito.
              </p>
              <p>
                Domingo, na roda, eu pergunto quem lembra da história da semana passada. A menina que decorou o versículo não lembra quem era Zaqueu. O menino que participou de tudo não lembra nem que teve história.
              </p>
              <p className="font-display text-[1.6rem] leading-[1.15] text-pa-laranja md:text-[2.1rem]">Quanto do que eu ensino fica?</p>
            </div>
          </div>
        </section>

        {/* 3. O diagnóstico */}
        <section className="bg-pa-campo text-white">
          <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <h2 className="text-balance font-display text-[2.2rem] leading-[1.06] md:text-[3.2rem]">
              Não é falta de esforço. <span className="text-pa-sol">É falta de sequência.</span>
            </h2>
            <div className="mt-6 space-y-5 text-[17px] font-medium leading-relaxed text-white/90 md:text-xl">
              <p>Criança aprende com história. E história precisa de continuação.</p>
              <p>Uma aula solta por semana é semente sem terra: cai, brilha no domingo e seca na segunda. Quatro domingos dentro da mesma história é onde ela cria raiz. A criança volta sabendo onde parou, a família escuta a mesma história a semana inteira, e o versículo entra sem decoreba.</p>
            </div>
          </div>
        </section>

        {/* 4. A virada */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 pb-6 pt-16 md:px-8 md:pt-24">
            <h2 className="text-balance font-display text-[2.4rem] leading-[1.02] text-pa-tinta md:text-[3.5rem]">
              Foi pra esse ano que existe o <span className="text-pa-campo">Plano Anual Biblinho.</span>
            </h2>
            <Texto className="mt-6 max-w-[60ch]">
              Uma história por mês, com quatro ou cinco domingos dentro dela. Kids e Júnior na mesma história, e o material Baby junto, de bônus. Sua igreja inteira aprendendo a mesma coisa no mesmo mês, do berçário ao Júnior.
            </Texto>
          </div>
        </section>

        {/* 5. A roda das histórias */}
        <section className="overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eaf6ff_55%,#dcefff_100%)]">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24">
            <H2 className="text-center">
              Uma história nova <span className="text-pa-campo">todo mês.</span>
            </H2>
            <Texto className="mx-auto mt-4 max-w-[56ch] text-center">
              Cada uma com quatro ou cinco domingos dentro, pra Kids e Júnior, com o Baby junto. A criança acompanha a mesma história o mês inteiro.
            </Texto>
            <div className="mt-8">
              <Roda historias={HISTORIAS} />
            </div>
          </div>
        </section>

        {/* Blocos 6 a 13 entram nas Tasks 7 e 8 */}
        <section id="oferta" className="bg-white py-16 text-center">
          <Botao>Quero o Plano Anual</Botao>
        </section>
      </main>
      <Footer showNav={false} />
    </div>
  );
}
```

- [ ] **Step 2: Build e captura**

Run: `npm run build`
Expected: sem erro; rota `/plano-anual` listada.

Subir o dev server pela ferramenta `preview_start` com `name: "criatividades-biblicas"` (porta 3001) e abrir `http://localhost:3001/plano-anual`. Rodar `read_console_messages` com `onlyErrors: true`: esperado nenhum erro. Tirar screenshot: hero com três capas flutuando, blocos 2 a 4, roda girando.

Testar a roda: clicar na seta "Próxima história" e confirmar que a legenda troca de "Jesus e Zaqueu" para "Arca de Noé" (`read_page` no `aria-live`).

- [ ] **Step 3: Commit**

```bash
git add app/plano-anual/page.js
git commit -m "plano-anual: pagina nova, blocos 1-5 (hero, cena, diagnostico, virada, roda)"
```

---

### Task 7: Blocos 6 a 9 (mês por dentro, peças, apostila anotada, três faixas)

**Files:**
- Modify: `app/plano-anual/page.js` (substituir o placeholder `{/* Blocos 6 a 13 ... */}` + seção `#oferta` temporária)

**Interfaces:**
- Consumes: `AULAS_ARCA`, `PECAS`, `ANOTACOES`, `FAIXAS`, `Leque`, `H2`, `Texto`, `Botao`.

- [ ] **Step 1: Inserir os blocos 6 a 9 no lugar do placeholder**

```jsx
        {/* 6. Um mês por dentro: os 4 domingos da Arca */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>Um mês por dentro.</H2>
            <Texto className="mt-4 max-w-[58ch]">
              Pega a Arca de Noé. Cada domingo é um marco da história e uma lição diferente. A criança acompanha Noé do chamado ao arco-íris, e no fim do mês sabe contar tudo.
            </Texto>
            <ol className="mt-12 grid gap-x-6 gap-y-10 min-[420px]:grid-cols-2 lg:grid-cols-4">
              {AULAS_ARCA.map((a) => (
                <li key={a.n} className="flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border-4 border-white shadow-[0_18px_34px_-14px_rgba(11,60,100,0.35)]">
                    <Image src={a.img} alt={`Lâmina do quadro de história: ${a.titulo}`} fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover object-[center_40%]" />
                    <span className="absolute left-3 top-3 rounded-full bg-pa-sol px-3 py-1 font-display text-sm text-pa-tinta">Domingo {a.n}</span>
                  </div>
                  <h3 className="mt-5 font-display text-[1.35rem] leading-tight text-pa-tinta">{a.titulo}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</p>
                  <p className="mt-3 font-display text-base text-pa-campo">{a.licao}</p>
                  <p className="mt-2 text-[14px] italic leading-relaxed text-pa-tinta/75">
                    "{a.verso}" <span className="not-italic font-bold">{a.ref}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 7. O que chega todo mês: páginas reais em leque */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>O que chega todo mês.</H2>
            <Texto className="mt-4 max-w-[56ch]">Kids e Júnior, cada um com o material completo, e o Baby de bônus. As imagens abaixo são páginas de verdade, sem mockup.</Texto>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PECAS.map((p) => (
                <article key={p.titulo} className={`flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)] ${p.grande ? "sm:col-span-2 lg:col-span-2 lg:flex-row" : ""} ${p.largo ? "sm:col-span-2 lg:col-span-3 sm:flex-row" : ""}`}>
                  <div className={`px-6 pt-6 ${p.grande ? "lg:w-[58%] lg:pb-6" : ""} ${p.largo ? "sm:w-[40%] sm:pb-6 lg:w-[34%] lg:px-10" : ""}`}>
                    <Leque imagens={p.imagens} alt={`Páginas reais: ${p.titulo}`} paisagem={p.paisagem} />
                  </div>
                  <div className={`p-6 pt-3 ${p.grande ? "lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:pt-6" : ""} ${p.largo ? "sm:flex sm:w-[60%] sm:flex-col sm:justify-center sm:pt-6 lg:w-[66%] lg:pr-16" : ""}`}>
                    <h3 className="font-display text-[1.45rem] leading-tight text-pa-tinta">{p.titulo}</h3>
                    <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 8. A fala já vem escrita */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>A fala da professora já vem escrita.</H2>
            <Texto className="mt-4 max-w-[56ch]">Esta é uma página real da apostila Kids, sem retoque. Você lê, adapta o que quiser e conduz.</Texto>
            <div className="mt-12 grid items-start gap-8 md:grid-cols-[1fr_1.15fr_1fr]">
              <ul className="hidden flex-col gap-6 md:flex md:pt-10">
                {ANOTACOES.filter((a) => a.lado === "esq").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-pa-ceu-claro p-5 after:absolute after:right-[-18px] after:top-7 after:h-0.5 after:w-[18px] after:bg-pa-campo">
                    <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <Image src="/arca-de-noe/anotada.webp" alt="Página real do Estudo 1 da apostila Kids: rotina, objetivo, roda de conversa e explorando a Bíblia" width={1300} height={1839} className="w-full rounded-[14px] shadow-[0_30px_60px_-26px_rgba(11,60,100,0.5)] ring-1 ring-pa-tinta/10" />
              <ul className="hidden flex-col gap-6 md:flex md:pt-32">
                {ANOTACOES.filter((a) => a.lado === "dir").map((a) => (
                  <li key={a.titulo} className="relative rounded-[1.5rem] bg-pa-ceu-claro p-5 before:absolute before:left-[-18px] before:top-7 before:h-0.5 before:w-[18px] before:bg-pa-campo">
                    <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-3 md:hidden">
                {ANOTACOES.map((a, i) => (
                  <li key={a.titulo} className="flex gap-3 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pa-sol font-display text-base text-pa-tinta">{i + 1}</span>
                    <span>
                      <span className="block font-display text-lg leading-tight text-pa-campo-escuro">{a.titulo}</span>
                      <span className="mt-1 block text-[15px] font-medium leading-relaxed text-pa-tinta/75">{a.texto}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Três faixas, uma história */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <H2>Três faixas, uma história.</H2>
            <Texto className="mt-4 max-w-[58ch]">A mesma Hora da História da Arca, escrita três vezes: pro colo, pra roda e pra turma que já lê. A linguagem muda. A história, não.</Texto>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {FAIXAS.map((f) => (
                <article key={f.faixa} className="flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_10px_30px_-18px_rgba(11,60,100,0.3)]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={f.src} alt={`Página real da apostila ${f.faixa}: Hora da História da Arca de Noé`} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover object-top" />
                    <span className="absolute left-4 top-4 rounded-full bg-pa-sol px-3 py-1 font-display text-sm text-pa-tinta">{f.faixa} · {f.idade}</span>
                  </div>
                  <blockquote className="p-6 text-[15px] font-medium italic leading-relaxed text-pa-tinta/85">"{f.trecho}"</blockquote>
                </article>
              ))}
            </div>
          </div>
        </section>
```

Manter, por enquanto, a seção `#oferta` temporária depois do bloco 9 (a Task 8 substitui).

- [ ] **Step 2: Build, captura e conferência**

Run: `npm run build` → sem erro.
No preview (`http://localhost:3001/plano-anual`): rolar até os blocos 6 a 9 e tirar screenshot. Conferir: 4 janelas dos domingos com etiqueta "Domingo N"; 6 cards de peças com leques (o da apostila largo, a carta pra família na largura toda); apostila anotada com 5 anotações; 3 cards das faixas com trecho literal.
`read_console_messages onlyErrors` → nenhum erro (em especial nenhum 404 de imagem).

- [ ] **Step 3: Commit**

```bash
git add app/plano-anual/page.js
git commit -m "plano-anual: blocos 6-9 (mes por dentro, pecas, apostila anotada, tres faixas)"
```

---

### Task 8: Blocos 10 a 13 (bônus, depoimentos, oferta, como funciona, FAQ, fechamento) + OG image

**Files:**
- Modify: `app/plano-anual/page.js` (substituir a seção `#oferta` temporária)
- Create: `scripts/plano-anual-og.html`
- Create: `public/plano-anual/og.png` (gerado)

**Interfaces:**
- Consumes: `DEPOIMENTOS`, `FAQ`, `OFERTA`, `KIWIFY_URL`, `FaqItem`, `Gift`, `CheckCircle`.

- [ ] **Step 1: Substituir a seção `#oferta` temporária pelos blocos 10 a 13**

```jsx
        {/* 10. Bônus Baby (permanente) */}
        <section id="bonus" className="bg-pa-campo text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
            <div className="relative mx-auto w-full max-w-sm">
              <Leque imagens={["/arca-de-noe/ativ-baby-1.webp", "/arca-de-noe/capa-baby.webp", "/arca-de-noe/ativ-baby-4.webp"]} alt="Páginas reais do material Baby" />
            </div>
            <div>
              <h2 className="text-balance font-display text-[2rem] leading-[1.08] md:text-[2.75rem]">Do berçário ao Júnior, todo mês.</h2>
              <p className="mt-5 text-[17px] font-medium leading-relaxed text-white/90 md:text-xl">
                Junto com o Plano vai o <strong className="text-pa-sol">material Baby completo</strong> (1 a 3 anos) de todas as doze histórias: apostila, atividades, balão de história, lembrancinha e carta pra família. Sem custo. Pra ninguém ficar de fora.
              </p>
              <ul className="mt-7 space-y-3 text-[16px] font-semibold">
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />O berçário recebe a mesma história que o Kids e o Júnior, no mesmo mês</li>
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />Linguagem de colo: frases curtas, gesto, repetição, oração simples</li>
                <li className="flex items-start gap-3"><Gift size={24} weight="fill" className="mt-0.5 shrink-0 text-pa-sol" />Uma igreja, uma história, três faixas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 11. Quem já usa (só com depoimentos reais) */}
        {DEPOIMENTOS.length > 0 ? (
          <section className="bg-white">
            <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
              <H2>Quem dá aula com o Plano.</H2>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {DEPOIMENTOS.map((d, i) => (
                  <li key={d.name} className={`relative rounded-[1.75rem] bg-pa-ceu-claro p-6 ${i % 3 === 1 ? "lg:mt-8" : ""}`}>
                    <blockquote className="text-[16px] font-medium leading-relaxed text-pa-tinta/90">"{d.quote}"</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${d.cor}`}>{d.iniciais}</span>
                      <span>
                        <span className="block font-display text-base text-pa-tinta">{d.name}</span>
                        <span className="block text-[13px] font-semibold text-pa-tinta/75">{d.role}</span>
                      </span>
                    </figcaption>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* 12. Oferta */}
        <section id="oferta" className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <H2 className="text-center">Quanto custa um ano de aula pronta.</H2>
            <div className="mt-10 overflow-hidden rounded-[2.25rem] bg-pa-ceu-claro shadow-[0_24px_60px_-30px_rgba(11,60,100,0.45)]">
              <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative flex items-center justify-center p-8 md:p-10">
                  <div className="relative h-72 w-full max-w-[16rem] md:h-96 md:max-w-[20rem]">
                    <Image src={HISTORIAS[2].src} alt="" width={900} height={1273} className="absolute left-0 top-4 h-[85%] w-auto -rotate-6 rounded-[10px] border-4 border-white shadow-[0_18px_36px_-14px_rgba(11,60,100,0.45)]" />
                    <Image src={HISTORIAS[0].src} alt="Capas do material" width={900} height={1273} className="absolute left-[22%] top-0 z-10 h-[92%] w-auto rotate-2 rounded-[10px] border-4 border-white shadow-[0_24px_40px_-14px_rgba(11,60,100,0.5)]" />
                    <Image src="/arca-de-noe/capa-baby.webp" alt="Capa Baby, bônus" width={1000} height={1415} className="absolute bottom-0 right-0 z-20 h-[48%] w-auto rotate-6 rounded-[10px] shadow-[0_18px_36px_-14px_rgba(11,60,100,0.45)] ring-4 ring-pa-sol" />
                  </div>
                </div>
                <div className="bg-white p-8 md:p-10">
                  <h3 className="font-display text-[1.6rem] leading-tight text-pa-tinta">Plano Anual Biblinho</h3>
                  <ul className="mt-5 space-y-2.5 text-[15px] font-medium text-pa-tinta/85">
                    {["Material Kids (4 a 6) completo, 12 histórias", "Material Júnior (7 a 10) completo, 12 histórias", "Bônus: material Baby (1 a 3) completo, 12 histórias", "Uma história nova por mês, durante 12 meses"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5"><CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-pa-campo" />{item}</li>
                    ))}
                  </ul>
                  <p className="mt-8 text-[15px] font-semibold text-pa-tinta/75">De <s>{OFERTA.de}</s> por</p>
                  <p className="mt-1 flex flex-wrap items-end gap-x-3">
                    <span className="font-display text-[3.4rem] leading-none text-pa-campo">{OFERTA.por}</span>
                    <span className="pb-2 text-[15px] font-semibold text-pa-tinta/75">à vista</span>
                  </p>
                  <p className="mt-1 text-[17px] font-bold text-pa-tinta">ou {OFERTA.parcela}</p>
                  <Botao className="mt-7 w-full sm:w-auto">Quero o Plano Anual</Botao>
                  <p className="mt-3 text-[13px] font-semibold text-pa-tinta/65">Pix, boleto ou cartão · pagamento seguro pela Kiwify</p>
                  <div className="mt-7 flex items-center gap-4 rounded-[1.25rem] bg-pa-ceu-claro p-4">
                    <Image src="/emocoes/garantia.png" alt="Selo: 7 dias de garantia ou seu dinheiro de volta" width={454} height={390} className="w-16 shrink-0" />
                    <p className="text-[14px] font-medium leading-relaxed text-pa-tinta/80"><strong className="font-bold text-pa-tinta">7 dias de garantia.</strong> Se o material não for o que você esperava, devolvemos o valor inteiro. Sem burocracia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 13a. Como funciona */}
        <section className="bg-pa-ceu-claro">
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
            <H2 className="text-center">Como funciona.</H2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { n: 1, t: "Você assina pela Kiwify.", d: "Pix, boleto ou cartão. O acesso chega no seu e-mail assim que o pagamento é aprovado." },
                { n: 2, t: "A primeira história abre na hora.", d: "Parábola do Semeador: apostila, quadro, atividades, versículo, lembrancinha e carta pra família. Baixa, imprime, dá a aula." },
                { n: 3, t: "Todo mês, uma história nova.", d: "Durante 12 meses. Kids, Júnior e Baby na mesma história, no mesmo mês." },
              ].map((p) => (
                <li key={p.n} className="rounded-[1.75rem] bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pa-sol font-display text-xl text-pa-tinta">{p.n}</span>
                  <h3 className="mt-4 font-display text-[1.3rem] leading-tight text-pa-tinta">{p.t}</h3>
                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-pa-tinta/75">{p.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 13b. FAQ */}
        <section className="bg-white">
          <div className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-20">
            <H2>Perguntas que sempre chegam.</H2>
            <div className="mt-8">
              {FAQ.map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
            </div>
          </div>
        </section>

        {/* 13c. Fechamento */}
        <section className="bg-[linear-gradient(180deg,#eaf6ff_0%,#dcefff_100%)] text-center">
          <div className="mx-auto max-w-2xl px-5 py-20 md:py-28">
            <Image src={HISTORIAS[0].src} alt="" width={900} height={1273} className="pa-flutua mx-auto h-52 w-auto rounded-[12px] border-4 border-white shadow-[0_18px_40px_-16px_rgba(11,60,100,0.45)]" style={{ "--dur": "6s", "--r": "-3deg" }} />
            <H2 className="mt-8">Domingo que vem pode ser sobre o Semeador.</H2>
            <Texto className="mt-3">Assina hoje, baixa em minutos, imprime amanhã.</Texto>
            <Botao className="mt-8">Quero o Plano Anual</Botao>
            <p className="mt-4 text-[14px] font-semibold text-pa-tinta/70">{OFERTA.por} à vista ou {OFERTA.parcela} · 7 dias de garantia</p>
          </div>
        </section>
```

- [ ] **Step 2: OG image**

`scripts/plano-anual-og.html`:

```html
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@700&display=swap" rel="stylesheet">
<style>
  html,body{margin:0}
  body{width:1200px;height:630px;overflow:hidden;font-family:Nunito,sans-serif;color:#22303f;background:linear-gradient(180deg,#ffffff,#eaf6ff)}
  .txt{position:absolute;left:72px;top:110px;width:560px}
  .eb{font-size:16px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#2a8a3e}
  h1{font-family:'Lilita One';font-weight:400;font-size:64px;line-height:1.02;margin:16px 0 22px}
  h1 span{color:#2a8a3e}
  p{font-size:22px;line-height:1.4;margin:0;color:rgba(34,48,63,.8)}
  .logo{position:absolute;left:72px;bottom:56px;height:56px}
  .capa{position:absolute;width:250px;border-radius:14px;border:5px solid #fff;box-shadow:0 30px 60px rgba(11,60,100,.3)}
</style></head><body>
  <div class="txt"><div class="eb">Plano Anual Biblinho</div>
    <h1>Uma história por mês.<br><span>A aula já vem pronta.</span></h1>
    <p>Kids + Júnior, com o material Baby de bônus. Do berçário ao Júnior, na mesma história.</p></div>
  <img class="logo" src="../public/marca/logo-horizontal.png" alt="">
  <img class="capa" style="left:700px;top:110px;transform:rotate(-8deg)" src="../public/plano-anual/capa-semeador.webp" alt="">
  <img class="capa" style="left:850px;top:70px;transform:rotate(2deg);z-index:2" src="../public/plano-anual/capa-zaqueu.webp" alt="">
  <img class="capa" style="left:990px;top:130px;transform:rotate(9deg)" src="../public/plano-anual/capa-arca.webp" alt="">
</body></html>
```

Run (Bash, uma linha):
```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --screenshot="C:/Users/thali/Desktop/sandbox/site/criatividades-biblicas/public/plano-anual/og.png" "file:///C:/Users/thali/Desktop/sandbox/site/criatividades-biblicas/scripts/plano-anual-og.html"
```
Expected: arquivo `public/plano-anual/og.png` 1200×630. Abrir com Read e conferir que as fontes carregaram (título em Lilita One) e as três capas aparecem. Criar `public/plano-anual/og.png.json` com `{"prompt":"Composicao HTML (scripts/plano-anual-og.html) com capas reais dos PDFs + logo da marca, renderizada em Chrome headless. Nao e imagem gerada por IA.","createdAt":"<ISO agora>"}`.

- [ ] **Step 3: Build e captura completa**

Run: `npm run build` → sem erro.
Run: `npm test` → `# pass 11`.
No preview: rolar até o fim. Conferir: bônus em verde com leque Baby; **nenhuma** seção de depoimentos (lista vazia); oferta com `De R$ 1.164,00 por R$ 597,00`, `ou 12x de R$ 61,74`, botão pra `pay.kiwify.com.br/kuUKSBr`; 3 passos; FAQ com 9 perguntas abrindo; fechamento. `read_console_messages onlyErrors` → nenhum.

Verificar links: `javascript_tool` com `[...document.querySelectorAll('a[href*="kiwify"]')].map(a=>a.href)` → 3 links (oferta, fechamento e... conferir; o do menu aponta pra `#oferta`), todos começando com `https://pay.kiwify.com.br/kuUKSBr`.

- [ ] **Step 4: Commit**

```bash
git add app/plano-anual/page.js scripts/plano-anual-og.html public/plano-anual/og.png public/plano-anual/og.png.json
git commit -m "plano-anual: blocos 10-13 (bonus Baby, oferta, como funciona, faq, fechamento) e OG image"
```

---

### Task 9: Verificação de acabamento e aprovação da Thali

**Files:**
- Create: `.impeccable/review/plano-anual-1440.png`, `.impeccable/review/plano-anual-390.png` (ignorados pelo git)
- Modify: `DESIGN.md` (acrescentar seção do mundo "Plano Anual / letra da capa")

- [ ] **Step 1: Capturas de página inteira**

Com o dev server no ar (porta 3001):

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,12000 --screenshot="C:/Users/thali/Desktop/sandbox/site/criatividades-biblicas/.impeccable/review/plano-anual-1440.png" "http://localhost:3001/plano-anual"
```
```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=390,16000 --screenshot="C:/Users/thali/Desktop/sandbox/site/criatividades-biblicas/.impeccable/review/plano-anual-390.png" "http://localhost:3001/plano-anual"
```
Abrir as duas com Read (PIL pode fatiar em tiras de 2000px se ficar pesado). Conferir bloco a bloco contra a spec §3: ordem, ausência de preço no hero, ausência de contador, roda sem números, oferta correta.

- [ ] **Step 2: Roda no toque e reduced-motion**

No preview: `resize_window preset mobile`, recarregar, `computer left_click_drag` da coordenada da roda 120px pra esquerda; `read_page` no `aria-live` deve mostrar outra história. Depois `resize_window preset desktop`.
Reduced-motion: `javascript_tool` → `matchMedia('(prefers-reduced-motion: reduce)').matches` (só informativo); a verificação real é abrir o DevTools emulation não disponível aqui, então testar a lógica: no código, `reduzido=true` renderiza a fila estática (já coberto por leitura do componente). Registrar no relatório.

- [ ] **Step 3: Revisão impeccable**

Invocar a skill `impeccable` com o pedido: "finish review da rota /plano-anual (app/plano-anual/page.js, components/plano-anual/*, tokens .pa em globals.css), capturas em .impeccable/review/plano-anual-*.png; mundo descrito no contrato de direção do topo da page.js". Aplicar cada item `fix` do veredito. Rodar `npm run build` e `npm test` de novo depois dos ajustes.

- [ ] **Step 4: Linter PT-BR e pixel**

Run: `grep -n -i -E "está a |estás a |de seguida|ecrã|miúdos|ficheiro|telemóvel|rapariga|autocarro" app/plano-anual/page.js components/plano-anual/dados.js`
Expected: nenhuma linha.

Pixel: no preview, `read_network_requests` com `urlPattern: "facebook.com/tr"` → pelo menos `ev=PageView` e `ev=ViewContent`. Clicar num botão da Kiwify (abre nova aba) e conferir `ev=InitiateCheckout`.

- [ ] **Step 5: DESIGN.md**

Acrescentar ao fim de `DESIGN.md` uma seção `## Mundo "Plano Anual / letra da capa"` com: fontes (Lilita One 400 display; Nunito 500/700/800 body), a tabela de tokens `pa-*` da spec §4, os raios (capa 12px, bloco 1.1rem, caixa 1.25rem, pílula 999px), regra "botão sempre sol", e o sinal autoral (roda 3D, `components/plano-anual/Roda.js`). Commit:

```bash
git add DESIGN.md app/plano-anual/page.js components/plano-anual app/globals.css
git commit -m "plano-anual: ajustes da revisao impeccable e DESIGN.md do mundo 'letra da capa'"
```

- [ ] **Step 6: Enviar capturas pra Thali e PARAR**

`SendUserFile` das duas capturas (1440 e 390) com legenda "Página pronta no local. Confere e me diz 'pode publicar'." **Não avançar pra Task 10 sem a resposta dela.**

---

### Task 10: Publicação (só com "pode publicar" da Thali)

**Files:** nenhum novo.

- [ ] **Step 1: Confirmar árvore limpa e branch**

Run: `git status --short && git branch --show-current`
Expected: nada pendente, branch `main`.

- [ ] **Step 2: Push**

Run: `git push origin main`
Expected: push aceito; a Vercel inicia o deploy automático.

- [ ] **Step 3: Verificar o deploy**

Aguardar ~2 min e rodar:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://materiais.criatividadesbiblicas.com.br/plano-anual
```
Expected: `200`.
```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://materiais.criatividadesbiblicas.com.br/planoanualbiblinho
```
Expected: `307 https://materiais.criatividadesbiblicas.com.br/plano-anual`.
```bash
curl -s https://materiais.criatividadesbiblicas.com.br/plano-anual | grep -o '"price":"597"'
```
Expected: `"price":"597"`.

- [ ] **Step 4: Conferir OG e a página no ar**

Abrir `https://materiais.criatividadesbiblicas.com.br/plano-anual` no Browser pane, screenshot do hero, `read_console_messages onlyErrors` → nenhum. Abrir `https://materiais.criatividadesbiblicas.com.br/plano-anual/og.png` → imagem carrega.

- [ ] **Step 5: Avisar a Thali**

Mensagem final com: URL da página, lembrete de trocar o link/botão da página antiga do GreatPages pra nova URL, e as pendências (depoimentos reais → ligar bloco 11; histórias 9 a 11 do ano). Atualizar a memória do projeto (`project-plano-anual-landing`) com estado, decisões e o que falta.

---

## Autorrevisão do plano (feita ao escrever)

- **Cobertura da spec:** §2 decisões → Tasks 3, 8 (oferta, sem prazo, checkout), 2 (host/rota), 9 (aprovação antes do push), 10 (índice/publicação). §3 blocos 1-13 → Tasks 6, 7, 8. §4 mundo visual → Task 2 (tokens/fontes/motion) e 6 (contrato de direção). §5 arquitetura → mapa de arquivos + Tasks 3-6. §6 assets → Task 1 e OG na 8. §7 erros/estados → Roda com reduced-motion e opacidade de fundo (Task 4), depoimentos vazios ocultos (Task 8), fallback de fonte no next/font (Task 6). §8 verificação → Task 9. §9 pendências → Task 10 Step 5.
- **Placeholders:** os únicos "preencher" são decisões humanas explícitas com instrução de como decidir (páginas da Hora da História na Task 1 e trechos literais na Task 3), não lacunas de código.
- **Consistência de nomes:** `HISTORIAS`, `AULAS_ARCA`, `PECAS`, `ANOTACOES`, `FAIXAS`, `DEPOIMENTOS`, `FAQ`, `OFERTA`, `KIWIFY_URL` iguais em dados.js, testes e page.js; `passo/indiceDaFrente/encaixar/estadoCapa/raio` iguais em roda-math.js, teste e Roda.js; arquivos de asset iguais entre o script (Task 1) e dados.js (Task 3).
