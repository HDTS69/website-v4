'use client';

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';

// Declare the lord-icon-element module
declare module 'lord-icon-element';

interface LordIconProps {
  src: string;
  trigger?: string;
  colors?: string;
  style?: React.CSSProperties;
  className?: string;
  state?: string;
  target?: string;
  size?: number;
  forceTrigger?: boolean;
}

export interface LordIconRef {
  element: HTMLElement | null;
  setTrigger: (trigger: string) => void;
}

const LordIcon = forwardRef<LordIconRef, LordIconProps>(({
  src,
  trigger = 'none',
  colors,
  style,
  className,
  state,
  target,
  size = 48,
  forceTrigger = false
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const [isLordIconLoaded, setIsLordIconLoaded] = useState(false);

  // Effect to load lord-icon element script
  useEffect(() => {
    const loadLordIconElement = async () => {
      try {
        if (typeof window !== 'undefined' && !customElements.get('lord-icon')) {
          const script = document.createElement('script');
          script.src = 'https://cdn.lordicon.com/lordicon.js';
          script.async = true;
          script.onload = () => {
            setIsLordIconLoaded(true);
          };
          document.body.appendChild(script);
        } else {
          setIsLordIconLoaded(true);
        }
      } catch (error) {
        console.error('Error loading lord-icon element:', error);
      }
    };

    loadLordIconElement();
  }, []);

  // Effect to create the lord-icon element
  useEffect(() => {
    if (!containerRef.current || !isLordIconLoaded) return;
    
    containerRef.current.innerHTML = '';
    
    try {
      const iconElement = document.createElement('lord-icon');
      iconElement.setAttribute('src', src);
      iconElement.setAttribute('trigger', forceTrigger ? 'loop' : trigger);
      
      if (colors) {
        iconElement.setAttribute('colors', colors);
      }
      
      if (state) {
        iconElement.setAttribute('state', state);
      }
      
      if (target) {
        iconElement.setAttribute('target', target);
      }
      
      iconElement.style.width = `${size}px`;
      iconElement.style.height = `${size}px`;
      
      if (style) {
        Object.entries(style).forEach(([key, value]) => {
          iconElement.style[key as any] = value as string;
        });
      }
      
      if (className) {
        iconElement.classList.add(...className.split(' '));
      }
      
      containerRef.current.appendChild(iconElement);
      elementRef.current = iconElement;
    } catch (error) {
      console.error('Error creating lord-icon element:', error);
    }
  }, [src, colors, style, size, className, trigger, forceTrigger, state, target, isLordIconLoaded]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    element: elementRef.current,
    setTrigger: (newTrigger: string) => {
      if (elementRef.current) {
        elementRef.current.setAttribute('trigger', newTrigger);
      }
    }
  }));

  // Handle forceTrigger changes
  useEffect(() => {
    if (elementRef.current && isLordIconLoaded) {
      if (forceTrigger) {
        elementRef.current.setAttribute('trigger', 'loop');
      } else {
        elementRef.current.setAttribute('trigger', trigger);
      }
    }
  }, [forceTrigger, trigger, isLordIconLoaded]);

  return <div ref={containerRef} className={className} />;
});

LordIcon.displayName = 'LordIcon';

export default LordIcon; 