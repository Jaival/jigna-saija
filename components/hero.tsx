'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

// Move data outside component to prevent recreation on each render
const WHY_CHOOSE_ME = {
  'Design Approach': {
    description:
      'We hear the customer, we set the customers and their requirements in the heart of our design.',
  },
  Transparency: {
    description:
      'We provide complete transparency on all matters. Our BOGs (bill of quality) & bring clarity in each step/material we select and order',
  },
  Trust: {
    description:
      'We work to build trust. Our work & transparency speaks it all.',
  },
  Quality: {
    description:
      'The design approach helps us offer well-planned, beautifully detailed long-lasting & high-satisfactory products.',
  },
  'Fast & Hassle Free': {
    description:
      'We handle the project from start to end. Clients need not co-ordinate when with team & contractors. We will manage all when the total responsibility has been given.',
  },
};

// Enhanced animation configurations with smoother timing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
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
      stiffness: 120,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 150,
    },
  },
};

// Floating background elements with modern colors
const FloatingBgElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute top-1/4 left-10 w-32 h-32 rounded-full blur-xl opacity-15"
      style={{
        background:
          'radial-gradient(circle, rgba(29, 103, 147, 0.12), rgba(34, 120, 170, 0.06))',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    <motion.div
      className="absolute bottom-1/3 right-20 w-24 h-24 rounded-full blur-xl opacity-12"
      style={{
        background:
          'radial-gradient(circle, rgba(164, 14, 76, 0.12), rgba(251, 146, 60, 0.06))',
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.12, 0.22, 0.12],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 4,
      }}
    />
  </div>
);

export default function Hero() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={scrollRef}
      className="relative flex flex-col justify-center items-center mt-5 md:mt-10 px-4 md:px-6 overflow-hidden"
    >
      <FloatingBgElements />

      {/* Main Hero Content */}
      <motion.div
        className="flex flex-col md:flex-row gap-8 md:gap-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y, opacity }}
      >
        {/* Text Content */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6 md:gap-8 justify-center items-center md:items-start md:m-8 max-w-2xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-6xl font-bold leading-tight"
            style={{
              background:
                'linear-gradient(135deg, #1d6793 0%, #a40e4c 50%, #fb923c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            whileHover={{
              scale: 1.01,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            Building the future, one project at a time.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-center md:text-left leading-relaxed text-gray-500"
          >
            Turning your{' '}
            <motion.span
              className="font-semibold text-blue-600"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              big ideas
            </motion.span>{' '}
            into impressive reality.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-4 md:mt-6">
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(29, 103, 147, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative overflow-hidden rounded-xl"
            >
              <Link
                href="/projects"
                className="relative block px-8 py-4 font-bold text-lg text-center text-white rounded-xl transition-all duration-300 w-full md:w-auto"
                style={{
                  background:
                    'linear-gradient(135deg, #1d6793 0%, #2278aa 100%)',
                }}
              >
                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  See Projects
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          variants={itemVariants}
          className="relative md:flex md:flex-col"
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent z-10 rounded-2xl opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Image
              className="rounded-2xl w-full shadow-2xl"
              alt="Modern architectural design showcase"
              priority={true}
              width={1100}
              height={1100}
              sizes="(max-width: 768px) 100vw, 1100px"
              style={{ objectFit: 'cover' }}
              src={
                '/images/architecture_projects/project_pic_1/project_pic_2.jpg'
              }
            />
          </motion.div>

          {/* Floating badge with modern colors */}
          <motion.div
            className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl"
            style={{ border: '2px solid #f6f6f1' }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="text-xs text-gray-500">Years</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Why Choose Me Section */}
      <motion.div
        className="flex flex-col mt-16 md:mt-24 justify-center items-center w-full max-w-7xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="mb-12 md:mb-16 text-center"
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
            Why Choose Me?
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

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-flow-col md:grid-rows-3 lg:grid-rows-2 md:gap-8 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {Object.entries(WHY_CHOOSE_ME).map(([key, value], index) => (
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: '0 20px 40px rgba(164, 14, 76, 0.25)',
              }}
              className="relative group card p-6 md:p-8 overflow-hidden"
              key={key}
              custom={index}
            >
              {/* Enhanced background gradient with modern colors */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(29, 103, 147, 0.12), rgba(164, 14, 76, 0.12))',
                }}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Card number indicator */}
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: 'rgba(246, 246, 241, 0.25)' }}
                initial={{ rotate: -90, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.3 }}
              >
                {index + 1}
              </motion.div>

              <motion.h3
                className="mb-3 font-bold tracking-tight text-white text-xl md:text-2xl relative z-10"
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                {key}
              </motion.h3>
              <motion.p
                className="text-base md:text-lg relative z-10 leading-relaxed"
                style={{ color: '#f6f6f1' }}
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.25 }}
              >
                {value.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
