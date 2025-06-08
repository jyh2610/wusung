/** @type {import('next').NextConfig} */
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin({
  identifiers: ({ hash }) => `prefix_${hash}`
});

const nextConfig = {
  images: {
    domains: ['dwkcd9qfwbc4t.cloudfront.net', 'dc4jgoljm3ewc.cloudfront.net']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트엔드에서 사용하는 API 경로
        destination: 'https://13.124.172.100.sslip.io/api/:path*' // 실제 백엔드 서버 URL
      }
    ];
  }
};

module.exports = withVanillaExtract(nextConfig);
