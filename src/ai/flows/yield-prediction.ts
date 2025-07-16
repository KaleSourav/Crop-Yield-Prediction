
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
  predictedYield: z.number().describe('The predicted crop yield in tons.'),
  recommendations: z.string().describe('Actionable recommendations for the farmer based on the prediction and data summary.'),
});
export type PredictYieldOutput = z.infer<typeof PredictYieldOutputSchema>;

export async function predictYield(input: PredictYieldInput): Promise<PredictYieldOutput> {
  return predictYieldFlow(input);
}

const predictYieldPrompt = ai.definePrompt({
  name: 'predictYieldPrompt',
  input: {schema: PredictYieldInputSchema},
  output: {schema: PredictYieldOutputSchema},
  prompt: `You are an expert agriculture advisor and data analyst.
Your task is to predict crop yield based on the provided agricultural data in CSV format.

1.  First, analyze the provided data to understand its key statistical properties and trends. Do not output this summary, use it for your internal reasoning.
2.  Based on your analysis, predict the crop yield in tons.
3.  Provide a set of actionable recommendations for the farmer based on your prediction and the data you analyzed.

Data:
{{{agriculturalData}}}
`,
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
      throw new Error("The AI model failed to produce a valid output.");
    }
    return output;
  }
);
