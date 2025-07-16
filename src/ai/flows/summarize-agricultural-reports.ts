'use server';

/**
 * @fileOverview Summarizes lengthy agricultural reports to quickly gather information.
 *
 * - summarizeReport - A function that summarizes the report.
 * - SummarizeReportInput - The input type for the summarizeReport function.
 * - SummarizeReportOutput - The return type for the summarizeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportInputSchema = z.object({
  reportText: z
    .string()
    .describe('The text of the agricultural report to summarize.'),
});
export type SummarizeReportInput = z.infer<typeof SummarizeReportInputSchema>;

const SummarizeReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the agricultural report.'),
});
export type SummarizeReportOutput = z.infer<typeof SummarizeReportOutputSchema>;

export async function summarizeReport(input: SummarizeReportInput): Promise<SummarizeReportOutput> {
  return summarizeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {schema: SummarizeReportInputSchema},
  output: {schema: SummarizeReportOutputSchema},
  prompt: `You are an expert agricultural researcher. Please summarize the following report, highlighting the key findings and conclusions.\n\nReport:\n{{{reportText}}}`,
});

const summarizeReportFlow = ai.defineFlow(
  {
    name: 'summarizeReportFlow',
    inputSchema: SummarizeReportInputSchema,
    outputSchema: SummarizeReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
