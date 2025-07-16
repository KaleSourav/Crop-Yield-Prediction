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
  agriculturalData: z
    .string()
    .describe('A string containing agricultural data in CSV format, including historical crop yield, soil quality, and weather data.'),
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
  prompt: `You are an expert agriculture advisor. Based on the provided agricultural data in CSV format, predict the crop yield and provide recommendations to the farmer.

The data provided is a string containing data in CSV format. The CSV data includes columns for historical crop yield, soil quality metrics (like pH, nitrogen levels), and weather data (like rainfall, temperature).

Your task is to analyze this data to identify trends and correlations, and then output a predicted yield figure and actionable recommendations for the farmer.

Agricultural Data (CSV):
{{{agriculturalData}}}`,
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
