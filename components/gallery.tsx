import projectData from "../data/projects";
import ImageGallery from "./gallery/ImageGallery";

export default function GalleryComponent() {

  return (
    <section className="bg-silver dark:bg-blue-dark">

      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto ">
        <h1 className="text-2xl md:text-5xl font-bold py-10 text-center md:text-left">
          Interior Gallery
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 py-2">
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
        <h1 className=" text-2xl md:text-5xl font-bold py-10 text-center md:text-left">
          Architecture Gallery
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 py-2">
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

