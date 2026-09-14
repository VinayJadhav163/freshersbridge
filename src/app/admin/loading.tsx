import { PageSkeleton } from '@/components/skeletons/PageSkeleton';

export default function AdminLoading() {
  return <PageSkeleton title={true} cardsCount={3} />;
}
