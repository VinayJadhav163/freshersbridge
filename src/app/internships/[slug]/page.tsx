import { permanentRedirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function InternshipRedirectPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/jobs/${slug}`);
}
