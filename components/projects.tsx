import Image from "next/image";
import userData from "../data/data";

export default function ProjectsComponent() {
  return (
    <section className="bg-silver dark:bg-blue-dark">
      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto ">
        <h1 className="text-2xl md:text-7xl font-bold py-10 text-center md:text-left">
          Interior Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          {userData.projects.interiorProjects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              title={proj.title}
              year={proj.year}
              imgUrl={proj.imgUrl}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Architecture Projects*/}
      <div className="max-w-6xl mx-auto">
        <h1 className=" text-2xl md:text-7xl font-bold py-10 text-center md:text-left">
          Architecture Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-gray dark:bg-black-light">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          {userData.projects.architectureProjects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              title={proj.title}
              year={proj.year}
              imgUrl={proj.imgUrl}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Image url for thr project card
const ProjectCard = ({ title, year, number, imgUrl }: { title: string, year: number, number: string, imgUrl: string }) => {
  return (
    // <a href={link} className="w-full block shadow-2xl">
    <div className="relative overflow-hidden rounded-xl">
      <div className="h-72 object-cover">
        <Image
          src={imgUrl}
          fill={true}
          alt="portfolio"
          className="h-full w-full transform hover:scale-125 transition duration-2000 ease-out object-cover"
        />
      </div>
      <h1 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
        {title}
      </h1>
      <h1 className="absolute bottom-10 left-10 text-gray-50 font-bold text-xl">
        {number.length === 1 ? "0" + number : number}
      </h1>
      <h1 className="absolute bottom-10 right-10 text-gray-50 font-bold text-xl">
        {year}
      </h1>
    </div>
    // </a>
  );
};