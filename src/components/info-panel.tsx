'use client';

import { ChevronLeft, Info } from 'lucide-react';
import type { CelestialObject } from '@/lib/solar-system-data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type InfoPanelProps = {
  object: CelestialObject;
  onClose: () => void;
};

const StatItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col py-3">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-lg font-medium">{value}</span>
    </div>
);

const AsteroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.9999 25.6667C13.9999 25.6667 23.3333 19.8334 23.3333 13.4167V6.41669L13.9999 2.33335L4.66659 6.41669V13.4167C4.66659 19.8334 13.9999 25.6667Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export function InfoPanel({ object, onClose }: InfoPanelProps) {
  return (
    <div className="relative h-auto max-h-[calc(100vh-8rem)] w-[350px] bg-zinc-900/80 text-white rounded-lg shadow-2xl flex flex-col p-6 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 left-4 h-10 w-10 text-white/60 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Close</span>
        </Button>

        <div className="flex-1 mt-10 overflow-hidden">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AsteroidIcon className="w-7 h-7 opacity-80" />
                        <div>
                            {object.id.match(/\d+/) && <p className="text-2xl font-semibold text-white/80">{object.id.match(/\d+/)?.[0]}</p>}
                            <h2 className="text-3xl font-bold">{object.name}</h2>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white/80 hover:text-white">
                        <Info className="w-5 h-5" />
                    </Button>
                </div>

                <Tabs defaultValue="orbital-path" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-4">
                        <TabsTrigger value="stats" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none text-white/60 data-[state=active]:text-white">
                            Essential Stats
                        </TabsTrigger>
                        <TabsTrigger value="orbital-path" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none text-white/60 data-[state=active]:text-white">
                            Orbital Path
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="stats">
                        <div className="space-y-2 mt-4">
                            <p className="text-sm text-white/80 leading-relaxed mb-4">
                                {object.description}
                            </p>
                            {object.type && <StatItem label="Type" value={object.type.charAt(0).toUpperCase() + object.type.slice(1)} />}
                            {object.diameter && <StatItem label="Diameter" value={`${object.diameter.toLocaleString()} km`} />}
                            {object.mass && <StatItem label="Mass" value={<span>{object.mass} x 10<sup>24</sup> kg</span>} />}
                            {object.dayLength && <StatItem label="Day Length" value={`${object.dayLength} hours`} />}
                        </div>
                    </TabsContent>
                    <TabsContent value="orbital-path">
                        <div className="space-y-4 mt-6">
                            {object.orbitalSpeed && object.type !== 'star' && (
                                <div className="flex flex-col">
                                    <span className="text-white/60 text-sm">Orbital Period</span>
                                    <span className="text-base">Time to complete one solar orbit</span>
                                    <span className="text-3xl font-bold mt-1">{(1 / object.orbitalSpeed * 10).toFixed(2)} years</span>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
