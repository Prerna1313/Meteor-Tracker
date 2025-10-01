'use client';

import { useState, useMemo, useEffect } from 'react';
import { SolarSystem } from '@/components/solar-system';
import { InfoPanel } from '@/components/info-panel';
import { Header } from '@/components/header';
import {
  initialSolarSystemData,
  type CelestialObject,
  type MeteorData,
} from '@/lib/solar-system-data';
import { Skeleton } from '@/components/ui/skeleton';

export type LabelData = {
  id: string;
  name: string;
  position: THREE.Vector3;
};


export default function Home() {
  const [solarSystemData, setSolarSystemData] = useState<CelestialObject[]>(
    initialSolarSystemData
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [labels, setLabels] = useState<LabelData[]>([]);

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
              onUpdateLabels={setLabels}
            />
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {labels.map(label => {
                const screenX = (label.position.x + 1) / 2 * window.innerWidth;
                const screenY = (-label.position.y + 1) / 2 * window.innerHeight;
                
                // Hide labels that are behind the camera
                if (label.position.z > 1) return null;

                return (
                  <div
                    key={label.id}
                    className={`absolute text-xs p-1 rounded-sm transition-colors duration-300 ${
                      selectedObjectId === label.id
                        ? 'text-primary bg-background/50'
                        : 'text-white/80'
                    }`}
                    style={{
                      transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
                      left: 0,
                      top: 0,
                    }}
                    onClick={() => handleSelectObject(label.id)}
                  >
                    {label.name}
                  </div>
                );
              })}
            </div>
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
