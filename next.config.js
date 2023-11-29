/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  },
  images: {
    domains: ['openweathermap.org'],
  }
}

module.exports = nextConfig
