/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip error page generation
  generateBuildId: async () => 'build-id',
  // Disable static page generation for error pages
  exportPathMap: async function (defaultPathMap) {
    const pathMap = { ...defaultPathMap };
    delete pathMap['/404'];
    delete pathMap['/500'];
    return pathMap;
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    if (!isServer) {
      config.externals.push('pino-pretty', 'encoding');
    }
    return config;
  },
};

module.exports = nextConfig;


