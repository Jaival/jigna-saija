import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground/80">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-[transform,box-shadow,background-color] duration-150 ease-out"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 border border-input text-foreground/80 font-semibold rounded-lg hover:bg-muted transition-colors duration-150"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
