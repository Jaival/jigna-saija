'use client';

import { useState, useMemo, useDeferredValue } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type Variants,
} from 'motion/react';
import {
  useHasHover,
  STAGGER,
  enterVariants,
  enterTransition,
  duration,
  spring,
} from '@/lib/motion';
import userData from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectImageTransition } from '@/components/ProjectImageTransition';
import {
  CARD_IMAGE_QUALITY,
  CARD_IMAGE_SIZES,
  NAV_FORWARD,
} from '@/lib/viewTransitions';
import { Search, Filter, Grid, List, Calendar, Loader2 } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'title';

export default function ProjectsComponent() {
  const hasHover = useHasHover();
  const [searchInput, setSearchInput] = useState('');
  const deferredSearch = useDeferredValue(searchInput);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'interior' | 'architecture'
  >('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [showFilters, setShowFilters] = useState(false);
  // A search is pending while the deferred value still lags the input.
  const isSearching = searchInput !== deferredSearch;

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

  // Filter and sort projects using deferred search value
  const filteredProjects = useMemo(() => {
    // Copy before sorting: sort() works in place, and sorting allProjects itself
    // would hand back the same array, so the "All" view never re-rendered.
    let filtered = [...allProjects];

    // Filter by search term
    if (deferredSearch) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(deferredSearch.toLowerCase()),
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
  }, [allProjects, deferredSearch, selectedCategory, sortBy]);

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

  // Search results change on every keystroke. Rearranging the grid that often
  // is worse than snapping, so layout animation is off while a term is active.
  // Motion decides whether to animate from the previous render's `layout`
  // prop, so the gate reads the urgent input too: it switches off one render
  // before the deferred results change the cards.
  const hasSearchTerm = searchInput.length > 0 || deferredSearch.length > 0;
  const animateLayout = !hasSearchTerm;

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: STAGGER },
    },
  };

  const itemVariants: Variants = enterVariants;

  return (
    // No page-level fade: the view transition brings the page in, and a second
    // fade on top of it would double-expose the arrival.
    <section className="flex flex-col px-4 sm:px-6 md:px-8">
      {/* Modern Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.enter, delay: STAGGER }}
        className="mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  aria-hidden="true"
                />
                {isSearching && (
                  <Loader2
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  aria-label="Search projects"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 transition-colors duration-150 ease-out shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={hasHover ? { scale: 1.05 } : undefined}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? 'Hide filters' : 'Show filters'}
                aria-expanded={showFilters}
                className={`p-3 min-h-[44px] min-w-[44px] rounded-xl border transition-[color,background-color,border-color,box-shadow] duration-150 ease-out ${
                  showFilters
                    ? 'bg-button-blue text-white border-button-blue shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" aria-hidden="true" />
              </motion.button>

              <div
                className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-sm"
                role="group"
                aria-label="View mode"
              >
                <motion.button
                  whileHover={hasHover ? { scale: 1.05 } : undefined}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-2 min-h-[44px] min-w-[44px] rounded-lg transition-[color,background-color,box-shadow] duration-150 ease-out ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-button-blue dark:text-light-periwinkle shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid className="w-4 h-4" aria-hidden="true" />
                </motion.button>
                <motion.button
                  whileHover={hasHover ? { scale: 1.05 } : undefined}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-2 min-h-[44px] min-w-[44px] rounded-lg transition-[color,background-color,box-shadow] duration-150 ease-out ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-button-blue dark:text-light-periwinkle shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List className="w-4 h-4" aria-hidden="true" />
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
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm"
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
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm shadow-sm"
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
        style={{ position: 'relative' }}
        className="max-w-7xl mx-auto w-full"
      >
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedProjects).map(([category, projects]) => {
              if (projects.length === 0) return null;

              const categoryTitle =
                category === 'interior'
                  ? 'Interior Projects'
                  : 'Architecture Projects';

              return (
                <motion.div
                  key={category}
                  // position, not size: the heading inside must not be stretched
                  // while the section's height changes under a filter.
                  layout={animateLayout ? 'position' : false}
                  variants={itemVariants}
                  exit={{
                    opacity: 0,
                    transition: { duration: duration.press },
                  }}
                  className="mb-16"
                >
                  {selectedCategory === 'all' && (
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: duration.enter }}
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
                    animateLayout={animateLayout}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </LayoutGroup>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.enter }}
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
    </section>
  );
}

// Project Grid Component
const ProjectGrid = ({
  projects,
  viewMode,
  category,
  animateLayout,
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
  animateLayout: boolean;
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: STAGGER },
    },
  };

  // Each card is the same object across sort, filter and grid/list changes, so
  // it travels to its new rect instead of being recreated. popLayout takes
  // exiting cards out of flow at once (which needs a non-static parent), so the
  // survivors start moving into the gap immediately.
  const renderCards = (Item: typeof ProjectCard) => (
    <AnimatePresence mode="popLayout">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          // Position only. Grid and list items have different aspect ratios, and
          // a size animation squashes the image and text mid-morph; the size
          // snaps while the card travels.
          layout={animateLayout ? 'position' : false}
          layoutId={animateLayout ? `project-card-${project.id}` : undefined}
          variants={enterVariants}
          exit={{
            opacity: 0,
            scale: 0.96,
            transition: { duration: duration.press },
          }}
          transition={spring}
        >
          <Item project={project} index={idx} />
        </motion.div>
      ))}
    </AnimatePresence>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        layout={animateLayout}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative' }}
        className="space-y-4"
      >
        {renderCards(ProjectListItem)}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout={animateLayout}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ position: 'relative' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {renderCards(ProjectCard)}
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
  const hasHover = useHasHover();
  return (
    <motion.div
      whileHover={hasHover ? { y: -8 } : undefined}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={project.link} transitionTypes={NAV_FORWARD} className="block">
        <div className="relative overflow-hidden rounded-2xl glass shadow-lg hover:shadow-2xl transition-shadow duration-150 ease-out">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Named wrapper, not the img: the hover scale must stay clipped
                inside the snapshot the morph starts from. */}
            <ProjectImageTransition id={project.id}>
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={project.imgUrl}
                  fill
                  sizes={CARD_IMAGE_SIZES}
                  quality={CARD_IMAGE_QUALITY}
                  alt={`${project.title} project thumbnail`}
                  className="object-cover transition-transform duration-150 ease-out group-hover:scale-110"
                  priority={index < 3}
                />
              </div>
            </ProjectImageTransition>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-150" />

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: STAGGER * 3 + index * STAGGER }}
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
              transition={{ delay: STAGGER * 4 + index * STAGGER }}
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-button-blue dark:group-hover:text-light-periwinkle transition-colors duration-150 line-clamp-2">
                {project.title}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{project.year}</span>
              </div>

              <motion.div
                whileHover={hasHover ? { x: 4 } : undefined}
                className="text-button-blue dark:text-honolulu-blue group-hover:text-honolulu-blue dark:group-hover:text-light-periwinkle transition-colors duration-150"
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
  const hasHover = useHasHover();
  return (
    <motion.div
      whileHover={hasHover ? { x: 8 } : undefined}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={project.link} transitionTypes={NAV_FORWARD} className="block">
        <div className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-150 ease-out border border-gray-100 dark:border-gray-700">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <ProjectImageTransition id={project.id}>
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={project.imgUrl}
                  fill
                  sizes="96px"
                  quality={75}
                  alt={`${project.title} thumbnail`}
                  className="object-cover transition-transform duration-150 group-hover:scale-110"
                />
              </div>
            </ProjectImageTransition>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-button-blue dark:group-hover:text-light-periwinkle transition-colors duration-150 truncate">
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
                whileHover={hasHover ? { x: 4 } : undefined}
                className="text-gray-400 group-hover:text-button-blue dark:group-hover:text-light-periwinkle transition-colors duration-150"
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
