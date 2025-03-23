'use client';

import { useState, useEffect } from 'react';

interface RiveDebugProps {
  visible?: boolean;
}

// Extended Performance interface to include Chrome's memory property
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export function RiveDebug({ visible = false }: RiveDebugProps) {
  const [fps, setFps] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [canvasCount, setCanvasCount] = useState(0);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (!isVisible) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const countFps = () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastTime = now;
        
        // Count Rive canvases
        const canvases = document.querySelectorAll('canvas');
        setCanvasCount(canvases.length);
        
        // Get memory usage if available (Chrome only)
        const extPerformance = performance as ExtendedPerformance;
        if (extPerformance.memory) {
          setMemoryUsage(Math.round(extPerformance.memory.usedJSHeapSize / (1024 * 1024)));
        }
      }
      
      frameId = requestAnimationFrame(countFps);
    };
    
    frameId = requestAnimationFrame(countFps);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 z-50 p-2 bg-black/80 text-white text-xs font-mono">
      <div>FPS: {fps}</div>
      {memoryUsage !== null && <div>Memory: {memoryUsage} MB</div>}
      <div>Canvas Elements: {canvasCount}</div>
      <button 
        className="absolute top-0 right-0 p-1 text-xs bg-red-500 hover:bg-red-600"
        onClick={() => setIsVisible(false)}
      >
        ×
      </button>
    </div>
  );
} 