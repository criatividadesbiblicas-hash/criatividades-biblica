"""Atualizacao de 19/11/2026 (pedido da Thali): exemplos do material por dentro passam a vir
dos estudos mais recentes (agosto a novembro de 2026) e as capas refeitas em 16 a 18/11 entram no site.
- Capas novas (Kids): Filho Prodigo "O Grande Amor de Deus", Dez Leprosos "Aprendendo a Ser Grato",
  Ovelha Perdida "O Amor de Jesus por Mim", e a capa de novembro "As Cores da Salvacao".
- Paginas internas (apostila, quadro, atividade, versiculo, lembranca, Querida Familia) de
  Ovelha Perdida (ago), Elias (set), Daniel (out) e Cores da Salvacao (nov), Kids.
- Hora da Historia nas 3 faixas: Filho Prodigo (o estudo mais recente que tem Junior; apostilas refeitas em 17 e 18/11).
Uso:
  python scripts/black-biblinho-assets-2.py          # gera os .webp + sidecars
  python scripts/black-biblinho-assets-2.py --check
Tudo e pagina real de PDF; nada gerado por IA.
"""
import json, os, sys, glob, datetime
import pymupdf  # pip install pymupdf
from PIL import Image

BASE = r"F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL/2026"
RAIZ = os.path.join(os.path.dirname(__file__), "..", "public")

def pdf(rel_glob):
    hits = glob.glob(os.path.join(BASE, rel_glob))
    if len(hits) != 1:
        raise SystemExit(f"PDF esperado 1, achou {len(hits)}: {rel_glob} -> {hits}")
    return hits[0]

OVELHA = "8 OVELHA PERDIDA"
ELIAS = "9 EILAS NO MONTE"
DANIEL = "10 DANIEL NA COVA DOS LEOES 2026"
CORES = "11 JESUS E ZAQUEU - CORES DA SALVA*"
PRODIGO = "6 FILHO PRODIGO"

