/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Fase 1 (set/2026): só a landing do Emoções fica no ar. Home, Plano Anual e Materiais
    // ainda em construção → tudo cai em /emocoes (redirect temporário, 307).
    return [
      { source: "/", destination: "/emocoes", permanent: false },
      { source: "/plano-anual", destination: "/emocoes", permanent: false },
      { source: "/plano-anual/:path*", destination: "/emocoes", permanent: false },
      { source: "/materiais", destination: "/emocoes", permanent: false },
      { source: "/materiais/:path*", destination: "/emocoes", permanent: false },
    ];

};

export default nextConfig;
