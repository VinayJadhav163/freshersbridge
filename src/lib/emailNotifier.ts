import { supabase } from '@/lib/supabase';
import { Job } from '@/types';

/**
 * Generates standard HTML email content for single job/internship notification
 */
export function generateJobNotificationHTML(job: Job): { subject: string; html: string; text: string } {
  const isInternship =
    job.job_type === 'internship' ||
    job.title.toLowerCase().includes('intern') ||
    job.eligibility.toLowerCase().includes('intern');

  const badgeLabel = isInternship ? 'INTERNSHIP DRIVE' : 'OFF-CAMPUS DRIVE';
  const badgeEmoji = isInternship ? '🎓' : '💼';
  const badgeBg = isInternship ? '#0284c7' : '#275df5';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshersbridge.in';
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const jobUrl = `${cleanSiteUrl}/jobs/${job.slug}`;

  const subject = `📢 New ${isInternship ? 'Internship' : 'Job'} Alert: ${job.title} at ${job.company}`;

  const skillsHtml = job.skills && job.skills.length > 0
    ? job.skills.slice(0, 6).map(skill => `<span style="display: inline-block; background-color: #edf4ff; color: #275df5; border: 1px solid #c7d8fe; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; margin-right: 5px; margin-bottom: 6px;">${skill}</span>`).join('')
    : '<span style="color: #717b9e; font-size: 12px;">Freshers & Experienced</span>';

  const text = `New Opportunity Alert!\n\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary || 'Best in Industry'}\nEligibility: ${job.eligibility}\n\nApply here: ${jobUrl}\n\nFreshersBridge - Your Bridge to First Career Step`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121224; line-height: 1.6;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e7e7f1;">
          
          <!-- Header Banner with Brand Logo -->
          <tr>
            <td style="background-color: #0d1326; padding: 26px 30px; text-align: center;">
              <a href="${cleanSiteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; font-family: 'Satoshi', 'Segoe UI', sans-serif;">
                      Freshers<span style="color: #275df5;">Bridge</span>
                    </td>
                  </tr>
                </table>
              </a>
              <p style="margin: 8px 0 0 0; font-size: 10.5px; color: #979ec2; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700;">
                DAILY OFF-CAMPUS DRIVES & INTERNSHIPS
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px 24px 30px;">
              
              <!-- Perfectly Aligned Badge -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: ${badgeBg}; border-radius: 50px; padding: 6px 16px; font-size: 11px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 0.8px; line-height: 1; vertical-align: middle;">
                    <span style="font-size: 13px; line-height: 1; vertical-align: middle; margin-right: 6px; display: inline-block;">${badgeEmoji}</span>
                    <span style="vertical-align: middle; display: inline-block; line-height: 1;">${badgeLabel}</span>
                  </td>
                </tr>
              </table>

              <!-- Job Title -->
              <h2 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #121224; line-height: 1.3;">
                ${job.title}
              </h2>
              <p style="margin: 0 0 22px 0; font-size: 14px; color: #474d6a; font-weight: 600;">
                at <strong style="color: #121224;">${job.company}</strong>
              </p>

              <!-- Job Details Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f9; border-radius: 14px; padding: 18px; border: 1px solid #e7e7f1; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 10px; font-size: 13.5px; color: #474d6a; font-weight: 500;">
                    📍 <strong style="color: #121224;">Location:</strong> ${job.location}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px; font-size: 13.5px; color: #474d6a; font-weight: 500;">
                    💰 <strong style="color: #121224;">Salary / Stipend:</strong> ${job.salary || 'Best in Industry'}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: ${job.application_deadline ? '10px' : '0px'}; font-size: 13.5px; color: #474d6a; font-weight: 500;">
                    🎓 <strong style="color: #121224;">Eligibility:</strong> ${job.eligibility}
                  </td>
                </tr>
                ${job.application_deadline ? `
                <tr>
                  <td style="font-size: 13.5px; color: #f04141; font-weight: 600;">
                    ⏰ <strong>Deadline:</strong> ${new Date(job.application_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>` : ''}
              </table>

              <!-- Required Skills -->
              <div style="margin-bottom: 28px;">
                <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 800; color: #717b9e; text-transform: uppercase; letter-spacing: 0.8px;">
                  Key Skills & Qualifications:
                </p>
                <div>
                  ${skillsHtml}
                </div>
              </div>

              <!-- CTA Apply Button -->
              <div style="text-align: center; margin: 32px 0 12px 0;">
                <a href="${jobUrl}" target="_blank" style="background-color: #275df5; color: #ffffff; text-decoration: none; font-size: 14.5px; font-weight: 800; padding: 15px 36px; border-radius: 14px; display: inline-block; box-shadow: 0 4px 16px rgba(39, 93, 245, 0.35);">
                  View Details & Apply Now →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #f7f7f9; padding: 22px 30px; text-align: center; border-top: 1px solid #e7e7f1;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #717b9e;">
                You are receiving this update because you subscribed to <strong>FreshersBridge Job Alerts</strong>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #979ec2;">
                © ${new Date().getFullYear()} FreshersBridge. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return { subject, html, text };
}

