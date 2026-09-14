import { JobListSkeleton } from '@/components/skeletons/JobCardSkeleton';

export default function InternshipsLoading() {
  return <JobListSkeleton title="Engineering & Tech Internships" isInternship={true} count={6} />;
}
