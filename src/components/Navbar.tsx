'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Menu, X, Settings } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Find Jobs', href: '/jobs' },
    { name: 'Latest Openings', href: '/jobs?sort=latest' },
    { name: 'Featured Jobs', href: '/jobs?featured=true' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground sm:block">
                Freshers<span className="text-indigo-600">Bridge</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    isActive(link.href) ? 'text-indigo-600 font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-4 w-px bg-border" />
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium border border-border bg-card shadow-sm transition-all hover:bg-secondary hover:text-indigo-600 ${
                  pathname.startsWith('/admin') ? 'border-indigo-600 text-indigo-600 font-semibold' : 'text-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-indigo-600/10 text-indigo-600 font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium ${
                pathname.startsWith('/admin')
                  ? 'bg-indigo-600/10 text-indigo-600 font-semibold'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
