'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, X, ArrowUpRight } from 'lucide-react';

export type TemplateCategory = 'Follow-up' | 'Interview' | 'Offer' | 'Networking';

export interface TemplateItem {
  id: string;
  category: TemplateCategory;
  icon: string;
  title: string;
  timing: string;
  subject: string;
  body: string;
}

const CATEGORIES: { name: string; value: 'All' | TemplateCategory }[] = [
  { name: 'All (12)', value: 'All' },
  { name: 'Follow-up', value: 'Follow-up' },
  { name: 'Interview', value: 'Interview' },
  { name: 'Offer', value: 'Offer' },
  { name: 'Networking', value: 'Networking' },
];

const TEMPLATES: TemplateItem[] = [
  {
    id: 'request-schedule-interview',
    category: 'Interview',
    icon: '🎯',
    title: 'Request to Schedule Interview (Matching Skills Follow-up)',
    timing: 'Send 2–4 days after applying to stand out directly to HR',
    subject: 'Application & Interview Request: [role] — [Your Name]',
    body: `Dear [Hiring Manager / HR Team Name],

I hope this email finds you well.

I recently went through the Job Description for the [role] opening at [Company] and have submitted my official application through your portal.

Upon thoroughly reviewing the required qualifications, I found that my technical skill set in [mention 2-3 key skills from JD, e.g. React, Node.js, Python, or Problem Solving] strongly matches what you are looking for. I have also built practical projects around [mention 1 relevant project/achievement] that align directly with your requirements.

Given how closely my background lines up with the role, I would welcome the opportunity to discuss how I can contribute to your team. Could we please schedule a brief introductory interview or technical conversation at your convenience?

I have attached my resume for your ready reference, and I am available for a conversation at any time that suits your schedule.

Thank you very much for your time and consideration.

Warm regards,
[Your Name]
[Your Phone Number]
[Your LinkedIn / Portfolio Link]`,
  },
  {
    id: 'follow-up-applying',
    category: 'Follow-up',
    icon: '✉️',
    title: 'Follow-up after applying (no reply)',
    timing: 'Send 5–7 working days after you apply',
    subject: 'Following up — [role] application',
    body: `Dear Hiring Team,

I applied for the [role] position at [Company] on [date you applied], and I wanted to check whether my application is still under review.

I am keen on this role because it lines up closely with what I have been building my skills around, and I would welcome the chance to take it forward. If anything further is needed from my side — a test, a portfolio, or references — I can share it the same day.

Thank you for your time.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'second-follow-up',
    category: 'Follow-up',
    icon: '🔁',
    title: 'Second follow-up (final nudge)',
    timing: 'One week after the first follow-up — then stop',
    subject: 'Re: Following up — [role] application',
    body: `Dear Hiring Team,

I am writing to briefly follow up on my previous email regarding the [role] application at [Company].

I remain very interested in the opportunity. If the position has been filled or the hiring timeline has changed, I would appreciate a quick update.

Thank you once again for your time and consideration.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'application-status',
    category: 'Follow-up',
    icon: '📋',
    title: 'Asking for application status update',
    timing: 'When the portal has said "In review" for weeks',
    subject: 'Status Update Request — [role] application',
    body: `Dear Hiring Manager,

I hope this email finds you well.

I submitted my application for the [role] position at [Company] a few weeks ago and noticed on the career portal that my status is currently marked as 'In Review'.

I wanted to check if there are any updates regarding the next steps in the hiring process or if you require any additional details from my end.

Thank you for your time and guidance.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'thank-you-interview',
    category: 'Interview',
    icon: '🙏',
    title: 'Thank-you note after an interview',
    timing: 'Within 24 hours of the interview',
    subject: 'Thank you — [role] interview',
    body: `Dear [Interviewer Name],

Thank you for taking the time to speak with me today about the [role] position at [Company]. I really enjoyed learning more about the team and [mention a specific topic discussed].

Our conversation confirmed my enthusiasm for joining [Company]. I am confident that my background in [your main skill/project] would allow me to contribute effectively to your upcoming projects.

Please let me know if you need any additional information from me. Looking forward to hearing about the next steps.

Best regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'asking-result',
    category: 'Interview',
    icon: '⏰',
    title: 'Asking about the interview result',
    timing: 'After the date they promised has passed',
    subject: 'Update on Interview Result — [role] position',
    body: `Dear [Interviewer Name / HR Team],

I hope you are having a good week.

Following up on our interview on [Date], I am writing to check if there are any updates regarding the decision for the [role] position at [Company].

I remain very excited about the possibility of joining your team and contributing to [Company Name].

Thank you again for your time and consideration.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'accepting-offer',
    category: 'Offer',
    icon: '✅',
    title: 'Accepting an offer',
    timing: 'Same day you decide — do not sit on it',
    subject: 'Job Offer Acceptance — [role]',
    body: `Dear [HR Name / Hiring Manager],

Thank you very much for offering me the [role] position at [Company]. I am thrilled to accept this offer!

As discussed, I accept the terms of employment including the starting salary and benefits. I am excited to join the team on [Joining Date].

Please let me know if there are any documents or formalities I need to complete prior to my start date.

Sincerely,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'offer-letter-status',
    category: 'Offer',
    icon: '📄',
    title: 'Asking for the offer letter status',
    timing: 'When the verbal offer has not become paper',
    subject: 'Written Offer Letter Request — [role]',
    body: `Dear [HR Name],

Thank you again for extending the verbal offer for the [role] position at [Company]. I am very excited to join the team.

I wanted to kindly check on the status of the formal written offer letter so I can review and complete the onboarding paperwork.

Please let me know if you need any further information from my side to prepare the document.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'joining-date-extension',
    category: 'Offer',
    icon: '🗓️',
    title: 'Requesting a joining date extension',
    timing: 'As soon as you know you cannot make the date',
    subject: 'Joining Date Extension Request — [role]',
    body: `Dear [HR Manager Name],

I am very excited to join [Company] as a [role].

Due to [reason, e.g., college graduation formalities / notice period requirement], I would like to kindly request a short extension of my joining date from [Original Date] to [Proposed New Date].

I appreciate your understanding and support with this adjustment. Please let me know if this new date works for the team.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'declining-offer',
    category: 'Offer',
    icon: '🙋',
    title: 'Politely declining an offer',
    timing: 'Within 2 days — they are holding the seat for you',
    subject: 'Offer Decision — [role] position',
    body: `Dear [HR Manager / Hiring Team],

Thank you so much for offering me the [role] position at [Company]. I truly appreciate your time and consideration throughout the interview process.

After careful thought, I am writing to inform you that I have decided to accept another opportunity that closely aligns with my current career goals. Therefore, I must respectfully decline your offer.

Thank you again for the opportunity, and I wish [Company] continued success.

Best regards,
[Your Name]
[Your Phone Number]`,
  },
  {
    id: 'referral-request',
    category: 'Networking',
    icon: '🤝',
    title: 'Asking an employee for a referral',
    timing: 'After you have engaged with them at least once',
    subject: 'Referral Request for [Role] at [Company]',
    body: `Hi [Employee Name],

I hope you are doing well.

I have been following [Company] and came across the opening for [role, Job ID if available]. Given your experience at [Company], I was wondering if you would be open to referring me for this role.

My background includes [key skill/project], which aligns well with the requirements. I have attached my resume for your reference.

Thank you for your time and any support you can provide!

Best regards,
[Your Name]
[LinkedIn Profile Link]
[Your Phone Number]`,
  },
  {
    id: 'withdrawing-application',
    category: 'Follow-up',
    icon: '📝',
    title: 'Withdrawing an application',
    timing: 'The moment you accept elsewhere',
    subject: 'Application Withdrawal — [role] position',
    body: `Dear Hiring Team,

I am writing to inform you that I wish to withdraw my application for the [role] position at [Company].

I recently accepted another job offer and will not be able to proceed further in your selection process. I want to thank you for your time and consideration during the recruitment process.

Wishing your team all the best in finding the right candidate.

Warm regards,
[Your Name]
[Your Phone Number]`,
  },
];

