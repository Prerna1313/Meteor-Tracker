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
        <button 
          onClick={() => alert("hey")}
          className="group relative px-6 py-3 bg-gradient-to-r from-black-600/20 to-purple-600/20 border border-amber-400/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:from-amber-500/30 hover:to-orange-500/30 hover:border-amber-300/50 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 text-amber-200 font-bold tracking-widest text-sm uppercase">
            HIGH
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </nav>
    </header>
  );
}