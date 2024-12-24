import { motion } from 'motion/react';
import { useRef } from 'react';
import { ArrowRightIcon } from './ui/arrow-right';

export default function DesignProcessComponent() {
  const scrollRef = useRef(null);

  return (
    <div className="flex md:justify-center md:items-center">
      <div className="container mt-5">
        <div className="my-10 text-left md:text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              ease: 'anticipate',
              duration: 1,
            }}
            className="font-bold text:xl md:text-4xl"
          >
            Design Process
          </motion.h2>
        </div>
        <div className="container">
          <div className="flex gap-4">
            <div className="flex-1 flex-row">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className={'mb-4 min-h-64 rounded-xl border-2 card p-4'}
              >
                <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  Layout Options
                </h3>
                <p className="text-lg">
                  We create a couple of format alternatives with the aid of
                  using knowledge of clients requirements, needs, and choices.
                </p>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className={'mb-4 min-h-32 rounded-xl border-2 card p-4'}
              >
                <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  Presentation
                </h3>
                <p className="text-lg">
                  Considering customers preferences, we create several design
                  concepts for you to choose.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className={'mb-4 min-h-32 rounded-xl border-2 card p-4'}
              >
                <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  3D Views
                </h3>
                <p className="text-lg">
                  After concept confirmation, we only detail and create 3D if
                  necessary.
                </p>
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className={'mb-4 min-h-32 rounded-xl border-2 card p-4'}
              >
                <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  Bill of Quality
                </h3>
                <p className="text-lg">
                  Based on the material selection, we create detailed cost
                  estimates.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef }}
                whileHover={{ scale: 1.1 }}
                className={
                  'flex flex-col mb-4 min-h-32 rounded-xl border-2 card p-4'
                }
              >
                <h3 className="pt-1 pb-3 mb-2 font-bold tracking-tight text-white text-l md:text-3xl">
                  Material Selection
                </h3>
                <p className="text-lg">
                  Depending on your budget, we offer your preferred material
                  selection and combination.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
