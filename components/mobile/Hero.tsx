import React from 'react';
import Image from 'next/image';
import { SparklesCore } from '../ui/SparklesCore';
import { Cover } from '../ui/cover';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '../ui/AnimatedButton';
import { HeroBookingForm } from './HeroBookingForm';

export function Hero() {
  const [showBookingForm, setShowBookingForm] = React.useState(false);

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-black opacity-0 animate-fade-in animation-delay-200 overflow-x-hidden overflow-y-auto pb-16 pt-16 touch-auto">
      {/* Sparkles Animation */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <SparklesCore
          background="transparent"
          minSize={0.8}
          maxSize={2}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00E6CA"
          speed={0.4}
        />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 flex flex-col h-full relative z-10">
        {/* Top Hero Content */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {/* Hero Text Box */}
          <motion.div 
            className="w-full max-w-md bg-black/40 backdrop-blur-sm p-4 rounded-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-3 text-center">
              <span className="block mb-1">Brisbane</span>
              <span className="inline-block mb-1 text-[#00E6CA]">24/7 Emergency Repairs</span>
              <span className="block">& Installations</span>
            </h1>
            
            <p className="text-base text-gray-300 mb-2 leading-relaxed text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Professional plumbing, gas, roofing & air conditioning services.
            </p>
            
            <p className="text-base text-gray-300 mb-0 leading-relaxed text-center font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              Fast response. Fair pricing. Guaranteed satisfaction.
            </p>
          </motion.div>

          {/* Warp Speed Box */}
          <motion.div 
            className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-2xl max-w-[280px] mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-white/90 text-sm">Technician to your home at</span>
              <Cover className="text-[#00E6CA] font-semibold text-base">warp speed</Cover>
            </div>
          </motion.div>
          
          {/* Book Button */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
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
          </motion.div>
        </div>
        
        {/* Hero Image */}
        <div className="w-full relative h-[45vh] mt-auto">
          <motion.div 
            className="absolute bottom-0 left-0 w-[65%] h-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, delay: 0.2 }}
          >
            <Image
              src="/images/hayden-hero-1.webp"
              alt="Professional Technician"
              fill
              sizes="(max-width: 768px) 65vw, 45vw"
              style={{ 
                objectFit: 'contain', 
                objectPosition: 'left bottom',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
              }}
              className="select-none"
              priority
              quality={90}
              draggable="false"
            />
          </motion.div>
          
          {/* Bottom fade gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
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
            className="w-full max-w-md mx-auto mt-4 px-4 mb-8"
            id="book"
          >
            <HeroBookingForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 