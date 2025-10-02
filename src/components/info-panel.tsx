'use client';

import { ChevronLeft, Info, Globe, Gem } from 'lucide-react';
import type { CelestialObject } from '@/lib/solar-system-data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const CometIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M17.5 17.5L20 15L22.5 17.5L25 15L27.5 17.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 25C15 25 18.5 28.5 24 28.5C29.5 28.5 33 25 33 25"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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


const PlanetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export function InfoPanel({ object, onClose }: InfoPanelProps) {
  return (
    <div className="relative h-auto max-h-[calc(100vh-8rem)] w-[350px] bg-zinc-900/80 text-white rounded-lg shadow-2xl flex flex-col p-6 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 h-10 w-10 text-white/60 hover:text-white bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Close</span>
        </Button>

        <div className="flex-1 mt-4 overflow-hidden">
             <ScrollArea className="h-full pr-4">
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4">
                        {object.type === 'comet' && <CometIcon className="w-10 h-10 opacity-80" />}
                        {object.type === 'planet' && <PlanetIcon className="w-8 h-8 opacity-80" />}
                        {object.type !== 'comet' && object.type !== 'planet' && <AsteroidIcon className="w-8 h-8 opacity-80" />}
                        
                        <div>
                            {object.type !== 'comet' && object.id.match(/\d+/) && <p className="text-2xl font-semibold text-white/80">{object.id.match(/\d+/)?.[0]}</p>}
                            <h2 className="text-3xl font-bold">{object.name}</h2>
                        </div>
                    </div>

                    <Tabs defaultValue="stats" className="w-full mt-6">
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
                                        <span className="text-3xl font-bold mt-1">{object.orbitalSpeed.toFixed(2)} years</span>
                                    </div>

                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    </div>
  );
}
