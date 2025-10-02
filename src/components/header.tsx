import { Rocket } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 md:px-6 bg-transparent">
      <div className="flex items-center gap-2">
        <Rocket className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">
          Eyes on the Solar System
        </h1>
      </div>
    </header>
  );
}
