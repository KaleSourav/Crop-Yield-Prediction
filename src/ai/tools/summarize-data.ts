'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeDataInputSchema = z.object({
  agriculturalData: z.string().describe('A large string of raw CSV data to be summarized.'),
});

const SummarizeDataOutputSchema = z.object({
  summary: z.string().describe('A summary of key statistics, trends, and correlations from the data.'),
});

const summarizeDataPrompt = ai.definePrompt({
  name: 'summarizeDataPrompt',
  input: { schema: SummarizeDataInputSchema },
  output: { schema: SummarizeDataOutputSchema },
  prompt: `You are an expert data analyst. You will be given a large dataset of agricultural data in CSV format.
Your task is to provide a very concise summary of the key statistical properties of this data. Do not output the raw data.
Focus on:
1.  Overall dataset size (rows, columns).
2.  For each numerical column (like temperature, rainfall, yield, soil metrics): calculate the mean, median, standard deviation, min, and max.
3.  Identify the time period covered by the data if available.
4.  Briefly mention any obvious strong positive or negative correlations between columns (e.g., "rainfall is positively correlated with yield").
Keep the entire summary under 500 words. This summary will be used by another AI to predict future yield, so only include the most critical information for that task.

Data:
{{{agriculturalData}}}`,
});

export const summarizeDataTool = ai.defineTool(
  {
    name: 'summarizeDataTool',
    description: 'Summarizes large agricultural data sets into key insights. This MUST be called before making a yield prediction.',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeDataPrompt(input);
    if (!output) {
      throw new Error('Failed to get a summary from the AI model.');
    }
    return output;
  }
);
