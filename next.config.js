/** @type {import('next').NextConfig} */
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
const withVanillaExtract = createVanillaExtractPlugin({
  identifiers: ({ hash }) => `prefix_${hash}`
});
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 프론트엔드에서 사용하는 API 경로
        destination: 'https://13.124.172.100.sslip.io/api/:path*' // 실제 백엔드 서버 URL
      }
    ];
  }
};

export default withVanillaExtract(nextConfig);
