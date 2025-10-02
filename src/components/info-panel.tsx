'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { CelestialObject } from '@/lib/solar-system-data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type InfoPanelProps = {
  object: CelestialObject;
  onClose: () => void;
};

const StatItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col py-2">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-lg font-medium">{value}</span>
    </div>
);

const AsteroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M12 2L14.09 8.26L20 9.27L15.55 13.91L16.64 20.02L12 17.27L7.36 20.02L8.45 13.91L4 9.27L9.91 8.26L12 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.22021 16.22L3.18021 15.18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.7803 16.22L20.8203 15.18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18 4L19 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6 4L5 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


export function InfoPanel({ object, onClose }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState('stats');
  
  return (
    <div className="info-panel absolute top-1/2 left-12 -translate-y-1/2 h-auto w-full max-w-sm bg-black/80 text-white shadow-2xl rounded-xl flex flex-col p-6">
        <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
                <ChevronLeft className="w-6 h-6" />
                <span className="sr-only">Go back</span>
            </Button>
            <div className="flex items-center gap-3">
                 {object.type === 'planet' && <AsteroidIcon className="w-8 h-8 opacity-70" />}
                 <h2 className="text-2xl font-bold">{object.name}</h2>
            </div>
        </div>

        <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-4">
                <TabsTrigger value="stats" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none text-white/60 data-[state=active]:text-white">
                    Essential Stats
                </TabsTrigger>
                <TabsTrigger value="path" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none text-white/60 data-[state=active]:text-white">
                    Orbital Path
                </TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
                 <div className="space-y-2">
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                        {object.description}
                    </p>
                    {object.type && <StatItem label="Type" value={object.type.charAt(0).toUpperCase() + object.type.slice(1)} />}
                    {object.diameter && <StatItem label="Diameter" value={`${object.diameter.toLocaleString()} km`} />}
                    {object.mass && <StatItem label="Mass" value={<span>{object.mass} x 10<sup>24</sup> kg</span>} />}
                    {object.dayLength && <StatItem label="Day Length" value={`${object.dayLength} hours`} />}
                </div>
            </TabsContent>
            <TabsContent value="path">
                <div className="space-y-2">
                    {object.orbitalSpeed && object.type !== 'star' && (
                        <StatItem 
                            label="Orbital Period" 
                            value={
                                <>
                                    <span>Time to complete one solar orbit</span>
                                    <br />
                                    <span className="text-2xl font-bold">{(1 / object.orbitalSpeed * 10).toFixed(2)} years</span>
                                </>
                            } 
                        />
                    )}
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
