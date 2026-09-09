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
    if len(hits) > 1:
        raise SystemExit(
            f"PDF ambiguo: '{rel_glob}' bateu em {len(hits)} arquivos, "
            f"esperava exatamente 1: {hits}"
        )
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
    # pagina 1 do PDF e so instrucao pro professor (sem ilustracao); pagina 4 tem
    # as cartas do jogo da memoria com a cena do reencontro pai-filho, bem mais
    # forte visualmente pro leque da pagina de venda. Conferido com --preview manual.
    ("prodigo-lembranca", "6 FILHO PRODIGO/2 KIDS/3 LEMBRAN*A/KIDS LEMBRAN*A*.pdf", 4, 828),
]
# Pagina da "Hora da Historia" do Estudo 1 em cada apostila da Arca.
# Confirmado visualmente via --preview (public/plano-anual/_preview/*-p##.png):
# cada apostila tem o banner "HORA DA HISTORIA - QUADRO DE HISTORIA 'ARCA DE NOE'"
# em pagina diferente porque o texto de "Curiosidade Biblica"/"Explorando a Biblia"
# antes dele varia de tamanho por faixa etaria (baby tem menos texto, junior mais).
APOSTILAS_ARCA = {
    "arca-baby-hora":   ("4 ARCA DE NOE/1 BABY/2 APOSTILA/BABY APOSTILA PROFESSOR*.pdf", 10),
    "arca-kids-hora":   ("4 ARCA DE NOE/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 11),
    "arca-junior-hora": ("4 ARCA DE NOE/3 JUNIOR/2 APOSTILA/J*NIOR APOSTILA PROFESSOR*.pdf", 12),
}

def render(origem, page, width, dest_png):
    doc = pymupdf.open(origem)
    pg = doc[page - 1]
    zoom = width / pg.rect.width
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(dest_png)

def salvar(nome, rel, page, width):
    origem = pdf(rel)  # resolvido uma unica vez; render() e o sidecar usam o mesmo caminho
    tmp = os.path.join(OUT, nome + ".png")
    render(origem, page, width, tmp)
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
