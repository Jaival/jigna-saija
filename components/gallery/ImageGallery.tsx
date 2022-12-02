import Image from "next/image";
import { useState } from "react";

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
            <div className="bg-gray dark:bg-black-light">
                <div className="flex flex-row justify-between">
                    <div className="w-5/6">
                        <h1 className="text-center text-gray-50 font-bold text-l md:text-3xl bg-red-500 rounded-lg p-3">
                            {title}
                        </h1>
                    </div>
                    <div className="flex justify-center items-center">
                        {showCurrent ?
                            <button className="bg-blue-500 p-2 md:p-4 rounded-full" onClick={() => toggleCurrent()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                            </button> :
                            <button className="bg-blue-500  p-2 md:p-4 rounded-full" onClick={() => setCurrent(id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>}
                    </div>
                </div>
                {showCurrent ?
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                        {imageUrls.slice(0, next).map((imageUrl: string, idx: number) => (
                            <div className="relative overflow-hidden rounded-xl" key={idx}>
                                <div className="h-72 object-cover">
                                    <BlurImage image={imageUrl} key={idx} />
                                </div>
                            </div>
                        ))}
                        <div className="hidden md:block"></div>
                        {next < imageUrls?.length && (
                            <button
                                className="my-3 bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-4 rounded"
                                onClick={handleMoreImage}
                            >
                                Load more
                            </button>
                        )}
                    </div> : null}
            </div >


        </div>
    );
};

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function BlurImage({ image }: { image: string }) {
    const [isLoading, setLoading] = useState(true)

    return (
        <div className="group">
            <div className="h-full w-full overflow-hidden rounded-lg bg-gray-200 object-cover">
                <Image
                    loading="lazy"
                    alt=""
                    src={image}
                    fill={true}
                    className={cn(
                        'duration-700 ease-in-out group-hover:opacity-75',
                        isLoading
                            ? 'scale-110 blur-2xl grayscale'
                            : 'scale-100 blur-0 grayscale-0'
                    )}
                    onLoadingComplete={() => setLoading(false)}
                />
            </div>
        </div>
    )
}