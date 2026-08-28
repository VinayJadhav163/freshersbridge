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
      {/* Hero Banner for Career Tools */}
      <section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-border px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center sm:px-8 lg:px-12">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        {/* Glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 dark:border-indigo-900/80 bg-indigo-50/60 dark:bg-indigo-950/60 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>100% Free Career & Placement Toolkit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-foreground leading-tight">
            Free ATS Resume Scanner, <br className="hidden sm:inline" />
            <span className="text-[#275df5] dark:text-[#3b82f6]">
              Salary Calculator & HR Scripts
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-muted-foreground font-medium">
            Boost your interview shortlist rate with our instant ATS compatibility checker, calculate your exact monthly in-hand take-home salary, and copy 12 professional HR email templates.
          </p>

          {/* Quick Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-muted-foreground">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              100% Free & Client-Side Private
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 shadow-2xs">
              <FileCheck className="h-4 w-4 text-indigo-600" />
              Real-Time ATS Keyword Matcher
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 shadow-2xs">
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
