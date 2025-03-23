'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AnimatedBookNowButton } from '../ui/AnimatedBookNowButton';
import { SparklesCore } from '../ui/SparklesCore';
import { getImageLoadingProps, IMAGE_SIZES } from '@/utils/imageLoading';
import { BackgroundSparkles } from '../ui/BackgroundSparkles';

interface ServiceDetailProps {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  images: string[];
  callToAction?: string;
}

/**
 * Layout component for individual service detail pages.
 * This is used for specific services like Leaking Taps, Gas BBQ Installation, etc.
 */
export function ServiceDetailLayout({
  title,
  description,
  features,
  benefits,
  images,
  callToAction = 'Book Now',
}: ServiceDetailProps) {
  return (
    <div className="pt-32 pb-16">
      {/* Background Effects */}
      <BackgroundSparkles zIndex={5} />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1CD4A7] via-white to-[#1CD4A7]">
              {title}
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              {description}
            </p>

            {/* Features List */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Services Include:</h2>
              <ul className="grid gap-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <svg
                      className="w-5 h-5 text-[#00E6CA] mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Why Choose Us</h2>
              <ul className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <svg
                      className="w-5 h-5 text-[#00E6CA] mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <AnimatedBookNowButton href="#book" className="w-full sm:w-auto">
              {callToAction}
            </AnimatedBookNowButton>
          </motion.div>

          {/* Right Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {images.map((image, index) => (
              <div key={index} className="relative">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${title} service image ${index + 1}`}
                    fill
                    sizes={IMAGE_SIZES.CARD}
                    className="object-cover"
                    {...getImageLoadingProps()}
                  />
                </div>
                <AnimatedBookNowButton
                  href="#book"
                  className="absolute bottom-4 right-4 !px-4 !py-2 text-sm"
                >
                  Book Now
                </AnimatedBookNowButton>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Default export for cleaner imports - renamed to clarify its purpose for individual service pages
export default ServiceDetailLayout; 