'use client';

import { ViewTransition, type ReactNode } from 'react';
import { projectImageName } from '@/lib/viewTransitions';

// The shared element between a project card and its detail page. `share`
// has to be explicit alongside `default="none"`, or the pair stops morphing;
// `default="none"` keeps the image out of unrelated transitions.
export function ProjectImageTransition({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition name={projectImageName(id)} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
