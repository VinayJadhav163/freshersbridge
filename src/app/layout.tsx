import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FreshersBridge | Jobs & Internships for MCA, BCA, BSc CS & BTech',
  description:
    'Find your first tech job. FreshersBridge lists handpicked entry-level off-campus jobs, software developer internships, and fresher roles for BCA, MCA, BSc Computer Science, and BE/BTech graduates in India.',
  keywords: [
    'MCA Freshers Jobs',
    'BCA Internships',
    'Off Campus Drives',
    'Software Engineer Internships',
    'Freshers Jobs 2026',
    'BSc Computer Science Jobs',
    'BE BTech Freshers Jobs',
    'Entry level coding jobs',
  ],
  metadataBase: new URL('https://freshersbridge.in'),
  openGraph: {
    title: 'FreshersBridge | Jobs & Internships for MCA, BCA & BTech Freshers',
    description:
      'Search and apply to verified entry-level jobs and internships. Your bridge from college to the tech industry.',
    url: 'https://freshersbridge.in',
    siteName: 'FreshersBridge',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreshersBridge | Jobs for MCA, BCA & BTech Freshers',
    description: 'Find your first tech job. Handpicked jobs and internships for computer science graduates.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
