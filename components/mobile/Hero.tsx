import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { SparklesCore } from '../ui/SparklesCore';
import { Cover } from '../ui/cover';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../ui/AnimatedButton';
import { getImageLoadingProps, IMAGE_SIZES, ImagePriority } from '@/utils/imageLoading';
import { HeroBookingForm } from './HeroBookingForm';

export function Hero() {
  const [showBookingForm, setShowBookingForm] = React.useState(false);
  // No longer need to manually track header height as we use CSS variables now

  return (
    <div 
      className="relative min-h-[100dvh] flex flex-col bg-black overflow-x-hidden overflow-y-auto pb-20 touch-auto"
      style={{ 
        paddingTop: '180px' // Restored spacing to match previous header height
      }}
    >
      {/* Sparkles Animation - Reduced particle density for better performance */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <SparklesCore
          background="transparent"
          minSize={0.8}
          maxSize={2}
          particleDensity={100} // Reduced from 150
          className="w-full h-full"
          particleColor="#00E6CA"
          speed={0.4}
        />
      </div>

      {/* Hero Images Container - Absolute position (fixed to hero section) */}
      <div className="absolute inset-0 bottom-0 z-[3] transform-gpu pointer-events-none">
        <div className="relative h-full w-full">
          {/* Main Hero Image */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="absolute bottom-0 left-0 w-[55%] h-[65%]"
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ 
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
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
                  src="/images/hayden-hero-1.webp"
                  alt="Professional Technician"
                  fill
                  sizes="55vw"
                  style={{ 
                    objectFit: 'contain', 
                    objectPosition: 'left bottom',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                  }}
                  className="select-none optimize-performance"
                  {...getImageLoadingProps(ImagePriority.CRITICAL)}
                  draggable="false"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Bottom fade gradient only */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent transform-gpu" />
        </div>
      </div>

      {/* Content Container - Restored to original position */}
      <div 
        className="container mx-auto px-4 py-0 relative z-10"
      >
        <div className="flex flex-col items-center min-h-[calc(100vh-400px)] justify-center" style={{ marginTop: "0" }}>
          {/* Hero Text */}
          <div className="flex flex-col items-center max-w-[100%] text-center mb-6">
            {/* Text box with removed background */}
            <div className="p-4 rounded-xl mb-4">
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight mb-3">
                <span className="block mb-2 opacity-0 animate-fade-in-up animation-delay-300">
                  Brisbane
                </span>
                <span className="inline-block mb-2 text-[#00E6CA] opacity-0 animate-fade-in-up animation-delay-400">
                  24/7 Emergency Repairs
                </span>
                <span className="block opacity-0 animate-fade-in-up animation-delay-500">
                  & Installations
                </span>
              </h1>
              
              <p className="text-base text-gray-300 mb-3 leading-relaxed font-medium opacity-0 animate-fade-in-up animation-delay-600">
                Professional plumbing, gas, roofing & air conditioning services at fair prices.
              </p>
            </div>

            {/* "Warp Speed" text */}
            <div className="text-lg text-gray-300 mb-3 leading-relaxed flex items-center justify-center gap-1 opacity-0 animate-fade-in-up animation-delay-650 px-4">
              <span>We can have a technician at your door at</span>
              <Cover className="text-[#00E6CA] font-semibold">
                warp speed
              </Cover>
            </div>

            {/* Star Review Component */}
            <div className="px-6 py-3 bg-black/70 backdrop-blur-sm rounded-lg mb-6 transform-gpu opacity-0 animate-scale-up animation-delay-700">
              <div className="flex items-center justify-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-white text-sm font-medium">
                  4.9 (2,842+ Reviews)
                </span>
              </div>
            </div>

            {/* Book Now Button - Only show when booking form is hidden */}
            {!showBookingForm && (
              <div className="w-full px-4 opacity-0 animate-fade-in-up animation-delay-750">
                <AnimatedButton
                  href="#"
                  onClick={() => setShowBookingForm(true)}
                  className="w-full justify-center py-4 animate-glow"
                >
                  Book Now
                </AnimatedButton>
              </div>
            )}
          </div>

          {/* Booking Form - Conditional rendering */}
          <AnimatePresence mode="wait">
            {showBookingForm && (
              <motion.div
                className="w-full px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 20,
                    stiffness: 100
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20,
                  transition: {
                    duration: 0.2
                  }
                }}
              >
                <HeroBookingForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 