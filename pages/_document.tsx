import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload the Rive WASM file with the correct path */}
        <link 
          rel="preload" 
          href="/_next/static/chunks/node_modules_@rive-app_canvas_rive_wasm.wasm" 
          as="fetch" 
          crossOrigin="anonymous" 
          type="application/wasm" 
        />
        
        {/* Preload the hero image */}
        <link
          rel="preload"
          href="/images/hayden-hero-1.webp"
          as="image"
          type="image/webp"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 