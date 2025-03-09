'use client';

import { Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

// Extract navigation links to avoid duplication
const navLinks = [
  { href: '/projects', label: 'Projects' },
  // { href: '/gallery', label: 'Gallery' },
  { href: '/contact-me', label: 'Contact Me' },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="w-full">
      <div className="flex justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:items-center">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center w-32 sm:w-40 md:w-48" >
            <Image
              className="w-full h-auto"
              alt="Jigna Saija"
              width={320}
              height={320}
              src={'/logos/JiiJ_Designs.png'}
              priority
            />
          </Link>

          <div className="absolute hidden md:block md:ml-10 right-48">
            <ul className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 text-xl font-medium text-white rounded-md hover:text-white-hover"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex -mr-2 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 text-white rounded-md focus:outline-none hover:bg-white/10 transition-colors"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        {(ref) => (
          <div className="md:hidden" id="mobile-menu">
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className="px-3 py-4 space-y-1 bg-blue-dark/95 backdrop-blur-md shadow-lg"
            >
              <ul className="flex flex-col items-center justify-center space-y-4">
                {navLinks.map((link) => (
                  <li key={link.href} className="w-full">
                    <Link
                      href={link.href}
                      // onClick={handleLinkClick}
                      className="block w-full px-4 py-3 text-lg font-medium text-center text-white rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
}
