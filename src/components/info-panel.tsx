'use client';

import { X } from 'lucide-react';
import type { CelestialObject } from '@/lib/solar-system-data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type InfoPanelProps = {
  object: CelestialObject;
  onClose: () => void;
};

const StatItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/10">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm font-medium text-right">{value}</span>
    </div>
);


export function InfoPanel({ object, onClose }: InfoPanelProps) {
  return (
    <div className="info-panel absolute top-0 right-0 h-full w-full max-w-sm bg-black/50 text-white shadow-2xl flex flex-col">
       <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-primary">{object.name}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
            </Button>
        </div>
        <ScrollArea className="flex-grow">
            <div className="p-4 space-y-4">
                <p className="text-sm text-white/80 leading-relaxed">
                    {object.description}
                </p>
                
                <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-semibold text-primary/80">Properties</h3>
                    <StatItem label="Type" value={object.type.charAt(0).toUpperCase() + object.type.slice(1)} />
                    {object.diameter && <StatItem label="Diameter" value={`${object.diameter.toLocaleString()} km`} />}
                    {object.mass && <StatItem label="Mass" value={<span>{object.mass} x 10<sup>24</sup> kg</span>} />}
                    {object.dayLength && <StatItem label="Day Length" value={`${object.dayLength} hours`} />}
                    <StatItem label="Distance from Sun" value={`${object.distance.toLocaleString()} units`} />
                    <StatItem label="Orbital Speed" value={`${object.orbitalSpeed}x`} />
                </div>
            </div>
        </ScrollArea>
    </div>
  );
}
