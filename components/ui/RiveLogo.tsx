'use client';

import { useEffect, useState, useRef } from 'react';
import { useRive, RuntimeLoader, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import Image from 'next/image';
import { useRiveContext } from './RiveContext';

// Unique identifier for this animation
const LOGO_ANIMATION_ID = 'icon-logo-animation';

interface RiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function RiveLogo({ width = 100, height = 100, className }: RiveLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);
  const { hasAnimationPlayed, markAnimationPlayed } = useRiveContext();
  
  // Check if animation has already played
  const alreadyPlayed = hasAnimationPlayed(LOGO_ANIMATION_ID);
  
  // Using the custom logo animation from the /rive folder
  const { RiveComponent, rive } = useRive({
    src: '/rive/icon-logo-animation.riv',
    autoplay: !alreadyPlayed, // Only autoplay if it hasn't played before
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    }),
    onLoad: () => {
      setIsLoaded(true);
      initialLoadRef.current = true;
      
      // If animation already played, make sure we pause it immediately
      if (rive && alreadyPlayed) {
        setTimeout(() => {
          rive.pause();
        }, 0);
      }
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

  // Set up the canvas and play animation once on initial load
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

    // Let animation play once for 2 seconds, then pause it
    if (initialLoadRef.current && !alreadyPlayed) {
      rive.play();
      
      const pauseTimer = setTimeout(() => {
        rive.pause();
        markAnimationPlayed(LOGO_ANIMATION_ID);
      }, 2000); // Play for 2 seconds then freeze
      
      return () => clearTimeout(pauseTimer);
    } else if (alreadyPlayed) {
      // Ensure already played animations are paused
      rive.pause();
    }
  }, [rive, isLoaded, width, height, alreadyPlayed, markAnimationPlayed]);

  return (
    <div 
      ref={containerRef}
      style={{ width, height }} 
      className={`relative flex-shrink-0 ${className || ''}`}
    >
      {/* Show Rive animation when loaded */}
      {!hasError && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
      
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#00E6CA] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 