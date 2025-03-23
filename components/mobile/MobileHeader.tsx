'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { OpenNowIndicator } from '../ui/OpenNowIndicator';
import { RiveLogo } from '../ui/RiveLogo';

export function MobileHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const openNowRef = useRef<HTMLDivElement>(null);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  
  // State for tracking scroll position and visibility
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  
  // Critical: Apply fixed positioning using all possible approaches
  useEffect(() => {
    // Apply positioning that allows header to scroll away normally
    const fixHeaderPositioning = () => {
      if (!openNowRef.current || !mainHeaderRef.current) return;
      
      const openNowHeight = openNowRef.current.offsetHeight;
      
      // 1. Change position from fixed to absolute to allow scrolling away
      Object.assign(openNowRef.current.style, {
        position: 'absolute', // Changed from 'fixed' to 'absolute'
        top: '0',
        left: '0',
        right: '0',
        width: '100%',
        zIndex: '9999',
        transition: 'transform 0.3s ease-in-out',
        willChange: 'transform',
        WebkitBackfaceVisibility: 'hidden',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.9))',
        backdropFilter: 'blur(4px)'
      });
      
      Object.assign(mainHeaderRef.current.style, {
        position: 'absolute', // Changed from 'fixed' to 'absolute'
        top: `${openNowHeight}px`,
        left: '0',
        right: '0',
        width: '100%',
        zIndex: '9998',
        transition: 'transform 0.3s ease-in-out, top 0.3s ease-in-out',
        willChange: 'transform',
        WebkitBackfaceVisibility: 'hidden',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
        backdropFilter: 'blur(4px)'
      });
      
      // 2. Add meta viewport tag to prevent iOS Safari scaling issues
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
      
      // 3. Remove body classes as we don't need special handling for fixed header
      document.body.classList.remove('has-fixed-header');
      document.body.classList.remove('header-hidden');
      
      // 4. Calculate actual heights for content padding - but don't apply padding
      const totalHeaderHeight = openNowHeight + (mainHeaderRef.current?.offsetHeight || 0);
      document.documentElement.style.setProperty(
        '--mobile-header-height', 
        `${totalHeaderHeight}px`
      );
      
      // 5. Remove padding from body - let header scroll normally
      document.body.style.paddingTop = '0px';
    };
    
    // Remove scroll handling as we want header to scroll away normally
    
    // Run immediately
    fixHeaderPositioning();
    
    // Run on resize and orientation change
    window.addEventListener('resize', fixHeaderPositioning, { passive: true });
    window.addEventListener('orientationchange', fixHeaderPositioning);
    
    // Check again after a short delay to catch any post-render layout shifts
    const timer1 = setTimeout(fixHeaderPositioning, 100);
    const timer2 = setTimeout(fixHeaderPositioning, 1000);
    
    return () => {
      window.removeEventListener('resize', fixHeaderPositioning);
      window.removeEventListener('orientationchange', fixHeaderPositioning);
      document.body.classList.remove('has-fixed-header');
      document.body.classList.remove('header-hidden');
      document.body.style.paddingTop = '0px';
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const LogoButton = () => {
    const buttonContent = (
      <div className="flex items-center w-full relative">
        {/* Main Logo Section with logos */}
        <div className="w-full flex items-center justify-between px-0 relative">
          {/* Left-aligned Icon Logo */}
          <div className="flex-shrink-0 pl-0">
            <RiveLogo width={100} height={100} />
          </div>
          
          {/* Centered Text Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center items-center">
            <Image
              src="/images/text-logo.webp"
              alt="HD Trade Services"
              width={720}
              height={156}
              style={{ objectFit: 'contain' }}
              priority
              className="max-h-[156px] w-auto"
              sizes="720px"
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
      {/* Open Now Indicator */}
      <div 
        ref={openNowRef}
        id="mobile-open-now"
        className="backdrop-blur-sm py-1 px-4 md:hidden"
        style={{ 
          paddingTop: 'env(safe-area-inset-top)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 50,
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.9))',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className="flex justify-center items-center w-full">
          <OpenNowIndicator 
            showTime={false}
            className="text-sm font-medium" 
          />
        </div>
      </div>
      
      {/* Main header */}
      <header 
        ref={mainHeaderRef}
        id="mobile-main-header"
        className="backdrop-blur-sm md:hidden"
        style={{ 
          position: 'absolute',
          top: openNowRef.current ? openNowRef.current.offsetHeight + 'px' : '24px',
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 49,
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className="py-2">
          <LogoButton />
        </div>
      </header>
    </>
  );
} 