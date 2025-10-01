'use server';

/**
 * @fileOverview Generates realistic near-earth asteroid data, simulating the NASA NeoWs API.
 *
 * - generateAsteroidData - A function that generates asteroid data.
 * - GenerateAsteroidDataInput - The input type for the generateAsteroidData function.
 * - GenerateAsteroidDataOutput - The return type for the generateAsteroidData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAsteroidDataInputSchema = z.object({
  count: z.number().describe('The number of near-earth asteroids to generate.'),
});
export type GenerateAsteroidDataInput = z.infer<typeof GenerateAsteroidDataInputSchema>;

const AsteroidObjectSchema = z.object({
    id: z.string().describe('A unique identifier for the asteroid.'),
    name: z.string().describe('The name of the asteroid (e.g., "(2024 ABC)")'),
    estimated_diameter_km_min: z.number().describe('The minimum estimated diameter of the asteroid in kilometers.'),
    estimated_diameter_km_max: z.number().describe('The maximum estimated diameter of the asteroid in kilometers.'),
    is_potentially_hazardous_asteroid: z.boolean().describe('Whether the asteroid is classified as potentially hazardous.'),
    orbital_period_days: z.number().describe('The orbital period of the asteroid around the Sun in days.'),
    relative_velocity_kps: z.number().describe('The relative velocity of the asteroid at close approach in kilometers per second.'),
    miss_distance_au: z.number().describe('The miss distance from Earth in astronomical units.'),
});

export type AsteroidData = z.infer<typeof AsteroidObjectSchema>;

const GenerateAsteroidDataOutputSchema = z.object({
  asteroids: z.array(AsteroidObjectSchema).describe('An array of generated asteroid data.'),
});
export type GenerateAsteroidDataOutput = z.infer<typeof GenerateAsteroidDataOutputSchema>;

export async function generateAsteroidData(input: GenerateAsteroidDataInput): Promise<GenerateAsteroidDataOutput> {
  return generateAsteroidDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAsteroidDataPrompt',
  input: { schema: GenerateAsteroidDataInputSchema },
  output: { schema: GenerateAsteroidDataOutputSchema },
  prompt: `You are a scientific data generator creating plausible data for a near-earth asteroid visualization.
Your output should mimic the data structure of the NASA NeoWs (Near Earth Object Web Service) API.

Generate plausible data for {{count}} asteroids. For each asteroid, provide:
- A unique ID.
- A name, typically in the format "(YYYY ABC)".
- Min and max estimated diameter in kilometers.
- A boolean for whether it is a potentially hazardous asteroid.
- Orbital period in days.
- Relative velocity at close approach in kilometers per second.
- Miss distance from Earth in astronomical units (AU).

Return the data as a JSON object with an "asteroids" array.`,
});


const generateAsteroidDataFlow = ai.defineFlow(
  {
    name: 'generateAsteroidDataFlow',
    inputSchema: GenerateAsteroidDataInputSchema,
    outputSchema: GenerateAsteroidDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
