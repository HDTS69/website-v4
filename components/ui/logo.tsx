'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Logo({
  width = 48,
  height = 48,
  className = '',
}: LogoProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const logoContent = (
    <>
      <div className="flex items-center">
        <div className="relative" style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}>
          <Image 
            src="/images/icon-logo.webp" 
            alt="HD Trade Services Logo" 
            width={typeof width === 'number' ? width : 48} 
            height={typeof height === 'number' ? height : 48}
            priority
          />
        </div>
        <div className="relative h-8 w-48 ml-2 hidden sm:block">
          <Image
            src="/images/text-logo.webp"
            alt="HD Trade Services"
            fill
            style={{ objectFit: 'contain', objectPosition: 'left' }}
            priority
          />
        </div>
        <span className="text-white text-xl font-bold ml-2 sm:hidden">
          HD Trade Services
        </span>
      </div>
    </>
  );

  return isHomePage ? (
    <button className={`flex items-center ${className}`}>
      {logoContent}
    </button>
  ) : (
    <Link href="/" className={`flex items-center ${className}`}>
      {logoContent}
    </Link>
  );
}

export default Logo;
