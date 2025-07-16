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
import { summarizeDataTool } from '@/ai/tools/summarize-data';

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

const predictYieldPrompt = ai.definePrompt({
  name: 'predictYieldPrompt',
  tools: [summarizeDataTool],
  input: {schema: PredictYieldInputSchema},
  output: {schema: PredictYieldOutputSchema},
  system: "You are an expert agriculture advisor. Your goal is to predict crop yield based on provided data. First, you MUST use the summarizeDataTool to get a summary of the provided agricultural data. Then, based on the summary returned by the tool, predict the crop yield and provide actionable recommendations for the farmer. Do not use the raw data directly.",
  prompt: `Please summarize and then predict the yield for the following data: {{{agriculturalData}}}`,
});

const predictYieldFlow = ai.defineFlow(
  {
    name: 'predictYieldFlow',
    inputSchema: PredictYieldInputSchema,
    outputSchema: PredictYieldOutputSchema,
  },
  async (input) => {
    const {output} = await predictYieldPrompt(input);
    if (!output) {
      throw new Error('The AI model failed to produce an output.');
    }
    return output;
  }
);
