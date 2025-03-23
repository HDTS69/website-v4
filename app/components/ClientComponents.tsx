'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { preloadRiveAnimations } from '@/utils/riveUtils';

const ScrollToTop = dynamic(() => import('@/components/ui/ScrollToTop').then(mod => ({ default: mod.ScrollToTop })), { ssr: false });
const Analytics = dynamic(() => import('@/components/Analytics').then(mod => ({ default: mod.Analytics })), { ssr: false });
const GoogleMapsScript = dynamic(() => import('@/components/ui/BookingForm/GoogleMapsScript').then(mod => ({ default: mod.GoogleMapsScript })), { ssr: false });

// Preload Rive animations
function RivePreloader() {
  useEffect(() => {
    // Preload the logo animation as it's used in critical UI elements
    preloadRiveAnimations(['Icon Logo Animation.riv']);
  }, []);
  
  return null;
}

// Silent version of the particle debugger without console logs
function ParticleDebugger() {
  useEffect(() => {
    // No console logs
    return () => {};
  }, []);
  
  return null;
}

export function ClientComponents() {
  return (
    <>
      <RivePreloader />
      <ParticleDebugger />
      <ScrollToTop />
      <Analytics />
      <GoogleMapsScript />
    </>
  );
} 