"""Capas da APOSTILA DO PROFESSOR (Kids) para as paginas /black-biblinho e /plano-anual.
Pedido da Thali em 21/11/2026: a capa mostrada era a do caderno de atividades ("Minhas atividades");
a capa certa e a da apostila do professor. Tudo e pagina 1 do PDF real; nada gerado por IA.
Os arquivos antigos (capa-*.webp, capa-2025-*.webp) ficam na pasta; estes entram com nome novo (capa-prof-*).
Excecao: Jesus e Zaqueu de marco/2026 nao tem apostila do professor em PDF unico (os estudos sao
arquivos separados, sem capa), entao a pagina continua com a capa das atividades dele.
Uso:
  python scripts/capas-professor.py          # gera os .webp + sidecars
  python scripts/capas-professor.py --check
"""
import json, os, sys, glob, datetime
import pymupdf  # pip install pymupdf
from PIL import Image

B26 = r"F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL/2026"
B25 = r"F:/JESSICA MIRANDA/OneDrive/1 TRABALHO - JESSICA/2 PLANO ANUAL/2025/2 KIDS"
RAIZ = os.path.join(os.path.dirname(__file__), "..", "public")

def pdf(base, rel_glob):
    hits = glob.glob(os.path.join(base, rel_glob))
    if len(hits) != 1:
        raise SystemExit(f"PDF esperado 1, achou {len(hits)}: {rel_glob} -> {hits}")
    return hits[0]

# (pasta em public, nome, base, glob, largura)
ITENS = [
    ("plano-anual", "capa-prof-semeador",       B26, "1 PARABOLA DO SEMEADOR/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-fornalha",       B26, "2 NA FORNALHA/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-arca",           B26, "4 ARCA DE NOE/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-adao-e-eva",     B26, "5 AD*O E EVA/2 KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-filho-prodigo",  B26, "6 FILHO PRODIGO/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR - O GRANDE AMOR DE DEUS.pdf", 900),
    ("plano-anual", "capa-prof-dez-leprosos",   B26, "7 DEZ LEPROSOS/2 KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-ovelha-perdida", B26, "8 OVELHA PERDIDA/KIDS/2 apostila/KIDS APOSTILA PROFESSOR - O AMOR DE JESUS POR MIM.pdf", 900),
    ("plano-anual", "capa-prof-elias",          B26, "9 EILAS NO MONTE/KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR - LIDANDO*.pdf", 900),
    ("plano-anual", "capa-prof-daniel",         B26, "10 DANIEL NA COVA DOS LEOES 2026/KIDS/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR*.pdf", 900),
    ("plano-anual", "capa-prof-cores",          B26, "11 JESUS E ZAQUEU - CORES DA SALVA*/KIDS/2 APOSTILA/KIDS APOSTILA PROFESSOR*.pdf", 900),
    # Biblioteca 2025 (Kids)
    ("black-biblinho", "capa-prof-2025-criacao",        B25, "1 A CRIA*/2 APOSTILA DO PROFESSOR E ATIVIDADES/APOSTILA PROFESSOR - A CRIA*O KIDS.pdf", 900),
    ("black-biblinho", "capa-prof-2025-ovelha-perdida", B25, "4 A OVELHA PERDIDA/2 APOSTILA E ATIVIDADES/APOSTILA PROFESSOR - A OVELHA PERDIDA 4-6 ANOS.pdf", 900),
    ("black-biblinho", "capa-prof-2025-aguas",          B25, "7 JESUS ANDA SOBRE AS AGUAS/2 APOSTILA E ATIVIDADES/KIDS 4-6 ANOS APOSTILA PROFESSOR*.pdf", 900),
    ("black-biblinho", "capa-prof-2025-plano-perfeito", B25, "8 O PLANO PERFEITO - JO*O 3.16/2 APOSTILA E ATIVIDADES/KIDS APOSTILA PROFESSOR - O PLANO PERFEITO.pdf", 900),
]

def salvar(pasta, nome, base, rel, width):
    out = os.path.join(RAIZ, pasta)
    os.makedirs(out, exist_ok=True)
    origem = pdf(base, rel)
    doc = pymupdf.open(origem)
    pg = doc[0]
    zoom = width / pg.rect.width
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(os.path.join(out, nome + ".webp"), "WEBP", quality=82, method=6)
    side = {
        "prompt": f"Origem: pagina 1 (capa da apostila do professor) do PDF real '{os.path.basename(origem)}' (Criatividades Biblicas, 2 PLANO ANUAL), renderizada com PyMuPDF via scripts/capas-professor.py. Nao e imagem gerada por IA.",
        "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    with open(os.path.join(out, nome + ".webp.json"), "w", encoding="utf-8") as f:
        json.dump(side, f, ensure_ascii=False, indent=2)
    print("ok", pasta + "/" + nome, img.size, "<-", os.path.basename(origem))

def check():
    faltam = [f"{p}/{n}" for p, n, *_ in ITENS if not os.path.exists(os.path.join(RAIZ, p, n + ".webp"))]
    if faltam:
        raise SystemExit("faltam: " + ", ".join(faltam))
    print("ok: todas as capas do professor existem")

if __name__ == "__main__":
    if "--check" in sys.argv:
        check()
    else:
        for pasta, nome, base, rel, width in ITENS:
            salvar(pasta, nome, base, rel, width)
