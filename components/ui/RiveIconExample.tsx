'use client';

import { useEffect } from 'react';
import RiveIcon from './RiveIcon';
import { preloadRiveAnimations } from '../../utils/riveUtils';

/**
 * Example component showing how to use Rive icons
 * Replace this with your actual implementation
 */
export default function RiveIconExample() {
  // Preload animations when the component mounts
  useEffect(() => {
    // Example: preload animations (replace with your actual file names)
    preloadRiveAnimations(['example-icon.riv', 'another-icon.riv']);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">Rive Icon Examples</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Basic icon example */}
        <div className="flex flex-col items-center">
          <RiveIcon 
            src="/rive/example-icon.riv" 
            width={48} 
            height={48}
            className="mb-2"
          />
          <p className="text-sm text-center">Basic Icon</p>
        </div>
        
        {/* Icon with state machine */}
        <div className="flex flex-col items-center">
          <RiveIcon 
            src="/rive/example-icon.riv" 
            stateMachineName="STATE_MACHINE_NAME"
            width={48} 
            height={48}
            className="mb-2"
          />
          <p className="text-sm text-center">With State Machine</p>
        </div>
        
        {/* Icon with specific animation */}
        <div className="flex flex-col items-center">
          <RiveIcon 
            src="/rive/example-icon.riv" 
            animationName="ANIMATION_NAME"
            width={48} 
            height={48}
            className="mb-2"
          />
          <p className="text-sm text-center">Custom Animation</p>
        </div>
        
        {/* Larger icon */}
        <div className="flex flex-col items-center">
          <RiveIcon 
            src="/rive/example-icon.riv" 
            width={64} 
            height={64}
            className="mb-2"
          />
          <p className="text-sm text-center">Larger Size</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
        <p className="font-medium mb-2">To use Rive icons:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Add .riv files to the /public/rive directory</li>
          <li>Import the RiveIcon component</li>
          <li>Pass the filename and desired properties</li>
          <li>Optional: Use preloadRiveAnimations() to improve performance</li>
        </ol>
      </div>
    </div>
  );
} 