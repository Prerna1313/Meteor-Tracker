'use client';
import React from 'react';

const MeteorLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4" />
    <path
      d="M30 70 L40 50 L50 70 L60 50 L70 70"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type HeaderProps = {
  onNavigateHome?: () => void;
};

export function Header({ onNavigateHome }: HeaderProps) {
  const navButtons = [
    { name: "Home", onClick: () => onNavigateHome ? onNavigateHome() : alert("Home clicked") },
    { name: "Globe", onClick: () => window.open("/map5.html", "_blank") },
    { name: "Mitigation", onClick: () => window.open("/mitigation.html", "_blank") },
    { name: "Hazard zone", onClick: () => alert("Hazard zone clicked") },
    { name: "Past events", onClick: () => window.open("/file.html", "_blank")}
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-transparent">
      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <MeteorLogo className="w-8 h-8" />
        <h1 className="text-base font-bold text-white/40 tracking-wider">
          EYES ON METEORS
        </h1>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex items-center gap-2">
        {navButtons.map((button) => (
          <button
            key={button.name}
            onClick={button.onClick}
            className="group relative px-4 py-2 bg-gradient-to-r from-slate-800/30 to-slate-700/30 border border-slate-600/40 rounded-lg backdrop-blur-sm transition-all duration-300 hover:from-purple-400/15 hover:to-purple-300/15 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/15 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-slate-200 group-hover:text-purple-200 font-medium tracking-wide text-xs uppercase">
              {button.name}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/8 to-purple-300/8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ))}
      </nav>
    </header>
  );
}