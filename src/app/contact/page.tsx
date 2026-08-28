'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle2, Sparkles, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setFallbackMailto(null);

    try {
      // 1. Direct Web3Forms submission from browser (origin header matches domain/localhost)
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '6c3e4150-6343-4c3e-a6c0-299f736bd4d1',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Message from ${formData.name}`,
          from_name: 'FreshersBridge Portal',
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setSubmitted(true);
        return;
      }

      // 2. Fallback to /api/contact route
      const routeRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const routeData = await routeRes.json();
      if (routeData.requiresMailto && routeData.mailtoUrl) {
        setFallbackMailto(routeData.mailtoUrl);
        window.open(routeData.mailtoUrl, '_blank');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      const directMailto = `mailto:freshersbridge@gmail.com?subject=${encodeURIComponent(
        `Message from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      setFallbackMailto(directMailto);
      window.open(directMailto, '_blank');
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

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

      {/* Main Contact Card Container */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Contact Details */}
          <div className="md:col-span-4 bg-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Accent Glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-bold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" /> Get in Touch
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white !text-white drop-shadow-sm">Contact Us</h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 !text-slate-300 leading-relaxed font-medium">
                  Have questions, feedback, or job posting inquiries? Reach out directly to our team.
                </p>
              </div>
            </div>

            {/* Email Box */}
            <div className="py-8 relative z-10 space-y-6 border-t border-slate-800/80 mt-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/25 text-indigo-300 border border-indigo-400/30 shadow-inner">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-300 !text-slate-300 uppercase tracking-wider">Email</h3>
                  <a
                    href="mailto:freshersbridge@gmail.com"
                    className="mt-1 block text-sm font-semibold text-indigo-300 hover:text-white transition-colors break-all underline decoration-indigo-500/40 underline-offset-4"
                  >
                    freshersbridge@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Footer text */}
            <div className="relative z-10 pt-4 text-xs text-slate-400 !text-slate-400 font-medium">
              FreshersBridge Support Team • Response within 24 hours
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-8 p-6 sm:p-10 bg-card flex flex-col justify-center">
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Contact Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Contact Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                For us user&apos;s feedback is top-most important. Feel free to suggest changes that will make us better in future.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-8 text-center space-y-4 my-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 mx-auto text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {fallbackMailto ? 'Message Prepared for Email' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  {fallbackMailto
                    ? 'Thank you! Your message has been prepared for freshersbridge@gmail.com.'
                    : 'Thank you! Your message has been sent directly to freshersbridge@gmail.com. We will reply to your email shortly.'}
                </p>
                {fallbackMailto && (
                  <div className="pt-1">
                    <a
                      href={fallbackMailto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all"
                    >
                      <span>Open Email App / Gmail</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-indigo-600 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20 font-medium"
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20 font-medium"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write message here..."
                    className="w-full h-32 sm:h-36 rounded-xl border border-border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20 font-sans font-medium resize-none overflow-y-auto"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Now</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
