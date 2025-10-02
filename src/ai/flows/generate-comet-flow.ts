
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { CometData } from '@/lib/solar-system-data';
import { CometDataSchema } from '@/lib/solar-system-data';

const generateCometPrompt = ai.definePrompt({
    name: 'generateCometPrompt',
    input: { schema: z.string() },
    output: { schema: CometDataSchema },
    prompt: `You are an expert astronomer. A user wants to create a new comet in a 3D solar system visualization.
    
    The user has provided the following name for the comet: {{{input}}}
    
    Generate the properties for this comet. Create a unique, compelling description and generate plausible but interesting orbital parameters. Ensure the orbit is highly elliptical and inclined to distinguish it from the planets.
    
    - The ID should be a new UUID.
    - The size should be a reasonable diameter for a comet nucleus (e.g., 1 to 20 km).
    - The perihelion (closest point to sun) should be within the inner solar system.
    - The aphelion (farthest point) should be far out in the outer solar system, creating a long, stretched orbit.
    - The inclination should be varied to make the orbit visually distinct.
    - The orbital period should be very long.`,
});

export const generateCometFlow = ai.defineFlow(
  {
    name: 'generateCometFlow',
    inputSchema: z.string(),
    outputSchema: CometDataSchema,
  },
  async (name) => {
    const { output } = await generateCometPrompt(name);
    if (!output) {
      throw new Error('Failed to generate comet data.');
    }
    // The prompt can't generate a UUID, so we do it here.
    output.id = `comet-${uuidv4()}`;
    output.name = name;
    return output;
  }
);


export async function generateComet(name: string): Promise<CometData> {
    return await generateCometFlow(name);
}
