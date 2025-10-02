'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DataGenerator } from './data-generator';
import type { CelestialObject, CometData, MeteorData, AsteroidData } from '@/lib/solar-system-data';
import { CometGenerator } from './comet-generator';
import { AsteroidGenerator } from './asteroid-generator';

type InfoPanelProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedObject: CelestialObject | null;
  onUpdateMeteors: (planetId: string, newMeteors: MeteorData[]) => void;
  onUpdateComets: (newComets: CometData[]) => void;
  onUpdateAsteroids: (newAsteroids: AsteroidData[]) => void;
};

export function InfoPanel({ isOpen, onOpenChange, selectedObject, onUpdateMeteors, onUpdateComets, onUpdateAsteroids }: InfoPanelProps) {
  if (!selectedObject) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col bg-background/80 backdrop-blur-sm border-l-2 border-primary/50">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl font-bold font-headline text-primary">{selectedObject.name}</SheetTitle>
          <SheetDescription>
            <Badge variant="outline" className="capitalize border-primary/50 text-primary">{selectedObject.type}</Badge>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 pt-4 space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Properties</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {selectedObject.type !== 'asteroid-belt' && (
                    <>
                        <li><strong>Radius:</strong> {selectedObject.size} units</li>
                        <li><strong>Distance from Sun:</strong> {selectedObject.distance} units</li>
                        <li><strong>Orbital Speed:</strong> {selectedObject.orbitalSpeed}x</li>
                        <li><strong>Rotation Speed:</strong> {selectedObject.rotationSpeed}x</li>
                    </>
                )}
                {selectedObject.type === 'asteroid-belt' && (
                    <li className='text-xs'>The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Jupiter and Mars. It contains a great many solid, irregularly shaped bodies, of many sizes, but much smaller than planets, called asteroids or minor planets.</li>
                )}
            </ul>
          </div>
          
          {selectedObject.type === 'planet' && (
             <div className="px-6 py-4 space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Known Meteors ({selectedObject.meteors.length})</h3>
                {selectedObject.meteors.length > 0 ? (
                  <ScrollArea className="h-40">
                    <ul className="space-y-3 text-sm text-muted-foreground pr-4">
                      {selectedObject.meteors.map(meteor => (
                        <li key={meteor.id} className="p-3 bg-muted/50 rounded-md">
                          <p><strong>Composition:</strong> {meteor.composition}</p>
                          <p><strong>Size:</strong> {meteor.size}m</p>
                          <p className="truncate"><strong>Trajectory:</strong> {meteor.trajectory}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No meteor data available. Use the tool below to generate some.</p>
                )}
             </div>
          )}

          {selectedObject.type === 'star' && (
            <div className="px-6 py-4 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Known Comets ({selectedObject.comets?.length || 0})</h3>
              {(selectedObject.comets?.length ?? 0) > 0 ? (
                  <ScrollArea className="h-40">
                    <ul className="space-y-3 text-sm text-muted-foreground pr-4">
                      {selectedObject.comets!.map(comet => (
                        <li key={comet.id} className="p-3 bg-muted/50 rounded-md">
                          <p><strong>Name:</strong> {comet.name}</p>
                          <p><strong>Size:</strong> {comet.size}km</p>
                          <p><strong>Period:</strong> {comet.orbitalPeriod} years</p>
                          <p className="truncate"><strong>Trajectory:</strong> {comet.trajectory}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">No comet data available. Use the tool below to generate some.</p>
              )}
            </div>
          )}

          {selectedObject.type === 'asteroid-belt' && (
             <div className="px-6 py-4 space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Generated Asteroids ({selectedObject.asteroids?.length || 0})</h3>
                {(selectedObject.asteroids?.length ?? 0) > 0 ? (
                  <ScrollArea className="h-40">
                    <ul className="space-y-3 text-sm text-muted-foreground pr-4">
                      {selectedObject.asteroids!.map(asteroid => (
                        <li key={asteroid.id} className="p-3 bg-muted/50 rounded-md">
                          <p><strong>Name:</strong> {asteroid.name}</p>
                           <p><strong>Diameter:</strong> {asteroid.estimated_diameter_km_min.toFixed(2)} - {asteroid.estimated_diameter_km_max.toFixed(2)} km</p>
                          <p><strong>Hazardous:</strong> {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No asteroid data available. Use the tool below to generate some.</p>
                )}
             </div>
          )}
        </ScrollArea>

        {selectedObject.type === 'planet' && (
          <DataGenerator planet={selectedObject} onUpdateMeteors={onUpdateMeteors} />
        )}
        {selectedObject.type === 'star' && (
          <CometGenerator onUpdateComets={onUpdateComets} />
        )}
        {selectedObject.type === 'asteroid-belt' && (
          <AsteroidGenerator onUpdateAsteroids={onUpdateAsteroids} />
        )}
      </SheetContent>
    </Sheet>
  );
}
