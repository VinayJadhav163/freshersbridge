import React from 'react';
import { Metadata } from 'next';
import CareerToolsHub from '@/components/CareerToolsHub';
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Send,
  IndianRupee,
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free ATS Resume Scanner, Salary Calculator & Career Tools | FreshersBridge',
  description:
    '100% free interactive career tools for tech freshers: ATS resume keyword matcher, Indian fresher in-hand CTC calculator, and 12 copy-ready HR email templates.',
  openGraph: {
    title: 'Free ATS Resume Scanner & Career Tools for Freshers | FreshersBridge',
    description:
      'Evaluate your resume ATS score, compute monthly in-hand CTC salary, and copy professional HR email scripts.',
    url: 'https://freshersbridge.in/career-tools',
  },
};

export default function CareerToolsPage() {
  return (
    <div className="flex flex-col w-full pb-16">
      {/* Hero Banner for Career Tools with Minimal Modern Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/25 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800 px-6 pt-12 pb-14 sm:pt-16 sm:pb-18 text-center sm:px-8 lg:px-12">
        {/* Minimal soft ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(39,93,245,0.09),transparent_70%)] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 dark:border-blue-900/50 bg-white/90 dark:bg-slate-900/90 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>100% Free Career & Placement Toolkit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Free ATS Resume Scanner, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] bg-clip-text text-transparent">
              Salary Calculator & HR Scripts
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Boost your interview shortlist rate with our instant ATS compatibility checker, calculate your exact monthly in-hand take-home salary, and copy 12 professional HR email templates.
          </p>

          {/* Quick Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Free & Client-Side Private
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <FileCheck className="h-4 w-4 text-[#275df5]" />
              Real-Time ATS Keyword Matcher
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xs">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              In-Hand CTC & PF Calculator
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tools Hub */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 w-full space-y-12">
        <CareerToolsHub />
      </main>
    </div>
  );
}