export default function HREmailTemplates() {
  const [activeCategory, setActiveCategory] = useState<'All' | TemplateCategory>('All');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<'email' | 'subject' | 'both' | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTemplate(null);
      }
    };
    if (selectedTemplate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTemplate]);

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleCopy = (template: TemplateItem, type: 'email' | 'subject' | 'both') => {
    let textToCopy = '';
    if (type === 'subject') {
      textToCopy = template.subject;
    } else if (type === 'email') {
      textToCopy = template.body;
    } else {
      textToCopy = `Subject: ${template.subject}\n\n${template.body}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedStatus(type);

    setTimeout(() => {
      setCopiedStatus(null);
    }, 2500);
  };

  const getCategoryBadgeClass = (category: TemplateCategory) => {
    switch (category) {
      case 'Follow-up':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800';
      case 'Interview':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800';
      case 'Offer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
      case 'Networking':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800';
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 w-full">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Copy-Ready Career Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span>✉️</span> HR Email Templates for Freshers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            12 copy-ready professional email templates to handle every stage of your job hunt.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                type="button"
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 border border-border'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 12 Templates Grid (Compact, Sleek, Perfectly Proportioned Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {filteredTemplates.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedTemplate(item)}
            className="group relative rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 text-base border border-indigo-100/80 dark:border-indigo-900/60 shadow-2xs group-hover:scale-105 transition-transform">
                    {item.icon}
                  </span>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                <div className="h-6 w-6 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5 line-clamp-1">
                  {item.timing}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
              <span>View & Copy Template</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL DIALOG WITH BLURRED BACKGROUND */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedTemplate(null)}
        >
          {/* Modal Container (Stop Propagation so clicking inside doesn't close) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-2xl border border-indigo-100 dark:border-indigo-900 shadow-xs">
                  {selectedTemplate.icon}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${getCategoryBadgeClass(selectedTemplate.category)}`}>
                      {selectedTemplate.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {selectedTemplate.timing}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary hover:bg-slate-200 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[60vh]">
              {/* Subject Line Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>SUBJECT LINE</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedTemplate, 'subject')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedStatus === 'subject' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Subject</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3 text-xs sm:text-sm font-semibold text-foreground select-all">
                  {selectedTemplate.subject}
                </div>
              </div>

              {/* Email Body Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>EMAIL BODY</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedTemplate, 'email')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedStatus === 'email' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Body</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs sm:text-sm text-foreground/90 font-sans leading-relaxed whitespace-pre-wrap select-all font-normal shadow-inner">
                  {selectedTemplate.body}
                </div>
              </div>
            </div>

            {/* Modal Footer with 3 Copy Actions */}
            <div className="p-4 sm:p-5 border-t border-border bg-secondary/40 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              {/* Primary Copy Email */}
              <button
                type="button"
                onClick={() => handleCopy(selectedTemplate, 'email')}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                {copiedStatus === 'email' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Email Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Email Body</span>
                  </>
                )}
              </button>

              {/* Copy Subject */}
              <button
                type="button"
                onClick={() => handleCopy(selectedTemplate, 'subject')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground py-2.5 px-4 text-xs sm:text-sm font-semibold border border-border transition-all active:scale-95 cursor-pointer"
              >
                {copiedStatus === 'subject' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Subject Copied!</span>
                  </>
                ) : (
                  <span>Copy Subject</span>
                )}
              </button>

              {/* Copy Both */}
              <button
                type="button"
                onClick={() => handleCopy(selectedTemplate, 'both')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground py-2.5 px-4 text-xs sm:text-sm font-semibold border border-border transition-all active:scale-95 cursor-pointer"
              >
                {copiedStatus === 'both' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Subject & Body Copied!</span>
                  </>
                ) : (
                  <span>Copy Both</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
