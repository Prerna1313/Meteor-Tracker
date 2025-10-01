'use client';

import { useState, useMemo, useEffect } from 'react';
import { SolarSystem, type LabelData } from '@/components/solar-system';
import { InfoPanel } from '@/components/info-panel';
import { Header } from '@/components/header';
import {
  initialSolarSystemData,
  type CelestialObject,
  type MeteorData,
} from '@/lib/solar-system-data';
import { Skeleton } from '@/components/ui/skeleton';


export default function Home() {
  const [solarSystemData, setSolarSystemData] = useState<CelestialObject[]>(
    initialSolarSystemData
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelectObject = (id: string | null) => {
    setSelectedObjectId(id);
    setIsPanelOpen(!!id);
  };

  const handleUpdateMeteors = (planetId: string, newMeteors: MeteorData[]) => {
    setSolarSystemData(prevData =>
      prevData.map(obj => {
        if (obj.id === planetId) {
          const existingMeteorIds = new Set(obj.meteors.map(m => m.id));
          const uniqueNewMeteors = newMeteors.filter(m => !existingMeteorIds.has(m.id));
          return { ...obj, meteors: [...obj.meteors, ...uniqueNewMeteors] };
        }
        return obj;
      })
    );
  };

  const selectedObject = useMemo(() => {
    return solarSystemData.find(obj => obj.id === selectedObjectId) || null;
  }, [selectedObjectId, solarSystemData]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <Header />
      {isMounted ? (
        <>
          <div className="w-full h-full">
            <SolarSystem
              data={solarSystemData}
              onSelectObject={handleSelectObject}
              selectedObjectId={selectedObjectId}
            />
          </div>
          <InfoPanel
            isOpen={isPanelOpen}
            onOpenChange={setIsPanelOpen}
            selectedObject={selectedObject}
            onUpdateMeteors={handleUpdateMeteors}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
    </main>
  );
}
