/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  staticPageGenerationTimeout: 120,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Disable static optimization for pages with wallet context
  generateBuildId: async () => {
    return 'build'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.externals.push('pino-pretty', 'encoding');
    return config;
  },
};

module.exports = nextConfig;


