import { PageTransition } from '@/components/PageTransition';
import ContactMeComponent from '@/components/contactMe';
import type { Metadata } from 'next';
import { sharedOpenGraph } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Jigna Saija to discuss an interior design or architecture project.',
  openGraph: {
    ...sharedOpenGraph,
    url: '/contact-me',
    title: 'Contact | Jigna Saija',
    description:
      'Get in touch with Jigna Saija to discuss an interior design or architecture project.',
  },
};

export default function ContactMe() {
  return (
    <PageTransition>
      <ContactMeComponent />
    </PageTransition>
  );
}
