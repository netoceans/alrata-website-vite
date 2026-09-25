import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i0.wp.com', pathname: '/alratadental.com/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'alratadental.com', pathname: '/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/videos/**' },
    ],
  },
}

export default nextConfig
