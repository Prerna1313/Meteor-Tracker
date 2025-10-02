'use client';

import { useState, useEffect } from 'react';
import { SolarSystem } from '@/components/solar-system';
import { Header } from '@/components/header';
import {
  solarSystemData,
  type CelestialObject,
} from '@/lib/solar-system-data';
import { InfoPanel } from '@/components/info-panel';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (showLanding) {
        setIsExiting(true);
        setTimeout(() => {
          setShowLanding(false);
        }, 1000); // Duration of the fade-out animation
      }
    };

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [showLanding]);


  const selectedObjectData = (() => {
    if (!selectedObjectId) return null;

    if (selectedObjectId === 'asteroid_belt') {
        return null;
    }

    return solarSystemData.find((obj) => obj.id === selectedObjectId) ?? null;
  })();


  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {showLanding && <LandingPage isExiting={isExiting} />}

      <div className={`transition-opacity duration-1000 ${showLanding ? 'opacity-0' : 'opacity-100'}`}>
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
      </div>
    </main>
  );
}
