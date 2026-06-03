/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@zoomoff/ui", "@zoomoff/auth", "@zoomoff/api-client", "@zoomoff/validators"],
};
export default config;
