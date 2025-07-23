'use client';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  MotionValue,
} from 'motion/react';
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 100,
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 120,
      delay: 0.1,
    },
  },
};

export default function AboutMeComponent() {
  const experience = [
    {
      value: 20,
      suffix: '',
      description: 'Years of Experience',
      color: 'linear-gradient(135deg, #1d6793, #2278aa)',
    },
    {
      value: 40,
      suffix: '+',
      description: 'Projects Completed',
      color: 'linear-gradient(135deg, #a40e4c, #bc1058)',
    },
    {
      value: 15,
      suffix: '+',
      description: 'Happy Clients',
      color: 'linear-gradient(135deg, #fb923c, #1d6793)',
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
        <motion.div
          className="absolute top-1/4 -left-20 w-40 h-40 rounded-full blur-3xl opacity-8"
          style={{
            background:
              'radial-gradient(circle, rgba(29, 103, 147, 0.08), rgba(52, 211, 153, 0.04))',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full blur-3xl opacity-6"
          style={{
            background:
              'radial-gradient(circle, rgba(164, 14, 76, 0.06), rgba(251, 146, 60, 0.03))',
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
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
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold md:text-5xl text-gray-300"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="mt-4 mx-auto w-24 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #1d6793, #a40e4c)',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
              <motion.div
                className="absolute -top-6 -left-6 w-12 h-12 rounded-full opacity-15"
                style={{
                  background: 'linear-gradient(135deg, #1d6793, #34d399)',
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-8 h-8 rounded-square opacity-20"
                style={{
                  background: 'linear-gradient(135deg, #a40e4c, #fb923c)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -90, -180],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 3,
                }}
              />

              {/* Main image with enhanced hover effects */}
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                whileHover={{
                  scale: 1.01,
                  rotateY: 2,
                  rotateX: 2,
                }}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  className="rounded-2xl aspect-auto w-full h-auto"
                  alt="Jigna Saija - Interior Designer"
                  width={3248}
                  height={4062.1}
                  src={'/images/jignasaija.jpg'}
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
                    'linear-gradient(90deg, transparent, rgba(29, 103, 147, 0.04), transparent)',
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.blockquote
                className="font-light italic text-base md:text-lg relative z-10 leading-relaxed text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                I believe in creating spaces that blend beauty with
                functionality, where design speaks to both the heart and mind.
              </motion.blockquote>
              <motion.p
                className="text-sm font-medium mt-3 md:text-base relative z-10 text-blue-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
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
              className="text-lg leading-relaxed tracking-wide md:text-xl lg:text-2xl mb-8 text-gray-400"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              With more than{' '}
              <motion.span
                className="font-semibold px-2 py-1 rounded-md text-blue-600 bg-blue-50"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: '#dbeafe',
                }}
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
              className="text-base leading-relaxed md:text-lg mb-8 text-gray-400"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              My approach combines{' '}
              <motion.span
                className="font-medium text-purple-600"
                whileHover={{ scale: 1.02 }}
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
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow: '0 20px 40px rgba(164, 14, 76, 0.25)',
                }}
                className="relative group card p-6 md:p-8 overflow-hidden"
                key={index}
                custom={index}
              >
                {/* Enhanced background gradient with modern colors */}
                <motion.div
                  className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity duration-300"
                  style={{
                    background: item.color,
                  }}
                  initial={{ scale: 0, rotate: 45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.05 + 0.3, duration: 0.6 }}
                />

                {/* Floating icon */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(246, 246, 241, 0.25)' }}
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.03 + 0.4,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#f6f6f1' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                </motion.div>

                {/* Animated counter */}
                <motion.h5
                  className="mb-2 md:mb-3 font-bold tracking-tight text-white text-3xl md:text-4xl relative z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: index * 0.05 + 0.4,
                    type: 'spring',
                    stiffness: 150,
                  }}
                >
                  <motion.span>
                    <AnimatedNumber motionValue={value} />
                  </motion.span>
                  {item.suffix}
                </motion.h5>

                <motion.p
                  className="text-sm md:text-base font-normal relative z-10 leading-relaxed"
                  style={{ color: '#f6f6f1' }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.5 }}
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
