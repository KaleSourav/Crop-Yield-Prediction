import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Particles from '@/components/particles';
import '@/components/particles.css';

export const metadata: Metadata = {
  title: 'CropCast',
  description: 'Sustainable Agriculture with AI for Crop Yield Prediction',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <Particles
            className="h-full w-full"
            particleColors={['#8FBC8F', '#98FB98', '#90EE90']}
            particleCount={1000}
            particleBaseSize={30}
            speed={0.05}
          />
        </div>
        <div className="relative z-10">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
