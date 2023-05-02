import Image from 'next/image';
import Link from 'next/link';
import userData from '../data/data';

export default function ProjectsComponent() {
  return (
    <section className="">
      {/* Interior Projects*/}
      <div className="max-w-6xl mx-auto">
        < h1 className="py-2 text-xl font-bold text-left md:text-4xl">
          Interior Projects
        </ h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-2">
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
        <h1 className="py-10 text-xl font-bold text-left md:text-4xl">
          Architecture Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-2">
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
    <Link href={redirectLink} className="block w-full shadow-2xl">
      <div className="relative overflow-hidden rounded-xl">
        <div className="object-cover h-72">
          <Image
            src={imgUrl}
            fill={true}
            alt="portfolio"
            className="object-cover w-full h-full transition duration-500 ease-in-out transform hover:scale-110"
          />
        </div>
        <h1 className="absolute px-2 text-xl font-bold text-white rounded-md top-10 left-10 bg-white-hover">
          {title}
        </h1>
        <h1 className="absolute text-xl font-bold text-white bottom-10 left-10">
          {number.length === 1 ? '0' + number : number}
        </h1>
        <h1 className="absolute text-xl font-bold text-white bottom-10 right-10">
          {year}
        </h1>
      </div>
    </Link>
  );
};