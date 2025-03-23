/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Only use unoptimized images for static export
    unoptimized: process.env.NODE_ENV === 'production',
    domains: ['maps.googleapis.com', 'localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  reactStrictMode: true,
  // Enable static export for production only
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    distDir: 'out',
  } : {}),
  experimental: {
    appDocumentPreloading: false,
  },
  compiler: {
    styledComponents: true,
  },
  // Add environment variables with default values for build time
  env: {
    // Supabase configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    
    // Google Maps API (if needed)
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'placeholder-google-maps-key',
    
    // Add any other required environment variables here with fallbacks
    // NODE_ENV is managed by Next.js and should not be set here
  },
  // Configure headers for proper CORS and asset loading
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          }
        ],
      },
      {
        // Add cache control for images
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          }
        ],
      },
      {
        // Add specific hero image optimization
        source: '/images/hayden-hero-1.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Priority',
            value: 'high',
          }
        ],
      }
    ];
  },
  // Configure webpack
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill fs
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    
    // Enable WebAssembly for Rive animations
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    // Add rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
}

module.exports = nextConfig;
