'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Internships', href: '/internships' },
    { name: 'Career Guides', href: '/guides' },
    { name: 'Career Tools', href: '/career-tools' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center ml-1 sm:ml-2">
            <Link href="/" className="flex items-center py-1">
              <img
                src="/logo.png"
                alt="FreshersBridge Logo"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className={`text-base font-semibold transition-colors hover:text-indigo-600 ${
                    isActive(link.href) ? 'text-indigo-600 font-bold' : 'text-foreground/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-foreground hover:bg-secondary active:scale-95 transition-all focus:outline-none cursor-pointer border border-border/50 select-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-indigo-600" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className="md:hidden border-b border-border bg-background/98 backdrop-blur-lg shadow-xl"
          id="mobile-menu"
        >
          <div className="space-y-1.5 px-4 pb-5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-xl px-4 py-3 text-base font-bold transition-all active:scale-[0.98] ${
                  isActive(link.href)
                    ? 'bg-indigo-600/10 text-indigo-600 font-extrabold border border-indigo-500/20'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
