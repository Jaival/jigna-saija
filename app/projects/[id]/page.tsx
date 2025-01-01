import ImageGallery from '@/components/gallery/ImageGallery';
import projectData from '@/data/projects';
import Link from 'next/link';

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = projectData.projects;
  let imageUrls: any = data.filter((proj) => proj.id === id);
  // console.log(imageUrls.length);
  if (imageUrls.length === 0) {
    imageUrls = null;
  }
  // if (project === 'interiorProjects') {
  //   const data = projectData.projects.interiorProjects;
  //   imageUrls = data.filter((proj) => proj.id === id);
  // } else if (project === 'architectureProjects') {
  //   const data = projectData.projects.architectureProjects;
  //   imageUrls = data.filter((proj) => proj.id === id);
  // } else if (project !== 'interiorProjects' && 'architectureProjects') {
  //   imageUrls = null;
  // }

  return (
    <section className="py-32">
      <div className="block">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-1">
          {!imageUrls ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-2xl">
                The project you are trying to open is not available.
              </h2>
              <h3 className="text-2xl">
                Please go back to the{' '}
                <Link href="/projects" className="text-dogwood-rose">
                  projects page
                </Link>
                .
              </h3>
            </div>
          ) : (
            imageUrls.map((proj: any, idx: any) => (
              <ImageGallery
                key={idx}
                id={idx}
                title={proj.title}
                imageUrls={proj.imgUrls}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
