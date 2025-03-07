import userData from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsComponent() {
  return (
    <section className="flex flex-col">
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
      <div className="max-w-6xl mx-auto">
        <h1
          className={`text-xl font-bold text-left md:text-4xl ${title.includes('Architecture') ? 'py-10' : 'py-2'}`}
        >
          {title}
        </h1>
      </div>
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-8 py-2 md:grid-cols-2">
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
        <div className="relative h-72 w-full">
          <Image
            src={imgUrl}
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            alt={`${title} project thumbnail`}
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
