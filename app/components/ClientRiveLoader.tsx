'use client';

import dynamic from 'next/dynamic';

const RiveScript = dynamic(() => import('./RiveScript'), {
  ssr: false
});

export default function ClientRiveLoader() {
  return <RiveScript />;
} 