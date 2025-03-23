'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useState, useEffect, useRef } from 'react';

export interface RiveIconProps {
  /**
   * The path to the Rive file (.riv) from the public directory
   * e.g. "rive/icon-name.riv"
   */
  src: string;
  
  /**
   * The name of the state machine to use (if applicable)
   */
  stateMachineName?: string;
  
  /**
   * The name of the animation to play (if not using state machine)
   */
  animationName?: string;
  
  /**
   * Whether to autoplay the animation on load
   */
  autoplay?: boolean;
  
  /**
   * Width of the Rive canvas
   */
  width?: number | string;
  
  /**
   * Height of the Rive canvas
   */
  height?: number | string;
  
  /**
   * Optional className for styling the container
   */
  className?: string;
  
  /**
   * Optional artboard name if the Rive file has multiple artboards
   */
  artboardName?: string;
  
  /**
   * Fit option for the Rive animation
   */
  fit?: Fit;
  
  /**
   * Alignment option for the Rive animation
   */
  alignment?: Alignment;

  /**
   * Device pixel ratio for high-resolution rendering
   * Set to 0 to use the device's actual pixel ratio
   * For extreme sharpness, use values like 2, 3, or 4
   */
  devicePixelRatio?: number;
}

/**
 * A reusable component for displaying Rive animations with high-quality rendering
 * Following Rive's best practices for optimal rendering and performance
 */
export function RiveIcon({
  src,
  stateMachineName,
  animationName,
  autoplay = true,
  width = 24,
  height = 24,
  className = '',
  artboardName,
  fit = Fit.Contain,
  alignment = Alignment.Center,
  devicePixelRatio = 0, // 0 means use the device's actual pixel ratio
}: RiveIconProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Determines if the device is Apple/iOS for enhanced rendering
  const isAppleDevice = typeof navigator !== 'undefined' && 
    (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) || 
    (navigator.userAgent.includes("Mac") && "ontouchend" in document));
  
  // Apply Rive's recommended configuration
  const riveConfig = {
    src: src,
    stateMachines: stateMachineName ? [stateMachineName] : undefined,
    animations: animationName && !stateMachineName ? [animationName] : undefined,
    autoplay: autoplay,
    artboard: artboardName,
    layout: new Layout({
      fit,
      alignment,
      // Prevent layout stretching which can cause pixelation
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    }),
    onLoad: () => {
      setIsLoaded(true);
    },
    // Don't use offscreen renderer as it can reduce quality
    useOffscreenRenderer: false,
  };
  
  const { RiveComponent, rive } = useRive(riveConfig);

  // Apply high-resolution rendering optimized for quality
  useEffect(() => {
    if (!rive || !containerRef.current) return;
    
    // Find the canvas element
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;
    
    // Store reference to canvas
    canvasRef.current = canvas;
    
    // Calculate optimal device pixel ratio
    let dpr = devicePixelRatio || window.devicePixelRatio || 2;
    
    // Slightly higher DPR for Apple devices improves quality dramatically
    if (isAppleDevice && devicePixelRatio === 0) {
      dpr = Math.min(window.devicePixelRatio * 1.5, 4);
    }
    
    // Sharp, clean rendering requires integer scaling
    dpr = Math.ceil(dpr);
    
    // Configure canvas for high-resolution rendering
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Get the display size of the canvas
    const rect = canvas.getBoundingClientRect();
    
    // Round to whole pixels to avoid blur
    const displayWidth = Math.round(rect.width);
    const displayHeight = Math.round(rect.height);
    
    // Set proper canvas dimensions for high-resolution rendering
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    
    // Apply the scale to avoid blurry rendering
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Scale all drawing operations by the device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Additional canvas optimizations for Apple devices
      if (isAppleDevice) {
        // @ts-ignore - Non-standard property but improves rendering on Safari
        if (typeof ctx.webkitImageSmoothingEnabled === 'boolean') {
          // @ts-ignore
          ctx.webkitImageSmoothingEnabled = true;
        }
      }
    }
    
    // Force a redraw of the animation
    if (rive) {
      // Small delay to ensure canvas is properly set up
      setTimeout(() => {
        rive.startRendering();
      }, 10);
    }
  }, [rive, isLoaded, devicePixelRatio, isAppleDevice, fit]);
  
  // Handle window resize to maintain quality
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !rive || !containerRef.current) return;
      
      const canvas = canvasRef.current;
      let dpr = devicePixelRatio || window.devicePixelRatio || 1;
      
      if (isAppleDevice && devicePixelRatio === 0) {
        dpr = window.devicePixelRatio;
      }
      
      dpr = Math.min(Math.max(1, dpr), 4);
      
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.round(rect.width);
      const displayHeight = Math.round(rect.height);
      
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      rive.startRendering();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [rive, devicePixelRatio, isAppleDevice]);

  return (
    <div 
      ref={containerRef}
      className={`rive-icon-container ${className}`} 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <RiveComponent />
    </div>
  );
}

export default RiveIcon; 