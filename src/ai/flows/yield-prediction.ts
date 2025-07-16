
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
  output: {schema: PredictYieldOutputSchema},
  system: `You are an expert agriculture advisor. Your goal is to predict crop yield based on provided data.
If you have not been given a data summary, you MUST call the \`summarizeDataTool\` with the \`agriculturalData\` to get a concise summary.
After receiving the summary from the tool, you MUST use that summary to predict the crop yield.
Finally, provide actionable recommendations for the farmer based on your prediction and the data summary.`,
});

const predictYieldFlow = ai.defineFlow(
  {
    name: 'predictYieldFlow',
    inputSchema: PredictYieldInputSchema,
    outputSchema: PredictYieldOutputSchema,
  },
  async (input) => {
    // Step 1: First request to the model.
    // The model will likely use the `summarizeDataTool` here.
    let response = await predictYieldPrompt(input);

    // Step 2: Loop through tool requests until the model provides the final answer.
    while (true) {
      const toolRequest = response.toolRequest;
      if (!toolRequest) {
        // No more tool requests, so the model has given its final answer.
        break;
      }

      const toolResponse = await toolRequest.run();

      // Step 3: Send the tool's response back to the model to continue the conversation.
      response = await predictYieldPrompt(input, {
        history: [response.request, response.response, toolResponse],
      });
    }

    const output = response.output;
    if (!output) {
      throw new Error('The AI model failed to produce a valid output.');
    }
    return output;
  }
);