/**
 * Triggers subscriber notification email when a new job is created
 */
export async function notifySubscribersNewJob(job: Job): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const { data: subscribers, error: dbErr } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    if (dbErr) {
      console.warn('Could not fetch subscribers for email alert:', dbErr.message);
      return { success: false, count: 0, error: dbErr.message };
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers to notify.');
      return { success: true, count: 0 };
    }

    const emails = subscribers.map(s => s.email).filter(Boolean);
    const { subject, html, text } = generateJobNotificationHTML(job);

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'FreshersBridge Job Alerts <onboarding@resend.dev>';

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            reply_to: 'freshersbridge@gmail.com',
            to: emails.length === 1 ? emails[0] : 'subscribers@freshersbridge.in',
            bcc: emails.length > 1 ? emails : undefined,
            subject: subject,
            html: html,
            text: text,
          }),
        });

        if (res.ok) {
          console.log(`Successfully sent email notification via Resend to ${emails.length} subscribers.`);
          return { success: true, count: emails.length };
        } else {
          const errData = await res.json();
          console.error('Resend API error:', errData);
        }
      } catch (err) {
        console.error('Resend fetch exception:', err);
      }
    }

    console.log(`[Job Notification Ready] Job "${job.title}" created. ${emails.length} active subscribers queued for notification.`);
    return { success: true, count: emails.length };
  } catch (err: any) {
    console.error('Failed to notify subscribers:', err);
    return { success: false, count: 0, error: err?.message || 'Unknown error' };
  }
}

/**
 * Generates Unstop-style Multi-Job Digest HTML email matching FreshersBridge portal blue theme (#275df5)
 */
