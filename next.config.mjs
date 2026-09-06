/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // subdomínio da landing: a raiz cai direto na página do estudo
      { source: "/", has: [{ type: "host", value: "emocoes.criatividadesbiblicas.com.br" }], destination: "/emocoes", permanent: false },
    ];
  },
};

export default nextConfig;
