/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2', 'mongoose'],
};

module.exports = nextConfig;
