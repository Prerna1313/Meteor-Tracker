
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCometData } from '@/ai/flows/generate-comet-data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';
import type { CometData } from '@/lib/solar-system-data';

const formSchema = z.object({
  cometCount: z.coerce.number().min(1, "Must be at least 1").max(10, "Cannot generate more than 10 at a time."),
});

type CometGeneratorProps = {
  onUpdateComets: (newComets: CometData[]) => void;
};

export function CometGenerator({ onUpdateComets }: CometGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cometCount: 3,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generateCometData({
        count: values.cometCount,
      });

      if (result && result.comets) {
        const newCometsWithIds: CometData[] = result.comets.map((c, i) => ({
          ...c,
          id: `${c.name.toLowerCase().replace(/ /g, '-')}-comet-${Date.now()}-${i}`,
        }));
        onUpdateComets(newCometsWithIds);
        toast({
          title: "Comets Generated",
          description: `Successfully generated ${result.comets.length} new comets.`,
        });
      }
    } catch (error) {
      console.error("Failed to generate comet data:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate comet data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 border-t">
      <h4 className="font-semibold mb-4 text-sm text-foreground">Generate Comets</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cometCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Comets</FormLabel>
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
