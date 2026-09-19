'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { spring, useHasHover, STAGGER, duration } from '@/lib/motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const hasHover = useHasHover();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.enter }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...spring, delay: STAGGER * 2 }}
          className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20"
        >
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STAGGER * 3 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Oops! Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STAGGER * 4 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          We encountered an unexpected error. Please try again or return to the
          home page.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: STAGGER * 5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={reset}
            whileHover={hasHover ? { scale: 1.05 } : undefined}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-150"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={hasHover ? { scale: 1.05 } : undefined}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg transition-colors duration-150"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
        </motion.div>

        {process.env.NODE_ENV === 'development' && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: STAGGER * 6 }}
            className="mt-8 text-left"
          >
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto max-h-40">
              {error.message}
            </pre>
          </motion.details>
        )}
      </motion.div>
    </div>
  );
}
