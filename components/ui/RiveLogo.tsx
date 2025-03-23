'use client';

import { useEffect, useState, useRef } from 'react';
import { useRive, RuntimeLoader, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import Image from 'next/image';

interface RiveLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

// Create a module-level flag to track if animation has played already across instances
let hasAnimationPlayedGlobally = false;

// Check localStorage on module load to see if animation has played before
if (typeof window !== 'undefined') {
  try {
    hasAnimationPlayedGlobally = localStorage.getItem('riveLogoAnimationPlayed') === 'true';
  } catch (e) {
    console.warn('Could not access localStorage:', e);
  }
}

export function RiveLogo({ width = 100, height = 100, className }: RiveLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(hasAnimationPlayedGlobally);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Using the custom logo animation from the /rive folder
  const { RiveComponent, rive } = useRive({
    src: '/rive/icon-logo-animation.riv',
    autoplay: !hasAnimationPlayedGlobally, // Only autoplay if animation hasn't played yet
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
      minX: -50,
      minY: -50,
      maxX: 150,
      maxY: 150
    }),
    onLoad: () => {
      setIsLoaded(true);
      
      // If animation has already played globally, mark as complete immediately
      if (hasAnimationPlayedGlobally) {
        setAnimationComplete(true);
      } else {
        // Set a timeout to stop the animation after it has played once (approximately 2 seconds)
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationComplete(true);
          hasAnimationPlayedGlobally = true; // Mark as played globally
          
          // Store animation played state in localStorage
          try {
            localStorage.setItem('riveLogoAnimationPlayed', 'true');
          } catch (e) {
            console.warn('Could not save animation state to localStorage:', e);
          }
          
          // Attempt to pause the animation
          if (rive) {
            try {
              rive.pause();
            } catch (e) {
              console.warn('Could not pause Rive animation', e);
            }
          }
        }, 2000);
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
    }, 1500); // Reduced timeout for faster fallback

    return () => {
      clearTimeout(timer);
      // Clean up animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
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
    
    // If animation is complete, ensure it's paused
    if (animationComplete && rive) {
      try {
        rive.pause();
      } catch (e) {
        console.warn('Could not pause Rive animation', e);
      }
    }
  }, [rive, isLoaded, width, height, animationComplete]);

  // Use a static image once animation is complete if we're showing Rive
  const showStaticImageAfterAnimation = animationComplete && isLoaded && !hasError;

  return (
    <div 
      ref={containerRef}
      style={{ 
        width, 
        height,
        position: 'relative',
        zIndex: 1 
      }} 
      className={`relative flex-shrink-0 rive-logo-container ${className || ''}`}
    >
      {/* Show Rive animation when loaded and animation isn't complete */}
      {!hasError && !animationComplete && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transform: 'scale(2)' }}>
          <RiveComponent />
        </div>
      )}
      
      {/* Static image when animation complete or there's an error */}
      {(hasError || !isLoaded || showStaticImageAfterAnimation) && (
        <Image 
          src="/images/icon-logo.webp" 
          alt="HD Trade Services Icon" 
          width={width}
          height={height}
          className="h-full w-full scale-200"
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