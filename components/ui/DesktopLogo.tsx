'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export interface DesktopLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function DesktopLogo({
  width = 100,
  height = 100,
  className = '',
}: DesktopLogoProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const logoContent = (
    <>
      <div className="flex items-center">
        {/* Static Icon Logo */}
        <div className="flex-shrink-0">
          <Image 
            src="/images/icon-logo.webp" 
            alt="HD Trade Services Icon" 
            width={typeof width === 'number' ? width : 100}
            height={typeof height === 'number' ? height : 100}
            className="h-full w-full"
            priority
            sizes={`${width}px`}
          />
        </div>
        
        {/* Text Logo */}
        <div className="relative h-10 w-56 ml-4 hidden sm:block">
          <Image
            src="/images/text-logo.webp"
            alt="HD Trade Services"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            priority
            sizes="(max-width: 768px) 100vw, 224px"
          />
        </div>
      </div>
    </>
  );

  return isHomePage ? (
    <button 
      className={`flex items-center ${className}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      {logoContent}
    </button>
  ) : (
    <Link href="/" className={`flex items-center ${className}`}>
      {logoContent}
    </Link>
  );
}

export default DesktopLogo; 