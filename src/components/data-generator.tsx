'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateMeteorData } from '@/ai/flows/generate-meteor-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';
import type { CelestialObject, MeteorData } from '@/lib/solar-system-data';

const formSchema = z.object({
  meteorCount: z.coerce.number().min(1, "Must be at least 1").max(50, "Cannot generate more than 50 at a time."),
});

type DataGeneratorProps = {
  planet: CelestialObject;
  onUpdateMeteors: (planetId: string, newMeteors: MeteorData[]) => void;
};

export function DataGenerator({ planet, onUpdateMeteors }: DataGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meteorCount: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generateMeteorData({
        planet: planet.name,
        meteorCount: values.meteorCount,
        orbitalRadius: planet.distance * 10000, // A plausible radius
      });

      if (result && result.meteors) {
        const newMeteorsWithIds: MeteorData[] = result.meteors.map((m, i) => ({
          ...m,
          id: `${planet.id}-meteor-${Date.now()}-${i}`,
        }));
        onUpdateMeteors(planet.id, newMeteorsWithIds);
        toast({
          title: "Meteors Generated",
          description: `Successfully generated ${result.meteors.length} new meteors for ${planet.name}.`,
        });
      }
    } catch (error) {
      console.error("Failed to generate meteor data:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate meteor data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 border-t">
      <h4 className="font-semibold mb-4 text-sm text-foreground">Generate Meteors</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="meteorCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Meteors</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </form>
      </Form>
    </div>
  );
}
