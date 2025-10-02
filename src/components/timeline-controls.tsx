
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Minus, Plus } from 'lucide-react';

export function TimelineControls() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center p-4">
      <div className="flex items-center gap-6 bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-border text-foreground">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
          </div>
          <span className="text-sm font-bold text-green-400">LIVE</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm tracking-wider">
          <span className="uppercase">{format(currentTime, 'MMM dd, yyyy')}</span>
          <span>{format(currentTime, 'hh:mm:ss a')}</span>
        </div>

        <div className="flex items-center gap-2">
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '50%' }}></div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-md bg-muted">
                <button className="p-1 hover:bg-accent rounded"><Minus size={16} /></button>
                <Clock size={16} className="text-primary"/>
                <button className="p-1 hover:bg-accent rounded"><Plus size={16} /></button>
            </div>
        </div>
      </div>
    </div>
  );
}
