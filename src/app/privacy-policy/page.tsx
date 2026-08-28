import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, ArrowLeft, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | FreshersBridge',
  description:
    'Privacy Policy for FreshersBridge - Learn how we collect, protect, and use your data, including Google Analytics, cookies, and email subscriptions.',
};

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="h-3.5 w-3.5" /> Privacy & Data Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Last Updated: February 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
        
        <p>
          Welcome to <strong className="text-foreground">FreshersBridge</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website (<strong className="text-foreground">freshersbridge.in</strong>).
        </p>

        <hr className="border-border" />

        {/* 1. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          
          <div className="space-y-2 pl-4 border-l-2 border-indigo-500/40">
            <h3 className="font-bold text-foreground text-sm">a) Personal Information</h3>
            <p>When you voluntarily subscribe to job updates or contact us, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Name</li>
              <li>Email address</li>
            </ul>

            <h3 className="font-bold text-foreground text-sm pt-2">b) Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>IP address</li>
              <li>Browser type & Device information</li>
              <li>Pages visited, Date & Time of visit</li>
              <li>Usage data</li>
            </ul>
          </div>
        </section>

        <hr className="border-border" />

        {/* 2. Use of Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Use of Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Send job updates and notifications (if subscribed)</li>
            <li>Improve website functionality and user experience</li>
            <li>Analyze traffic and user behavior</li>
            <li>Monitor website performance</li>
            <li>Prevent fraud and misuse</li>
          </ul>
        </section>

        <hr className="border-border" />

        {/* 3. Google Analytics */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Google Analytics</h2>
          <p>
            We use Google Analytics, a web analytics service provided by Google, to understand how users interact with our website. Google Analytics may collect information such as IP address, device information, and browsing behavior through cookies and similar technologies.
          </p>
          <p>
            This information helps us improve our services. You can learn more about how Google uses data by visiting Google’s Privacy Policy.
          </p>
        </section>

        <hr className="border-border" />

        {/* 4. Google AdSense */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Google AdSense</h2>
          <p>
            We may use Google AdSense to display advertisements. Google, as a third-party vendor, may use cookies (including the DoubleClick cookie) to serve ads based on a user&apos;s prior visits to this website or other websites.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        <hr className="border-border" />

        {/* 5. Affiliate Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">5. Affiliate Links</h2>
          <p>
            Some links on our website may be affiliate links. This means we may earn a small commission if you click on the link and take action (such as registering or applying). This comes at no additional cost to you.
          </p>
          <p>
            Affiliate partners may use their own cookies and tracking technologies, which are governed by their respective privacy policies.
          </p>
        </section>

        <hr className="border-border" />

        {/* 6. Cookies */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">6. Cookies</h2>
          <p>
            We use cookies to improve user experience, analyze traffic, and serve relevant advertisements. You may choose to disable cookies through your browser settings. However, some features of the website may not function properly if cookies are disabled.
          </p>
        </section>

        <hr className="border-border" />

        {/* 7. Email Subscription */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">7. Email Subscription</h2>
          <p>
            If you subscribe to our job alerts, we will use your name and email address to send important job updates. You may unsubscribe at any time by clicking the unsubscribe link in our emails or by contacting us.
          </p>
          <p className="font-bold text-foreground">
            We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        <hr className="border-border" />

        {/* 8. Third-Party Links */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">8. Third-Party Links</h2>
          <p>
            Our website contains links to third-party websites (such as company career pages and opportunity platforms). We are not responsible for the privacy practices or content of these external websites. We encourage users to review their privacy policies before sharing any personal information.
          </p>
        </section>

        <hr className="border-border" />

        {/* 9. Data Security */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">9. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <hr className="border-border" />

        {/* 10. Children's Privacy */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">10. Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        <hr className="border-border" />

        {/* 11. Legal Compliance */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">11. Legal Compliance</h2>
          <p>
            We may disclose personal information if required to do so by law or in response to valid legal requests.
          </p>
        </section>

        <hr className="border-border" />

        {/* 12. Changes to This Privacy Policy */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <hr className="border-border" />

        {/* 13. Contact Us */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">13. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please contact us at:
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
