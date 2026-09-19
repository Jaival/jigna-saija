'use client';

import { motion } from 'motion/react';
import { useHasHover, STAGGER, duration } from '@/lib/motion';
import ImageGallery from '@/components/gallery/ImageGallery';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { NAV_BACK } from '@/lib/viewTransitions';

interface ProjectPageClientProps {
  project: {
    id: string;
    title: string;
    year: number;
    type: string;
    imgUrls: string[];
  };
}

export const ProjectPageClient = ({ project }: ProjectPageClientProps) => {
  const hasHover = useHasHover();

  return (
    // No page-level entrance: the view transition slides the page in, and a
    // second fade on top of it would double-expose the arrival.
    <section className="min-h-svh">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER }}
          className="mb-8"
        >
          <Breadcrumbs
            items={[
              {
                label: 'Projects',
                href: '/projects',
                transitionTypes: NAV_BACK,
              },
              { label: project.title },
            ]}
          />
        </motion.div>

        {/* Modern Project Header */}
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER * 2, duration: duration.enter }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: STAGGER * 3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6 shadow-sm"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  project.type === 'interiorProjects'
                    ? 'bg-emerald-500'
                    : 'bg-blue-500'
                }`}
              />
              {project.type === 'interiorProjects'
                ? 'Interior Design'
                : 'Architecture'}
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 4 }}
            >
              {project.title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: STAGGER * 5 }}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-lg">Completed in {project.year}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Gujarat, India</span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Modern Project Stats */}
        {/* <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER * 6 }}
        > */}
        {/* <motion.div
            whileHover={hasHover ? { scale: 1.02 } : undefined}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {project.imgUrls.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Project Images
            </div>
          </motion.div> */}

        {/* <motion.div
            whileHover={hasHover ? { scale: 1.02 } : undefined}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {project.year}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Year Completed
            </div>
          </motion.div> */}
        {/* </motion.div> */}

        {/* Modern Project Gallery */}
        {/* No entrance here: the project card morphs into the first tile, so the
            gallery must already be in place. An offset would move the landing
            spot, and a fade would leave the tile half-transparent when the
            morph hands over to it. */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="">
            <ImageGallery
              id={0}
              transitionId={project.id}
              title={project.title}
              imageUrls={project.imgUrls}
            />
          </div>
        </div>

        {/* Modern Project Description */}
        {/* <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER * 8 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Project Overview
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                The {project.title} project represents a perfect blend of modern
                design principles and functional architecture. Completed in{' '}
                {project.year}, this{' '}
                {project.type === 'interiorProjects'
                  ? 'interior design'
                  : 'architectural'}{' '}
                project showcases innovative solutions and attention to detail
                that defines our approach to creating exceptional spaces.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <motion.div
                  whileHover={hasHover ? { scale: 1.02 } : undefined}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Design Philosophy
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our design approach focuses on creating harmonious spaces
                    that balance aesthetics with functionality, ensuring every
                    element serves both form and purpose.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={hasHover ? { scale: 1.02 } : undefined}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Sustainable design materials</li>
                    <li>• Optimized space utilization</li>
                    <li>• Modern aesthetic appeal</li>
                    <li>• Functional living spaces</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div> */}

        {/* Modern Back to Projects Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: STAGGER * 9 }}
        >
          <Link href="/projects" transitionTypes={NAV_BACK} className="group">
            <motion.div
              whileHover={hasHover ? { scale: 1.05 } : undefined}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-button-blue hover:bg-honolulu-blue text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-[box-shadow,background-color] duration-150 ease-out"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-150" />
              Back to All Projects
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
