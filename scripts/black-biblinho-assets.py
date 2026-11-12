"""Renderiza as capas reais que faltavam pra pagina /black-biblinho (Black Friday 2026).
- 2026: Elias (setembro) e Daniel (outubro), capas Kids, pra public/plano-anual/ (mesmo padrao das 8 que ja existem)
- 2025: as 9 historias completas da Biblioteca 2025, capas Kids, pra public/black-biblinho/
Uso:
  python scripts/black-biblinho-assets.py          # gera os .webp + sidecars .webp.json
  python scripts/black-biblinho-assets.py --check  # confere que todos existem
Josias (2025) fica de fora de proposito: so existe o estudo 1, sem apostila.
"""
import json, os, sys, glob, datetime
import pymupdf  # pip install pymupdf
from PIL import Image

BASE = r"F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL"
RAIZ = os.path.join(os.path.dirname(__file__), "..", "public")

def pdf(rel_glob):
    hits = glob.glob(os.path.join(BASE, rel_glob))
    if len(hits) != 1:
        raise SystemExit(f"PDF esperado 1, achou {len(hits)}: {rel_glob} -> {hits}")
    return hits[0]

# (pasta em public, nome, glob relativo a BASE, pagina, largura)
CAPAS = [
    ("plano-anual", "capa-elias",  "2026/9 EILAS NO MONTE/KIDS/2 APOSTILA E ATIVIDADES/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("plano-anual", "capa-daniel", "2026/10 DANIEL NA COVA DOS LEOES 2026/KIDS/2 APOSTILA E ATIVIDADES/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 900),
    ("black-biblinho", "capa-2025-criacao",        "2025/2 KIDS/1 A CRIA*O/2 APOSTILA DO PROFESSOR E ATIVIDADES/CAPA DAS ATIVIDADES.pdf", 1, 720),
    ("black-biblinho", "capa-2025-adao-e-eva",     "2025/2 KIDS/2 AD*O E EVA/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES.pdf", 1, 720),
    ("black-biblinho", "capa-2025-arca",           "2025/2 KIDS/3 ARCA DE NOE/2 APOSTILA DO PROFESSOR E ATIVIDADES/CAPA DAS ATIVIDADES KIDS.pdf", 1, 720),
    ("black-biblinho", "capa-2025-ovelha-perdida", "2025/2 KIDS/4 A OVELHA PERDIDA/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES KIDS.pdf", 1, 720),
    ("black-biblinho", "capa-2025-daniel",         "2025/2 KIDS/5 DANIEL NA COVA DOS LEOES/2 APOSTILA DO PROFESSOR E ATIVIDADES/CAPA DAS ATIVIDADES.pdf", 1, 720),
    ("black-biblinho", "capa-2025-filho-prodigo",  "2025/2 KIDS/6 FILHO PRODIGO/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES KIDS*.pdf", 1, 720),
    ("black-biblinho", "capa-2025-aguas",          "2025/2 KIDS/7 JESUS ANDA SOBRE AS AGUAS/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES KIDS.pdf", 1, 720),
    ("black-biblinho", "capa-2025-plano-perfeito", "2025/2 KIDS/8 O PLANO PERFEITO*/2 APOSTILA E ATIVIDADES/CAPA DAS ATIVIDADES KIDS*.pdf", 1, 720),
    ("black-biblinho", "capa-2025-semeador",       "2025/2 KIDS/9 O SEMEADOR/2 APOSTILA E ATIVIDADES/KIDS CAPA DAS ATIVIDADES*.pdf", 1, 720),
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
    ano = "2025" if "/2025/" in rel.replace("\\", "/") or rel.startswith("2025") else "2026"
    side = {
        "prompt": f"Origem: pagina {page} do PDF real '{os.path.basename(origem)}' (Criatividades Biblicas, 2 PLANO ANUAL/{ano}), renderizada com PyMuPDF via scripts/black-biblinho-assets.py. Nao e imagem gerada por IA.",
        "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    with open(os.path.join(out, nome + ".webp.json"), "w", encoding="utf-8") as f:
        json.dump(side, f, ensure_ascii=False, indent=2)
    print("ok", pasta + "/" + nome, img.size)

def check():
    faltam = [f"{p}/{n}" for p, n, *_ in CAPAS if not os.path.exists(os.path.join(RAIZ, p, n + ".webp"))]
    if faltam:
        raise SystemExit("faltam: " + ", ".join(faltam))
    print("ok: todas as capas existem")

if __name__ == "__main__":
    if "--check" in sys.argv:
        check()
    else:
        for pasta, nome, rel, page, width in CAPAS:
            salvar(pasta, nome, rel, page, width)
