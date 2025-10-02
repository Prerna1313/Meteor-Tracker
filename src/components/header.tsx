'use client';

import Image from 'next/image';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 md:px-6 bg-transparent">
      <div className="flex items-center gap-3">
        <Image src="/nasa-logo.svg" alt="NASA Logo" width={40} height={40} />
        <h1 className="text-xl font-bold text-foreground tracking-wider">
          EYES ON ASTEROIDS
        </h1>
      </div>
    </header>
  );
}
