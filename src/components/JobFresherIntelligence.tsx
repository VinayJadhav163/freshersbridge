import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  IndianRupee, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Calculator, 
  Lightbulb,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Job } from '@/types';

interface JobFresherIntelligenceProps {
  job: Job;
  isInternship?: boolean;
}

// Helper to determine interview questions and round structure based on role & skills
function getInterviewBlueprint(title: string, skills: string[]) {
  const t = title.toLowerCase();
  const s = skills.join(' ').toLowerCase();

  if (t.includes('data') || t.includes('analyst') || s.includes('sql') || s.includes('python')) {
    return {
      domain: 'Data Analytics & Engineering',
      rounds: [
        'Round 1: Aptitude & SQL Assessment (Joins, Aggregations, Window Functions)',
        'Round 2: Practical Data Challenge (Python/Pandas data manipulation or Excel model)',
        'Round 3: Business Problem-Solving & Technical Discussion on Academic Projects'
      ],
      sampleQuestions: [
        'Write a SQL query using RANK() or DENSE_RANK() to find the 2nd highest salary per department.',
        'What is the difference between WHERE and HAVING clauses in SQL with an example?',
        'How do you handle missing values or outliers in a dataset using Python Pandas?'
      ],
      studyGuideUrl: '/guides/data-analyst-interview-questions-answers-freshers',
      studyGuideTitle: 'Data Analyst & SQL Interview Guide'
    };
  }

  if (t.includes('web') || t.includes('frontend') || t.includes('react') || t.includes('full stack') || s.includes('react') || s.includes('javascript')) {
    return {
      domain: 'Web & Full Stack Development',
      rounds: [
        'Round 1: Core Coding & MCQ Round (JavaScript closures, DOM manipulation, basic DSA)',
        'Round 2: Component Architecture & Machine Coding (Build a dynamic stateful component)',
        'Round 3: API Integration, State Management, and Architecture Walkthrough'
      ],
      sampleQuestions: [
        'Explain how the React Virtual DOM diffing algorithm works compared to direct DOM updates.',
        'What is the difference between useEffect, useMemo, and useCallback hooks?',
        'How does JavaScript handle asynchronous code via the Event Loop, Microtasks, and Call Stack?'
      ],
      studyGuideUrl: '/guides/full-stack-developer-roadmap-freshers-guide',
      studyGuideTitle: 'Full-Stack Developer Interview Roadmap'
    };
  }

  if (t.includes('qa') || t.includes('test') || s.includes('selenium') || s.includes('automation')) {
    return {
      domain: 'Software Testing & QA Automation',
      rounds: [
        'Round 1: Manual Testing Fundamentals (SDLC/STLC, Test Scenarios, Boundary Value Analysis)',
        'Round 2: Practical Automation & Scripting (Selenium WebDriver, Locators, Postman API tests)',
        'Round 3: Bug Life Cycle, Defect Severity vs Priority, and Behavioral Fitment'
      ],
      sampleQuestions: [
        'What is the difference between Functional Testing and Non-Functional Testing?',
        'How do you write a test scenario using Equivalence Partitioning and Boundary Value Analysis?',
        'Explain the structure of an automated testing framework and how Page Object Model (POM) helps.'
      ],
      studyGuideUrl: '/guides',
      studyGuideTitle: 'Software Testing & Automation Preparation'
    };
  }

  // Default: Software Engineering & Core CS
  return {
    domain: 'Software Engineering & Core CS',
    rounds: [
      'Round 1: Online Technical Assessment (Quantitative Aptitude, Logical Reasoning, 2 Coding Problems)',
      'Round 2: Technical Interview (Data Structures, OOPs concepts, DBMS queries, OS basics)',
      'Round 3: System Design Fundamentals, Academic Project deep-dive, and HR Fitment'
    ],
    sampleQuestions: [
      'Explain the four fundamental pillars of Object-Oriented Programming (OOPs) with practical examples.',
      'What is the time and space complexity of QuickSort vs MergeSort, and when would you choose each?',
      'Explain ACID properties in Database Management Systems and why they matter.'
    ],
    studyGuideUrl: '/guides/top-50-java-interview-questions-answers-freshers-2026',
    studyGuideTitle: 'Core CS & Technical Interview Masterclass'
  };
}

