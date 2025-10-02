import { Rocket } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 md:px-6 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-2">
        <Rocket className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold font-headline text-foreground">
          Meteor Gazer
        </h1>
      </div>
    </header>
  );
}
