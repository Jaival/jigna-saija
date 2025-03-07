import { motion } from 'motion/react';
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

// Reusable animation configs
const fadeInAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: {
    ease: 'anticipate',
    duration: 1,
  },
};

const slideInFromLeftAnimation = {
  initial: { x: -100, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: {
    ease: 'anticipate',
    duration: 1,
  },
};

const slideInFromRightAnimation = {
  initial: { x: 100, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  transition: {
    ease: 'anticipate',
    duration: 1,
  },
};

export default function Hero() {
  const scrollRef = useRef(null);

  return (
    <div ref={scrollRef} className="mt-10">
      <div className="flex flex-col md:flex-row gap-5">
        <motion.div
          {...slideInFromLeftAnimation}
          viewport={{ root: scrollRef }}
          className="flex flex-col gap-6 md:justify-center md:items-center md:m-8"
        >
          <motion.h1
            {...fadeInAnimation}
            viewport={{ root: scrollRef }}
            className="text-xl md:text-5xl"
          >
            Building the future, one project at a time.
          </motion.h1>
          <motion.p
            {...fadeInAnimation}
            viewport={{ root: scrollRef }}
            className="w-auto text-l md:text-2xl"
          >
            Turning your big ideas into impressive reality.
          </motion.p>
          <motion.div
            className="flex px-4 py-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link
              href="/projects"
              className="px-4 py-2 font-bold text-center text-white rounded bg-button-blue hover:bg-honolulu-blue w-60"
            >
              See projects
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          {...slideInFromRightAnimation}
          viewport={{ root: scrollRef }}
          className=" md:flex md:flex-col"
        >
          <Image
            className="rounded-lg"
            alt="Modern architectural design showcase"
            priority={true}
            width={1100}
            height={1100}
            src={
              '/images/architecture_projects/project_pic_1/project_pic_2.jpg'
            }
          />
        </motion.div>
      </div>

      <div className="flex mt-40 md:mt-24 md:justify-center md:items-center">
        <div className="container mt-14">
          <div className="mb-10 text-left md:text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xl font-bold md:text-4xl"
            >
              Why Choose Me?
            </motion.h2>
          </div>

          <div
            className="grid grid-flow-col grid-rows-5 gap-4 md:grid-rows-3 lg:grid-rows-2 md:gap-14"
          >
            {Object.entries(WHY_CHOOSE_ME).map(([key, value]) => (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className="card"
                key={key}
              >
                <h3 className="mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  {key}
                </h3>
                <p className="text-base font-normal md:text-lg text-white-dark">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
