import { NotFoundGlitch } from '@/components/ui/be-ui-404-not-found';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | FreshersBridge',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] w-full items-center justify-center">
      <NotFoundGlitch />
    </main>
  );
}
