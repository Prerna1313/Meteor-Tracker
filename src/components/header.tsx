'use client';

const MeteorLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M11.5 21.5a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" fill="#fff"/>
        <path stroke="#000" strokeWidth="1.5" d="M15.52 12.53a4.5 4.5 0 0 1-6.04-6.06 4.5 4.5 0 0 1 6.04 6.06Z" />
        <path stroke="#000" strokeWidth="1.5" d="M12.5 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path d="m2 2 20 6-3 1-4-4-3 4-4-2z" fill="#fff" />
    </svg>
);


export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 md:px-6 bg-transparent">
      <div className="flex items-center gap-3">
        <MeteorLogo className="w-8 h-8" />
        <h1 className="text-base font-bold text-muted-foreground tracking-wider">
          EYES ON METEORS
        </h1>
      </div>
    </header>
  );
}
