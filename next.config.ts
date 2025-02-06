import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 이미지와 텍스트의 최대 용량
    },
  },

  async rewrites() {
    // 이미지 업로드되면 자동으로 앞에 local주소 붙이게 하는 코드
    return [
      {
        source: '/upload/:slug',
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/:slug`,
      },
    ]
  },
}

export default nextConfig
