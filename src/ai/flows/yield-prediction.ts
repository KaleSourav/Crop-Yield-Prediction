// src/ai/flows/yield-prediction.ts
'use server';
/**
 * @fileOverview A crop yield prediction AI agent.
 *
 * - predictYield - A function that handles the crop yield prediction process.
 * - PredictYieldInput - The input type for the predictYield function.
 * - PredictYieldOutput - The return type for the predictYield function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictYieldInputSchema = z.object({
  cropYieldData: z
    .string()
    .describe('Historical crop yield data as a CSV text.'),
  soilQualityData: z
    .string()
    .describe('Historical soil quality data as a CSV text.'),
  weatherData: z
    .string()
    .describe('Historical weather data as a CSV text.'),
});
export type PredictYieldInput = z.infer<typeof PredictYieldInputSchema>;

const PredictYieldOutputSchema = z.object({
  predictedYield: z.number().describe('The predicted crop yield.'),
  recommendations: z.string().describe('Recommendations for the farmer based on the prediction.'),
});
export type PredictYieldOutput = z.infer<typeof PredictYieldOutputSchema>;

export async function predictYield(input: PredictYieldInput): Promise<PredictYieldOutput> {
  return predictYieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictYieldPrompt',
  input: {schema: PredictYieldInputSchema},
  output: {schema: PredictYieldOutputSchema},
  prompt: `You are an expert agriculture advisor. Based on the historical crop yield data, soil quality data, and weather data provided, predict the crop yield and provide recommendations to the farmer. The data is in CSV format.

Crop Yield Data (CSV):
{{{cropYieldData}}}

Soil Quality Data (CSV):
{{{soilQualityData}}}

Weather Data (CSV):
{{{weatherData}}}`,
});

const predictYieldFlow = ai.defineFlow(
  {
    name: 'predictYieldFlow',
    inputSchema: PredictYieldInputSchema,
    outputSchema: PredictYieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
