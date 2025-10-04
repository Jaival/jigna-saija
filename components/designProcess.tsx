'use client';
import { motion } from 'motion/react';
import { useRef } from 'react';

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

const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    rotateY: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 120,
      duration: 0.5,
    },
  },
};

const stepIndicatorVariants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 180,
    },
  },
};

// Enhanced ProcessCard component
const ProcessCard = ({
  step,
  title,
  description,
  height = 'min-h-48',
  isLarge = false,
}: {
  step: number;
  title: string;
  description: string;
  height?: string;
  isLarge?: boolean;
}) => {
  const scrollRef = useRef(null);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.01,
        y: -4,
        rotateY: 1,
        boxShadow: '0 15px 30px rgba(164, 14, 76, 0.3)',
      }}
      className={`relative group mb-4 ${height} rounded-2xl card p-6 md:p-8 overflow-hidden`}
      style={{ perspective: 1000 }}
    >
      {/* Animated background pattern with modern colors */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(29, 103, 147, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(164, 14, 76, 0.06) 0%, transparent 60%)
          `,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Enhanced step indicator with modern colors */}
      <motion.div
        variants={stepIndicatorVariants}
        className="absolute top-4 right-4 flex items-center justify-center"
      >
        <motion.div
          className={`relative ${isLarge ? 'w-12 h-12' : 'w-10 h-10'} rounded-full flex items-center justify-center backdrop-blur-sm`}
          style={{
            background:
              'linear-gradient(135deg, rgba(246, 246, 241, 0.25), rgba(246, 246, 241, 0.15))',
            border: '1px solid rgba(246, 246, 241, 0.3)',
          }}
          whileHover={{ scale: 1.05, rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className={`font-bold text-white ${isLarge ? 'text-lg' : 'text-sm'}`}
            animate={{
              textShadow: [
                '0 0 0px rgba(255,255,255,0)',
                '0 0 6px rgba(255,255,255,0.3)',
                '0 0 0px rgba(255,255,255,0)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {step}
          </motion.span>

          {/* Animated ring around step number */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(246, 246, 241, 0.3)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>

      {/* Card content */}
      <motion.div className="relative z-10">
        <motion.h3
          className={`pt-1 pb-4 mb-3 font-bold tracking-tight text-white relative z-10 ${isLarge ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}
          initial={{ x: -15, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {title}

          {/* Animated underline with modern color */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(246, 246, 241, 0.8), transparent)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: '60%' }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.h3>

        <motion.p
          className={`relative z-10 leading-relaxed ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}
          style={{ color: '#f6f6f1' }}
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Decorative corner elements with modern colors */}
      <motion.div
        className="absolute bottom-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-100"
        style={{
          borderLeft: '2px solid rgba(29, 103, 147, 0.4)',
          borderBottom: '2px solid rgba(29, 103, 147, 0.4)',
        }}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      />
      <motion.div
        className="absolute top-4 left-4 w-6 h-6 opacity-0 group-hover:opacity-100"
        style={{
          borderTop: '2px solid rgba(164, 14, 76, 0.4)',
          borderLeft: '2px solid rgba(164, 14, 76, 0.4)',
        }}
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ delay: 0.15 }}
      />
    </motion.div>
  );
};

// Connecting line component for visual flow with modern colors
const ConnectingLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="hidden md:flex items-center justify-center my-4"
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay * 0.1, duration: 0.6 }}
  >
    <motion.div
      className="flex items-center space-x-2"
      animate={{ x: [0, 3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: 'linear-gradient(135deg, #a40e4c, #bc1058)' }}
      />
      <motion.div
        className="w-8 h-0.5"
        style={{ background: 'linear-gradient(90deg, #a40e4c, #1d6793)' }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: 'linear-gradient(135deg, #1d6793, #2278aa)' }}
      />
    </motion.div>
  </motion.div>
);

export default function DesignProcessComponent() {
  // Enhanced process steps data
  const processSteps = [
    {
      title: 'Layout Options',
      description:
        'We create multiple format alternatives using deep understanding of client requirements, needs, and aesthetic preferences to establish the perfect foundation.',
      height: 'min-h-72',
      isLarge: true,
    },
    {
      title: 'Concepts',
      description:
        'Considering customer preferences, we develop several innovative design concepts for you to choose from.',
      height: 'min-h-40',
    },
    {
      title: '3D Views',
      description:
        'After concept confirmation, we create detailed 3D visualizations to bring your vision to life.',
      height: 'min-h-40',
    },
    {
      title: 'Bill of Quality',
      description:
        'Based on material selection, we provide transparent, detailed cost estimates for complete clarity.',
      height: 'min-h-40',
    },
    {
      title: 'Material Selection',
      description:
        'According to your budget, we offer carefully curated material options and combinations.',
      height: 'min-h-40',
    },
  ];

  return (
    <section
      id="design-process"
      aria-labelledby="design-process-title"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Background decorative elements with modern colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-6"
          style={{
            background:
              'radial-gradient(circle, rgba(29, 103, 147, 0.06), rgba(52, 211, 153, 0.03))',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-4"
          style={{
            background:
              'radial-gradient(circle, rgba(164, 14, 76, 0.04), rgba(251, 146, 60, 0.02))',
          }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container px-4 md:px-0 mx-auto relative z-10">
        {/* Enhanced section title */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            id="design-process-title"
            className="font-bold text-3xl md:text-5xl mb-4 text-gray-300"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Our Design Process
          </motion.h2>

          <motion.div
            className="mx-auto w-24 h-1 rounded-full mb-6 divider-brand"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-500"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            A systematic approach to transforming your vision into reality,
            ensuring every detail is carefully planned and executed.
          </motion.p>
        </motion.div>

        {/* Enhanced grid layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* First column - large card */}
          <div className="md:col-span-1">
            <ProcessCard
              step={1}
              title={processSteps[0]!.title}
              description={processSteps[0]!.description}
              height={processSteps[0]!.height}
              isLarge={processSteps[0]!.isLarge}
            />
          </div>

          {/* Second column - two cards with connecting flow */}
          <div className="md:col-span-1">
            <ProcessCard
              step={2}
              title={processSteps[1]!.title}
              description={processSteps[1]!.description}
              height={processSteps[1]!.height}
            />
            <ConnectingLine delay={5} />
            <ProcessCard
              step={3}
              title={processSteps[2]!.title}
              description={processSteps[2]!.description}
              height={processSteps[2]!.height}
            />
          </div>

          {/* Third column - two cards with connecting flow */}
          <div className="md:col-span-1">
            <ProcessCard
              step={4}
              title={processSteps[3]!.title}
              description={processSteps[3]!.description}
              height={processSteps[3]!.height}
            />
            <ConnectingLine delay={8} />
            <ProcessCard
              step={5}
              title={processSteps[4]!.title}
              description={processSteps[4]!.description}
              height={processSteps[4]!.height}
            />
          </div>
        </motion.div>

        {/* Process flow indicator with modern colors */}
        <motion.div
          className="flex justify-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            className="flex items-center space-x-4 px-6 py-3 rounded-full backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(135deg, rgba(29, 103, 147, 0.08), rgba(164, 14, 76, 0.08))',
              border: '1px solid rgba(246, 246, 241, 0.2)',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #1d6793, #2278aa)',
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-gray-400">
              From Concept to Completion
            </span>
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #a40e4c, #fb923c)',
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
