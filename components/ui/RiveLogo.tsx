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
  const isVisibleRef = useRef(true);
  
  // Using the custom logo animation from the /rive folder
  const { RiveComponent, rive } = useRive({
    src: '/rive/icon-logo-animation.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    }),
    // Use stateMachines and artboard if they exist in your Rive file
    // stateMachines: "state-machine",
    // artboard: "main",
    onLoad: () => setIsLoaded(true),
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

  // Optimize Rive canvas when the component mounts
  useEffect(() => {
    if (rive && containerRef.current) {
      // Find the canvas element within our container
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        // Set explicit dimensions to the canvas element for better performance
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Set actual pixel dimensions based on device pixel ratio for crisp rendering
        const pixelRatio = window.devicePixelRatio || 1;
        const scaledWidth = Math.floor(width * pixelRatio);
        const scaledHeight = Math.floor(height * pixelRatio);
        
        // Only resize if necessary
        if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          
          // Notify Rive to resize its renderer
          rive.resizeToCanvas();
        }
      }
    }
  }, [rive, width, height]);

  // Pause the animation when the component is not visible to save resources
  useEffect(() => {
    if (!rive) return;

    // Create an intersection observer to detect visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisibleRef.current = entry.isIntersecting;
        
        // Pause/play based on visibility
        if (entry.isIntersecting) {
          rive.play();
        } else {
          rive.pause();
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.1 // trigger when 10% of the element is visible
    });

    // Start observing the container
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup function
    return () => {
      observer.disconnect();
      if (rive) {
        rive.pause();
      }
    };
  }, [rive]);

  // Handle visibility change events (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!rive) return;
      
      if (document.hidden) {
        rive.pause();
      } else if (isVisibleRef.current) {
        rive.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [rive]);

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