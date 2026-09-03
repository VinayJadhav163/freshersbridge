'use client';

import Link from 'next/link';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

function formatSalaryBadge(salary?: string | null): string {
  if (!salary) return 'Apply to View';
  const s = salary.trim();
  const lower = s.toLowerCase();
  if (
    lower.includes('not disclosed') ||
    lower.includes('as per industry') ||
    lower.includes('industry standard') ||
    lower.includes('best in industry') ||
    lower.includes('competitive') ||
    lower === 'n/a' ||
    lower === 'na' ||
    lower === 'tbd'
  ) {
    return 'Apply';
  }
  return s;
}

export default function JobCard({ job }: JobCardProps) {
  const isInternship =
    job.job_type === 'internship' ||
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title);

  const detailUrl = isInternship ? `/internships/${job.slug}` : `/jobs/${job.slug}`;
  const salaryText = formatSalaryBadge(job.salary);

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 w-full transition-all duration-200 hover:border-[#275df5] hover:shadow-[0_4px_16px_rgba(39,93,245,0.08)] group cursor-pointer"
    >
      {/* Whole Card Clickable Link Overlay */}
      <Link href={detailUrl} className="absolute inset-0 z-0" aria-label={job.title} />

      <div className="space-y-3 relative z-10 pointer-events-none">
        {/* Top Meta Bar: Recruiter Activity & Drive Type */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/70 dark:border-emerald-800/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Actively Hiring
            </span>
            {isInternship ? (
              <span className="inline-flex items-center rounded text-[10.5px] font-semibold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 px-2 py-0.5 border border-sky-200/70 dark:border-sky-800/50">
                Internship
              </span>
            ) : (
              <span className="inline-flex items-center rounded text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 border border-slate-200 dark:border-slate-700">
                Off-Campus Drive
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
            {formatDate(job.created_at)}
          </span>
        </div>

        {/* Company Header Row */}
        <div className="flex items-start gap-3">
          {/* Company Logo or Clean Corporate Initial */}
          {job.company_logo && job.company_logo.trim() ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-1 shadow-2xs">
              <img
                src={job.company_logo.trim()}
                alt={job.company}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base shadow-2xs">
              {job.company.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug truncate group-hover:text-[#275df5] transition-colors pointer-events-auto">
              <Link href={detailUrl}>
                {job.title}
              </Link>
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
              {job.company}
            </p>
          </div>
        </div>

        {/* Structured Info Row: Location, Eligibility, CTC */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 min-w-0" title={job.location}>
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 min-w-0" title={job.eligibility}>
            <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{job.eligibility}</span>
          </div>
        </div>

        {/* Skills Tag Pills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10.5px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/70 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Salary Pill & Clear CTA Button */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white">
          <span className="text-[11px] font-medium text-slate-400">Package:</span>
          <span className="text-[#275df5] dark:text-[#4777fe] font-extrabold">{salaryText}</span>
        </div>

        <Link
          href={detailUrl}
          className="inline-flex items-center gap-1 rounded-lg bg-[#275df5] hover:bg-[#1f4cd0] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs relative z-20 pointer-events-auto"
        >
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
