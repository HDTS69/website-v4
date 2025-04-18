"use client";

import React from "react";
import { SparklesCore } from "./SparklesCore";

interface BackgroundSparklesProps {
  zIndex?: number;
  containerClassName?: string;
  useFixed?: boolean;
  opacity?: number;
}

/**
 * A consistent background sparkles effect component that can be used throughout the application
 * with standardized parameters.
 */
export function BackgroundSparkles({
  zIndex = 1,
  containerClassName = "",
  useFixed = true,
  opacity = 1,
}: BackgroundSparklesProps) {
  return (
    <div 
      className={`${useFixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none ${containerClassName}`}
      style={{ 
        zIndex,
        opacity,
        pointerEvents: 'none'
      }}
    >
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.8}
        particleDensity={180}
        className="w-full h-full"
        particleColor="#00E6CA"
        speed={0.6}
      />
    </div>
  );
} 