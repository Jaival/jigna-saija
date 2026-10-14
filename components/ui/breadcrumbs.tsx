'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  // Direction for the page slide, e.g. NAV_BACK when the link goes up a level.
  transitionTypes?: string[];
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-150"
            aria-label="Home"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight
                className="w-4 h-4 text-muted-foreground/60"
                aria-hidden="true"
              />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  transitionTypes={item.transitionTypes}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-foreground font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
