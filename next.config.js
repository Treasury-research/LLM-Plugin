/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const removeImports = require('next-remove-imports')();
module.exports = removeImports({});

// const nextEnv = require('next-env');
// const dotenvLoad = require('dotenv-load');

// dotenvLoad('.env');

// const withNextEnv = nextEnv();
// module.exports = withNextEnv(nextConfig)
