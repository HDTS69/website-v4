'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Define the Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface GoogleMapsScriptProps {
  onLoadSuccess?: () => void;
  onLoadError?: () => void;
}

export function GoogleMapsScript({ onLoadSuccess, onLoadError }: GoogleMapsScriptProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [needsScriptLoad, setNeedsScriptLoad] = useState(false);
  
  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Define the global callback function before loading the script
  useEffect(() => {
    // Skip if not in browser
    if (!isBrowser) return;
    
    // Check if Google Maps API is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      // Google Maps is already loaded, notify success
      setScriptLoaded(true);
      onLoadSuccess?.();
      return;
    }
    
    // Check if any Google Maps script tag already exists
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    if (existingScripts.length > 0) {
      // A script tag already exists, poll for API availability instead of adding a new one
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkInterval);
          setScriptLoaded(true);
          onLoadSuccess?.();
        }
      }, 200);
      
      // Stop checking after 10 seconds to prevent infinite polling
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          setScriptError(true);
          onLoadError?.();
        }
      }, 10000);
      
      return () => clearInterval(checkInterval);
    }
    
    // If we get here, we need to load the script
    setNeedsScriptLoad(true);
    
    // Define callback function for the script
    window.initGooglePlacesAutocomplete = function() {
      setScriptLoaded(true);
      onLoadSuccess?.();
    };
    
    return () => {
      // Cleanup 
      if (typeof window !== 'undefined') {
        window.initGooglePlacesAutocomplete = () => {};
      }
    };
  }, [isBrowser, onLoadSuccess, onLoadError]);

  // Don't render anything on the server or if we don't need to load the script
  if (!isBrowser || !needsScriptLoad) return null;

  return (
    <Script
      id="google-maps-api"
      src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlacesAutocomplete`}
      strategy="afterInteractive"
      onLoad={() => {
        setScriptLoaded(true);
        onLoadSuccess?.();
      }}
      onError={() => {
        setScriptError(true);
        onLoadError?.();
      }}
    />
  );
};
