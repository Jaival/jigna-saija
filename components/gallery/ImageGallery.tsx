import Image from 'next/image';
import { useState } from 'react';

export default function ImageGallery({ id, title, imageUrls }: { id: number, title: string, imageUrls: any, }) {
  const imagePerRow = 6;
  const [next, setNext] = useState(imagePerRow);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCurrent, setShowCurrent] = useState(false);

  const handleMoreImage = () => {
    setNext(next + imagePerRow);
  };

  const toggleCurrent = () => {
    setShowCurrent(false);
    setNext(imagePerRow);
  };

  const setCurrent = (index: number) => {
    setCurrentIdx(index);
    setShowCurrent(true);
  };
  return (
    <div>
      <div className="">
        <div className="flex flex-row justify-between">
          <div className="w-5/6">
            <h1
              className="p-3 font-bold text-center text-white rounded-lg text-l md:text-3xl bg-amaranth-purple">
              {title}
            </h1>
          </div>
          <div className="flex items-center justify-center">
            {showCurrent ?
              <button className="p-2 rounded-full bg-button-blue md:p-4" onClick={() => toggleCurrent()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 18.0001H9.33004C6.02005 18.0001 4.66005 15.6501 6.32005 12.7801L7.66004 10.4701L9.00005 8.16007C10.66 5.29007 13.37 5.29007 15.03 8.16007L16.37 10.4701L17.71 12.7801C19.37 15.6501 18.01 18.0001 14.7 18.0001H12Z"
                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                    strokeLinejoin="round" />
                </svg>
              </button> :
              <button className="p-2 rounded-full bg-button-blue md:p-4" onClick={() => setCurrent(id)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.0001 6H14.6701C17.9801 6 19.3401 8.35 17.6801 11.22L16.3401 13.53L15.0001 15.84C13.3401 18.71 10.6301 18.71 8.97005 15.84L7.63005 13.53L6.29005 11.22C4.66005 8.35 6.01005 6 9.33005 6H12.0001Z"
                    stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                    strokeLinejoin="round" />
                </svg>
              </button>}
          </div>
        </div>
        {showCurrent ?
          <div className="grid max-w-6xl grid-cols-1 gap-8 py-4 mx-auto md:grid-cols-3">
            {imageUrls.slice(0, next).map((imageUrl: string, idx: number) => (
              <div className="relative overflow-hidden rounded-xl" key={idx}>
                <div className="object-cover h-72">
                  <BlurImage image={imageUrl} key={idx} />
                </div>
              </div>
            ))}
            {next < imageUrls?.length && (
              <button
                className="px-4 py-2 my-3 text-lg font-bold text-white rounded bg-button-blue"
                onClick={handleMoreImage}
              >
                Load more
              </button>
            )}
          </div> : null}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function BlurImage({ image }: { image: string }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="group">
      <Image
        loading="lazy"
        alt=""
        src={image}
        fill={true}
        className={cn(
          'h-full w-full object-cover duration-700 ease-in-out group-hover:opacity-75',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
}