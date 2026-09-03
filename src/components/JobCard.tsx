'use client';

import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';
import { getCompanyLogo } from '@/lib/companiesData';

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

export default function JobCard({ job }: JobCardProps) {
  const isFeatured = job.featured_job;
  const isInternship =
    job.job_type === 'internship' ||
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title);

  const detailUrl = isInternship ? `/internships/${job.slug}` : `/jobs/${job.slug}`;
  const packageText = getValidSalary(job.salary);
  const resolvedLogo = (job.company_logo && job.company_logo.trim()) || getCompanyLogo(job.company);

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#e7e7f1] dark:border-slate-800 bg-card p-3.5 sm:p-4 max-w-xl w-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[#275df5]/40 shadow-[0px_4px_10px_rgba(30,10,58,0.04)] hover:shadow-[0px_6px_20px_rgba(30,10,58,0.08)] group cursor-pointer"
    >
      {/* Whole Card Clickable Link Overlay */}
      <Link href={detailUrl} className="absolute inset-0 z-0" aria-label={job.title} />

      <div className="space-y-2 relative z-10 pointer-events-none">
        {/* Header Row: Title & Company vs Logo */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#121224] dark:text-white tracking-tight leading-snug truncate group-hover:text-[#275df5] transition-colors pointer-events-auto">
                <Link href={detailUrl}>
                  {job.title}
                </Link>
              </h3>
              {isInternship && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Internship
                </span>
              )}
            </div>
            
            {/* Company Line */}
            <div className="text-xs text-[#474d6a] dark:text-slate-400">
              <span className="font-bold text-[#121224] dark:text-white">{job.company}</span>
            </div>
          </div>

          {/* Right Logo Avatar */}
          {resolvedLogo ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7e7f1] dark:border-slate-700 bg-white p-1 shadow-xs">
              <img
                src={resolvedLogo}
                alt={job.company}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-[#e7e7f1] dark:border-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-base shadow-xs">
              {job.company.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Metadata Lines: Eligibility & Location */}
        <div className="space-y-1 text-xs text-[#474d6a] dark:text-slate-400 font-medium pt-0.5">
          <div className="flex items-center gap-2 min-w-0" title={job.eligibility}>
            <Briefcase className="h-3.5 w-3.5 text-[#717b9e] shrink-0" />
            <span className="truncate">{job.eligibility}</span>
          </div>

          <div className="flex items-center gap-2 min-w-0" title={job.location}>
            <MapPin className="h-3.5 w-3.5 text-[#717b9e] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        </div>

        {/* Skills Line (Up to 6 skills with dot separator) */}
        {job.skills && job.skills.length > 0 && (
          <div className="pt-0.5 text-xs text-[#717b9e] dark:text-slate-400 font-medium truncate" title={job.skills.join(', ')}>
            {job.skills.slice(0, 6).join('  ·  ')}
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
          className="inline-flex items-center justify-center rounded-full bg-[#edf4ff] dark:bg-blue-950/60 px-4 py-1 text-xs font-bold text-[#275df5] dark:text-blue-400 hover:bg-[#275df5] hover:text-white transition-all relative z-20"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
