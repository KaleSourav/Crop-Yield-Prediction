/**
 * @fileOverview This file contains the Zod schemas for the AI flows.
 * Separating schemas into their own file allows them to be imported into
 * both client and server components without running into "use server"
 * directive conflicts.
 */
import { z } from 'zod';

export const PersonalizedRecommendationsInputSchema = z.object({
  soilPh: z.number().describe('The pH level of the soil.'),
  nitrogenLevels: z.number().describe('The nitrogen levels in the soil (ppm).'),
  rainfall: z.number().describe('Rainfall in the last month (mm).'),
  temperature: z.number().describe('Average temperature in the last month (°C).'),
  humidity: z.number().describe('Average humidity in the last month (%).'),
  historicalYieldTrends: z.string().describe('Description of historical yield trends.'),
  cropType: z.string().describe('The type of crop being grown.'),
  location: z.string().describe('The location of the farm.'),
});

export const PersonalizedRecommendationsOutputSchema = z.object({
  irrigationRecommendation: z.string().describe('Personalized irrigation recommendations.'),
  fertilizationRecommendation: z.string().describe('Personalized fertilization recommendations.'),
  plantingTimeRecommendation: z.string().describe('Personalized planting time recommendations.'),
});
