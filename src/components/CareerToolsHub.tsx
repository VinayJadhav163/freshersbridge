'use client';

import { useState, useRef } from 'react';
import ATSResumeMatcher from '@/components/ATSResumeMatcher';
import SalaryCalculator from '@/components/SalaryCalculator';
import HREmailTemplates from '@/components/HREmailTemplates';
import { 
  FileCheck2, 
  IndianRupee, 
  MailCheck, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CareerToolsHub() {
  const [activeTab, setActiveTab] = useState<'ats' | 'salary' | 'emails'>('ats');
  const containerRef = useRef<HTMLDivElement>(null);
  const atsRef = useRef<HTMLButtonElement>(null);
  const salaryRef = useRef<HTMLButtonElement>(null);
  const emailsRef = useRef<HTMLButtonElement>(null);

  const handleTabClick = (tab: 'ats' | 'salary' | 'emails') => {
    setActiveTab(tab);

    if (containerRef.current) {
      if (tab === 'ats') {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (tab === 'salary' || tab === 'emails') {
        // Shift fully to the right so the entire "12 HR Email Scripts" tab is 100% completely visible
        const container = containerRef.current;
        container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Tool Selection Tabs Bar with Full Visibility Shift on Mobile */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto pb-2 scroll-smooth scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <div className="flex items-center justify-start sm:justify-center min-w-max mx-auto pr-4 sm:pr-0">
          <div className="inline-flex p-1 sm:p-1.5 rounded-2xl bg-secondary/80 border border-border gap-1.5 sm:gap-2 shadow-xs">
            <button
              ref={atsRef}
              type="button"
              onClick={() => handleTabClick('ats')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
                activeTab === 'ats'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              <FileCheck2 className="h-4 w-4 shrink-0" />
              <span>ATS Resume Scanner</span>
            </button>

            <button
              ref={salaryRef}
              type="button"
              onClick={() => handleTabClick('salary')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
                activeTab === 'salary'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              <IndianRupee className="h-4 w-4 shrink-0" />
              <span>In-Hand Salary Calculator</span>
            </button>

            <button
              ref={emailsRef}
              type="button"
              onClick={() => handleTabClick('emails')}
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
                activeTab === 'emails'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
              }`}
            >
              <MailCheck className="h-4 w-4 shrink-0" />
              <span>12 HR Email Scripts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Active Tool Body with Smooth Slide & Fade Transition */}
      <div className="pt-2 min-h-[500px]">
        {activeTab === 'ats' && (
          <div key="ats-tab" className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2 ease-out">
            <ATSResumeMatcher />
          </div>
        )}

        {activeTab === 'salary' && (
          <div key="salary-tab" className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2 ease-out">
            <SalaryCalculator />
          </div>
        )}

        {activeTab === 'emails' && (
          <div key="emails-tab" className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2 ease-out">
            <HREmailTemplates />
          </div>
        )}
      </div>

      {/* Sleek Banner linking to Career Guides */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
            Exam Blueprints &amp; Interview Prep
          </div>
          <h4 className="text-sm sm:text-base font-bold text-foreground">
            Explore 10+ In-Depth Career &amp; Placement Guides
          </h4>
          <p className="text-xs text-muted-foreground max-w-xl">
            Read complete syllabus breakdowns for TCS NQT, Accenture ASE, Core Java &amp; Python interview questions.
          </p>
        </div>

        <Link
          href="/guides"
          prefetch={true}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow-2xs transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Browse All Guides</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
