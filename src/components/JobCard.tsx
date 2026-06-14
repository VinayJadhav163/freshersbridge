import Link from 'next/link';
import { MapPin, Calendar, DollarSign, Eye, GraduationCap } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const isFeatured = job.featured_job;

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isFeatured
          ? 'border-indigo-500/40 bg-indigo-50/5 dark:bg-indigo-950/5 shadow-md shadow-indigo-500/5 hover:border-indigo-500 hover:shadow-indigo-500/10'
          : 'border-border hover:border-muted'
      }`}
    >
      {/* Featured Badge Glow Effect */}
      {isFeatured && (
        <span className="absolute top-0 right-0 rounded-bl-lg bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          Featured
        </span>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
            {job.company}
          </span>
          <h3 className="mt-1 text-lg font-bold text-foreground line-clamp-1 group-hover:text-indigo-600">
            <Link href={`/jobs/${job.slug}`} className="hover:underline">
              {job.title}
            </Link>
          </h3>
        </div>

        {/* Quick details */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <span className="truncate">{job.eligibility}</span>
          </div>

          {job.salary && (
            <div className="flex items-center gap-1.5 min-w-0">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
              <span className="truncate font-medium text-foreground/80">{job.salary}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <span>{formatDate(job.created_at)}</span>
          </div>
        </div>

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-medium flex items-center">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          {job.views_count} views
        </span>

        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
