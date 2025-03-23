'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getImageLoadingProps, ImagePriority } from '@/utils/imageLoading';
import { OpenNowIndicator } from '../ui/OpenNowIndicator';
import Logo from '../ui/logo';

export function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Set header visible after a short delay for entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // Update background opacity
      setIsScrolled(currentScroll > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const LogoButton = () => {
    const buttonContent = (
      <motion.div 
        className="flex items-center w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }}
        style={{ touchAction: 'auto' }}
      >
        {/* Logo */}
        <div className="flex-grow flex justify-center items-center">
          <Logo className="mx-auto" width={36} height={36} />
        </div>
        
        {/* Open Now Indicator on the right */}
        <div className="flex justify-end flex-shrink-0 pr-4">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isVisible ? 1 : 0,
              transition: { delay: 0.3, duration: 0.5 }
            }}
          >
            <OpenNowIndicator showTime={false} className="scale-90" />
          </motion.div>
        </div>
      </motion.div>
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
    <motion.header 
      className={cn(
        // Base styles
        "fixed w-full z-50",
        // Background and transition
        "transition-all duration-300 ease-in-out",
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-transparent',
        // Show only on mobile
        "block md:hidden"
      )}
      initial={{ opacity: 0, y: -100 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -100,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.1
        }
      }}
      style={{ 
        touchAction: 'auto',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        <LogoButton />
      </div>
    </motion.header>
  );
} 