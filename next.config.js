/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'mysql2', 'mongoose'],
  },
};

module.exports = nextConfig;
