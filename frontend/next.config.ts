import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin(
  './app/i18n/request.tsx'
);
export default withNextIntl(nextConfig);
