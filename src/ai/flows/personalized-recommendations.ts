'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized agricultural recommendations to farmers.
 *
 * - personalizedRecommendations - A function that takes farm data as input and returns personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the personalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the personalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PersonalizedRecommendationsInputSchema, PersonalizedRecommendationsOutputSchema } from '@/ai/schemas';

export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function personalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' },
    ],
  },
  prompt: `You are an expert agricultural advisor. 
  
  Based on the following farm profile, provide specific and actionable recommendations for irrigation, fertilization, and planting times.
  Return only the JSON output.

  Location: {{{location}}}
  Crop Type: {{{cropType}}}
  Soil pH: {{{soilPh}}}
  Nitrogen Levels: {{{nitrogenLevels}}} ppm
  Monthly Rainfall: {{{rainfall}}} mm
  Avg Temperature: {{{temperature}}} °C
  Avg Humidity: {{{humidity}}} %
  Historical Yield Trends: {{{historicalYieldTrends}}}`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error("The AI failed to generate recommendations. It might have been blocked by a safety filter or provided an invalid response.");
      }
      return output;
    } catch (error: any) {
      console.error("Personalized Recommendations Flow Error:", error);
      throw new Error(`AI Recommendation Error: ${error.message || "Unknown error"}`);
    }
  }
);