// Calculate rough monthly in-hand take-home salary from annual CTC
function computeInHandSalary(salaryStr?: string | null): { inHandMonthly: string; note: string } | null {
  if (!salaryStr) return null;
  const s = salaryStr.toLowerCase();

  // If already monthly (e.g. "₹25,000 / month")
  if (s.includes('/ month') || s.includes('/month') || s.includes('stipend')) {
    const numMatch = s.match(/([0-9,]+)/);
    if (numMatch) {
      return {
        inHandMonthly: `₹${numMatch[1]} / month`,
        note: 'Direct monthly stipend credited without standard EPF deductions.'
      };
    }
  }

  // If annual LPA (e.g. "₹4.5 LPA" or "4 - 6 LPA")
  const lpaMatch = s.match(/([0-9.]+)\s*(?:-|to)?\s*([0-9.]*)\s*lpa/i);
  if (lpaMatch) {
    const minLpa = parseFloat(lpaMatch[1]);
    const maxLpa = lpaMatch[2] ? parseFloat(lpaMatch[2]) : minLpa;
    const avgLpa = (minLpa + maxLpa) / 2;

    // Approximate in-hand calculation under Indian New Tax Regime:
    // Annual CTC minus ~12% PF & professional tax. Up to 7 LPA is zero income tax.
    const monthlyGross = (avgLpa * 100000) / 12;
    const monthlyNet = Math.round(monthlyGross * 0.88); // Deducting ~12% EPF & PT

    const formattedMonthly = `₹${monthlyNet.toLocaleString('en-IN')}`;
    return {
      inHandMonthly: `~${formattedMonthly} / month`,
      note: `Estimated take-home for ${salaryStr} after standard EPF and statutory deductions.`
    };
  }

  return null;
}

export default function JobFresherIntelligence({ job, isInternship }: JobFresherIntelligenceProps) {
  const blueprint = getInterviewBlueprint(job.title, job.skills || []);
  const salaryInsight = computeInHandSalary(job.salary);

  // Pick top 4-6 required skills for the ATS checklist
  const atsSkills = (job.skills && job.skills.length > 0) 
    ? job.skills.slice(0, 6) 
    : ['Programming Fundamentals', 'Problem Solving', 'Data Structures', 'Git & Version Control'];

  return (
    <section className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-card to-card p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/40 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 px-3 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" /> Fresher Intelligence &amp; Preparation Blueprint
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            How to Crack the {job.title} Role at {job.company}
          </h2>
        </div>

        <Link
          href="/career-tools"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
        >
          <Calculator className="h-3.5 w-3.5" />
          <span>Launch Career Toolkit</span>
        </Link>
      </div>

      {/* Grid: ATS Keyword Matcher & Expected Hiring Rounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: ATS Resume Keyword Optimization */}
        <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <FileCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>Target ATS Keywords for Your Resume</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Applicant Tracking Systems (ATS) score your application against these core competencies. Ensure they are highlighted in your resume:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {atsSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                <Check className="h-3 w-3 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Want to score your resume?</span>
            <Link
              href="/career-tools"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Test ATS Score</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Typical Selection & Interview Rounds */}
        <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <BookOpen className="h-4.5 w-4.5 text-[#275df5]" />
            <span>Expected Hiring Rounds ({blueprint.domain})</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Standard selection pattern for entry-level candidates applying for this profile:
          </p>

          <ul className="space-y-2 text-xs text-foreground/90 font-medium">
            {blueprint.rounds.map((round, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-tight">{round}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Preparation resource:</span>
            <Link
              href={blueprint.studyGuideUrl}
              className="text-[#275df5] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>{blueprint.studyGuideTitle}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Top 3 Technical Interview Questions Likely to be Asked */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <HelpCircle className="h-4.5 w-4.5 text-amber-500" />
          <span>Top Technical Interview Questions for this Role</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Prepare these essential conceptual and problem-solving questions before your technical discussion:
        </p>

        <div className="space-y-2 pt-1">
          {blueprint.sampleQuestions.map((q, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs text-foreground/90 font-medium border border-border/40"
            >
              <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Q{idx + 1}:</span>
              <span className="leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary In-Hand Take-Home Breakdown (if salary exists) */}
      {salaryInsight && (
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>Estimated In-Hand Monthly Take-Home</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {salaryInsight.inHandMonthly}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                (CTC: {job.salary})
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {salaryInsight.note}
            </p>
          </div>

          <Link
            href="/career-tools"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 transition-all shadow-2xs self-start sm:self-auto shrink-0"
          >
            <span>Customize In-Hand CTC</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Verification & Anti-Scam Notice */}
      <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/50 border border-border/60 p-3.5 flex items-start gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-foreground">Official Direct Application:</strong> FreshersBridge directs you to the verified official portal of {job.company}. We enforce a zero-tolerance policy against fake recruiters. Never pay money for any job interview, test, or offer letter.
        </div>
      </div>

    </section>
  );
}

