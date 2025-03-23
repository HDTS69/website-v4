import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ClientComponents } from './components/ClientComponents';
import ClientBackground from './components/ClientBackground';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Brisbane 24/7 Emergency Repairs",
  description: "Professional plumbing, gas, roofing & air conditioning services.",
  metadataBase: new URL('https://hdtradeservices.com.au'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark touch-auto`} suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                color-scheme: dark;
                touch-action: manipulation;
              }
              
              html {
                height: 100%;
                margin: 0;
                padding: 0;
                touch-action: manipulation;
                -ms-content-zooming: none;
                -ms-touch-action: manipulation;
              }

              body {
                background-color: rgb(0, 0, 0);
                min-height: 100%;
                margin: 0;
                padding: 0;
                -webkit-overflow-scrolling: touch;
                touch-action: manipulation;
                overflow-y: auto;
                overflow-x: hidden;
                position: relative;
              }

              * {
                box-sizing: border-box;
                touch-action: manipulation;
              }

              /* Input styling */
              input, textarea {
                background-color: rgb(0, 0, 0) !important;
                -webkit-text-fill-color: #f3f4f6 !important;
                color: #f3f4f6 !important;
                transition: none !important;
              }

              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active,
              textarea:-webkit-autofill {
                -webkit-text-fill-color: #f3f4f6 !important;
                -webkit-box-shadow: 0 0 0 30px rgb(0, 0, 0) inset !important;
                box-shadow: 0 0 0 30px rgb(0, 0, 0) inset !important;
                background-color: rgb(0, 0, 0) !important;
                caret-color: #f3f4f6 !important;
                transition: none !important;
              }
              
              /* Mobile-specific fixes */
              @media (max-width: 767px) {
                html, body {
                  position: relative;
                  height: auto;
                  min-height: 100%;
                  overflow-y: auto !important;
                  overflow-x: hidden;
                  overscroll-behavior: none;
                }
                
                /* Fixed elements can cause scrolling issues */
                .fixed-mobile {
                  position: absolute;
                }
              }
              
              .content-visibility-auto {
                content-visibility: auto;
                contain-intrinsic-size: 1px 5000px;
              }
              
              .optimize-performance {
                backface-visibility: hidden;
              }
              
              @media (prefers-reduced-motion: reduce) {
                * {
                  animation-duration: 0.01ms !important;
                  animation-iteration-count: 1 !important;
                  transition-duration: 0.01ms !important;
                  scroll-behavior: auto !important;
                }
              }
            `
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, minimum-scale=1.0, viewport-fit=cover" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        
        {/* Lordicon Script */}
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </head>
      <body className="font-inter antialiased bg-black touch-auto" suppressHydrationWarning>
        {/* Sparkles background - directly importing client component */}
        <ClientBackground />
        
        {/* Main Content Wrapper */}
        <div className="relative z-10 min-h-screen flex flex-col touch-auto">
          {children}
        </div>
        <ClientComponents />
      </body>
    </html>
  );
}