# (pasta em public, nome, glob relativo a BASE, pagina 1-based, largura final)
ITENS = [
    # capas refeitas (substituem as antigas, mesmo nome de arquivo) + novembro
    ("plano-anual", "capa-filho-prodigo",  f"{PRODIGO}/2 KIDS/2 APOSTILA/KIDS CAPA DAS ATIVIDADES  - O GRANDE AMOR DE DEUS.pdf", 1, 900),
    ("plano-anual", "capa-dez-leprosos",   "7 DEZ LEPROSOS/2 KIDS/2 APOSTILA/KIDS CAPA DAS ATIVIDADES - APRENDENDO A SER GRATO.pdf", 1, 900),
    ("plano-anual", "capa-ovelha-perdida", f"{OVELHA}/KIDS/2 apostila/KIDS CAPA DAS ATIVIDADES - O AMOR DE JESUS POR MIM.pdf", 1, 900),
    ("plano-anual", "capa-cores",          f"{CORES}/KIDS/2 APOSTILA/KIDS CAPA DAS ATIVIDADES  - AS CORES*.pdf", 1, 900),

    # apostila do professor (retrato 828)
    ("plano-anual", "cores-apostila",  f"{CORES}/KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 11, 828),
    ("plano-anual", "ovelha-apostila", f"{OVELHA}/KIDS/2 apostila/KIDS APOSTILA PROFESSOR - O AMOR DE JESUS POR MIM.pdf", 10, 828),
    ("plano-anual", "daniel-apostila", f"{DANIEL}/KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 17, 828),
    ("plano-anual", "elias-apostila",  f"{ELIAS}/KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR - LIDANDO*.pdf", 11, 828),
    ("plano-anual", "ovelha-area",     f"{OVELHA}/KIDS/2 apostila/KIDS APOSTILA PROFESSOR - O AMOR DE JESUS POR MIM.pdf", 8, 828),

    # quadro de historia (retrato 828)
    ("plano-anual", "daniel-quadro", f"{DANIEL}/KIDS/1 RECURSOS/KIDS QUADRO DE HIST*.pdf", 11, 828),
    ("plano-anual", "cores-quadro",  f"{CORES}/KIDS/1 RECURSO/KIDS QUADRO DE HISTORIA*.pdf", 6, 828),
    ("plano-anual", "elias-quadro",  f"{ELIAS}/KIDS/1 RECURSO/KIDS QUADRO DE HIST*.pdf", 5, 828),
    ("plano-anual", "ovelha-quadro", f"{OVELHA}/KIDS/1 RECURSO/KIDS QUADRO DE HIST*.pdf", 7, 828),
    ("plano-anual", "cores-quadro-2", f"{CORES}/KIDS/1 RECURSO/KIDS QUADRO DE HISTORIA*.pdf", 3, 828),

    # atividades (retrato 828)
    ("plano-anual", "daniel-atividade", f"{DANIEL}/KIDS/2 APOSTILA E ATIVIDADES/KIDS ATIVIDADES  - CRIAN*.pdf", 3, 828),
    ("plano-anual", "ovelha-atividade", f"{OVELHA}/KIDS/2 apostila/KIDS ATIVIDADES - O AMOR DE JESUS POR MIM.pdf", 3, 828),
    ("plano-anual", "elias-atividade",  f"{ELIAS}/KIDS/2 APOSTILA E ATIVIDADES/KIDS ATIVIDADES  - LIDANDO*.pdf", 5, 828),
    ("plano-anual", "cores-atividade",  f"{CORES}/KIDS/2 APOSTILA/KIDS ATIVIDADES  - AS CORES*.pdf", 4, 828),
    ("plano-anual", "ovelha-atividade-2", f"{OVELHA}/KIDS/2 apostila/KIDS ATIVIDADES - O AMOR DE JESUS POR MIM.pdf", 7, 828),

    # versiculo pra parede (paisagem 1200)
    ("plano-anual", "ovelha-versiculo", f"{OVELHA}/KIDS/1 RECURSO/KIDS VERS*CULO DE MEMORIZA*O - A OVELHA PERDIDA.pdf", 1, 1200),
    ("plano-anual", "cores-versiculo",  f"{CORES}/KIDS/1 RECURSO/KIDS VERS*.pdf", 1, 1200),
    ("plano-anual", "daniel-versiculo", f"{DANIEL}/KIDS/1 RECURSOS/KIDS VERS*.pdf", 1, 1200),

    # lembrancinha (retrato 828)
    ("plano-anual", "ovelha-lembranca", f"{OVELHA}/KIDS/KIDS LEMBRAN*A - O AMOR DE JESUS POR MIM.pdf", 1, 828),
    ("plano-anual", "cores-lembranca",  f"{CORES}/KIDS/BABY E KIDS LEMBRAN*.pdf", 1, 828),
    ("plano-anual", "daniel-lembranca", f"{DANIEL}/KIDS/KIDS LEMBRAN*.pdf", 1, 828),

    # Querida Familia (pagina 1 do caderno de atividades; retrato 828)
    ("plano-anual", "cores-familia",  f"{CORES}/KIDS/2 APOSTILA/KIDS ATIVIDADES  - AS CORES*.pdf", 1, 828),
    ("plano-anual", "ovelha-familia", f"{OVELHA}/KIDS/2 apostila/KIDS ATIVIDADES - O AMOR DE JESUS POR MIM.pdf", 1, 828),

    # Hora da Historia nas 3 faixas: Filho Prodigo (paginas conferidas por folha de contato, 19/11)
    ("plano-anual", "prodigo-baby-hora",   f"{PRODIGO}/1 BABY/2 APOSTILA/BABY APOSTILA PROFESSOR*.pdf", 10, 1300),
    ("plano-anual", "prodigo-kids-hora",   f"{PRODIGO}/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR - O GRANDE AMOR DE DEUS.pdf", 11, 1300),
    ("plano-anual", "prodigo-junior-hora", f"{PRODIGO}/3 JUNIOR/2 APOSTILA/JUNIOR APOSTILA PROFESSOR - O GRANDE AMOR DE DEUS.pdf", 11, 1300),
]

def render(origem, page, width, dest_png):
    doc = pymupdf.open(origem)
    pg = doc[page - 1]
    zoom = width / pg.rect.width
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(dest_png)

def salvar(pasta, nome, rel, page, width):
    out = os.path.join(RAIZ, pasta)
    os.makedirs(out, exist_ok=True)
    origem = pdf(rel)
    tmp = os.path.join(out, nome + ".png")
    render(origem, page, width, tmp)
    img = Image.open(tmp).convert("RGB")
    img.save(os.path.join(out, nome + ".webp"), "WEBP", quality=82, method=6)
    os.remove(tmp)
    side = {
        "prompt": f"Origem: pagina {page} do PDF real '{os.path.basename(origem)}' (Criatividades Biblicas, 2 PLANO ANUAL/2026), renderizada com PyMuPDF via scripts/black-biblinho-assets-2.py. Nao e imagem gerada por IA.",
        "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    with open(os.path.join(out, nome + ".webp.json"), "w", encoding="utf-8") as f:
        json.dump(side, f, ensure_ascii=False, indent=2)
    print("ok", pasta + "/" + nome, img.size)

def check():
    faltam = [f"{p}/{n}" for p, n, *_ in ITENS if not os.path.exists(os.path.join(RAIZ, p, n + ".webp"))]
    if faltam:
        raise SystemExit("faltam: " + ", ".join(faltam))
    print("ok: todos os arquivos existem")

if __name__ == "__main__":
    if "--check" in sys.argv:
        check()
    else:
        so = [a for a in sys.argv[1:] if not a.startswith("--")]
        for pasta, nome, rel, page, width in ITENS:
            if so and nome not in so:
                continue
            salvar(pasta, nome, rel, page, width)
