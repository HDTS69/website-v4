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
  },
  reactStrictMode: true,
  // Comment out the static export configuration for development
  // output: 'export',
  // distDir: 'out',
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
        // Handle Rive animation files specifically
        source: '/rive/:file*.riv',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
          {
            key: 'Access-Control-Expose-Headers',
            value: 'Content-Length',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Timing-Allow-Origin',
            value: '*',
          }
        ],
      }
    ];
  },
  // Configure webpack for Rive animations
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

    // Configure Rive file handling
    config.module.rules.push({
      test: /\.riv$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/rive/[name].[hash][ext]'
      }
    });

    return config;
  },
}

module.exports = nextConfig;
