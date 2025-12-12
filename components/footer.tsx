import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import userData from '@/data/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 mt-16 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="relative w-32 h-auto mb-4">
              <Image
                src="/logos/JiiJ_Designs.png"
                alt="JiiJ Designs"
                width={128}
                height={128}
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Professional architect and interior designer with 20+ years of
              experience creating beautiful, functional spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-me"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:underline"
                >
                  Contact Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Architecture Design</li>
              <li>Interior Design</li>
              <li>3D Visualization</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href={`mailto:${userData.email}`}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group focus:outline-none focus:underline"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="break-all">{userData.email}</span>
              </a>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={userData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={userData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="p-2 rounded-lg bg-blue-600 text-white hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            © {currentYear} <span className="font-semibold">Jigna Saija</span>.
            All Rights Reserved.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center sm:text-right">
            Designed with ❤️ by{' '}
            <a
              href="https://github.com/jaival"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:underline"
            >
              Jaival Saija
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
