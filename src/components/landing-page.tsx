'use client';

import { ChevronDown } from 'lucide-react';

const MeteorLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_303_2)">
            <path d="M50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0ZM50 90C27.9086 90 10 72.0914 10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90Z" fill="white"/>
            <path d="M69.9727 34.0254L34.0254 69.9727C35.918 71.8652 38.1348 73.4473 40.5859 74.6465L75.5332 38.6992C73.4473 36.6133 71.6797 35.0312 69.9727 34.0254Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_303_2">
                <rect width="100" height="100" fill="white"/>
            </clipPath>
        </defs>
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

      <div className="relative text-center">
        <div className="relative z-20 pt-4">
            <h1 className="text-3xl font-light tracking-[0.3em] text-white/70">EYES</h1>
            <h2 className="mt-1 text-md font-light tracking-[0.4em] text-white/50">ON</h2>
        </div>
         <h1 className="mt-4 text-5xl font-medium tracking-[0.8em] text-white">METEORS</h1>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center space-y-2 z-10">
        <span className="text-sm font-light tracking-widest text-white/50">Scroll to enter</span>
        <ChevronDown className="h-6 w-6 text-white/50 animate-chevron" />
      </div>
    </div>
  );
}
