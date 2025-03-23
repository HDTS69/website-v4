'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OpenNowIndicator } from '../ui/OpenNowIndicator';
import { RiveLogo } from '../ui/RiveLogo';

export function MobileHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Logo with navigation functionality
  const LogoButton = () => {
    const logoContent = (
      <div className="flex items-center justify-between w-full px-3">
        {/* Left-aligned Icon Logo */}
        <div className="flex-shrink-0 mr-2">
          <RiveLogo width={70} height={70} />
        </div>
        
        {/* Centered Text Logo - Increased size */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
          <Image
            src="/images/text-logo.webp"
            alt="HD Trade Services"
            width={200}
            height={42}
            style={{ objectFit: 'contain' }}
            priority
            className="max-h-[42px] w-auto"
            sizes="200px"
          />
        </div>
      </div>
    );

    // On homepage, scroll to top; otherwise navigate to homepage
    if (isHomePage) {
      return (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full bg-transparent border-none p-0 m-0 cursor-pointer"
          aria-label="Return to top"
        >
          {logoContent}
        </button>
      );
    }

    return (
      <Link 
        href="/"
        className="w-full"
        aria-label="Return to homepage"
      >
        {logoContent}
      </Link>
    );
  };

  return (
    <>
      {/* Open Now Indicator - Fixed at top */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-[60]",
          "bg-black/90 backdrop-blur-sm border-b border-gray-800/40",
          "block md:hidden"
        )}
        style={{ 
          paddingTop: 'calc(env(safe-area-inset-top) + 2px)',
          paddingBottom: '2px'
        }}
      >
        <div className="flex justify-center items-center">
          <OpenNowIndicator 
            showTime={false}
            className="text-xs font-medium text-[#00E6CA]" 
          />
        </div>
      </div>
      
      {/* Main Header with Logos - Fixed with transparent background */}
      <header 
        className={cn(
          "fixed w-full z-50",
          "block md:hidden"
        )}
        style={{ 
          paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)'
        }}
      >
        <div className="py-2">
          <LogoButton />
        </div>
      </header>
    </>
  );
} 