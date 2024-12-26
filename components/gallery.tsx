import projectData from '@/data/projects';
import ImageGallery from './gallery/ImageGallery';

export default function GalleryComponent() {
  return (
    <section className="flex">
      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto ">
        <h1 className="py-2 text-xl font-bold text-left md:text-4xl">
          Interior Gallery
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-1">
          {projectData.projects.interiorProjects.map((proj, idx) => (
            <ImageGallery
              key={idx}
              id={idx}
              title={proj.title}
              imageUrls={proj.imgUrls}
            />
          ))}
        </div>
      </div>
      {/* Architecture Projects*/}
      <div className="max-w-6xl mx-auto">
        <h1 className="py-10 text-xl font-bold text-left md:text-4xl">
          Architecture Gallery
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-1">
          {projectData.projects.architectureProjects.map((proj, idx) => (
            <ImageGallery
              key={idx}
              id={idx}
              title={proj.title}
              imageUrls={proj.imgUrls}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
