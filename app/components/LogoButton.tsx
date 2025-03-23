/// <reference path="../types/lord-icon.d.ts" />
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Declare the lord-icon element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': {
        src: string;
        trigger?: string;
        colors?: string;
        style?: React.CSSProperties;
        class?: string;
        state?: string;
        target?: string;
      };
    }
  }
}

export default function LogoButton() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const iconRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const iconElement = iconRef.current;
    if (!iconElement) return;

    // Play animation once on mount
    iconElement.setAttribute('trigger', 'loop');

    // Listen for animation completion
    const handleComplete = () => {
      if (iconElement) {
        iconElement.setAttribute('trigger', 'none');
      }
    };

    iconElement.addEventListener('complete', handleComplete, { once: true });

    return () => {
      if (iconElement) {
        iconElement.removeEventListener('complete', handleComplete);
      }
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  const buttonContent = (
    <>
      <lord-icon
        ref={iconRef}
        src="/icons/logo.json"
        trigger="none"
        colors="primary:#ffffff"
        style={{ width: '48px', height: '48px' }}
      />
      <span className="text-white text-2xl font-bold ml-2">
        Plumber
      </span>
    </>
  );

  return isHomePage ? (
    <button className="flex items-center">
      {buttonContent}
    </button>
  ) : (
    <Link href="/" className="flex items-center">
      {buttonContent}
    </Link>
  );
} 