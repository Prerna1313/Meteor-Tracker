'use server';

/**
 * @fileOverview Generates realistic meteor data based on a given planet and orbital parameters.
 *
 * - generateMeteorData - A function that generates meteor data.
 * - GenerateMeteorDataInput - The input type for the generateMeteorData function.
 * - GenerateMeteorDataOutput - The return type for the generateMeteorData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMeteorDataInputSchema = z.object({
  planet: z.string().describe('The planet around which the meteors orbit.'),
  orbitalRadius: z.number().describe('The orbital radius of the meteor swarm in kilometers.'),
  meteorCount: z.number().describe('The number of meteors to generate data for.'),
});
export type GenerateMeteorDataInput = z.infer<typeof GenerateMeteorDataInputSchema>;

const GenerateMeteorDataOutputSchema = z.object({
  meteors: z.array(
    z.object({
      size: z.number().describe('The size of the meteor in meters.'),
      trajectory: z.string().describe('The trajectory of the meteor described mathematically.'),
      composition: z.string().describe('The composition of the meteor (e.g., iron, nickel-iron, stony).'),
    })
  ).describe('An array of meteor data.'),
});
export type GenerateMeteorDataOutput = z.infer<typeof GenerateMeteorDataOutputSchema>;

export async function generateMeteorData(input: GenerateMeteorDataInput): Promise<GenerateMeteorDataOutput> {
  return generateMeteorDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMeteorDataPrompt',
  input: {schema: GenerateMeteorDataInputSchema},
  output: {schema: GenerateMeteorDataOutputSchema},
  prompt: `You are a scientific data generator specialized in creating plausible meteor data for a solar system visualization.

  Generate data for {{meteorCount}} meteors orbiting the planet {{planet}} with an orbital radius of {{orbitalRadius}} km.

  Each meteor should have a size (in meters), a trajectory (described mathematically), and a composition (e.g., iron, nickel-iron, stony).

  Return the data in a JSON format. The JSON should contain a "meteors" array, where each object in the array represents a single meteor and has "size", "trajectory", and "composition" fields.

  Ensure the generated trajectories are mathematically plausible, and the compositions are realistic given the planet they orbit.

  The data should be diverse and represent a realistic distribution of meteor properties.
`,
});

const generateMeteorDataFlow = ai.defineFlow(
  {
    name: 'generateMeteorDataFlow',
    inputSchema: GenerateMeteorDataInputSchema,
    outputSchema: GenerateMeteorDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
