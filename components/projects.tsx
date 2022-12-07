import Image from "next/image";
import Link from "next/link";
import userData from "../data/data";

export default function ProjectsComponent() {
  return (
    <section className="">
      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto ">
        < h1 className="text-xl md:text-4xl font-bold py-10 text-left">
          Interior Projects
        </ h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          {userData.projects.interiorProjects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              title={proj.title}
              year={proj.year}
              imgUrl={proj.imgUrl}
              redirectLink={proj.link}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Architecture Projects*/}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-4xl font-bold py-10 text-left">
          Architecture Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          {userData.projects.architectureProjects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              title={proj.title}
              year={proj.year}
              imgUrl={proj.imgUrl}
              redirectLink={proj.link}
              number={`${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Image url redirects to that particular project
const ProjectCard = ({
  title,
  year,
  number,
  imgUrl,
  redirectLink
}: { title: string, year: number, number: string, imgUrl: string, redirectLink: string }) => {
  return (
    <Link href={redirectLink} className="w-full block shadow-2xl">
      <div className="relative overflow-hidden rounded-xl">
        <div className="h-72 object-cover">
          <Image
            src={imgUrl}
            fill={true}
            alt="portfolio"
            className="h-full w-full transform hover:scale-110 transition duration-500 ease-in-out object-cover"
          />
        </div>
        <h1 className="absolute top-10 left-10 text-white font-bold text-xl bg-earth-yellow rounded-md px-2">
          {title}
        </h1>
        <h1 className="absolute bottom-10 left-10 text-white font-bold text-xl">
          {number.length === 1 ? "0" + number : number}
        </h1>
        <h1 className="absolute bottom-10 right-10 text-white font-bold text-xl">
          {year}
        </h1>
      </div>
    </Link>
  );
};