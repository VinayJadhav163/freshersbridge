import { JobListSkeleton } from '@/components/skeletons/JobCardSkeleton';

export default function JobsLoading() {
  return <JobListSkeleton title="Off-Campus Tech Job Drives" isInternship={false} count={6} />;
}
