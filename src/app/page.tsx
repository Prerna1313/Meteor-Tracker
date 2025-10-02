'use client';

import { useState } from 'react';
import { SolarSystem } from '@/components/solar-system';
import { Header } from '@/components/header';
import {
  solarSystemData,
  type CelestialObject,
} from '@/lib/solar-system-data';
import { InfoPanel } from '@/components/info-panel';

export default function Home() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);


  const selectedObjectData = (() => {
    if (!selectedObjectId) return null;

    if (selectedObjectId === 'asteroid_belt') {
        return null;
    }

    return solarSystemData.find((obj) => obj.id === selectedObjectId) ?? null;
  })();


  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <Header />
      <div className="w-full h-full">
        <SolarSystem
          data={solarSystemData}
          onSelectObject={setSelectedObjectId}
          selectedObjectId={selectedObjectId}
          onHoverObject={setHoveredObjectId}
          hoveredObjectId={hoveredObjectId}
        />
      </div>
      {selectedObjectData && (
        <InfoPanel
          object={selectedObjectData as CelestialObject}
          onClose={() => setSelectedObjectId(null)}
        />
      )}
    </main>
  );
}
