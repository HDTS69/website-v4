'use client';

import ClientBackground from '@/app/components/ClientBackground';
import { motion } from 'framer-motion';
import { Testimonials } from "@/components/ui/Testimonials";
import { BookingForm } from "@/components/ui/BookingForm/BookingForm";
import { GoogleReviews } from "@/components/ui/GoogleReviews";

interface ServiceCategoryLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Layout component for main service category pages.
 * This is used for pages like Plumbing, Gas Fitting, etc.
 */
export function ServiceCategoryLayout({ title, description, children }: ServiceCategoryLayoutProps) {
  return (
    <div className="relative w-full min-h-screen">
      <ClientBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E6CA] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1, 
                opacity: [0, 1, 1, 0.8],
              }}
              transition={{ 
                duration: 1.5,
                opacity: {
                  times: [0, 0.3, 0.7, 1],
                  duration: 1.5
                },
                ease: "easeOut"
              }}
              style={{
                transformOrigin: "center"
              }}
            />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mt-6 mb-4">
            {description}
          </p>
          <div className="flex justify-center">
            <GoogleReviews />
          </div>
        </div>

        {/* Services Grid */}
        {children}
      </div>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Booking Form Section */}
      <section id="book" className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Book Your Service
              </h2>
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E6CA] to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: 1, 
                  opacity: [0, 1, 1, 0.8],
                }}
                transition={{ 
                  duration: 1.5,
                  opacity: {
                    times: [0, 0.3, 0.7, 1],
                    duration: 1.5
                  },
                  ease: "easeOut"
                }}
                style={{
                  transformOrigin: "center"
                }}
              />
            </div>
          </div>

          <BookingForm brandName="HD Trade Services" />
        </div>
      </section>
    </div>
  );
}

// Default export for cleaner imports - renamed to clarify its purpose
export default ServiceCategoryLayout; 