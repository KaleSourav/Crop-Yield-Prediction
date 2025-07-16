import { Sprout } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <Sprout className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          Crop<span className='text-primary'>Cast</span>
        </h1>
      </div>
    </header>
  );
}
