/** @type {import('next').NextConfig} */
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "";

const config = {
  reactStrictMode: true,
  transpilePackages: ["@zoomoff/ui", "@zoomoff/auth", "@zoomoff/api-client", "@zoomoff/validators"],
  async rewrites() {
    if (!ADMIN_URL) return [];
    return [
      {
        source: "/admin",
        destination: `${ADMIN_URL}/login`,
      },
      {
        source: "/admin/:path*",
        destination: `${ADMIN_URL}/:path*`,
      },
    ];
  },
};
export default config;
