import ImageGallery from '@/components/gallery/ImageGallery';
import projectData from '@/data/projects';

export default async function Gallery({
  params,
}: {
  params: Promise<{ project: string; id: string }>;
}) {
  const { project, id } = await params;
  let imageUrls: any = [];
  if (project === 'interiorProjects') {
    const data = projectData.projects.interiorProjects;
    imageUrls = data.filter((proj) => proj.id === id);
  } else if (project === 'architectureProjects') {
    const data = projectData.projects.architectureProjects;
    imageUrls = data.filter((proj) => proj.id === id);
  }
  return (
    <section className="py-32">
      <div className="block">
        <div className="grid max-w-6xl grid-cols-1 gap-8 py-2 mx-auto md:grid-cols-1">
          {imageUrls.map((proj: any, idx: any) => (
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
