'use client';
import { motion } from 'motion/react';
import AboutMeComponent from '@/components/aboutMe';
import DesignProcessComponent from '@/components/designProcess';
import Hero from '@/components/hero';
import React from 'react';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Home',
//   description:
//     'Jigna Saija - Professional architect and interior designer specializing in modern and sustainable design solutions.',
// };
// Decorative floating elements component with modern colors
const FloatingElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Floating geometric shapes using modern color palette */}
    <motion.div
      className="absolute top-20 left-10 w-6 h-6 rounded-full opacity-15 bg-gradient-brand"
      animate={{
        y: [0, -20, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    <motion.div
      className="absolute top-1/3 right-20 w-4 h-4 rounded-square opacity-15 bg-gradient-brand"
      animate={{
        y: [0, 15, 0],
        rotate: [0, -180, -360],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 3,
      }}
    />
    <motion.div
      className="absolute bottom-1/4 left-1/4 w-8 h-8 border-2 rounded-full opacity-10"
      style={{ borderColor: 'var(--color-gold)' }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 6,
      }}
    />
  </div>
);

// Section wrapper with smoother transitions
const SectionWrapper = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{
      duration: 0.6,
      delay: delay * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient overlay using modern color palette */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at 20% 50%, rgba(29, 103, 147, 0.04) 0%, transparent 60%),
          radial-gradient(circle at 80% 20%, rgba(164, 14, 76, 0.03) 0%, transparent 60%),
          radial-gradient(circle at 40% 80%, rgba(251, 146, 60, 0.02) 0%, transparent 60%)`,
        }}
      />

      {/* Floating decorative elements */}
      <FloatingElements />

      {/* Main content with enhanced spacing */}
      <main className="relative z-10">
        {/* Hero Section */}
        <SectionWrapper>
          <Hero />
        </SectionWrapper>

        {/* Section divider with modern gradient colors */}
        <motion.div
          className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* About Me Section */}
        <SectionWrapper delay={1}>
          <AboutMeComponent />
        </SectionWrapper>

        {/* Section divider */}
        <motion.div
          className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Design Process Section */}
        <SectionWrapper delay={2}>
          <DesignProcessComponent />
        </SectionWrapper>

        {/* Bottom spacer */}
        <div className="h-16 md:h-24" />
      </main>
    </div>
  );
}
