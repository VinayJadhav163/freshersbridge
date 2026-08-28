'use client';

import { useState } from 'react';
import ATSResumeMatcher from '@/components/ATSResumeMatcher';
import SalaryCalculator from '@/components/SalaryCalculator';
import HREmailTemplates from '@/components/HREmailTemplates';
import { 
  FileCheck2, 
  IndianRupee, 
  MailCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function CareerToolsHub() {
  const [activeTab, setActiveTab] = useState<'ats' | 'salary' | 'emails'>('ats');

  return (
    <div className="space-y-8">
      {/* Tool Selection Tabs Bar */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-secondary/80 border border-border gap-2 max-w-full overflow-x-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ats')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
              activeTab === 'ats'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <FileCheck2 className="h-4 w-4 shrink-0" />
            <span>ATS Resume Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
              activeTab === 'salary'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <IndianRupee className="h-4 w-4 shrink-0" />
            <span>In-Hand Salary Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emails')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ease-out shrink-0 cursor-pointer select-none active:scale-95 ${
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

      {/* Banner linking to Career Guides */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-card to-card p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
            <Sparkles className="h-3 w-3" />
            Exam Blueprints & Interview Prep
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-foreground">
            Explore 10+ In-Depth Career & Placement Guides
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Read complete syllabus breakdowns for TCS NQT, Accenture ASE, Core Java & Python interview questions.
          </p>
        </div>

        <Link
          href="/guides"
          prefetch={true}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-all hover:scale-105 shrink-0"
        >
          <span>Browse All Guides</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
