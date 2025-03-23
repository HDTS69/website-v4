/**
 * Utilities for handling Rive animations and WASM loading
 * Following Rive documentation: https://rive.app/docs/runtimes/overview/web#rive-wasm
 */

import { RuntimeLoader } from '@rive-app/canvas';

/**
 * Preloads the Rive WASM file for use across the site
 * This should be called early in the application lifecycle
 */
export async function preloadRiveWasm(): Promise<void> {
  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  try {
    // Check if already loaded
    if (RuntimeLoader.hasInstance) {
      return;
    }

    // Dynamic import the WASM file
    const wasmModule = await import('@rive-app/canvas/rive.wasm');
    
    if (wasmModule.default) {
      // Set the WASM URL for the RuntimeLoader
      RuntimeLoader.setWasmUrl(wasmModule.default);
      console.log('Rive WASM preloaded successfully');
    }
  } catch (err) {
    console.warn('Failed to preload Rive WASM:', err);
  }
}

/**
 * Checks if the Rive WASM is loaded
 */
export function isRiveWasmLoaded(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return RuntimeLoader.hasInstance;
}

/**
 * Helper to handle Rive animation errors
 */
export function handleRiveError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Controls Rive animation playback
 * @param rive The Rive instance to control
 * @param animationName Optional animation name to target
 */
export function playRiveAnimation(rive: any, animationName?: string): void {
  if (!rive) return;
  
  try {
    if (animationName) {
      rive.play(animationName);
    } else {
      rive.play();
    }
  } catch (err) {
    console.warn('Error playing Rive animation:', err);
  }
}

/**
 * Pauses Rive animation playback
 * @param rive The Rive instance to control
 * @param animationName Optional animation name to target
 */
export function pauseRiveAnimation(rive: any, animationName?: string): void {
  if (!rive) return;
  
  try {
    if (animationName) {
      rive.pause(animationName);
    } else {
      rive.pause();
    }
  } catch (err) {
    console.warn('Error pausing Rive animation:', err);
  }
}

/**
 * Stops Rive animation playback
 * @param rive The Rive instance to control
 * @param animationName Optional animation name to target
 */
export function stopRiveAnimation(rive: any, animationName?: string): void {
  if (!rive) return;
  
  try {
    if (animationName) {
      rive.stop(animationName);
    } else {
      rive.stop();
    }
  } catch (err) {
    console.warn('Error stopping Rive animation:', err);
  }
}

/**
 * NOTE: For high-DPI (Retina) displays, use Rive's built-in method instead of these functions.
 * Example:
 * 
 * const { rive } = useRive({ ... });
 * 
 * // In onLoad callback or useEffect:
 * if (rive) {
 *   rive.resizeDrawingSurfaceToCanvas();
 * }
 * 
 * // Also handle window resize:
 * useEffect(() => {
 *   const handleResize = () => {
 *     if (rive) {
 *       rive.resizeDrawingSurfaceToCanvas();
 *     }
 *   };
 *   
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [rive]);
 */ 