'use client';

import { useEffect, useState, useRef } from 'react';
import { useRive, RuntimeLoader, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import Image from 'next/image';

interface RiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function RiveLogo({ width = 100, height = 100, className }: RiveLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Using the custom logo animation from the /rive folder
  const { RiveComponent, rive } = useRive({
    src: '/rive/icon-logo-animation.riv',
    autoplay: true, // Always animate on initial load
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    }),
    onLoad: () => {
      setIsLoaded(true);
    },
    onLoadError: (e) => {
      console.error('Rive animation failed to load:', e);
      setHasError(true);
    }
  });

  // Fallback to static image after timeout if animation doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Set up the canvas and optimize rendering
  useEffect(() => {
    if (!rive || !isLoaded) return;

    // Optimize canvas dimensions
    if (containerRef.current) {
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        const pixelRatio = window.devicePixelRatio || 1;
        const scaledWidth = Math.floor(width * pixelRatio);
        const scaledHeight = Math.floor(height * pixelRatio);
        
        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          rive.resizeToCanvas();
        }
      }
    }
  }, [rive, isLoaded, width, height]);

  return (
    <div 
      ref={containerRef}
      style={{ width, height }} 
      className={`relative flex-shrink-0 ${className || ''}`}
    >
      {/* Show Rive animation when loaded */}
      {!hasError && (
        <div className="absolute inset-0">
          <RiveComponent />
        </div>
      )}
      
      {/* Fallback image when there's an error */}
      {hasError && (
        <Image 
          src="/images/icon-logo.webp" 
          alt="HD Trade Services Icon" 
          width={width}
          height={height}
          className="h-full w-full"
          sizes={`${width}px`}
          priority
        />
      )}
    </div>
  );
} 