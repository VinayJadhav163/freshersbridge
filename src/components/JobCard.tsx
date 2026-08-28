'use client';

import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

function getCompanyGradient(company: string) {
  const charCode = company.charCodeAt(0) || 0;
  const gradients = [
    'from-indigo-500 to-blue-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-pink-500 to-rose-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-blue-600 to-cyan-600 text-white',
    'from-violet-600 to-fuchsia-600 text-white'
  ];
  return gradients[charCode % gradients.length];
}

export default function JobCard({ job }: JobCardProps) {
  const isFeatured = job.featured_job;
  const isInternship =
    job.job_type === 'internship' ||
    /\b(intern|internship|interns|apprentice|fellowship)\b/i.test(job.title);

  const detailUrl = isInternship ? `/internships/${job.slug}` : `/jobs/${job.slug}`;

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[#e7e7f1] bg-card p-3.5 sm:p-4 max-w-xl w-full transition-all duration-300 hover:-translate-y-0.5 hover:border-[#275df5]/40 shadow-[0px_4px_10px_rgba(30,10,58,0.04)] hover:shadow-[0px_6px_20px_rgba(30,10,58,0.08)] group cursor-pointer"
    >
      {/* Whole Card Clickable Link Overlay */}
      <Link href={detailUrl} className="absolute inset-0 z-0" aria-label={job.title} />

      <div className="space-y-2 relative z-10 pointer-events-none">
        {/* Header Row: Title & Company vs Logo */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#121224] tracking-tight leading-snug truncate group-hover:text-[#275df5] transition-colors pointer-events-auto">
                <Link href={detailUrl}>
                  {job.title}
                </Link>
              </h3>
              {isInternship && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Internship
                </span>
              )}
            </div>
            
            {/* Company Line */}
            <div className="text-xs text-[#474d6a]">
              <span className="font-bold text-[#121224]">{job.company}</span>
            </div>
          </div>

          {/* Right Logo Avatar */}
          {job.company_logo && job.company_logo.trim() ? (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7e7f1] bg-white p-1 shadow-xs">
              <img
                src={job.company_logo.trim()}
                alt={job.company}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain rounded-md"
              />
            </div>
          ) : (
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getCompanyGradient(job.company)} font-extrabold text-base shadow-xs`}>
              {job.company.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Metadata Lines: Eligibility & Location */}
        <div className="space-y-1 text-xs text-[#474d6a] font-medium pt-0.5">
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
          <div className="pt-0.5 text-xs text-[#717b9e] font-medium truncate" title={job.skills.join(', ')}>
            {job.skills.slice(0, 6).join('  ·  ')}
          </div>
        )}
      </div>

      {/* Footer Row: Date & Apply Now */}
      <div className="mt-3 pt-2.5 border-t border-[#f7f7f9] flex items-center justify-between relative z-10">
        <span className="text-xs text-[#979ec2] font-medium">
          {formatDate(job.created_at)}
        </span>

        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center rounded-full bg-[#edf4ff] px-3.5 py-1 text-xs font-bold text-[#275df5] hover:bg-[#275df5] hover:text-white transition-all relative z-20"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
