import { PageTransition } from '@/components/PageTransition';
import ProjectsComponent from '@/components/projects';
import type { Metadata } from 'next';
import { sharedOpenGraph } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Browse interior design and architecture projects by Jigna Saija — residences, offices, showrooms and more.',
  openGraph: {
    ...sharedOpenGraph,
    url: '/projects',
    title: 'Projects | Jigna Saija',
    description:
      'Browse interior design and architecture projects by Jigna Saija — residences, offices, showrooms and more.',
  },
};

export default function Projects() {
  return (
    <PageTransition>
      <ProjectsComponent />
    </PageTransition>
  );
}
