'use client';

import React from 'react';
import { AnimatedButton } from './ui/AnimatedButton';
import { SparklesCore } from './ui/SparklesCore';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero as MobileHero } from './mobile/Hero';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  getImageLoadingProps,
  IMAGE_SIZES,
  ImagePriority
} from '@/utils/imageLoading';
import { HeroBookingForm } from '@/components/HeroBookingForm';
import { GoogleReviews } from './ui/GoogleReviews';
import { BackgroundSparkles } from "@/components/ui/BackgroundSparkles";

export function Hero() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileHero />;
  }

  const handleBookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const bookingForm = document.getElementById('book');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="
        relative min-h-[100dvh]
        flex items-center justify-center
        bg-black
        overflow-x-hidden overflow-y-auto
      "
    >
      {/* Sparkles Background */}
      <div className="absolute inset-0 z-[2]">
        <BackgroundSparkles zIndex={5} />
      </div>

      {/* Hero Image (absolutely positioned) */}
      <div className="absolute inset-0 top-[80px] z-[3] transform-gpu">
        <div className="relative h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              className="absolute inset-0 left-0 w-[35%] h-full"
              initial={{ x: '-100vw', opacity: 0 }}
              animate={{ 
                x: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  damping: 20,
                  mass: 0.75,
                  stiffness: 100,
                  delay: 0.2
                }
              }}
              key="hero-image"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/hayden-hero-fixed.webp"
                  alt="Professional Technician"
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  style={{ 
                    objectFit: 'contain', 
                    objectPosition: 'left center',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                  }}
                  className="select-none optimize-performance"
                  {...getImageLoadingProps(ImagePriority.CRITICAL)}
                />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% via-black/70 via-85% to-black transform-gpu" />
        </div>
      </div>
      
      {/* Main Container */}
      <div className="relative z-[4] container mx-auto px-4 py-8">
        <div
          className="
            grid grid-cols-12 gap-6
            items-center
          "
        >
          {/* Left Spacer (for the absolute-positioned image) */}
          <div className="col-span-3 hidden md:block" />
          
          {/* Text Column */}
          <div
            className="
              col-span-12 md:col-span-5
              flex flex-col
              items-center md:items-center
              text-center md:text-center
              select-none transform-gpu
            "
          >
            {/* Tighter spacing to keep text together */}
            <h1
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-5xl
                font-bold text-white mb-3
                tracking-tight leading-tight
              "
            >
              <span className="block mb-1 opacity-0 animate-fade-in-up animation-delay-300">
                Brisbane
              </span>
              <span
                className="
                  inline-block mb-1 text-[#00E6CA]
                  opacity-0 animate-fade-in-up animation-delay-400
                "
              >
                24/7 Emergency Repairs
              </span>
              <span
                className="
                  block opacity-0 animate-fade-in-up
                  animation-delay-500
                "
              >
                & Installations
              </span>
            </h1>
            
            <p
              className="
                text-base sm:text-base md:text-lg text-gray-300
                mb-2 leading-relaxed
                opacity-0 animate-fade-in-up animation-delay-600
                drop-shadow-[0_2px_4px_rgba(0,0,0,1)]
                font-medium transform-gpu
              "
            >
              Professional plumbing, gas, roofing & air conditioning services. 
            </p>

            <p
              className="
                text-base sm:text-base md:text-lg text-gray-300
                mb-4 leading-relaxed
                opacity-0 animate-fade-in-up animation-delay-650
                drop-shadow-[0_2px_4px_rgba(0,0,0,1)]
                font-medium transform-gpu
              "
            >
              Fast response. Fair pricing. Guaranteed satisfaction.
            </p>

            {/* Google Reviews Component */}
            <div
              className="
                opacity-0 animate-scale-up animation-delay-700
                transform-gpu mb-4 w-full
              "
            >
              <GoogleReviews />
            </div>
          </div>

          {/* Booking Form */}
          <motion.div
            className="col-span-12 md:col-span-4 w-full"
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ 
              x: 0,
              opacity: 1, 
              transition: {
                type: 'spring',
                damping: 20,
                mass: 0.75,
                stiffness: 100,
                delay: 0.4
              }
            }}
          >
            <HeroBookingForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
