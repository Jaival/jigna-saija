'use client';

import { motion } from 'motion/react';
import { enterTransition } from '@/lib/motion';
import React from 'react';

export function SectionWrapper({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={enterTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionDivider() {
  return (
    <motion.div
      className="my-12 md:my-16 mx-auto w-24 h-1 rounded-full divider-brand"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={enterTransition}
      style={{ transformOrigin: 'center' }}
    />
  );
}
