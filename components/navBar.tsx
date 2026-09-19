'use client';

import { Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FolderOpen, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Extract navigation links to avoid duplication
const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/contact-me', label: 'Contact Me', icon: Mail },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Add scroll effect for modern navbar behavior
  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        frame = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <nav
      data-persistent
      // Its own view-transition layer, held still and above the sliding page.
      style={{ viewTransitionName: 'site-header' }}
      data-scrolled={isScrolled ? '' : undefined}
      className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] md:pt-[calc(1rem+env(safe-area-inset-top,0px))] nav-surface"
    >
      {/* ps-/pe- are a deliberate exception to this file's physical padding
          utilities: the landscape notch swaps sides, and logical properties
          keep that correct under RTL. max() preserves the responsive scale. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ps-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] sm:ps-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pe-[max(1.5rem,env(safe-area-inset-right,0px))] lg:ps-[max(2rem,env(safe-area-inset-left,0px))] lg:pe-[max(2rem,env(safe-area-inset-right,0px))]">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group transition-transform duration-150 hover:scale-[1.02]"
          >
            <div className="relative w-28 sm:w-32 md:w-36 lg:w-40">
              <Image
                className="w-full h-auto"
                alt="Jigna Saija"
                width={320}
                height={320}
                src={'/logos/JiiJ_Designs.png'}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full text-sm lg:text-base font-medium transition-colors duration-150 ease-out group ${
                    isActive
                      ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                      : isScrolled
                        ? 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800'
                        : 'text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent
                    className="w-4 h-4 transition-transform duration-150 group-hover:scale-[1.06]"
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`p-2 min-h-[44px] min-w-[44px] rounded-lg transition-colors duration-150 ease-out ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-out duration-150 transform"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-2 scale-95"
      >
        {(ref) => (
          <nav
            className="md:hidden"
            id="mobile-menu"
            aria-label="Mobile navigation"
          >
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="glass border-t shadow-xl"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 w-full px-4 py-3 min-h-[44px] text-base font-medium rounded-xl transition-colors duration-150 ease-out group ${
                        isActive
                          ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent
                        className="w-5 h-5 transition-transform duration-150 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </Transition>
    </nav>
  );
}
