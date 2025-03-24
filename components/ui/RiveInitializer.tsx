'use client';

import { useEffect } from 'react';
import { RuntimeLoader } from '@rive-app/canvas';

/**
 * This component initializes Rive and preloads WASM
 * It should be included once at the top level of the application
 * Following Rive documentation: https://rive.app/docs/runtimes/overview/web#rive-wasm
 */
export function RiveInitializer() {
  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return;

    const initializeRiveWasm = async () => {
      try {
        // Dynamically import the WASM file - using @rive-app/canvas as recommended in docs
        const wasmModule = await import('@rive-app/canvas/rive.wasm');
        
        if (wasmModule.default) {
          // Set the WASM URL for the RuntimeLoader
          RuntimeLoader.setWasmUrl(wasmModule.default);
          console.log('Rive WASM initialized successfully');
        }
      } catch (err) {
        console.warn('Failed to initialize Rive WASM:', err);
      }
    };

    // Only load if not already loaded
    if (!RuntimeLoader.hasInstance) {
      initializeRiveWasm();
    }
  }, []);

  // This is a utility component with no UI
  return null;
} 