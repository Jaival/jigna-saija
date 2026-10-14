import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import userData from '@/data/data';
import { Logo } from '@/components/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <Logo className="w-44 mb-4 text-foreground" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional architect and interior designer with 20+ years of
              experience creating beautiful, functional spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-me"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  Contact Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Architecture Design</li>
              <li>Interior Design</li>
              <li>3D Visualization</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Connect</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${userData.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-150 group"
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
                  className="p-2 rounded-lg bg-brand text-brand-foreground hover:shadow-lg transition-shadow duration-150 ease-out"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={userData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-shadow duration-150 ease-out"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} <span className="font-semibold">Jigna Saija</span>.
            All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Designed with ❤️ by{' '}
            <a
              href="https://github.com/jaival"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Jaival Saija
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
