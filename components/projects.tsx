'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import userData from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Grid, List, Calendar } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'title';

export default function ProjectsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'interior' | 'architecture'
  >('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Combine all projects with type information
  const allProjects = useMemo(() => {
    const interior = userData.projects.interiorProjects.map((p) => ({
      ...p,
      type: 'interior' as const,
    }));
    const architecture = userData.projects.architectureProjects.map((p) => ({
      ...p,
      type: 'architecture' as const,
    }));
    return [...interior, ...architecture];
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = allProjects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (project) => project.type === selectedCategory,
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProjects, searchTerm, selectedCategory, sortBy]);

  // Group projects by type for display
  const groupedProjects = useMemo(() => {
    if (selectedCategory !== 'all') {
      return {
        [selectedCategory]: filteredProjects,
      };
    }

    return {
      interior: filteredProjects.filter((p) => p.type === 'interior'),
      architecture: filteredProjects.filter((p) => p.type === 'architecture'),
    };
  }, [filteredProjects, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col px-4 sm:px-6 md:px-8"
    >
      {/* Modern Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  showFilters
                    ? 'bg-pink-500 text-white border-pink-500 shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" />
              </motion.button>

              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-pink-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-pink-500 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Modern Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-6"
              >
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category:
                    </span>
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as any)
                      }
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
                    >
                      <option value="all">All Projects</option>
                      <option value="interior">Interior Design</option>
                      <option value="architecture">Architecture</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {filteredProjects.length} project
                    {filteredProjects.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Projects Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full"
      >
        {Object.entries(groupedProjects).map(([category, projects]) => {
          if (projects.length === 0) return null;

          const categoryTitle =
            category === 'interior'
              ? 'Interior Projects'
              : 'Architecture Projects';

          return (
            <motion.div
              key={category}
              variants={itemVariants}
              className="mb-16"
            >
              {selectedCategory === 'all' && (
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3"
                >
                  <span>{categoryTitle}</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">
                    ({projects.length})
                  </span>
                </motion.h2>
              )}

              <ProjectGrid
                projects={projects}
                viewMode={viewMode}
                category={category}
              />
            </motion.div>
          );
        })}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}

// Project Grid Component
const ProjectGrid = ({
  projects,
  viewMode,
  category,
}: {
  projects: Array<{
    id: string;
    title: string;
    year: number;
    imgUrl: string;
    link: string;
    type: 'interior' | 'architecture';
  }>;
  viewMode: ViewMode;
  category: string;
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {projects.map((project, idx) => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectListItem project={project} index={idx} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project, idx) => (
        <motion.div key={project.id} variants={itemVariants}>
          <ProjectCard project={project} index={idx} />
        </motion.div>
      ))}
    </motion.div>
  );
};

// Modern Project Card Component
const ProjectCard = ({
  project,
  index,
}: {
  project: {
    id: string;
    title: string;
    year: number;
    imgUrl: string;
    link: string;
    type: 'interior' | 'architecture';
  };
  index: number;
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={project.link} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={project.imgUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
              alt={`${project.title} project thumbnail`}
              className="object-cover transition-all duration-700 group-hover:scale-110"
              priority={index < 3}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="absolute top-4 left-4"
            >
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${
                  project.type === 'interior'
                    ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30'
                    : 'bg-blue-500/20 text-blue-100 border-blue-400/30'
                }`}
              >
                {project.type === 'interior' ? 'Interior' : 'Architecture'}
              </span>
            </motion.div>

            {/* Project Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="absolute top-4 right-4"
            >
              <span className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-bold border border-white/30">
                {String(index + 1).padStart(2, '0')}
              </span>
            </motion.div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200 line-clamp-2">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{project.year}</span>
              </div>

              <motion.div
                whileHover={{ x: 4 }}
                className="text-pink-600 dark:text-pink-400 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Modern List View Component
const ProjectListItem = ({
  project,
  index,
}: {
  project: {
    id: string;
    title: string;
    year: number;
    imgUrl: string;
    link: string;
    type: 'interior' | 'architecture';
  };
  index: number;
}) => {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={project.link} className="block">
        <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={project.imgUrl}
              fill
              sizes="96px"
              quality={80}
              alt={`${project.title} thumbnail`}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200 truncate">
                {project.title}
              </h3>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  project.type === 'interior'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}
              >
                {project.type === 'interior' ? 'Interior' : 'Architecture'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{project.year}</span>
              </div>

              <motion.div
                whileHover={{ x: 4 }}
                className="text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
