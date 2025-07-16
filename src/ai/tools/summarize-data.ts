'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeDataInputSchema = z.object({
  data: z.string().describe('The raw CSV data to be summarized.'),
});

const SummarizeDataOutputSchema = z.object({
  summary: z.string().describe('A summary of key statistics, trends, and correlations from the data.'),
});

const summarizeDataPrompt = `You are an expert data analyst. Summarize the following agricultural data (in CSV format).
Focus on key statistics (mean, median, std dev), trends over time, and potential correlations between weather, soil, and yield.
Keep the summary concise and focused on what would be needed to predict future yield.
Data:
{{{data}}}`;

export const summarizeDataTool = ai.defineTool(
  {
    name: 'summarizeDataTool',
    description: 'Summarizes large agricultural data sets into key insights.',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: summarizeDataPrompt,
      model: 'googleai/gemini-2.0-flash',
      input: {
        data: input.data
      }
    });
    return { summary: text };
  }
);
