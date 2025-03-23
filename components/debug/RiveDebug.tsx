'use client';

import { useEffect, useRef, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export function RiveDebug() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('Loading...');
  const [availableFiles, setAvailableFiles] = useState<string[]>([
    '/rive/icon-logo-animation.riv',
    '/rive/Icon Logo Animation.riv'
  ]);
  const [selectedFile, setSelectedFile] = useState<string>(availableFiles[0]);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  
  // Using a minimal Rive setup for debugging
  const { RiveComponent, rive } = useRive({
    src: selectedFile,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    }),
    onLoad: () => {
      setStatus('Animation loaded successfully');
      
      // Fix blurry rendering
      if (rive && containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          // Set explicit dimensions
          canvas.style.width = `${dimensions.width}px`;
          canvas.style.height = `${dimensions.height}px`;
          
          // Apply high DPI fix
          try {
            rive.resizeDrawingSurfaceToCanvas();
            setStatus(prev => `${prev}, canvas sized correctly`);
          } catch (e) {
            console.error('Sizing error:', e);
            setStatus(prev => `${prev}, but sizing failed: ${String(e)}`);
          }
        } else {
          setStatus(prev => `${prev}, but no canvas found`);
        }
      }
    },
    onLoadError: (e) => {
      console.error('Load error:', e);
      setStatus(`Failed to load: ${String(e)}`);
    }
  });
  
  // Check if files exist
  useEffect(() => {
    // Function to check file existence
    const checkFile = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return { url, exists: response.ok, status: response.status };
      } catch (e) {
        return { url, exists: false, error: e };
      }
    };
    
    // Check all files
    const checkAllFiles = async () => {
      const results = await Promise.all(availableFiles.map(checkFile));
      console.log('File check results:', results);
      
      // Update status with file check results
      setStatus(prev => `${prev}; File checks: ${results.map(r => 
        `${r.url.split('/').pop()}: ${r.exists ? 'Found' : 'Not found'}`
      ).join(', ')}`);
      
      // Automatically select first available file
      const firstAvailable = results.find(r => r.exists);
      if (firstAvailable && firstAvailable.url !== selectedFile) {
        setSelectedFile(firstAvailable.url);
      }
    };
    
    checkAllFiles();
  }, [availableFiles, selectedFile]);
  
  // Handle resize
  useEffect(() => {
    if (!rive || !containerRef.current) return;
    
    const canvas = containerRef.current.querySelector('canvas');
    if (canvas) {
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      
      try {
        rive.resizeDrawingSurfaceToCanvas();
      } catch (e) {
        console.error('Resize error:', e);
      }
    }
  }, [dimensions, rive]);
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Rive Animation Debug</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Status: {status}</p>
        
        <div className="flex gap-2 mb-4">
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => setDimensions({ width: 100, height: 100 })}
          >
            Small
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => setDimensions({ width: 200, height: 200 })}
          >
            Medium
          </button>
          <button 
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            onClick={() => setDimensions({ width: 400, height: 400 })}
          >
            Large
          </button>
        </div>
        
        <select 
          className="w-full p-2 bg-gray-800 rounded mb-4"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          {availableFiles.map(file => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
      
      <div 
        ref={containerRef}
        className="relative bg-black rounded overflow-hidden"
        style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          margin: '0 auto'
        }}
      >
        <div className="absolute inset-0">
          <RiveComponent />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400 space-y-2">
        <p className="font-bold">Canvas Details:</p>
        <CanvasInfo containerRef={containerRef} />
      </div>
    </div>
  );
}

// Define TypeScript interface
interface CanvasInfoProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

// Helper component to show canvas information
function CanvasInfo({ containerRef }: CanvasInfoProps) {
  const [info, setInfo] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateInfo = () => {
      const canvas = containerRef.current?.querySelector('canvas');
      if (!canvas) {
        setInfo({ error: 'Canvas not found' });
        return;
      }
      
      setInfo({
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
        pixelRatio: window.devicePixelRatio || 1,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        hasDimensions: Boolean(canvas.width && canvas.height)
      });
    };
    
    // Update initially and set up interval
    updateInfo();
    const interval = setInterval(updateInfo, 1000);
    
    return () => clearInterval(interval);
  }, [containerRef]);
  
  if (info.error) {
    return <p>Error: {info.error}</p>;
  }
  
  return (
    <div>
      <p>Canvas dimensions: {info.width}x{info.height} pixels</p>
      <p>CSS dimensions: {info.styleWidth}x{info.styleHeight}</p>
      <p>Client dimensions: {info.clientWidth}x{info.clientHeight}px</p>
      <p>Device pixel ratio: {info.pixelRatio}</p>
    </div>
  );
} 