import React from 'react';
import Image from 'next/image';
import { SparklesCore } from '../ui/SparklesCore';
import { Cover } from '../ui/cover';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../ui/AnimatedButton';
import { getImageLoadingProps, IMAGE_SIZES, ImagePriority } from '@/utils/imageLoading';
import { HeroBookingForm } from './HeroBookingForm';

export function Hero() {
  // Remove unused state management
  // const [isLoaded, setIsLoaded] = React.useState(true);
  const [showBookingForm, setShowBookingForm] = React.useState(false);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-black opacity-0 animate-fade-in animation-delay-200 overflow-x-hidden overflow-y-auto pb-24 pt-28 touch-auto">
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
              className="absolute bottom-0 left-0 w-[55%] h-[70%]"
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
                  priority
                  quality={90}
                  loading="eager"
                  draggable="false"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Bottom fade gradient only */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent transform-gpu" />
        </div>
      </div>

      {/* Content Container */}
      <div 
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <div className="flex flex-col items-center min-h-[calc(100vh-220px)] justify-center mt-8">
          {/* Hero Text */}
          <div className="flex flex-col items-center max-w-[100%] text-center mb-6">
            {/* New shadow box to help with visibility */}
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl mb-4">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">
                <span className="block mb-1 opacity-0 animate-fade-in-up animation-delay-300">
                  Brisbane
                </span>
                <span className="inline-block mb-1 text-[#00E6CA] opacity-0 animate-fade-in-up animation-delay-400">
                  24/7 Emergency Repairs
                </span>
                <span className="block opacity-0 animate-fade-in-up animation-delay-500">
                  & Installations
                </span>
              </h1>
              
              <p className="text-base text-gray-300 mb-2 leading-relaxed opacity-0 animate-fade-in-up animation-delay-600 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                Professional plumbing, gas, roofing & air conditioning services.
              </p>
              
              <p className="text-base text-gray-300 mb-4 leading-relaxed opacity-0 animate-fade-in-up animation-delay-650 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                Fast response. Fair pricing. Guaranteed satisfaction.
              </p>
            </div>

            <div className="opacity-0 animate-fade-in-up animation-delay-800 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-2xl max-w-[280px] mx-auto">
              <div className="flex flex-col items-center gap-1">
                <span className="text-white/90 text-sm">Technician to your home at</span>
                <Cover className="text-[#00E6CA] font-semibold text-base">warp speed</Cover>
              </div>
            </div>
            
            <div className="opacity-0 animate-scale-up animation-delay-900 transform-gpu mt-4">
              <AnimatedButton 
                href="#book"
                variant="primary"
                className="shadow-lg hover:shadow-xl hover:shadow-[#00E6CA]/20 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  setShowBookingForm(true);
                  setTimeout(() => {
                    const bookingForm = document.getElementById('book');
                    if (bookingForm) {
                      bookingForm.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
              >
                Book Online
              </AnimatedButton>
            </div>
          </div>
        </div>
        
        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto mb-12"
            >
              <HeroBookingForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 