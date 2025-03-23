'use client';

import { useEffect, useState, useRef } from 'react';
import { RuntimeLoader } from '@rive-app/react-canvas';

/**
 * Utility component that helps preload and manage Rive animations.
 * This component addresses issues with Rive animations failing to load
 * and provides mechanisms to recover from those failures.
 */
export function RiveLoader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear any stuck Rive animations
  const clearFailedRiveAnimations = () => {
    // Find and remove any canvas elements that might be stuck
    const riveElements = document.querySelectorAll('canvas[data-rive]');
    riveElements.forEach(el => {
      const parent = el.parentElement;
      if (parent) {
        const newCanvas = document.createElement('canvas');
        newCanvas.setAttribute('data-rive', 'true');
        parent.appendChild(newCanvas);
        el.remove();
      }
    });

    // Clear any error flags
    document.querySelectorAll('[data-rive-error="true"]').forEach(el => {
      el.removeAttribute('data-rive-error');
    });
  };

  useEffect(() => {
    // Initialize the Rive runtime
    try {
      const runtimeInstance = RuntimeLoader.getInstance('canvas');
      if (runtimeInstance) {
        runtimeInstance
          .load()
          .then(() => {
            setIsLoaded(true);
            // Clear any previously failed animations
            clearFailedRiveAnimations();
          })
          .catch((err: Error) => {
            console.error('Failed to load Rive runtime:', err);
            setHasError(true);
          });
      }
    } catch (e) {
      console.error('Error getting Rive runtime instance:', e);
      setHasError(true);
    }

    // Set up error handling for network issues that might affect Rive
    const handleNetworkChange = () => {
      if (navigator.onLine && hasError) {
        // If we're back online and had errors, try to reload the runtime
        try {
          const runtimeInstance = RuntimeLoader.getInstance('canvas');
          if (runtimeInstance) {
            runtimeInstance
              .load()
              .then(() => {
                setIsLoaded(true);
                setHasError(false);
                clearFailedRiveAnimations();
              })
              .catch((err: Error) => {
                console.error('Failed to reload Rive runtime:', err);
              });
          }
        } catch (e) {
          console.error('Error getting Rive runtime instance on network change:', e);
        }
      }
    };

    // Listen for online status changes
    window.addEventListener('online', handleNetworkChange);

    // Retry with delay on initial load
    if (!isLoaded && !hasError) {
      const retryTimer = setTimeout(() => {
        try {
          const runtimeInstance = RuntimeLoader.getInstance('canvas');
          if (runtimeInstance) {
            runtimeInstance
              .load()
              .then(() => {
                setIsLoaded(true);
                clearFailedRiveAnimations();
              })
              .catch((err: Error) => {
                console.error('Retry failed to load Rive runtime:', err);
                setHasError(true);
              });
          }
        } catch (e) {
          console.error('Error getting Rive runtime instance on retry:', e);
          setHasError(true);
        }
      }, 2000);

      animationTimeoutRef.current = retryTimer;

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        window.removeEventListener('online', handleNetworkChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleNetworkChange);
    };
  }, [isLoaded, hasError]);

  // This component doesn't render anything visible
  return null;
}

export default RiveLoader; 