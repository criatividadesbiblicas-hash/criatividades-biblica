/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Fase 1 (set/2026): só a landing do Emoções fica no ar. Home, Plano Anual e Materiais
    // ainda em construção → tudo cai em /emocoes (redirect temporário, 307).
    const materiais = [{ type: "host", value: "materiais.criatividadesbiblicas.com.br" }];
    return [
      // Subdomínio dos Packs (set/2026): a raiz e os caminhos antigos caem na landing do Pack atual.
      { source: "/", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/materiais", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/materiais/:path*", has: materiais, destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/emocoes", has: materiais, destination: "https://emocoes.criatividadesbiblicas.com.br/emocoes", permanent: false },
      { source: "/arca-de-noe", destination: "/aprendendo-a-obedecer", permanent: false },
      { source: "/", destination: "/emocoes", permanent: false },
      { source: "/plano-anual", destination: "/emocoes", permanent: false },
      { source: "/plano-anual/:path*", destination: "/emocoes", permanent: false },
      { source: "/materiais", destination: "/emocoes", permanent: false },
      { source: "/materiais/:path*", destination: "/emocoes", permanent: false },
    ];
  },
};

export default nextConfig;
