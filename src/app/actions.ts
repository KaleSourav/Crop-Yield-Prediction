'use server';

import {
  personalizedRecommendations,
  type PersonalizedRecommendationsInput,
} from '@/ai/flows/personalized-recommendations';
import { PersonalizedRecommendationsInputSchema } from '@/ai/schemas';

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
) {
  const validatedInput = PersonalizedRecommendationsInputSchema.safeParse(input);

  if (!validatedInput.success) {
    console.error('Validation Error: ', validatedInput.error.format());
    return { failure: 'Invalid input provided. Please check the form fields.' };
  }

  try {
    const result = await personalizedRecommendations(validatedInput.data);
    return { success: result };
  } catch (e) {
    console.error(e);
    return {
      failure:
        'Failed to get recommendations from AI. Please try again later.',
    };
  }
}
