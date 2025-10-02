
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const CometDataSchema = z.object({
  id: z.string().describe('Unique ID for the comet'),
  name: z.string().describe('Name of the comet'),
  description: z.string().describe('A brief, interesting description of the comet.'),
  size: z.number().describe('The diameter of the comet\'s nucleus in kilometers.'),
  type: z.literal('comet').describe("The object type, always 'comet'"),
  orbital: z.object({
    perihelion: z.number().describe('Closest distance to the sun in astronomical units (AU). Should be relatively close, e.g., 0.5 to 2 AU.'),
    aphelion: z.number().describe('Farthest distance from the sun in astronomical units (AU). Should be very far, e.g., 100 to 5000 AU, to create a highly elliptical orbit.'),
    inclination: z.number().describe('Orbital inclination in degrees from the solar system\'s main plane. Can be any value from 0 to 180.'),
    orbitalPeriod: z.number().describe('The time it takes to orbit the sun, in Earth years. Should be a long period, e.g., 75 to 2000 years.'),
  }),
});

export type CometData = z.infer<typeof CometDataSchema>;

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

    