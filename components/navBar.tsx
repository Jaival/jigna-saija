'use client';

import { Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FolderOpen, Mail } from 'lucide-react';

// Extract navigation links to avoid duplication
const navLinks = [
  // { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/contact-me', label: 'Contact Me', icon: Mail },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for modern navbar behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group transition-transform duration-200 hover:scale-105"
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
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 group ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                      : 'text-white hover:bg-white/10 hover:text-blue-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">
                {isOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300 transform"
        enterFrom="opacity-0 -translate-y-2 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-200 transform"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-2 scale-95"
      >
        {(ref) => (
          <div className="md:hidden" id="mobile-menu">
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-700/20 shadow-xl"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                    >
                      <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
}
