import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

type RecommendationCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function RecommendationCard({
  icon,
  title,
  description,
}: RecommendationCardProps) {
  return (
    <Card className="bg-background/30 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="flex-shrink-0">{icon}</div>
        <CardTitle className="text-lg font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground pt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
