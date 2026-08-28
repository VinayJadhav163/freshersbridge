import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobAlertsBanner from '@/components/JobAlertsBanner';
import PageNavigationLoader from '@/components/PageNavigationLoader';
import CookieConsentBanner from '@/components/CookieConsentBanner';


export const metadata: Metadata = {
  title: 'FreshersBridge | Handpicked Off-Campus Jobs & Internships for Freshers',
  description:
    'Find your first tech job. FreshersBridge lists handpicked entry-level off-campus jobs, software developer internships, and fresher roles for college graduates in India.',
  keywords: [
    'Freshers Jobs',
    'Tech Internships',
    'Off Campus Drives',
    'Software Engineer Internships',
    'Freshers Jobs 2026',
    'Entry level coding jobs',
  ],
  metadataBase: new URL('https://freshersbridge.in'),
  openGraph: {
    title: 'FreshersBridge | Handpicked Jobs & Internships for Freshers',
    description:
      'Search and apply to verified entry-level jobs and internships. Your bridge from college to the tech industry.',
    url: 'https://freshersbridge.in',
    siteName: 'FreshersBridge',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreshersBridge | Handpicked Jobs for Freshers',
    description: 'Find your first tech job. Handpicked jobs and internships for college graduates.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=6' },
      { url: '/favicon-32x32.png?v=6', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=6', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png?v=6', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=6',
    apple: [
      { url: '/apple-touch-icon.png?v=6', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <Suspense fallback={null}>
          <PageNavigationLoader />
        </Suspense>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <JobAlertsBanner />
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
