'use client';

import { useEffect, useState, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas-lite';
import Image from 'next/image';
import { pauseRiveAnimation, handleRiveError } from '@/utils/riveUtils';

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

/**
 * RiveLogo component that displays the HD Trade Services animated logo
 * Using Rive best practices: https://rive.app/docs/runtimes/overview/web#react
 */
export function RiveLogo({ width = 100, height = 100, className = '' }: RiveLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(hasAnimationPlayedGlobally);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle different file naming conventions
  const [animationSrc, setAnimationSrc] = useState('/rive/icon-logo-animation.riv');
  
  const { RiveComponent, rive } = useRive({
    src: animationSrc,
    autoplay: !hasAnimationPlayedGlobally,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      setIsLoaded(true);
      setErrorDetails('');
      
      // Use the resizeDrawingSurfaceToCanvas method to properly handle high-DPI displays
      if (rive) {
        try {
          // This ensures the canvas drawing surface is properly sized based on the device pixel ratio
          rive.resizeDrawingSurfaceToCanvas();
        } catch (e) {
          console.warn('Could not resize drawing surface:', e);
        }
      }
      
      // If animation has already played globally, mark as complete immediately
      if (hasAnimationPlayedGlobally) {
        setAnimationComplete(true);
        
        // Ensure animation is stopped using utility function
        pauseRiveAnimation(rive);
      } else {
        // Set a timeout to mark animation as complete after it has played
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationComplete(true);
          hasAnimationPlayedGlobally = true;
          
          // Store animation played state in localStorage
          try {
            localStorage.setItem('riveLogoAnimationPlayed', 'true');
          } catch (e) {
            console.warn('Could not save animation state to localStorage:', e);
          }
          
          // Pause the animation using our utility function
          pauseRiveAnimation(rive);
        }, 2000);
      }
    },
    onLoadError: (error: any) => {
      console.error('Rive animation failed to load:', error);
      const errorMessage = handleRiveError(error);
      setErrorDetails(errorMessage);
      
      // Try alternative file name if the first one fails
      if (animationSrc === '/rive/icon-logo-animation.riv') {
        setAnimationSrc('/rive/Icon Logo Animation.riv');
      } else {
        setHasError(true);
      }
    }
  });

  // Handle window resize to update canvas drawing surface
  useEffect(() => {
    const handleResize = () => {
      if (rive) {
        try {
          // Properly resize the drawing surface when the window size changes
          rive.resizeDrawingSurfaceToCanvas();
        } catch (e) {
          console.warn('Could not resize drawing surface on window resize:', e);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rive]);

  // Fallback to static image after timeout if animation doesn't load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isLoaded]);

  // If animation is complete, ensure it's paused
  useEffect(() => {
    if (animationComplete && rive) {
      pauseRiveAnimation(rive);
    }
  }, [animationComplete, rive]);
  
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
      className={`relative flex-shrink-0 rive-logo-container transform-gpu ${className}`}
    >
      {/* Rive animation when loaded and animation isn't complete */}
      {!hasError && !animationComplete && (
        <div 
          ref={canvasContainerRef}
          className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            transform: 'scale(2)',
            width: `${width}px`,
            height: `${height}px`
          }}
        >
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
      
      {/* Error message (hidden in production) */}
      {process.env.NODE_ENV !== 'production' && hasError && errorDetails && (
        <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 truncate text-center">
          Error: {errorDetails}
        </div>
      )}
    </div>
  );
}