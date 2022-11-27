import Image from "next/image";
import { useState } from 'react';
import projectData from "../data/projects";

export default function GalleryComponent() {
  return (
    <section className="bg-silver dark:bg-blue-dark">

      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto ">
        <h1 className="text-2xl md:text-5xl font-bold py-10 text-center md:text-left">
          Interior Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 py-2">
          {projectData.projects.interiorProjects.map((proj, idx) => (
            <ImageGallery
              key={idx}
              title={proj.title}
              imageUrls={proj.imgUrls} />
          ))}
        </div>
      </div>
      {/* Architecture Projects*/}
      <div className="max-w-6xl mx-auto">
        <h1 className=" text-2xl md:text-5xl font-bold py-10 text-center md:text-left">
          Architecture Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 py-2">
          {projectData.projects.architectureProjects.map((proj, idx) => (
            <ImageGallery
              key={idx}
              title={proj.title}
              imageUrls={proj.imgUrls} />
          ))}
        </div>
      </div>

    </section>
  );
}
const imagePerRow = 6;
// TODO: Image url for thr project card
const ImageGallery = ({ title, imageUrls }: { title: string, imageUrls: any }) => {
  const [next, setNext] = useState(imagePerRow);
  const handleMoreImage = () => {
    setNext(next + imagePerRow);
  };
  return (
    <div className="bg-gray dark:bg-black-light w-full">
      <h1 className="text-center text-gray-50 font-bold text-3xl bg-red-500 rounded-lg p-3">
        {title}
      </h1>
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
      </div>
    </div >
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