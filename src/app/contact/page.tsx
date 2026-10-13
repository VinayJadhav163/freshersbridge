import { Metadata } from 'next';
import ContactFormClient from '@/components/ContactFormClient';

export const metadata: Metadata = {
  title: 'Contact Us | FreshersBridge',
  description:
    'Contact the FreshersBridge team for support, partnership inquiries, job posting requests, or feedback.',
  alternates: {
    canonical: 'https://freshersbridge.in/contact',
  },
  openGraph: {
    title: 'Contact Us | FreshersBridge',
    description:
      'Contact the FreshersBridge team for support, partnership inquiries, job posting requests, or feedback.',
    url: 'https://freshersbridge.in/contact',
  },
};

export default function ContactPage() {
  return <ContactFormClient />;
}
