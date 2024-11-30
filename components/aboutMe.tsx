import { motion } from 'motion/react';
import Image from 'next/image';
import { useRef } from 'react';

export default function AboutMeComponent() {
  const experience = {
    '20': {
      description: 'Years of Experience',
    },
    '15': {
      description: 'Projects Completed',
    },
  };
  const scrollRef = useRef(null);
  return (
    <div className="flex md:justify-center md:items-center">
      <div className="container mt-14">
        <div className="my-10 text-left md:text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="text-xl font-bold md:text-4xl"
          >
            About Me
          </motion.h2>
        </div>

        <div className="flex flex-col items-center gap-2 md:flex-row">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            viewport={{ root: scrollRef }}
            className="flex flex-col"
          >
            <Image
              className="rounded-lg aspect-auto"
              alt="jigna saija"
              width={3248}
              height={4062.1}
              src={'/images/jignasaija.jpg'}
            />
            <div className="py-2 text-left md:text-center">
              <q className="font-light md:text-base">
                I believe in complete design
              </q>
              <p className="text-sm font-thin md:text-base md:h-6">
                {' '}
                - Jigna Saija{' '}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 25, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ root: scrollRef }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="flex flex-col md:ml-10"
          >
            <p className="text-base leading-relaxed tracking-wide md:text-2xl">
              With more than fifteen years of experience designing both
              residential and commercial architectures and interiors, I
              gracefully oversee projects from concept to completion. As a
              versatile designer, I have an innate ability to conceive elegant
              and inspiring concepts and transform them into functional spaces
              that are both beautiful and practical.
            </p>
          </motion.div>
        </div>

        {/* <!-- Experience Cards--> */}
        <div className="grid grid-flow-col grid-rows-3 gap-4 mt-10 md:grid-rows-1">
          {Object.entries(experience).map(([key, value]) => (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ root: scrollRef }}
              whileHover={{ scale: 1.1 }}
              className="card"
              key={key}
            >
              <h5 className="mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                {key}
              </h5>
              <p className="text-base font-normal md:text-lg text-white-dark">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
