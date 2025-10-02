'use client';

import { useState, useMemo } from 'react';
import { SolarSystem } from '@/components/solar-system';
import { Header } from '@/components/header';
import {
  solarSystemData,
  type CelestialObject,
} from '@/lib/solar-system-data';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  const handleSelectObject = (id: string | null) => {
    setSelectedObjectId(id);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <Header />
      <div className="w-full h-full">
        <SolarSystem
          data={solarSystemData}
          onSelectObject={handleSelectObject}
          selectedObjectId={selectedObjectId}
        />
      </div>
    </main>
  );
}
