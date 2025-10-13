import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 이미지 설정
  eslint: {
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  turbopack: {},
  images: {
    domains: [
      'img1.kakaocdn.net',
      'lh3.googleusercontent.com',
      'k.kakaocdn.net',
    ],
  },
}

export default nextConfig
