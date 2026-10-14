'use client';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  MotionValue, type Variants } from 'motion/react';
import { spring, enterTransition, STAGGER, useHasHover, enterVariants, duration } from '@/lib/motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Animated counter hook
function useAnimatedCounter(value: number, duration: number = 2000) {
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  return { ref, value: springValue };
}

// Component to display animated number
function AnimatedNumber({ motionValue }: { motionValue: MotionValue<number> }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    return motionValue.on('change', (latest: number) => {
      setValue(Math.round(latest));
    });
  }, [motionValue]);

  return <>{value}</>;
}

// Enhanced animation configurations with smoother timing
const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER },
  },
};

const itemVariants: Variants = enterVariants;

const imageVariants: Variants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { ...spring, delay: STAGGER },
  },
};

export default function AboutMeComponent() {
  const hasHover = useHasHover();
  const experience = [
    {
      value: 20,
      suffix: '',
      description: 'Years of Experience',
      color: 'linear-gradient(135deg, var(--color-pine), var(--color-pine-light))',
    },
    {
      value: 40,
      suffix: '+',
      description: 'Projects Completed',
      color: 'linear-gradient(135deg, var(--color-clay), var(--color-clay-deep))',
    },
    {
      value: 15,
      suffix: '+',
      description: 'Happy Clients',
      color: 'linear-gradient(135deg, var(--color-ochre), var(--color-pine))',
    },
  ];

  // Call hooks at the top level for each experience item
  const experienceCounters = [
    useAnimatedCounter(20, 1800),
    useAnimatedCounter(40, 1900),
    useAnimatedCounter(15, 2000),
  ];

  const scrollRef = useRef(null);

  return (
    <section
      id="about"
      className="relative flex flex-col px-4 py-16 md:px-0 md:py-24 md:justify-center md:items-center overflow-hidden"
    >
      {/* Background decorative elements with modern colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-20 w-40 h-40 rounded-full blur-3xl opacity-8"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-pine) 8%, transparent), color-mix(in oklab, var(--color-pine-tint) 4%, transparent))',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full blur-3xl opacity-6"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-clay) 6%, transparent), color-mix(in oklab, var(--color-ochre) 3%, transparent))',
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          className="mb-12 md:mb-20 text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duration.enter }}
        >
          <motion.h2
            className="text-3xl font-bold md:text-5xl text-foreground"
            whileHover={hasHover ? { scale: 1.01 } : undefined}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="mt-4 mx-auto w-24 h-1 rounded-full divider-brand"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: duration.enter, delay: STAGGER * 3 }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="flex flex-col items-center gap-12 md:gap-16 lg:flex-row"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Image Section */}
          <motion.div
            variants={imageVariants}
            className="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative"
          >
            <div className="relative group">
              {/* Floating decorative elements around image with modern colors */}
              <div
                className="absolute -top-6 -left-6 w-12 h-12 rounded-full opacity-15"
                style={{
                  background: 'linear-gradient(135deg, var(--color-pine), var(--color-pine-tint))',
                }}
              />
              <div
                className="absolute -bottom-4 -right-4 w-8 h-8 rounded-square opacity-20"
                style={{
                  background: 'linear-gradient(135deg, var(--color-clay), var(--color-ochre))',
                }}
              />

              {/* Main image with enhanced hover effects */}
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                whileHover={hasHover ? {
                  scale: 1.01,
                  rotateY: 2,
                  rotateX: 2,
                } : undefined}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <Image
                  className="rounded-2xl aspect-auto w-full h-auto"
                  alt="Jigna Saija - Professional architect and interior designer with over 20 years of experience"
                  width={3248}
                  height={4062.1}
                  src={'/images/jignasaija.jpg'}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGZpbHRlciBpZD0iYiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InJnYmEoMTU2LCAxNjMsIDE3NSwgMC4yKSIgZmlsdGVyPSJ1cmwoI2IpIi8+PC9zdmc+"
                  priority
                />
              </motion.div>
            </div>

            {/* Enhanced quote section */}
            <motion.div
              className="py-6 text-center relative"
              variants={itemVariants}
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-pine) 4%, transparent), transparent)',
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: STAGGER * 3 }}
              />
              <motion.blockquote
                className="font-light italic text-base md:text-lg relative z-10 leading-relaxed text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: STAGGER * 4 }}
              >
                I believe in creating spaces that blend beauty with
                functionality, where design speaks to both the heart and mind.
              </motion.blockquote>
              <motion.p
                className="text-sm font-medium mt-3 md:text-base relative z-10 text-primary"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: STAGGER * 5 }}
              >
                - Jigna Saija
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col w-full lg:ml-12"
          >
            <motion.p
              className="text-lg leading-relaxed md:text-xl lg:text-2xl mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 2, duration: duration.enter }}
            >
              With more than{' '}
              <motion.span
                className="font-semibold px-2 py-1 rounded-md text-brand-muted-foreground bg-brand-muted"
                whileHover={hasHover ? { scale: 1.02 } : undefined}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                fifteen years
              </motion.span>{' '}
              of experience designing both residential and commercial
              architectures and interiors, I gracefully oversee projects from
              concept to completion. As a versatile designer, I have an innate
              ability to conceive elegant and inspiring concepts and transform
              them into functional spaces that are both beautiful and practical.
            </motion.p>

            {/* Additional content for better flow */}
            <motion.p
              className="text-base leading-relaxed md:text-lg mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 3, duration: duration.enter }}
            >
              My approach combines{' '}
              <motion.span
                className="font-medium text-brand"
                whileHover={hasHover ? { scale: 1.02 } : undefined}
              >
                innovative design thinking
              </motion.span>{' '}
              with practical solutions, ensuring every project reflects the
              client&apos;s vision while maintaining the highest standards of
              quality and sustainability.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced Experience Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 md:mt-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {experience.map((item, index) => {
            const { ref, value } = experienceCounters[index]!;

            return (
              <motion.div
                ref={ref}
                variants={itemVariants}
                whileHover={hasHover ? {
                  scale: 1.02,
                  y: -5,
                  boxShadow: '0 20px 40px color-mix(in oklab, var(--color-clay) 25%, transparent)',
                } : undefined}
                className="relative group card p-6 md:p-8 overflow-hidden"
                key={index}
                custom={index}
              >
                {/* Enhanced background gradient with modern colors */}
                <motion.div
                  className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-150"
                  style={{
                    background: item.color,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...enterTransition, delay: index * STAGGER }}
                />

                {/* Floating icon */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'color-mix(in oklab, var(--color-foreground) 8%, transparent)' }}
                  initial={{ scale: 0.96, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: index * STAGGER }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                </motion.div>

                {/* Animated counter */}
                <motion.h5
                  className="mb-2 md:mb-3 font-bold tracking-tight text-foreground text-3xl md:text-4xl relative z-10"
                  initial={{ scale: 0.96, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: index * STAGGER }}
                >
                  <motion.span>
                    <AnimatedNumber motionValue={value} />
                  </motion.span>
                  {item.suffix}
                </motion.h5>

                <motion.p
                  className="text-sm md:text-base font-normal relative z-10 leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * STAGGER }}
                >
                  {item.description}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
