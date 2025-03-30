import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function AboutMeComponent() {
  const experience = [
    {
      value: '20',
      description: 'Years of Experience',
    },
    {
      value: '40+',
      description: 'Projects Completed',
    },
    {
      value: '15+',
      description: 'Happy Clients',
    },
  ];

  const scrollRef = useRef(null);

  return (
    <section
      id="about"
      className="flex flex-col px-4 py-10 md:px-0 md:py-16 md:justify-center md:items-center"
    >
      <div className="container mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="text-2xl font-bold md:text-4xl"
          >
            About Me
          </motion.h2>
        </div>

        <div className="flex flex-col items-center gap-8 md:gap-6 md:flex-row">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            <div className="mx-auto w-full max-w-[280px] sm:max-w-none">
              <Image
                className="rounded-lg aspect-auto w-full h-auto"
                alt="Jigna Saija - Interior Designer"
                width={3248}
                height={4062.1}
                src={'/images/jignasaija.jpg'}
                priority
              />
            </div>
            <div className="py-4 text-center">
              <blockquote className="font-light italic text-sm md:text-base">
                I believe in creating spaces that blend beauty with
                functionality, where design speaks to both the heart and mind.
              </blockquote>
              <p className="text-xs font-thin mt-2 md:text-base">
                - Jigna Saija
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 25, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="flex flex-col w-full md:ml-10"
          >
            <p className="text-base leading-relaxed tracking-wide md:text-lg lg:text-2xl">
              With more than fifteen years of experience designing both
              residential and commercial architectures and interiors, I
              gracefully oversee projects from concept to completion. As a
              versatile designer, I have an innate ability to conceive elegant
              and inspiring concepts and transform them into functional spaces
              that are both beautiful and practical.
            </p>
          </motion.div>
        </div>

        {/* Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10 md:mt-14">
          {experience.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ root: scrollRef }}
              whileHover={{ scale: 1.05 }}
              className="card p-4"
              key={index}
              aria-label={`${item.value} ${item.description}`}
            >
              <h5 className="mb-1 md:mb-2 font-bold tracking-tight text-white text-2xl md:text-3xl">
                {item.value}
              </h5>
              <p className="text-sm md:text-base font-normal text-white-dark">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
