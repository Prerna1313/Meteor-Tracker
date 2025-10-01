'use server';

/**
 * @fileOverview Generates realistic comet data.
 *
 * - generateCometData - A function that generates comet data.
 * - GenerateCometDataInput - The input type for the generateCometData function.
 * - GenerateCometDataOutput - The return type for the generateCometData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCometDataInputSchema = z.object({
  count: z.number().describe('The number of comets to generate.'),
});
export type GenerateCometDataInput = z.infer<typeof GenerateCometDataInputSchema>;

const GenerateCometDataOutputSchema = z.object({
  comets: z.array(
    z.object({
      id: z.string().describe('A unique identifier for the comet (e.g., C/2023 P1).'),
      name: z.string().describe('The name of the comet (e.g., Nishimura).'),
      size: z.number().describe('The estimated diameter of the comet nucleus in kilometers.'),
      composition: z.string().describe('The composition of the comet (e.g., ice, dust, rock).'),
      orbitalPeriod: z.number().describe('The orbital period of the comet in Earth years.'),
      trajectory: z.string().describe('A description of the comet\'s trajectory (e.g., "Highly elliptical, long-period orbit").'),
    })
  ).describe('An array of generated comet data.'),
});
export type GenerateCometDataOutput = z.infer<typeof GenerateCometDataOutputSchema>;

export async function generateCometData(input: GenerateCometDataInput): Promise<GenerateCometDataOutput> {
  return generateCometDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCometDataPrompt',
  input: { schema: GenerateCometDataInputSchema },
  output: { schema: GenerateCometDataOutputSchema },
  prompt: `You are a scientific data generator creating plausible data for a solar system visualization.
Generate data for {{count}} comets. For each comet, provide a unique ID, a name, size (in km), composition, orbital period (in years), and a trajectory description.
Return the data as a JSON object with a "comets" array.`,
});


const generateCometDataFlow = ai.defineFlow(
  {
    name: 'generateCometDataFlow',
    inputSchema: GenerateCometDataInputSchema,
    outputSchema: GenerateCometDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
