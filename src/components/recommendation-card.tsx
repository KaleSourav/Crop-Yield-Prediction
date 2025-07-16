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
    <Card className="bg-secondary/50 border-border hover:border-primary hover:bg-secondary transition-all duration-300 group shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <CardTitle className="text-lg font-medium text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground pt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
