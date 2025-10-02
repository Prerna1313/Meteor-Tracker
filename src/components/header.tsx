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
        <path d="M15.5 21.5a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" fill="white" />
        <path d="m9.06 9.9 2.12-2.12 6.37-6.36" stroke="black" strokeWidth="1.5"/>
        <path d="M11.18 12.02 9.06 9.9" stroke="black" strokeWidth="1.5"/>
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
