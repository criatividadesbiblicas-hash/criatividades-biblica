// Monta a página da Mesa de Postagens num módulo JS (lib/central/mesa/pagina.gerado.js).
// Rodar depois de mexer em estilo.css, icones.svg, corpo.html ou app.js:  node scripts/mesa-gerar.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const P = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "central", "mesa");
const ler = (f) => readFileSync(join(P, f), "utf8");
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Mesa de Postagens · Central</title><link rel="icon" href="/central-mesa/biblinho-coracao.webp"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@500;700;800;900&display=swap"><style>body{margin:0}img{max-width:100%}\n${ler("estilo.css")}</style></head><body>\n${ler("icones.svg")}\n${ler("corpo.html")}\n<script>\n${ler("app.js").replace(/<\/script/gi, "<\/script")}\n</script></body></html>\n`;
writeFileSync(join(P, "pagina.gerado.js"), `// Gerado por scripts/mesa-gerar.mjs. Não editar à mão.\nconst PAGINA = ${JSON.stringify(html)};\nexport default PAGINA;\n`);
console.log(`pagina.gerado.js: ${Math.round(html.length / 1024)} KB`);
