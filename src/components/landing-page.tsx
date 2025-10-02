'use client';

import { ChevronDown } from 'lucide-react';

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


type LandingPageProps = {
  isExiting: boolean;
};

export function LandingPage({ isExiting }: LandingPageProps) {
  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-1000 overflow-hidden ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="stars"></div>
      <div className="absolute top-10">
         <MeteorLogo className="h-20 w-20 opacity-80" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative z-20 text-center">
            <h1 className="text-3xl font-light tracking-[0.3em] text-white/70">EYES</h1>
            <h2 className="mt-1 text-md font-light tracking-[0.4em] text-white/50">ON</h2>
        </div>
         <h1 className="mt-4 text-4xl font-medium tracking-[1em] text-white">METEORS</h1>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center space-y-2 z-10">
        <span className="text-sm font-light tracking-widest text-white/50">Scroll to enter</span>
        <ChevronDown className="h-6 w-6 text-white/50 animate-chevron" />
      </div>
    </div>
  );
}
