'use client';
import { Button } from './ui/button';
import Link from 'next/link';

const MeteorLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4"/>
        <path d="M30 70 L40 50 L50 70 L60 50 L70 70" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-transparent">
      <div className="flex items-center gap-3">
        <MeteorLogo className="w-8 h-8" />
        <h1 className="text-base font-bold text-white/40 tracking-wider">
          EYES ON METEORS
        </h1>
      </div>
      <nav>
        <Link href="/heatmap" className="text-base font-bold text-white/40 tracking-wider hover:text-white">
          <Button onClick={()=>alert("hey")}>HIGH</Button>
        </Link>
      </nav>
    </header>
  );
}