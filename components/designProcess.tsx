'use client';
import { motion, type Variants } from 'motion/react';
import { spring, useHasHover, STAGGER, duration } from '@/lib/motion';
import { useRef } from 'react';

// Enhanced animation configurations with smoother timing
const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
};

const stepIndicatorVariants: Variants = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: spring },
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
  const hasHover = useHasHover();
  const scrollRef = useRef(null);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={hasHover ? {
        scale: 1.01,
        y: -4,
        rotateY: 1,
        boxShadow: '0 15px 30px color-mix(in oklab, var(--color-clay) 30%, transparent)',
      } : undefined}
      className={`relative group mb-4 ${height} rounded-2xl card p-6 md:p-8 overflow-hidden`}
      style={{ perspective: 1000 }}
    >
      {/* Animated background pattern with modern colors */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-150"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-pine) 8%, transparent) 0%, transparent 60%),
            radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--color-clay) 6%, transparent) 0%, transparent 60%)
          `,
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
              'linear-gradient(135deg, color-mix(in oklab, var(--color-foreground) 8%, transparent), color-mix(in oklab, var(--color-foreground) 4%, transparent))',
            border: '1px solid color-mix(in oklab, var(--color-foreground) 15%, transparent)',
          }}
          whileHover={hasHover ? { scale: 1.05, rotate: 90 } : undefined}
          transition={{ duration: 0.3 }}
        >
          <span className={`font-bold text-foreground ${isLarge ? 'text-lg' : 'text-sm'}`}>
            {step}
          </span>

          {/* Animated ring around step number */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid color-mix(in oklab, var(--color-foreground) 15%, transparent)' }}
          />
        </motion.div>
      </motion.div>

      {/* Card content */}
      <motion.div className="relative z-10">
        <motion.h3
          className={`pt-1 pb-4 mb-3 font-bold tracking-tight text-foreground relative z-10 ${isLarge ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}
          initial={{ x: -15, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: STAGGER }}
        >
          {title}

          {/* Animated underline with modern color */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, color-mix(in oklab, var(--color-primary) 80%, transparent), transparent)',
            }}
            initial={{ width: 0 }}
            whileInView={{ width: '60%' }}
            transition={{ delay: STAGGER * 3, duration: duration.enter }}
          />
        </motion.h3>

        <motion.p
          className={`relative z-10 leading-relaxed text-muted-foreground ${isLarge ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}
          initial={{ y: 15, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: STAGGER * 2 }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Decorative corner elements with modern colors */}
      <motion.div
        className="absolute bottom-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-100"
        style={{
          borderLeft: '2px solid color-mix(in oklab, var(--color-pine) 40%, transparent)',
          borderBottom: '2px solid color-mix(in oklab, var(--color-pine) 40%, transparent)',
        }}
        initial={{ scale: 0.96 }}
        whileHover={hasHover ? { scale: 1 } : undefined}
        transition={{ delay: STAGGER }}
      />
      <motion.div
        className="absolute top-4 left-4 w-6 h-6 opacity-0 group-hover:opacity-100"
        style={{
          borderTop: '2px solid color-mix(in oklab, var(--color-clay) 40%, transparent)',
          borderLeft: '2px solid color-mix(in oklab, var(--color-clay) 40%, transparent)',
        }}
        initial={{ scale: 0.96 }}
        whileHover={hasHover ? { scale: 1 } : undefined}
        transition={{ delay: STAGGER }}
      />
    </motion.div>
  );
};

// Connecting line component for visual flow with modern colors
const ConnectingLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="hidden md:flex items-center justify-center my-4"
    initial={{ opacity: 0, scale: 0.96 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay * STAGGER, duration: duration.enter }}
  >
    <div className="flex items-center space-x-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: 'linear-gradient(135deg, var(--color-clay), var(--color-clay-deep))' }}
      />
      <div
        className="w-8 h-0.5"
        style={{ background: 'linear-gradient(90deg, var(--color-clay), var(--color-pine))' }}
      />
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: 'linear-gradient(135deg, var(--color-pine), var(--color-pine-light))' }}
      />
    </div>
  </motion.div>
);

export default function DesignProcessComponent() {
  const hasHover = useHasHover();
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
        <div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl opacity-6"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-pine) 6%, transparent), color-mix(in oklab, var(--color-pine-tint) 3%, transparent))',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-4"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-clay) 4%, transparent), color-mix(in oklab, var(--color-ochre) 2%, transparent))',
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
          transition={{ duration: duration.enter }}
        >
          <motion.h2
            id="design-process-title"
            className="font-bold text-3xl md:text-5xl mb-4 text-foreground"
            whileHover={hasHover ? { scale: 1.01 } : undefined}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Our Design Process
          </motion.h2>

          <motion.div
            className="mx-auto w-24 h-1 rounded-full mb-6 divider-brand"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: duration.enter, delay: STAGGER * 3 }}
          />

          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: STAGGER * 4, duration: duration.enter }}
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
          transition={{ delay: STAGGER * 3, duration: duration.enter }}
        >
          <motion.div
            className="flex items-center space-x-4 px-6 py-3 rounded-full backdrop-blur-sm"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in oklab, var(--color-pine) 8%, transparent), color-mix(in oklab, var(--color-clay) 8%, transparent))',
              border: '1px solid color-mix(in oklab, var(--color-foreground) 12%, transparent)',
            }}
            whileHover={hasHover ? { scale: 1.02 } : undefined}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--color-pine), var(--color-pine-light))',
              }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              From Concept to Completion
            </span>
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--color-clay), var(--color-ochre))',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
