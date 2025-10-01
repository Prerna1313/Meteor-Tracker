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
import type { CelestialObject, MeteorData } from '@/lib/solar-system-data';

type InfoPanelProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedObject: CelestialObject | null;
  onUpdateMeteors: (planetId: string, newMeteors: MeteorData[]) => void;
};

export function InfoPanel({ isOpen, onOpenChange, selectedObject, onUpdateMeteors }: InfoPanelProps) {
  if (!selectedObject) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col border-l-2 border-accent/50">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl font-bold font-headline text-primary">{selectedObject.name}</SheetTitle>
          <SheetDescription>
            <Badge variant="outline" className="capitalize border-accent/50 text-accent">{selectedObject.type}</Badge>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 pt-4 space-y-4">
            <h3 className="font-semibold text-lg text-foreground">Properties</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>Radius:</strong> {selectedObject.size} units</li>
              <li><strong>Distance from Sun:</strong> {selectedObject.distance} units</li>
              <li><strong>Orbital Speed:</strong> {selectedObject.orbitalSpeed}x</li>
              <li><strong>Rotation Speed:</strong> {selectedObject.rotationSpeed}x</li>
            </ul>
          </div>
          
          {selectedObject.type === 'planet' && (
             <div className="px-6 py-4 space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Known Meteors ({selectedObject.meteors.length})</h3>
                {selectedObject.meteors.length > 0 ? (
                  <ScrollArea className="h-60">
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
        </ScrollArea>

        {selectedObject.type === 'planet' && (
          <DataGenerator planet={selectedObject} onUpdateMeteors={onUpdateMeteors} />
        )}
      </SheetContent>
    </Sheet>
  );
}
