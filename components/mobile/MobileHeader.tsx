'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OpenNowIndicator } from '../ui/OpenNowIndicator';
import { RiveLogo } from '../ui/RiveLogo';

export function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // Update background opacity
      setIsScrolled(currentScroll > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const LogoButton = () => {
    const buttonContent = (
      <div className="flex items-center w-full relative">
        {/* Main Logo Section with logos */}
        <div className="w-full flex items-center justify-between px-3 relative">
          {/* Left-aligned Icon Logo */}
          <div className="flex-shrink-0">
            <RiveLogo width={80} height={80} />
          </div>
          
          {/* Centered Text Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
            <Image
              src="/images/text-logo.webp"
              alt="HD Trade Services"
              width={160}
              height={35}
              style={{ objectFit: 'contain' }}
              priority
              className="max-h-[35px] w-auto"
              sizes="160px"
            />
          </div>
        </div>
      </div>
    );

    if (isHomePage) {
      return (
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full cursor-pointer"
          aria-label="Return to top"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {buttonContent}
        </div>
      );
    }

    return (
      <Link 
        href="/"
        className="w-full"
        aria-label="Return to homepage"
      >
        {buttonContent}
      </Link>
    );
  };

  return (
    <>
      {/* Absolute position for Open Now Indicator at the top of the page */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-[60]", // Higher z-index to ensure it's above the header
          "bg-black/80 backdrop-blur-sm border-b border-gray-800/40",
          "block md:hidden",
          "py-0.5 px-4"
        )}
        style={{ 
          touchAction: 'auto',
          paddingTop: 'calc(env(safe-area-inset-top) + 2px)'
        }}
      >
        <div className="flex justify-center items-center w-full">
          <OpenNowIndicator 
            showTime={false}
            className="text-xs font-medium" 
          />
        </div>
      </div>
      
      {/* Main header with logos */}
      <header 
        className={cn(
          // Base styles
          "fixed w-full z-50",
          // Background and transition
          "transition-all duration-300 ease-in-out",
          // Transparent background with blur
          isScrolled ? "bg-black/80 backdrop-blur-sm shadow-lg" : "bg-transparent backdrop-blur-sm",
          // Show only on mobile
          "block md:hidden"
        )}
        style={{ 
          touchAction: 'auto',
          paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)' // Add extra padding for the indicator
        }}
      >
        <div className="py-2">
          <LogoButton />
        </div>
      </header>
    </>
  );
} 