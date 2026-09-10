'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Send, Check, MessageSquare, ArrowLeft, ExternalLink, Clock, ShieldAlert } from 'lucide-react';
import { AnimatedSubscribeButton } from '@/components/ui/animated-subscribe-button';

const STORAGE_KEY = 'fb_contact_submission_history';
const COOLDOWN_SECONDS = 180; // 3 minutes cooldown between messages
const MAX_DAILY_MESSAGES = 3; // Maximum 3 messages per 24 hours

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);

  // Anti-spam state
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [isDailyLimitReached, setIsDailyLimitReached] = useState<boolean>(false);

  const contactCardRef = useRef<HTMLDivElement>(null);

  // Helper to read submissions in last 24h
  const getRecentSubmissions = (): number[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const list = JSON.parse(raw);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return Array.isArray(list) ? list.filter((t: number) => t > oneDayAgo) : [];
    } catch {
      return [];
    }
  };

  // Check rate limit on component mount
  useEffect(() => {
    const recent = getRecentSubmissions();
    if (recent.length >= MAX_DAILY_MESSAGES) {
      setIsDailyLimitReached(true);
    }
    if (recent.length > 0) {
      const lastTime = Math.max(...recent);
      const elapsed = Math.floor((Date.now() - lastTime) / 1000);
      if (elapsed < COOLDOWN_SECONDS) {
        setCooldownRemaining(COOLDOWN_SECONDS - elapsed);
      }
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please write your message.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const recordSuccessfulSubmission = () => {
    const recent = [...getRecentSubmissions(), Date.now()];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {}

    setCooldownRemaining(COOLDOWN_SECONDS);
    if (recent.length >= MAX_DAILY_MESSAGES) {
      setIsDailyLimitReached(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check anti-spam limitations
    if (isDailyLimitReached || cooldownRemaining > 0 || isSubmitting || isSent) {
      return;
    }

    // Bot honeypot check
    if (honeypot.trim() !== '') {
      setIsSent(true);
      setTimeout(() => setSubmitted(true), 1000);
      return;
    }

    // Custom non-intrusive validation (no browser popup tooltip)
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFallbackMailto(null);

    try {
      // 1. Direct Web3Forms submission
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '6c3e4150-6343-4c3e-a6c0-299f736bd4d1',
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: `New Contact Message from ${formData.name.trim()}`,
          from_name: 'FreshersBridge Portal',
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        setIsSent(true);
        recordSuccessfulSubmission();
        setTimeout(() => {
          setSubmitted(true);
          contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
        return;
      }

      // 2. Fallback to /api/contact route
      const routeRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const routeData = await routeRes.json();
      if (routeData.requiresMailto && routeData.mailtoUrl) {
        setFallbackMailto(routeData.mailtoUrl);
        window.open(routeData.mailtoUrl, '_blank');
      }

      setIsSent(true);
      recordSuccessfulSubmission();
      setTimeout(() => {
        setSubmitted(true);
        contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
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
      setIsSent(true);
      recordSuccessfulSubmission();
      setTimeout(() => {
        setSubmitted(true);
        contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
    }
  };

  const handleSendAnother = () => {
    if (cooldownRemaining > 0 || isDailyLimitReached) return;
    setSubmitted(false);
    setIsSent(false);
    setFormData({ name: '', email: '', message: '' });
    setFormErrors({});
    contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
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
      <div ref={contactCardRef} className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Contact Details */}
          <div className="md:col-span-4 bg-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Accent Glows */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 text-xs font-bold text-indigo-300">
                Get in Touch
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

          {/* Right Column: Interactive Form & Anti-Spam Protected States */}
          <div className="md:col-span-8 p-6 sm:p-10 bg-card flex flex-col justify-center min-h-[540px]">
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
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 p-6 sm:p-8 text-center space-y-4 my-auto animate-in fade-in duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="h-6 w-6" />
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

                {/* Anti-Spam Limitation Info */}
                <div className="pt-3 space-y-3">
                  {isDailyLimitReached ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3.5 text-left flex items-start gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Daily Message Limit Reached</p>
                        <p className="text-xs text-amber-700/90 dark:text-amber-400/90">
                          To prevent spam, you have reached the limit of 3 messages today. For urgent queries, contact freshersbridge@gmail.com.
                        </p>
                      </div>
                    </div>
                  ) : cooldownRemaining > 0 ? (
                    <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/60 dark:bg-indigo-950/20 p-3 text-left flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span>Anti-spam cooldown active</span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        {formatCountdown(cooldownRemaining)}
                      </span>
                    </div>
                  ) : null}

                  <div>
                    <button
                      type="button"
                      disabled={cooldownRemaining > 0 || isDailyLimitReached}
                      onClick={handleSendAnother}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      {isDailyLimitReached
                        ? 'Message limit reached for today'
                        : cooldownRemaining > 0
                        ? `Send Another Message (wait ${formatCountdown(cooldownRemaining)})`
                        : 'Send Another Message'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Honeypot field (hidden from users, traps bots) */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_feedback_trap"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="Enter your name"
                    className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all font-medium ${
                      formErrors.name
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-border focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-xs font-medium text-rose-500">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    placeholder="Enter your email"
                    className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all font-medium ${
                      formErrors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-border focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs font-medium text-rose-500">{formErrors.email}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                    }}
                    placeholder="Write message here..."
                    className={`w-full h-32 sm:h-36 rounded-xl border bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm text-foreground outline-none transition-all font-sans font-medium resize-none overflow-y-auto ${
                      formErrors.message
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-border focus:border-indigo-600 focus:bg-background focus:ring-2 focus:ring-indigo-600/20'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-xs font-medium text-rose-500">{formErrors.message}</p>
                  )}
                </div>

                {/* Cooldown or Daily limit warning if returning user is restricted */}
                {isDailyLimitReached ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>Daily message limit reached (3/3). Please email freshersbridge@gmail.com for inquiries.</span>
                  </div>
                ) : cooldownRemaining > 0 ? (
                  <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/60 dark:bg-indigo-950/20 p-2.5 text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Anti-spam wait time active:</span>
                    </span>
                    <span className="font-mono font-bold">{formatCountdown(cooldownRemaining)}</span>
                  </div>
                ) : null}

                {/* Animated Submit Button */}
                <div className="pt-2 flex justify-center">
                  <AnimatedSubscribeButton
                    type="submit"
                    buttonColor="#0f172a"
                    buttonTextColor="#ffffff"
                    subscribeStatus={isSent}
                    disabled={isSubmitting || isSent || cooldownRemaining > 0 || isDailyLimitReached}
                    className="dark:!bg-indigo-600 dark:hover:!bg-indigo-500"
                    initialText={
                      isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span>Send Message</span>
                          <Send className="h-4 w-4" />
                        </span>
                      )
                    }
                    changeText={
                      <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Sent</span>
                      </span>
                    }
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

