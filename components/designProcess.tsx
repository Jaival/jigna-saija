import { motion } from 'motion/react';
import { useRef } from 'react';

// Create a reusable card component to reduce repetition
const ProcessCard = ({
  step,
  title,
  description,
  height = 'min-h-48', // Add height prop with default value
}: {
  step: number;
  title: string;
  description: string;
  height?: string; // Make height optional
}) => {
  const scrollRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ root: scrollRef }}
      whileHover={{ scale: 1.1 }}
      className={`relative mb-4 ${height} rounded-xl border-2 card p-4 overflow-hidden`}
    >
      <span className="absolute top-3 right-3 text-xs font-semibold bg-white/10 px-2 py-1 rounded-full">
        Step {step}
      </span>
      <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-xl md:text-3xl">
        {title}
      </h3>
      <p className="text-base md:text-lg text-white/80">{description}</p>
    </motion.div>
  );
};

export default function DesignProcessComponent() {
  // Process steps data
  const processSteps = [
    {
      title: 'Layout Options',
      description:
        'We create a couple of format alternatives with the aid of using knowledge of clients requirements, needs, and choices.',
      height: 'min-h-64',
    },
    {
      title: 'Concepts',
      description:
        'Considering customers preferences, we create several design concepts for you to choose.',
      height: 'min-h-32',
    },
    {
      title: '3D Views',
      description:
        'After concept confirmation, we only detail and create 3D if necessary.',
      height: 'min-h-32',
    },
    {
      title: 'Bill of Quality',
      description:
        'Based on material selection, we create detailed cost estimates for transparency.',
      height: 'min-h-32',
    },
    {
      title: 'Material Selection',
      description:
        'According to your budget, we offer material options and combinations that suit your needs.',
      height: 'min-h-32',
    },
  ];

  return (
    <section
      id="design-process"
      aria-labelledby="design-process-title"
      className="py-12"
    >
      <div className="container px-4 md:px-0 mx-auto">
        <motion.h2
          id="design-process-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            ease: 'anticipate',
            duration: 1,
          }}
          className="font-bold text-2xl md:text-4xl mb-10 text-left md:text-center"
        >
          Our Design Process
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First column - single large card */}
          <div>
            <ProcessCard
              step={1}
              title={processSteps[0].title}
              description={processSteps[0].description}
              height={processSteps[0].height}
            />
          </div>

          {/* Second column - two cards */}
          <div>
            <ProcessCard
              step={2}
              title={processSteps[1].title}
              description={processSteps[1].description}
              height={processSteps[1].height}
            />
            <ProcessCard
              step={3}
              title={processSteps[2].title}
              description={processSteps[2].description}
              height={processSteps[2].height}
            />
          </div>

          {/* Third column - two cards */}
          <div>
            <ProcessCard
              step={4}
              title={processSteps[3].title}
              description={processSteps[3].description}
              height={processSteps[3].height}
            />
            <ProcessCard
              step={5}
              title={processSteps[4].title}
              description={processSteps[4].description}
              height={processSteps[4].height}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
