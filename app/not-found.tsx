import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-row h-[500px] content-between justify-center items-center">
      <div className="flex flex-col space-y-10">
        <h2 className="text-4xl">Not Found</h2>
        <p className="text-xl">
          The link you are trying to visit doesn`t exists.
        </p>
        <Link
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'text-xl',
          )}
          href="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
