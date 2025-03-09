import userData from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsComponent() {
  return (
    <section className="flex flex-col px-4 sm:px-6 md:px-8">
      {/* Interior Projects */}
      <ProjectSection
        title="Interior Projects"
        projects={userData.projects.interiorProjects}
      />

      {/* Architecture Projects */}
      <ProjectSection
        title="Architecture Projects"
        projects={userData.projects.architectureProjects}
      />
    </section>
  );
}

// Component to render a section of projects
const ProjectSection = ({
  title,
  projects,
}: {
  title: string;
  projects: Array<{
    title: string;
    year: number;
    imgUrl: string;
    link: string;
  }>;
}) => {
  return (
    <>
      <div className="w-full mx-auto">
        <h1
          className={`text-2xl font-bold text-left md:text-4xl ${
            title.includes('Architecture') ? 'pt-8 pb-4 md:py-10' : 'py-4 md:py-2'
          }`}
        >
          {title}
        </h1>
      </div>
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 gap-6 py-2 sm:gap-8 md:grid-cols-3">
          {projects.map((proj, idx) => (
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
    </>
  );
};

const ProjectCard = ({
  title,
  year,
  number,
  imgUrl,
  redirectLink,
}: {
  title: string;
  year: number;
  number: string;
  imgUrl: string;
  redirectLink: string;
}) => {
  return (
    <Link href={redirectLink} className="block w-full shadow-2xl">
      <div className="relative overflow-hidden rounded-xl">
        <div className="relative w-full h-56 sm:h-64 md:h-72">
          <Image
            src={imgUrl}
            fill={true}
            sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, 50vw"
            quality={90}
            alt={`${title} project thumbnail`}
            className="object-cover w-full h-full transition duration-500 ease-in-out transform hover:scale-110"
            priority={number === "1"}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
        <h1 className="absolute px-3 py-1 text-base font-bold text-white rounded-md top-4 left-4 sm:top-10 sm:left-10 sm:text-xl bg-black/50">
          {title}
        </h1>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 py-3 sm:px-10 sm:py-4">
          <h1 className="text-base font-bold text-white sm:text-xl">
            {number.length === 1 ? '0' + number : number}
          </h1>
          <h1 className="text-base font-bold text-white sm:text-xl">
            {year}
          </h1>
        </div>
      </div>
    </Link>
  );
};
