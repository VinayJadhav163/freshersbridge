'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';
import { getCompanyLogo, getCompanyColor } from '@/lib/companiesData';

interface JobCardProps {
  job: Job;
}

function getValidSalary(salary?: string | null): string | null {
  if (!salary) return null;
  const s = salary.trim();
  const lower = s.toLowerCase();
  if (
    lower === 'apply' ||
    lower.includes('not disclosed') ||
    lower.includes('as per industry') ||
    lower.includes('industry standard') ||
    lower.includes('best in industry') ||
    lower.includes('competitive') ||
    lower === 'n/a' ||
    lower === 'na' ||
    lower === 'tbd'
  ) {
    return null;
  }
  return s;
}

function formatEligibility(eligibility?: string | null): string {
  if (!eligibility) return 'All Freshers & Graduates';
  return eligibility
    .replace(/\s*\(\s*internship\s*\/\s*students\s*&\s*freshers\s*\)/gi, '')
    .replace(/\s*\(\s*internship\s*\)/gi, '')
    .replace(/\s*\(\s*students\s*&\s*freshers\s*\)/gi, '')
    .trim() || eligibility;
}

function formatSkillName(skill: string): string {
  const s = skill.trim();
  const lower = s.toLowerCase();
  
  if (lower.includes('data structures') || lower === 'dsa') return 'DSA';
  if (lower.includes('mis reporting')) return 'MIS Reporting';
  if (lower === 'oop concepts' || lower.includes('object oriented')) return 'OOP';
  if (lower === 'computer networks') return 'Networks';
  if (lower === 'backend development') return 'Backend';
  if (lower === 'frontend development') return 'Frontend';
  if (lower === 'full stack development') return 'Full Stack';
  if (lower === 'software development') return 'Software Dev';
  if (lower === 'software engineering') return 'Software Eng';
  if (lower === 'quality control') return 'Quality Control';
  if (lower === 'quality analyst' || lower === 'quality assurance') return 'QA';
  if (lower.includes('api testing') || lower.includes('postman')) return 'API Testing';
  if (lower === 'artificial intelligence (ai)' || lower === 'artificial intelligence') return 'AI';
  if (lower === 'machine learning (ml)' || lower === 'machine learning') return 'ML';
  if (lower === 'problem solving') return 'Problem Solving';
  if (lower === 'git / github' || lower === 'git/github') return 'Git';
  if (lower === 'go (golang)') return 'Go';
  if (lower === 'ui/ux design') return 'UI/UX';
  
  return s;
}

function getCleanSkills(skills: string[] | undefined | null, jobTitle: string): string[] {
  if (!skills || skills.length === 0) return [];
  const titleLower = (jobTitle || '').toLowerCase().trim();
  
  return skills.filter((sk) => {
    const skLower = sk.toLowerCase().trim();
    if (!skLower) return false;
    // Filter out if skill is identical or duplicate of the job title
    if (skLower === titleLower || skLower.startsWith(titleLower) || titleLower.startsWith(skLower)) {
      return false;
    }
    // Filter out internship or contractor labels mistakenly stored as skills
    if (skLower.endsWith('internship') || skLower.includes('contractor') || skLower.includes('contractual')) {
      return false;
    }
    return true;
  });
}

export default function JobCard({ job }: JobCardProps) {
  const isInternship =
    job.job_type === 'internship' ||
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title) ||
    (job.apply_url && job.apply_url.toLowerCase().includes('/internship/')) ||
    (job.source_url && job.source_url.toLowerCase().includes('/internship/')) ||
    (job.eligibility && job.eligibility.toLowerCase().includes('(internship)'));

  const [imgError, setImgError] = useState(false);
  const detailUrl = isInternship ? `/internships/${job.slug}` : `/jobs/${job.slug}`;
  const packageText = getValidSalary(job.salary);
  const rawLogo = (job.company_logo && job.company_logo.trim()) || getCompanyLogo(job.company);
  const resolvedLogo = imgError ? null : rawLogo;
  const cleanEligibility = formatEligibility(job.eligibility);
  const cleanSkills = getCleanSkills(job.skills, job.title);
  const displaySkills = cleanSkills.length > 0 ? cleanSkills : (job.skills || []);

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#e7e7f1] dark:border-slate-800 bg-card p-3.5 sm:p-4 max-w-xl w-full h-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[#275df5]/40 shadow-[0px_4px_10px_rgba(30,10,58,0.04)] hover:shadow-[0px_6px_20px_rgba(30,10,58,0.08)] group cursor-pointer"
    >
      {/* Whole Card Clickable Link Overlay */}
      <Link href={detailUrl} className="absolute inset-0 z-0" aria-label={job.title} />

      <div className="space-y-2.5 relative z-10 pointer-events-none">
        {/* Header Row: Title & Company vs Logo */}
        <div className="flex items-start justify-between gap-3.5">
          <div className="space-y-1 min-w-0 flex-1">
            {/* Job Title: Up to 2 lines cleanly wrapped, never cuts off role name */}
            <h3 className="text-base sm:text-lg font-bold text-[#121224] dark:text-white tracking-tight leading-snug break-words group-hover:text-[#275df5] transition-colors pointer-events-auto">
              <Link href={detailUrl}>
                {job.title}
              </Link>
            </h3>

            {/* Company Line with fixed, consistent Internship Pill */}
            <div className="flex items-center gap-2 text-xs text-[#474d6a] dark:text-slate-400 flex-wrap">
              <span className="font-bold text-[#121224] dark:text-white">{job.company}</span>
              {isInternship && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  Internship
                </span>
              )}
            </div>
          </div>

          {/* Right Logo Avatar */}
          {resolvedLogo ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7e7f1] dark:border-slate-700 bg-white p-1 shadow-xs">
              <img
                src={resolvedLogo}
                alt={`${job.company} hiring logo`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                width={44}
                height={44}
                className="h-full w-full object-contain rounded-md"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border font-extrabold text-base shadow-xs ${getCompanyColor(job.company)}`}>
              {job.company.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Metadata Lines: Eligibility & Location (no truncation ...) */}
        <div className="space-y-1.5 text-xs text-[#474d6a] dark:text-slate-400 font-medium pt-0.5">
          <div className="flex items-start gap-2 min-w-0" title={job.eligibility}>
            <Briefcase className="h-3.5 w-3.5 text-[#717b9e] shrink-0 mt-0.5" />
            <span className="break-words leading-tight">{cleanEligibility}</span>
          </div>

          <div className="flex items-center gap-2 min-w-0" title={job.location}>
            <MapPin className="h-3.5 w-3.5 text-[#717b9e] shrink-0" />
            <span className="break-words leading-tight">{job.location}</span>
          </div>
        </div>

        {/* Skills: Clean natural badges with flex-wrap (zero clipped text, no overflow slicing) */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {displaySkills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
              >
                {formatSkillName(skill)}
              </span>
            ))}
            {displaySkills.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-slate-50 dark:bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800">
                +{displaySkills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Date, Package (if present) & Apply Button */}
      <div className="mt-3 pt-2.5 border-t border-[#f7f7f9] dark:border-slate-800/80 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#979ec2] font-medium">
            {formatDate(job.created_at)}
          </span>
          {packageText && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {packageText}
              </span>
            </>
          )}
        </div>

        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center rounded-full bg-[#edf4ff] dark:bg-blue-950/60 px-4 py-1.5 text-xs font-bold text-[#275df5] dark:text-blue-400 hover:bg-[#275df5] hover:text-white transition-all relative z-20 min-h-[28px]"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
