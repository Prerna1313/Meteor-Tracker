'use client';

import { ChevronDown } from 'lucide-react';

const NasaLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 240 240"
        fill="white"
        {...props}
    >
        <path d="M120.33,2.05c-65.34,0-118.28,52.94-118.28,118.28s52.94,118.28,118.28,118.28,118.28-52.94,118.28-118.28S185.67,2.05,120.33,2.05Zm40.13,117.8a40.13,40.13,0,0,1-40.13,40.13h0a40.13,40.13,0,0,1,0-80.26h0A40.13,40.13,0,0,1,160.46,119.85Z"/>
        <path d="M190,147.24a87,87,0,0,1-79.67-2.62c-14.86,22-38.3,42.27-55.51,52.69a117.52,117.52,0,0,0,59.83,19.26c62.3,0,113.3-48.45,117.86-110.19C221.36,120.25,208.57,133,190,147.24Z"/>
        <path d="M49.25,123.63a131.62,131.62,0,0,1,13.59-45.74L101,103.45s-3.52-2-6.19-3.41c-13.43-7-19.14-16.79-19.14-16.79s2.5,2.15,5,4.1c16.3,12.78,35.25,21.14,35.25,21.14S82.4,85.25,60.29,66.38c-1.81-1.55-3.3-2.69-3.3-2.69s3.21,5.2,14.07,17.21c10.42,11.51,26.13,26.43,39.11,36.57,0,0-23.4-15.52-47.54-32.61C49.25,76.57,49.25,123.63,49.25,123.63Z"/>
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
         <NasaLogo className="h-20 w-20 opacity-80" />
      </div>

      <div className="relative text-center">
        <div className="relative z-20 pt-4">
            <h1 className="text-3xl font-light tracking-[0.3em] text-white/70">EYES</h1>
            <h2 className="mt-1 text-md font-light tracking-[0.4em] text-white/50">ON</h2>
        </div>
         <h1 className="mt-4 text-5xl font-medium tracking-[0.4em] text-white">METEORS</h1>
      </div>
      
      <div 
        className="absolute bottom-[-250px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,_rgba(100,100,100,0.2)_0%,_transparent_70%)]"
      />

      <div className="absolute bottom-10 flex flex-col items-center space-y-2 z-10">
        <span className="text-sm font-light tracking-widest text-white/50">Scroll to enter</span>
        <ChevronDown className="h-6 w-6 text-white/50 animate-chevron" />
      </div>
    </div>
  );
}