export function generateMultipleJobsDigestHTML(
  jobs: Job[],
  subscriberName: string = 'Job Seeker'
): { subject: string; html: string; text: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freshersbridge.in';
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const subject = `🔥 ${jobs.length} New Opportunities Curated for You | FreshersBridge Digest (${dateStr})`;

  const jobRowsHtml = jobs.map((job) => {
    const jobUrl = `${cleanSiteUrl}/jobs/${job.slug}`;
    const salaryBadge = job.salary || 'Best in Industry';
    const isIntern = job.job_type === 'internship' || job.title.toLowerCase().includes('intern');
    const badgeBg = '#edf4ff';
    const badgeColor = '#275df5';
    const badgeBorder = '#c7d8fe';

    return `
    <tr>
      <td style="padding-bottom: 10px;">
        <a href="${jobUrl}" target="_blank" style="text-decoration: none; display: block;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e7e7f1; border-radius: 14px; padding: 14px 16px;">
            <tr>
              <td style="vertical-align: middle;">
                <div style="font-size: 14px; font-weight: 800; color: #121224; margin-bottom: 3px; line-height: 1.3;">
                  ${job.title}
                </div>
                <div style="font-size: 12px; font-weight: 600; color: #717b9e;">
                  ${job.company} • <span style="color: #474d6a;">${job.location}</span>
                </div>
              </td>
              <td align="right" style="vertical-align: middle; padding-left: 10px; white-space: nowrap;">
                <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder}; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 20px;">
                  ${salaryBadge}
                </span>
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>`;
  }).join('');

  const text = `Hi ${subscriberName},\n\nHere are ${jobs.length} new opportunities curated for you:\n\n` +
    jobs.map(j => `- ${j.title} at ${j.company} (${j.salary || 'Best in Industry'}): ${cleanSiteUrl}/jobs/${j.slug}`).join('\n') +
    `\n\nView all jobs at ${cleanSiteUrl}/jobs\n\nFreshersBridge`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121224; line-height: 1.5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e7e7f1;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0d1326; padding: 26px 30px; text-align: center;">
              <a href="${cleanSiteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; font-family: 'Satoshi', 'Segoe UI', sans-serif;">
                      Freshers<span style="color: #275df5;">Bridge</span>
                    </td>
                  </tr>
                </table>
              </a>
              <div style="margin-top: 10px;">
                <span style="background-color: rgba(39, 93, 245, 0.15); color: #4777fe; border: 1px solid rgba(39, 93, 245, 0.3); font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                  RECOMMENDED OPPORTUNITIES
                </span>
              </div>
            </td>
          </tr>

          <!-- Greeting Section -->
          <tr>
            <td style="padding: 28px 30px 16px 30px; text-align: center;">
              <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #121224;">
                Hi <span style="color: #275df5;">${subscriberName}</span>,
              </h2>
              <p style="margin: 0; font-size: 13.5px; color: #717b9e; font-weight: 600;">
                Here are ${jobs.length} top off-campus drives & internships curated just for you!
              </p>
            </td>
          </tr>

          <!-- Jobs List (Cards) -->
          <tr>
            <td style="padding: 10px 24px 20px 24px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                ${jobRowsHtml}
              </table>
            </td>
          </tr>

          <!-- View All Button -->
          <tr>
            <td style="padding: 0 30px 24px 30px; text-align: center;">
              <a href="${cleanSiteUrl}/jobs" target="_blank" style="background-color: #275df5; color: #ffffff; text-decoration: none; font-size: 14.5px; font-weight: 800; padding: 15px 36px; border-radius: 14px; display: inline-block; box-shadow: 0 4px 16px rgba(39, 93, 245, 0.35);">
                View All Jobs & Internships →
              </a>
            </td>
          </tr>

          <!-- Community Join -->
          <tr>
            <td style="padding: 0 30px 24px 30px; text-align: center;">
              <p style="margin: 0; font-size: 12.5px; color: #474d6a; font-weight: 600;">
                📢 <strong>Stay Updated:</strong> Get daily off-campus updates on <a href="${cleanSiteUrl}/jobs" target="_blank" style="color: #275df5; text-decoration: underline;">FreshersBridge Portal</a>.
              </p>
            </td>
          </tr>

          <!-- Footer Box -->
          <tr>
            <td style="padding: 0 24px 28px 24px;">
              <div style="background-color: #f7f7f9; border: 1px solid #e7e7f1; border-radius: 14px; padding: 16px 20px; text-align: center;">
                <p style="margin: 0; font-size: 11.5px; color: #717b9e; line-height: 1.6;">
                  At FreshersBridge, we're committed to helping you discover opportunities that match your career goals. You're receiving this email because you subscribed to updates from us.
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return { subject, html, text };
}

/**
 * Sends a Multi-Job Digest broadcast to all active subscribers via Resend API
 */
export async function sendMultipleJobsDigest(
  jobs: Job[],
  customSubject?: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    if (!jobs || jobs.length === 0) {
      return { success: false, count: 0, error: 'No jobs selected for digest broadcast.' };
    }

    const { data: subscribers, error: dbErr } = await supabase
      .from('subscribers')
      .select('email, name')
      .eq('status', 'active');

    if (dbErr) {
      return { success: false, count: 0, error: dbErr.message };
    }

    if (!subscribers || subscribers.length === 0) {
      return { success: false, count: 0, error: 'No active subscribers found.' };
    }

    const emails = subscribers.map(s => s.email).filter(Boolean);
    const { subject: defaultSubject, html, text } = generateMultipleJobsDigestHTML(jobs, 'Job Seeker');
    const finalSubject = customSubject?.trim() || defaultSubject;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'FreshersBridge Job Alerts <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          reply_to: 'freshersbridge@gmail.com',
          to: emails.length === 1 ? emails[0] : 'subscribers@freshersbridge.in',
          bcc: emails.length > 1 ? emails : undefined,
          subject: finalSubject,
          html: html,
          text: text,
        }),
      });

      if (res.ok) {
        console.log(`Sent Multi-Job Digest broadcast via Resend to ${emails.length} subscribers.`);
        return { success: true, count: emails.length };
      } else {
        const errData = await res.json();
        return { success: false, count: 0, error: errData.message || 'Resend send failed' };
      }
    }

    return { success: false, count: 0, error: 'RESEND_API_KEY is not configured in .env.local' };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Unknown exception' };
  }
}
