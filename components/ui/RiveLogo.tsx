'use client';

import { useEffect, useState, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import Image from 'next/image';

interface RiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function RiveLogo({ width = 100, height = 100, className = '' }: RiveLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Rive logo animation setup
  const { RiveComponent, rive } = useRive({
    src: '/rive/icon-logo-animation.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    }),
    onLoad: () => setIsLoaded(true),
    onLoadError: (e) => {
      console.error('Rive animation failed to load:', e);
      setHasError(true);
    }
  });

  // Fallback to static image after timeout if animation doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setHasError(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Optimize canvas dimensions when Rive loads
  useEffect(() => {
    if (!rive || !isLoaded || !containerRef.current) return;
    
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Handle pixel ratio for crisp rendering
    const pixelRatio = window.devicePixelRatio || 1;
    const scaledWidth = Math.floor(width * pixelRatio);
    const scaledHeight = Math.floor(height * pixelRatio);
    
    if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      rive.resizeToCanvas();
    }
  }, [rive, isLoaded, width, height]);

  return (
    <div 
      ref={containerRef}
      style={{ width, height }} 
      className={`relative flex-shrink-0 ${className}`}
      aria-label="HD Trade Services Logo"
    >
      {!hasError ? (
        <div className="absolute inset-0">
          <RiveComponent />
        </div>
      ) : (
        <Image 
          src="/images/icon-logo.webp" 
          alt="HD Trade Services Icon" 
          width={width}
          height={height}
          className="h-full w-full"
          sizes={`${Math.max(width, 70)}px`}
          priority
        />
      )}
    </div>
  );
} 