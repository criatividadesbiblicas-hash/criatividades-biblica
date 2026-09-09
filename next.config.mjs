/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Fase 1 (set/2026): só a landing do Emoções fica no ar. Home, Plano Anual e Materiais
    // ainda em construção → tudo cai em /emocoes (redirect temporário, 307).
    const materiais = [{ type: "host", value: "materiais.criatividadesbiblicas.com.br" }];
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
  },
};

export default nextConfig;
