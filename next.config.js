/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    API_KEY: process.env.API_KEY,
    APP_ID: process.env.APP_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    CALENDAR_API_KEY: process.env.CALENDAR_API_KEY,
  },
};

module.exports = nextConfig
