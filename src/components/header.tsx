import { Sprout } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <Sprout className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">
          CropCast
        </h1>
      </div>
    </header>
  );
}
