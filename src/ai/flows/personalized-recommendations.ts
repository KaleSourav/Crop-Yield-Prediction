// src/ai/flows/personalized-recommendations.ts
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
  prompt: `You are an AI assistant providing personalized agricultural recommendations to farmers.

  Based on the following farm data, provide specific and actionable recommendations for irrigation, fertilization, and planting times.

  Soil pH: {{{soilPh}}}
  Nitrogen Levels: {{{nitrogenLevels}}} ppm
  Rainfall: {{{rainfall}}} mm
  Temperature: {{{temperature}}} °C
  Humidity: {{{humidity}}} %
  Historical Yield Trends: {{{historicalYieldTrends}}}
  Crop Type: {{{cropType}}}
  Location: {{{location}}}

  Format your response as follows:

  Irrigation Recommendation: [recommendation]
  Fertilization Recommendation: [recommendation]
  Planting Time Recommendation: [recommendation]`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
