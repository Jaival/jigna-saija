import AboutMeComponent from '@/components/aboutMe';
import DesignProcessComponent from '@/components/designProcess';
import Hero from '@/components/hero';
import { PageTransition } from '@/components/PageTransition';
import { SectionWrapper, SectionDivider } from '@/components/SectionWrapper';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  // The root layout's title.template only applies to child segments, and this
  // page shares the root segment, so the suffix is written out here.
  title: { absolute: 'Home | Jigna Saija' },
  description:
    'Jigna Saija - Professional architect and interior designer specializing in modern and sustainable design solutions.',
};

export default function Home() {
  return (
    <PageTransition>
      <div className="relative min-h-svh overflow-hidden">
        {/* Background gradient wash */}
        <div
          className="fixed inset-0 pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(circle at 20% 50%, rgba(29, 103, 147, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(164, 14, 76, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 40% 80%, rgba(251, 146, 60, 0.02) 0%, transparent 60%)`,
          }}
        />

        <main className="relative z-10">
          <SectionWrapper>
            <Hero />
          </SectionWrapper>

          <SectionDivider />

          <SectionWrapper>
            <AboutMeComponent />
          </SectionWrapper>

          <SectionDivider />

          <SectionWrapper>
            <DesignProcessComponent />
          </SectionWrapper>

          <div className="h-16 md:h-24" />
        </main>
      </div>
    </PageTransition>
  );
}
