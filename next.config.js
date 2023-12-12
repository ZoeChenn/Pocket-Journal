/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    APP_ID: process.env.APP_ID,
    CLIENT_ID: process.env.CLIENT_ID,
  },
};

module.exports = nextConfig
