'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateAsteroidData, type AsteroidData } from '@/ai/flows/generate-asteroid-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  asteroidCount: z.coerce.number().min(1, "Must be at least 1").max(20, "Cannot generate more than 20 at a time."),
});

type AsteroidGeneratorProps = {
  onUpdateAsteroids: (newAsteroids: AsteroidData[]) => void;
};

export function AsteroidGenerator({ onUpdateAsteroids }: AsteroidGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asteroidCount: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generateAsteroidData({
        count: values.asteroidCount,
      });

      if (result && result.asteroids) {
        onUpdateAsteroids(result.asteroids);
        toast({
          title: "Asteroids Generated",
          description: `Successfully generated ${result.asteroids.length} new asteroids.`,
        });
      }
    } catch (error) {
      console.error("Failed to generate asteroid data:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate asteroid data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 border-t">
      <h4 className="font-semibold mb-4 text-sm text-foreground">Generate Near-Earth Asteroids</h4>
      <p className='text-xs text-muted-foreground mb-4'>This tool uses AI to simulate data from NASA's NeoWs API to generate plausible near-earth object data.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="asteroidCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Asteroids</FormLabel>
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
