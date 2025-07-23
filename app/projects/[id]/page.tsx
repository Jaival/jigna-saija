import projectData from '@/data/projects';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProjectPageClient } from './ProjectPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

// Generate metadata for better SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projectData.projects.find((proj) => proj.id === id);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Jigna Saija`,
    description: `View the ${project.title} project by Jigna Saija - Professional architecture and interior design work from ${project.year}.`,
    openGraph: {
      title: `${project.title} | Jigna Saija`,
      description: `View the ${project.title} project by Jigna Saija`,
      images: project.imgUrls.slice(0, 3).map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: `${project.title} project image`,
      })),
    },
  };
}

// Generate static paths for better performance
export async function generateStaticParams() {
  return projectData.projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projectData.projects.find((proj) => proj.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}
