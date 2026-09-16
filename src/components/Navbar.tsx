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

  // Lock body scroll when mobile menu is open to prevent behind-screen scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Internships', href: '/internships' },
    { name: 'Companies', href: '/companies' },
    { name: 'Career Guides', href: '/guides' },
    { name: 'Career Tools', href: '/career-tools' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center ml-1 sm:ml-2">
              <Link href="/" className="flex items-center py-1">
                <img
                  src="/logo.png"
                  alt="FreshersBridge - Off-Campus Tech Jobs & Internships for Freshers"
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
      </nav>

      {/* Full-Screen Mobile Menu Drawer - Rendered outside <nav> to prevent backdrop-filter containing block trap */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 sm:top-20 z-50 md:hidden bg-background flex flex-col justify-between overflow-y-auto px-6 py-6 border-t border-border shadow-2xl"
          style={{ height: 'calc(100dvh - 4rem)' }}
          id="mobile-menu"
        >
          <div className="space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-bold transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-indigo-600/10 text-indigo-600 font-extrabold border border-indigo-500/20'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />}
                </Link>
              );
            })}
          </div>

          {/* Bottom Quick Call-To-Action inside Menu */}
          <div className="pt-6 border-t border-border/80 space-y-3 mt-6">
            <Link
              href="/career-tools"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98]"
            >
              Free ATS Resume Builder
            </Link>
            <p className="text-center text-[11px] font-medium text-muted-foreground">
              © {new Date().getFullYear()} FreshersBridge · Verified Off-Campus Drives
            </p>
          </div>
        </div>
      )}
    </>
  );
}
