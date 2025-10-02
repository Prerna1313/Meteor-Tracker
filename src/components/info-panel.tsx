'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ArrowLeft, ArrowRight } from 'lucide-react';
import type { CelestialObject } from '@/lib/solar-system-data';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

type InfoPanelProps = {
  object: CelestialObject;
  onClose: () => void;
  solarSystemData: CelestialObject[];
};

const StatItem = ({ label, value, description }: { label: string; value: React.ReactNode, description?: string }) => (
    <div className="flex flex-col py-3">
        <span className="text-white/60 text-sm">{label}</span>
        {description && <span className="text-sm text-white/40">{description}</span>}
        <span className="text-3xl font-medium mt-1">{value}</span>
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
        d="M13.9999 25.6667C13.9999 25.6667 23.3333 19.8334 23.3333 13.4167V6.41669L13.9999 2.33335L4.66659 6.41669V13.4167C4.66659 19.8334 13.9999 25.6667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
       <path
        d="M24.3333 2.33335L19.6666 14.8334L11.8333 13.5L16.5 21.8334L6.83325 25.6667L18.4999 25.6667L21.1666 34.3334L25.3333 25.6667L34.8333 31.8334L29.4999 23.5L38.3333 20.3334L29.4999 18.5L34.8333 8.33335L26.1666 14.8334L24.3333 2.33335Z"
        stroke="white"
        strokeOpacity="0.8"
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

export function InfoPanel({ object, onClose, solarSystemData }: InfoPanelProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const essentialStats = [
        { label: "Size", description: "Diameter", value: `${object.diameter?.toLocaleString() ?? 'N/A'} km`, condition: object.diameter },
        { label: "Rotation Period", description: "Length of one day", value: `${object.dayLength?.toLocaleString() ?? 'N/A'} hours`, condition: object.dayLength },
        { label: "Distance from Earth", description: "Current", value: '2.5 AU', condition: true }, // Placeholder
        { label: "Discovered", description: "Year", value: object.discoveryYear, condition: object.discoveryYear && (object.type === 'comet' || object.type !== 'planet' )},
    ].filter(stat => stat.condition);
    
    const orbitalPathStats = [
        { label: "Orbital Period", description: "Time to complete one solar orbit", value: `${object.orbitalSpeed.toFixed(2)} years`, condition: object.orbitalSpeed },
        { label: "Eccentricity", description: "Orbit shape", value: object.eccentricity?.toFixed(3) ?? 'N/A', condition: object.eccentricity !== undefined },
        { label: "Perihelion", description: "Closest to Sun", value: `${object.perihelion?.toFixed(2) ?? 'N/A'} AU`, condition: object.perihelion !== undefined },
        { label: "Aphelion", description: "Farthest from Sun", value: `${object.aphelion?.toFixed(2) ?? 'N/A'} AU`, condition: object.aphelion !== undefined },
        { label: "Inclination", description: "Orbit tilt", value: `${object.orbitalInclination?.toFixed(2) ?? 'N/A'}°`, condition: object.orbitalInclination !== undefined },
    ].filter(stat => stat.condition);

    const allStats = [...essentialStats, ...orbitalPathStats];
    const essentialCount = essentialStats.length;
    const activeTab = current < essentialCount ? 'essential' : 'orbital';

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);
    
    const scrollPrev = useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const handleTabClick = (tab: 'essential' | 'orbital') => {
        if (tab === 'essential') {
            api?.scrollTo(0);
        } else {
            api?.scrollTo(essentialCount);
        }
    }

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
                        
                        <div className="flex flex-col">
                            {object.type !== 'comet' && object.id.match(/\d+/) && <p className="text-lg text-white/80">{object.id.match(/\d+/)?.[0]}</p>}
                            <h2 className="text-2xl">{object.name}</h2>
                        </div>
                    </div>

                    <p className="text-sm text-white/80 leading-relaxed my-4">
                        {object.description}
                    </p>

                    <div className="flex gap-6 border-b border-white/10 mb-2">
                        <button
                            onClick={() => handleTabClick('essential')}
                            className={cn(
                                "py-2 text-sm",
                                activeTab === 'essential' ? 'text-white border-b-2 border-white' : 'text-white/60'
                            )}
                        >
                            Essential stats
                        </button>
                        <button
                            onClick={() => handleTabClick('orbital')}
                            className={cn(
                                "py-2 text-sm",
                                activeTab === 'orbital' ? 'text-white border-b-2 border-white' : 'text-white/60'
                            )}
                        >
                            Orbital path
                        </button>
                    </div>

                    <Carousel setApi={setApi} className="w-full mt-2">
                         <CarouselContent>
                            {allStats.map((stat, index) => (
                                <CarouselItem key={index}>
                                    <StatItem label={stat.label} value={stat.value} description={stat.description} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </ScrollArea>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
            <Button variant="ghost" size="icon" onClick={scrollPrev} className="h-8 w-8 rounded-full text-white/60 hover:text-white" disabled={current === 0}>
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Previous</span>
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: count }).map((_, i) => (
                    <button key={i} onClick={() => api?.scrollTo(i)} className={cn("h-2 w-2 rounded-full", current === i ? 'bg-white' : 'bg-white/30')}></button>
                ))}
            </div>
            <Button variant="ghost" size="icon" onClick={scrollNext} className="h-8 w-8 rounded-full text-white/60 hover:text-white" disabled={current === count - 1}>
                <ArrowRight className="w-4 h-4" />
                <span className="sr-only">Next</span>
            </Button>
        </div>
    </div>
  );
}
