import Link from 'next/link';
import { Metadata } from 'next';
import { FileCode2, ArrowLeft, Mail, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | FreshersBridge',
  description:
    'Terms and Conditions for FreshersBridge - Read the rules, guidelines, and terms governing your use of our platform and job listings.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Scale className="h-3.5 w-3.5" /> Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Last Updated: February 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
        
        <p>
          Welcome to <strong className="text-foreground">FreshersBridge</strong> (freshersbridge.in). These Terms and Conditions (&quot;Terms&quot;) govern your use of our website. By accessing or using our website, you agree to comply with these Terms. If you do not agree, please do not use our website.
        </p>

        <hr className="border-border" />

        {/* 1. Use of Website */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Use of Website</h2>
          <p>
            <strong className="text-foreground">FreshersBridge</strong> provides job listings, internships, hackathons, career resources, and free course coupon information for informational purposes only. You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others.
          </p>
        </section>

        <hr className="border-border" />

        {/* 2. Job Listings & Opportunities */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Job Listings & Opportunities</h2>
          <p>
            We aggregate and share job opportunities from company websites and third-party platforms. We are not affiliated with, endorsed by, or officially connected to the companies whose job listings appear on this website unless explicitly stated.
          </p>
          <p>We do not guarantee:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Job availability</li>
            <li>Selection or interview calls</li>
            <li>Accuracy of job details</li>
            <li>Deadline validity</li>
          </ul>
          <p className="font-semibold text-foreground text-xs pt-1">
            Users are responsible for verifying information directly from official sources before applying.
          </p>
        </section>

        <hr className="border-border" />

        {/* 3. Affiliate Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Affiliate Links</h2>
          <p>
            Some links on this website may be affiliate links. This means we may earn a small commission if you register, apply, or take action through certain third-party platforms. This does not result in any additional cost to you.
          </p>
          <p>
            We do not guarantee outcomes related to third-party services accessed through affiliate links.
          </p>
        </section>

        <hr className="border-border" />

        {/* 4. Free Course Coupons */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Free Course Coupons</h2>
          <p>
            We may share promotional coupons and free course offers from third-party platforms. These offers are subject to availability and may expire at any time without notice. We do not control, guarantee, or manage these offers.
          </p>
        </section>

        <hr className="border-border" />

        {/* 5. Email Subscription */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">5. Email Subscription</h2>
          <p>
            If you subscribe to job updates, you agree to receive emails from us. You may unsubscribe at any time. We are not responsible for missed notifications due to incorrect email addresses or technical issues beyond our control.
          </p>
        </section>

        <hr className="border-border" />

        {/* 6. External Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">6. External Links</h2>
          <p>
            Our website contains links to third-party websites. We are not responsible for the content, accuracy, privacy practices, or services provided by these external websites. Accessing third-party websites is at your own risk.
          </p>
        </section>

        <hr className="border-border" />

        {/* 7. Intellectual Property */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">7. Intellectual Property</h2>
          <p>
            All content on FreshersBridge, including text, design, graphics, and branding, is the property of FreshersBridge unless otherwise stated. Unauthorized copying, reproduction, or redistribution is prohibited.
          </p>
        </section>

        <hr className="border-border" />

        {/* 8. Limitation of Liability */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">8. Limitation of Liability</h2>
          <p>
            Your use of this website is at your own risk. The website is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We shall not be held liable for any direct, indirect, incidental, or consequential damages arising from:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Use of our website</li>
            <li>Reliance on job listings</li>
            <li>Expired coupons</li>
            <li>Third-party platform issues</li>
          </ul>
        </section>

        <hr className="border-border" />

        {/* 9. Termination */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">9. Termination</h2>
          <p>
            We reserve the right to restrict or terminate access to our website at any time without notice if we believe a user has violated these Terms.
          </p>
        </section>

        <hr className="border-border" />

        {/* 10. Governing Law */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">10. Governing Law</h2>
          <p>
            These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes arising under these Terms shall fall under the jurisdiction of Indian courts.
          </p>
        </section>

        <hr className="border-border" />

        {/* 11. Changes to Terms */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">11. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms at any time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.
          </p>
        </section>

        <hr className="border-border" />

        {/* 12. Contact Us */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">12. Contact Us</h2>
          <p>
            If you have any questions regarding these Terms and Conditions, please contact us at:
          </p>
          <a
            href="mailto:freshersbridge@gmail.com"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            <Mail className="h-4 w-4" /> freshersbridge@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}
