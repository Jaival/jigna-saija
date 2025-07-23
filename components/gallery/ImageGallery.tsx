'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Grid3X3,
  LayoutGrid,
} from 'lucide-react';

type ImageGalleryProps = {
  id: number;
  title: string;
  imageUrls: string[];
};

// Preload next/previous images for better UX
const preloadImage = (src: string) => {
  const img = new window.Image();
  img.src = src;
};

export default function ImageGallery({
  id,
  title,
  imageUrls,
}: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null,
  );
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'grid'>('grid');
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  const openModal = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);
      setIsModalOpen(true);

      // Preload adjacent images
      if (index > 0) preloadImage(imageUrls[index - 1]!);
      if (index < imageUrls.length - 1) preloadImage(imageUrls[index + 1]!);
    },
    [imageUrls],
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setCurrentImageIndex(null);
    }
  }, []);

  const goToNextImage = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      if (currentImageIndex === null) return;
      const nextIndex = (currentImageIndex + 1) % imageUrls.length;
      setCurrentImageIndex(nextIndex);

      // Preload next image
      const preloadIndex = (nextIndex + 1) % imageUrls.length;
      preloadImage(imageUrls[preloadIndex]!);
    },
    [currentImageIndex, imageUrls],
  );

  const goToPreviousImage = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      if (currentImageIndex === null) return;
      const prevIndex =
        (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
      setCurrentImageIndex(prevIndex);

      // Preload previous image
      const preloadIndex =
        (prevIndex - 1 + imageUrls.length) % imageUrls.length;
      preloadImage(imageUrls[preloadIndex]!);
    },
    [currentImageIndex, imageUrls],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case 'ArrowLeft':
          goToPreviousImage();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
        case 'Escape':
          handleOpenChange(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, goToNextImage, goToPreviousImage, handleOpenChange]);

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded((prev) => new Set([...Array.from(prev), index]));
  }, []);

  // Modern bento layout pattern - creates sophisticated asymmetrical grid
  const getBentoSpan = (index: number) => {
    if (layoutMode !== 'masonry') return '';

    const patterns = [
      'sm:col-span-2 sm:row-span-2', // Hero - Large feature
      'sm:col-span-1 sm:row-span-1', // Standard
      'sm:col-span-1 sm:row-span-1', // Standard
      'sm:col-span-2 sm:row-span-1', // Landscape
      'sm:col-span-1 sm:row-span-2', // Portrait
      'sm:col-span-1 sm:row-span-1', // Standard
      'sm:col-span-1 sm:row-span-1', // Standard
      'sm:col-span-2 sm:row-span-1', // Landscape
      'sm:col-span-1 sm:row-span-1', // Standard
      'sm:col-span-1 sm:row-span-2', // Portrait
      'sm:col-span-2 sm:row-span-1', // Landscape
      'sm:col-span-1 sm:row-span-1', // Standard
    ];

    return patterns[index % patterns.length];
  };

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-6">📷</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No images available for this project.
        </p>
      </motion.div>
    );
  }

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(index);
  };

  // Enhanced container variants with fast, snappy timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: layoutMode === 'masonry' ? 0.02 : 0.03,
        delayChildren: 0.02,
        duration: 0.15,
      },
    },
  };

  // Enhanced item variants with fast, snappy animations
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: layoutMode === 'masonry' ? 20 : 15,
      scale: 0.96,
      rotateX: layoutMode === 'masonry' ? 1 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.3,
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <div className="w-full max-w-none">
      {/* Streamlined Gallery Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="text-gray-600 dark:text-gray-400 text-base font-medium">
          {imageUrls.length} {imageUrls.length === 1 ? 'image' : 'images'}
        </div>

        {/* Layout Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayoutMode('grid')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              layoutMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-pink-500 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            title="Grid Layout"
          >
            <Grid3X3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLayoutMode('masonry')}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              layoutMode === 'masonry'
                ? 'bg-white dark:bg-gray-700 text-pink-500 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            title="Bento Layout"
          >
            <LayoutGrid className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Gallery with Layout-Specific Styling */}
      <motion.div
        key={layoutMode} // Re-trigger animations when layout changes
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          layoutMode === 'masonry'
            ? 'grid auto-rows-[180px] sm:auto-rows-[200px] lg:auto-rows-[220px] grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
        }
      >
        {imageUrls.map((image, index) => (
          <motion.div
            key={`${id}-${index}-${layoutMode}`}
            variants={itemVariants}
            whileHover={{
              scale: 1.04,
              y: -4,
              zIndex: 10,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
            className={`${
              layoutMode === 'masonry' ? `${getBentoSpan(index)}` : ''
            } cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-100 bg-white dark:bg-gray-900 ${
              layoutMode === 'masonry'
                ? 'border border-gray-100 dark:border-gray-800'
                : ''
            }`}
            onClick={(e) => handleImageClick(index, e)}
            role="button"
            tabIndex={0}
            aria-label={`Open image ${index + 1} of ${imageUrls.length} in lightbox`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(index);
              }
            }}
          >
            <ProfessionalImage
              image={image}
              title={title}
              index={index}
              priority={index < 6}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(index, e);
              }}
              onLoad={() => handleImageLoad(index)}
              layoutMode={layoutMode}
            />

            {/* Modern Overlay with Instant Response */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.05 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.05,
                  ease: 'easeOut',
                }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30"
              >
                <ZoomIn className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Enhanced Image Number Badge with Layout-Specific Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10, x: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{
                delay: 0.05 + index * 0.015,
                duration: 0.25,
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
              className={`absolute top-3 sm:top-5 right-3 sm:right-5 bg-black/70 backdrop-blur-lg text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/25 shadow-lg ${
                layoutMode === 'masonry' ? 'backdrop-blur-md' : ''
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>

            {/* Modern accent for bento */}
            {layoutMode === 'masonry' && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.05 }}
                className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full shadow-lg"
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Premium Modal/Dialog with Enhanced Animations */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none min-w-full min-h-full p-6 bg-black/95 border-0 overflow-hidden m-0 translate-x-0 translate-y-0">
              <DialogTitle className="sr-only">
                {title} - Image{' '}
                {currentImageIndex !== null ? currentImageIndex + 1 : 1} of{' '}
                {imageUrls.length}
              </DialogTitle>

              {currentImageIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* Premium Navigation buttons */}
                  {imageUrls.length > 1 && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm rounded-full transition-all duration-200"
                          onClick={goToPreviousImage}
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm rounded-full transition-all duration-200"
                          onClick={goToNextImage}
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </motion.div>
                    </>
                  )}

                  {/* Premium Image counter */}
                  {imageUrls.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 text-white px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-md border border-white/20 shadow-lg"
                    >
                      {currentImageIndex + 1} / {imageUrls.length}
                    </motion.div>
                  )}

                  {/* Main image with premium animation */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                    }}
                    className="relative w-full h-full max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]"
                  >
                    <Image
                      src={imageUrls[currentImageIndex]!}
                      alt={`${title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-contain rounded-2xl"
                      sizes="100vw"
                      quality={95}
                      priority
                    />
                  </motion.div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

type ProfessionalImageProps = {
  image: string;
  title: string;
  index: number;
  priority?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onLoad?: () => void;
  layoutMode: 'masonry' | 'grid';
};

function ProfessionalImage({
  image,
  title,
  index,
  priority = false,
  onClick,
  onLoad,
  layoutMode,
}: ProfessionalImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setLoading(false);
    onLoad?.();
  };

  return (
    <div
      className="group relative overflow-hidden w-full h-full"
      onClick={onClick}
    >
      {hasError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl"
        >
          <div className="text-center">
            <div className="text-4xl sm:text-5xl mb-4">🖼️</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Failed to load image
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={
            layoutMode === 'grid'
              ? 'aspect-[4/3] relative'
              : 'w-full h-full relative'
          }
        >
          <Image
            src={image}
            alt={`${title} - Image ${index + 1}`}
            fill
            className={cn(
              'transition-transform duration-150 ease-out rounded-2xl sm:rounded-3xl object-cover',
              isLoading
                ? 'scale-105 blur-sm grayscale opacity-70'
                : 'scale-100 blur-0 grayscale-0 group-hover:scale-105',
            )}
            sizes={
              layoutMode === 'grid'
                ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            }
            priority={priority}
            quality={95}
            onLoad={handleLoad}
            onError={() => {
              setLoading(false);
              setHasError(true);
            }}
          />

          {/* Enhanced Loading overlay for masonry */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl sm:rounded-3xl flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
