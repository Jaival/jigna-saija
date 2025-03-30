'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

type ImageGalleryProps = {
  id: number;
  title: string;
  imageUrls: string[];
};

export default function ImageGallery({ id, title, imageUrls }: ImageGalleryProps) {
  return (
    <div className="block px-4 sm:px-6 md:px-0">
      <div className="flex flex-row justify-between">
        <div className="w-full">
          <h1 className="p-2 sm:p-3 font-bold text-center text-white rounded-lg text-xl md:text-3xl bg-amaranth-purple">
            {title}
          </h1>
        </div>
      </div>
      <div className="grid max-w-6xl grid-cols-1 gap-4 sm:gap-6 md:gap-8 py-3 sm:py-4 mx-auto md:grid-cols-3">
        {imageUrls.map((imageUrl: string, idx: number) => (
          <div 
            className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 active:scale-98 touch-manipulation" 
            key={`${id}-${idx}`}
          >
            <div className="aspect-square sm:aspect-auto sm:h-72">
              <BlurImage image={imageUrl} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type BlurImageProps = {
  image: string;
};

function BlurImage({ image }: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="group">
      <Image
        loading="lazy"
        alt="Gallery image"
        src={image}
        fill={true}
        sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 33vw"
        className={cn(
          'h-full w-full object-cover duration-700 ease-in-out group-hover:opacity-75',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0',
        )}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
