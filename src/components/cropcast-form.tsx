'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  type PersonalizedRecommendationsOutput,
} from '@/ai/flows/personalized-recommendations';
import { PersonalizedRecommendationsInputSchema } from '@/ai/schemas';
import { getPersonalizedRecommendations } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const formSchema = PersonalizedRecommendationsInputSchema;

type CropcastFormProps = {
  onResults: (data: PersonalizedRecommendationsOutput | null) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: string) => void;
};

export function CropcastForm({
  onResults,
  onLoading,
  onError,
}: CropcastFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      cropType: 'Wheat',
      soilPh: 7.0,
      nitrogenLevels: 50,
      rainfall: 100,
      temperature: 25,
      humidity: 60,
      historicalYieldTrends:
        'Stable yields over the last 3 years with minor fluctuations due to seasonal rain variations.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    onLoading(true);

    const result = await getPersonalizedRecommendations(values);

    if (result.success) {
      onResults(result.success);
    } else {
      onError(result.failure || 'An unknown error occurred.');
      onResults(null);
    }
    
    setIsSubmitting(false);
    onLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Punjab, India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a crop" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Corn">Corn</SelectItem>
                    <SelectItem value="Soybean">Soybean</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="soilPh"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Soil pH</FormLabel>
                <span className="text-sm font-medium text-muted-foreground">
                  {field.value.toFixed(1)}
                </span>
              </div>
              <FormControl>
                <Slider
                  min={0}
                  max={14}
                  step={0.1}
                  onValueChange={(value) => field.onChange(value[0])}
                  defaultValue={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nitrogenLevels"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Nitrogen Levels (ppm)</FormLabel>
                <span className="text-sm font-medium text-muted-foreground">
                  {field.value} ppm
                </span>
              </div>
              <FormControl>
                <Slider
                  min={0}
                  max={200}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                  defaultValue={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rainfall"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rainfall (mm/mo)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avg. Temp (°C)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="humidity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avg. Humidity (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="historicalYieldTrends"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Historical Yield Trends</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your farm's yield over the past few seasons..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Analyzing...' : 'Get Recommendations'}
        </Button>
      </form>
    </Form>
  );
}
