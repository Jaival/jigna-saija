'use client';
import AboutMeComponent from '@/components/aboutMe';
import DesignProcessComponent from '@/components/designProcess';
import Hero from '@/components/hero';

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutMeComponent />
      <DesignProcessComponent />
    </div>
  );
}
