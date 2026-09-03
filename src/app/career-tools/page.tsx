import React from 'react';
import { Metadata } from 'next';
import CareerToolsHub from '@/components/CareerToolsHub';
import FAQAccordion, { FAQItem } from '@/components/FAQAccordion';
import { 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Send,
  IndianRupee, 
  Layers,
  HelpCircle
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

const CAREER_TOOLS_FAQS: FAQItem[] = [
  {
    question: 'What is an ATS Resume Scanner and why is it important for freshers?',
    answer: 'An Applicant Tracking System (ATS) is automated software used by recruiters to parse, filter, and rank resumes before a human reads them. Our scanner tests your resume against target job roles to detect missing technical keywords, skill gaps, and ATS readability issues.',
  },
  {
    question: 'How is monthly in-hand take-home salary calculated from annual CTC in India?',
    answer: 'Annual CTC includes non-cash benefits such as Employer Provident Fund (EPF), gratuity, and performance incentives. Our salary calculator deducts Employee PF (12% of basic), standard professional tax, and income tax under the new tax regime to give your actual monthly bank credit.',
  },
  {
    question: 'How do I customize and copy the HR Email scripts?',
    answer: 'Enter your name, role, target company, and university in the Quick Input Customizer at the top of the templates. Every email script automatically updates in real-time. Then simply click "Copy Script" to paste directly into your email client or LinkedIn message.',
  },
  {
    question: 'Is my resume data stored or shared with external servers?',
    answer: 'No! All resume parsing and keyword extraction occurs 100% client-side inside your own browser session. We do not store, log, or transmit your resume to any server.',
  },
];

export default function CareerToolsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': CAREER_TOOLS_FAQS.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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

        {/* Frequently Asked Questions on Career Tools */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 px-3 py-1 text-xs font-bold text-[#275df5] dark:text-blue-400">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Career Tools FAQ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Frequently Asked Questions About Freshers Career Tools
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about testing ATS resume match, calculating take-home CTC, and reaching out to recruiters.
            </p>
          </div>

          <FAQAccordion items={CAREER_TOOLS_FAQS} />
        </section>
      </main>
    </div>
  );
}
