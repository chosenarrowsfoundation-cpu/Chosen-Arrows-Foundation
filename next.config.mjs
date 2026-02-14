/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow image uploads up to 5MB (default 1MB causes "unexpected response")
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Supabase Storage (use your project hostname from Supabase URL)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mlqxwviojciosgbwfrws.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Turbopack is enabled by default in Next.js 16
};

export default nextConfig;
