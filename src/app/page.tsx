'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  PersonalizedRecommendationsOutput,
} from '@/ai/flows/personalized-recommendations';
import { PredictYieldOutput } from '@/ai/flows/yield-prediction';
import { Header } from '@/components/header';
import { CropcastForm } from '@/components/cropcast-form';
import { RecommendationCard } from '@/components/recommendation-card';
import { YieldPredictionForm } from '@/components/yield-prediction-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Leaf, CalendarDays, LineChart, MessageSquareQuote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<PersonalizedRecommendationsOutput | null>(null);
  const [prediction, setPrediction] = useState<PredictYieldOutput | null>(null);
  const { toast } = useToast();

  const handleRecResults = (data: PersonalizedRecommendationsOutput | null) => {
    setRecommendations(data);
    setLoading(false);
  };
  
  const handlePredResults = (data: PredictYieldOutput | null) => {
    setPrediction(data);
    setLoading(false);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
    if (isLoading) {
      setRecommendations(null);
      setPrediction(null);
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
    setPrediction(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background/80 font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to <span className='text-primary'>CropCast</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Leverage AI to predict crop yields and receive personalized
            recommendations for sustainable farming. Input your farm&apos;s data
            to get started.
          </p>
        </div>

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto bg-card border-border shadow-inner">
            <TabsTrigger value="recommendations">Personalized Recommendations</TabsTrigger>
            <TabsTrigger value="prediction">Yield Prediction</TabsTrigger>
          </TabsList>
          <TabsContent value="recommendations">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8">
              <div className="bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-border/20 shadow-lg transition-all hover:shadow-primary/20 hover:border-primary/40 duration-300">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  Your Farm&apos;s Data
                </h2>
                <CropcastForm
                  onResults={handleRecResults}
                  onLoading={handleLoading}
                  onError={handleError}
                />
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-border/20 shadow-lg min-h-[400px] transition-all hover:shadow-primary/20 hover:border-primary/40 duration-300">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  AI-Powered Recommendations
                </h2>
                {loading ? (
                  <div className="space-y-4 pt-2">
                    <Skeleton className="h-28 w-full rounded-lg bg-secondary/50" />
                    <Skeleton className="h-28 w-full rounded-lg bg-secondary/50" />
                    <Skeleton className="h-28 w-full rounded-lg bg-secondary/50" />
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
                      icon={<CalendarDays className="h-8 w-8 text-amber-500" />}
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
                      className="rounded-lg mb-4 object-cover opacity-10"
                      data-ai-hint="agriculture technology"
                    />
                    <p className="mt-4 text-lg">
                      Your personalized insights will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="prediction">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mt-8">
              <div className="bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-border/20 shadow-lg transition-all hover:shadow-primary/20 hover:border-primary/40 duration-300">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  Historical Data
                </h2>
                <YieldPredictionForm
                  onResults={handlePredResults}
                  onLoading={handleLoading}
                  onError={handleError}
                />
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-border/20 shadow-lg min-h-[400px] transition-all hover:shadow-primary/20 hover:border-primary/40 duration-300">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  AI-Powered Prediction
                </h2>
                {loading ? (
                  <div className="space-y-4 pt-2">
                    <Skeleton className="h-24 w-full rounded-lg bg-secondary/50" />
                    <Skeleton className="h-36 w-full rounded-lg bg-secondary/50" />
                  </div>
                ) : prediction ? (
                  <div className="space-y-6">
                    <Card className="bg-secondary/20 border-border/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <LineChart className="h-10 w-10 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Predicted Yield</p>
                            <p className="text-3xl font-bold">{prediction.predictedYield.toLocaleString()} tons</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/20 border-border/20">
                      <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <MessageSquareQuote className="h-8 w-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Recommendations</p>
                          <p className="text-base">{prediction.recommendations}</p>
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-8">
                    <Image
                      src="https://placehold.co/400x300.png"
                      alt="An illustration of data charts and graphs"
                      width={400}
                      height={300}
                      className="rounded-lg mb-4 object-cover opacity-10"
                      data-ai-hint="data charts"
                    />
                    <p className="mt-4 text-lg">
                      Your yield prediction will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {/* <footer className="text-center p-4 text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()}Hllo
      </footer> */}
    </div>
  );
}
