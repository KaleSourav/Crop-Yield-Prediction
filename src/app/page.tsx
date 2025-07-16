'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  PersonalizedRecommendationsOutput,
} from '@/ai/flows/personalized-recommendations';
import { Header } from '@/components/header';
import { CropcastForm } from '@/components/cropcast-form';
import { RecommendationCard } from '@/components/recommendation-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, Leaf, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<PersonalizedRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const handleResults = (data: PersonalizedRecommendationsOutput | null) => {
    setRecommendations(data);
    setLoading(false);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) {
      setRecommendations(null);
    }
  };

  const handleError = (errorMessage: string) => {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    setLoading(false);
    setRecommendations(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
            Welcome to CropCast
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Leverage AI to predict crop yields and receive personalized
            recommendations for sustainable farming. Input your farm&apos;s data
            to get started.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold font-headline mb-6">
              Your Farm&apos;s Data
            </h2>
            <CropcastForm
              onResults={handleResults}
              onLoading={handleLoading}
              onError={handleError}
            />
          </div>
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-lg min-h-[400px]">
            <h2 className="text-2xl font-bold font-headline mb-6">
              AI-Powered Recommendations
            </h2>
            {loading ? (
              <div className="space-y-4 pt-2">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            ) : recommendations ? (
              <div className="space-y-4">
                <RecommendationCard
                  icon={<Droplets className="h-8 w-8 text-blue-500" />}
                  title="Irrigation"
                  description={recommendations.irrigationRecommendation}
                />
                <RecommendationCard
                  icon={<Leaf className="h-8 w-8 text-green-500" />}
                  title="Fertilization"
                  description={recommendations.fertilizationRecommendation}
                />
                <RecommendationCard
                  icon={<CalendarDays className="h-8 w-8 text-amber-600" />}
                  title="Planting Time"
                  description={recommendations.plantingTimeRecommendation}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-8">
                <Image
                  src="https://placehold.co/400x300.png"
                  alt="An illustration of a farm with data analytics overlay"
                  width={400}
                  height={300}
                  className="rounded-lg mb-4 object-cover"
                  data-ai-hint="agriculture technology"
                />
                <p className="mt-4 text-lg">
                  Your personalized insights will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>
          Powered by AI for a sustainable future. CropCast &copy;{' '}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
