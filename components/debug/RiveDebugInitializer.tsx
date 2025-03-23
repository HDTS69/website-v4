'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RiveDebug } from './RiveDebug';

export function RiveDebugInitializer() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check for debug=rive parameter in URL
    if (searchParams) {
      const debugValue = searchParams.get('debug');
      setIsVisible(debugValue === 'rive');
    }
    
    // Add keyboard shortcut (Ctrl+Shift+D) to toggle debug panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchParams]);
  
  return <RiveDebug visible={isVisible} />;
} 