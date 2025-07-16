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
  predictedYield: z.number().describe('The predicted crop yield in tons.'),
  recommendations: z.string().describe('Actionable recommendations for the farmer based on the prediction and data summary.'),
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
  system: `You are an expert agriculture advisor. Your goal is to predict crop yield based on provided data.
The user will provide a large string of agricultural data in CSV format.
You MUST first call the \`summarizeDataTool\` with the entire \`agriculturalData\` string to get a concise summary of the key statistics, trends, and correlations.
After receiving the summary from the tool, you MUST use that summary to predict the crop yield.
Finally, you will provide actionable recommendations for the farmer based on your prediction and the data summary.
Do not use the raw data directly for the final prediction; use only the summary provided by the tool.`,
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
