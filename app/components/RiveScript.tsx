'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Extend Window interface to include RiveCanvas property
declare global {
  interface Window {
    RiveCanvas?: any;
  }
}

export default function RiveScript() {
  const [isRiveLoaded, setIsRiveLoaded] = useState(false);

  useEffect(() => {
    // Set up a fix for the path issues with Rive animations
    const handleRiveLoad = () => {
      setIsRiveLoaded(true);
      
      // Fix URL paths in the loaded resources
      const fixRiveUrls = () => {
        try {
          const links = document.querySelectorAll('a[href^="/rive/"]');
          links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
              // Create proper absolute URL if needed
              const fullUrl = new URL(href, window.location.origin).toString();
              link.setAttribute('href', fullUrl);
              link.setAttribute('as', 'fetch');
              link.setAttribute('type', 'application/octet-stream');
              link.setAttribute('crossorigin', 'anonymous');
            }
          });
        } catch (error) {
          console.error('Error fixing Rive URLs:', error);
        }
      };
      
      // Run URL fix
      fixRiveUrls();
      
      // Add listener for Rive resources
      const observer = new MutationObserver((mutations) => {
        let shouldFix = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            shouldFix = addedNodes.some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              (node as Element).querySelector('[href^="/rive/"]')
            );
            
            if (shouldFix) break;
          }
        }
        
        if (shouldFix) {
          fixRiveUrls();
        }
      });
      
      // Start observing the document
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
      };
    };
    
    // If window is defined, check if Rive is already loaded
    if (typeof window !== 'undefined') {
      if (window.RiveCanvas) {
        handleRiveLoad();
      }
    }
  }, [isRiveLoaded]);

  return (
    <Script
      src="https://unpkg.com/@rive-app/canvas@2.7.0"
      strategy="afterInteractive"
      onLoad={() => setIsRiveLoaded(true)}
    />
  );
} 