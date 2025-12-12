import React from 'react';
import { motion } from 'motion/react';

// Base skeleton component
export function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      {...props}
    />
  );
}

// Project card skeleton for grid view
export function ProjectCardSkeleton() {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl glass shadow-lg">
        <Skeleton className="aspect-[4/3]" />
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Project list item skeleton for list view
export function ProjectListSkeleton() {
  return (
    <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12">
      <div className="flex flex-col gap-6 md:gap-8 justify-center items-center md:items-start max-w-2xl">
        <Skeleton className="h-12 md:h-20 w-full" />
        <Skeleton className="h-8 md:h-12 w-3/4" />
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>
      <Skeleton className="w-full md:w-[550px] h-[400px] md:h-[550px] rounded-2xl" />
    </div>
  );
}

// About section skeleton
export function AboutSkeleton() {
  return (
    <div className="flex flex-col items-center gap-12 md:gap-16 lg:flex-row">
      <Skeleton className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-[400px] md:h-[600px] rounded-2xl" />
      <div className="flex flex-col w-full lg:ml-12 space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
}

// Image skeleton with shimmer effect
export function ImageSkeleton({
  className = '',
  aspectRatio = 'aspect-square',
}: {
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${aspectRatio} ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: ['100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
