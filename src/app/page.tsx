'use client';

import { useState, useMemo } from 'react';
import { SolarSystem } from '@/components/solar-system';
import { Header } from '@/components/header';
import {
  solarSystemData,
  type CelestialObject,
  type CometData,
} from '@/lib/solar-system-data';
import { InfoPanel } from '@/components/info-panel';

export default function Home() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [comets, setComets] = useState<CometData[]>([]);

  const handleSelectObject = (id: string | null) => {
    setSelectedObjectId(id);
  };

  const selectedObjectData = useMemo(() => {
    if (!selectedObjectId) return null;
    
    if (selectedObjectId === 'asteroid_belt') {
        return {
            id: 'asteroid_belt',
            name: 'Asteroid Belt',
            type: 'region',
            description: 'The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Jupiter and Mars. It contains a great many solid, irregularly shaped bodies, of many sizes but much smaller than planets, called asteroids or minor planets.'
        };
    }

    const allObjects: (CelestialObject | CometData)[] = [...solarSystemData, ...comets];
    return allObjects.find((obj) => obj.id === selectedObjectId) ?? null;
  }, [selectedObjectId, comets]);


  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <Header />
      <div className="w-full h-full">
        <SolarSystem
          data={solarSystemData}
          onSelectObject={handleSelectObject}
          selectedObjectId={selectedObjectId}
          comets={comets}
          onCometsChange={setComets}
        />
      </div>
      {selectedObjectData && (
        <InfoPanel
          object={selectedObjectData as CelestialObject}
          onClose={() => handleSelectObject(null)}
        />
      )}
    </main>
  );
}
