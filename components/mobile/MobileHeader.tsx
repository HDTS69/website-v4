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
      <div className="flex items-center justify-between w-full">
        {/* Left-aligned Icon Logo */}
        <div className="flex-shrink-0">
          <RiveLogo width={60} height={60} />
        </div>
        
        {/* Text Logo - Right aligned */}
        <div className="flex items-center">
          <Image
            src="/images/text-logo.webp"
            alt="HD Trade Services"
            width={180}
            height={38}
            style={{ objectFit: 'contain' }}
            priority
            className="max-h-[38px] w-auto"
            sizes="180px"
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
      {/* Main Header - Fully transparent with minimal height */}
      <header 
        className="fixed w-full z-50 block md:hidden"
        style={{ 
          paddingTop: 'calc(env(safe-area-inset-top))'
        }}
      >
        <div className="flex flex-col">
          {/* Open Now Indicator - Integrated into header */}
          <div className="w-full flex justify-center items-center py-1 bg-black/50 backdrop-blur-sm">
            <OpenNowIndicator 
              showTime={false}
              className="text-xs font-medium text-[#00E6CA]" 
            />
          </div>
          
          {/* Logo section with transparent background */}
          <div className="py-2 px-3 bg-gradient-to-b from-black/80 to-black/30 backdrop-blur-sm">
            <LogoButton />
          </div>
        </div>
      </header>
    </>
  );
} 