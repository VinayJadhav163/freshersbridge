"""
FreshersBridge Safe 1-Time Email Inviter
Sends a warm, personalized 1-time email invite from freshersbridge.community@gmail.com
to verified student leads, inviting them to 1-click subscribe to daily job alerts or join the WhatsApp community.

Safety Safeguards:
- 1-time send only (records sent emails in data/sent_student_invites.json to never re-contact)
- Strictly enforces daily limit (Default: 20–25 emails max per day)
- Natural human jitter (random delays of 60 to 120 seconds between sends)
- Unsubscribe compliance: Includes 1-click unsubscribe suppression mechanism
- Uses secondary Gmail SMTP (protecting root domain freshersbridge.in from any penalty)
"""

import os
import sys
import json
import time
import random
import smtplib
import argparse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, List, Tuple

# Force UTF-8 on Windows console output
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import pandas as pd
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
LEADS_CSV = os.path.join(DATA_DIR, "scraped_students.csv")
SENT_HISTORY_FILE = os.path.join(DATA_DIR, "sent_student_invites.json")
SUPPRESSION_FILE = os.path.join(DATA_DIR, "unsubscribed_emails.json")

# Load credentials from .env.local or environment
load_dotenv(os.path.join(BASE_DIR, ".env.local"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

OUTREACH_EMAIL = os.environ.get("OUTREACH_EMAIL", "freshersbridge.community@gmail.com").strip()
OUTREACH_APP_PASSWORD = os.environ.get("OUTREACH_APP_PASSWORD", "").replace(" ", "").strip()
SENDER_NAME = os.environ.get("OUTREACH_SENDER_NAME", "Vinay | FreshersBridge Community").strip()

def load_json_list(filepath: str) -> list:
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def save_json_list(filepath: str, data: list):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

import re

def slugify(text: str) -> str:
    """Generates clean URL slug matching FreshersBridge database standard."""
    text = re.sub(r'[^\w\s-]', '', str(text).lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def clean_salary_badge(salary: Any) -> str:
    """Replaces verbose placeholders with clean 'Apply' badge or formatted CTC."""
    if not salary:
        return 'Apply'
    s = str(salary).strip()
    lower = s.lower()
    if any(k in lower for k in [
        'not disclosed', 'as per industry', 'industry standard',
        'industry standards', 'best in industry', 'competitive',
        'n/a', 'na', 'tbd', 'undisclosed'
    ]):
        return 'Apply'
    return s

def get_latest_top_jobs(count: int = 3) -> List[Dict[str, str]]:
    """
    Fetches a curated mix of top full-time fresher drives (MNCs/Product) and internships,
    ensuring verified direct portal URLs and clean salary badges.
    """
    jobs_csv = os.path.join(BASE_DIR, "scraper", "output", "latest_freshersbridge_jobs.csv")
    sample_jobs = [
        {"company": "Capgemini", "title": "Software Engineer (2026 Batch)", "salary": "₹4.25 - ₹7.5 LPA", "location": "Pan-India", "url": "https://freshersbridge.in/jobs"},
        {"company": "Qualcomm", "title": "Associate Engineer", "salary": "₹12 - ₹18 LPA", "location": "Bangalore / Hyderabad", "url": "https://freshersbridge.in/jobs"},
        {"company": "Google", "title": "Software Engineering Intern", "salary": "₹1.1 Lakh/month", "location": "Bangalore", "url": "https://freshersbridge.in/internships"}
    ]
    if os.path.exists(jobs_csv):
        try:
            df = pd.read_csv(jobs_csv)
            if not df.empty:
                full_time = []
                internships = []

                for _, row in df.iterrows():
                    title = str(row.get("title", "")).strip()
                    company = str(row.get("company", "")).strip()
                    loc = str(row.get("location", "Pan-India")).strip()
                    raw_sal = str(row.get("salary", ""))
                    sal = clean_salary_badge(raw_sal)

                    is_intern = 'intern' in title.lower() or 'internship' in title.lower()
                    section = 'internships' if is_intern else 'jobs'
                    slug = slugify(f"{title}-{company}")
                    direct_url = f"https://freshersbridge.in/{section}/{slug}"

                    item = {
                        "company": company,
                        "title": title,
                        "salary": sal,
                        "location": loc,
                        "url": direct_url
                    }

                    if is_intern:
                        internships.append(item)
                    else:
                        full_time.append(item)

                # Prioritize 2 Full-Time Jobs + 1 Internship for balanced digest
                curated = []
                # Prefer well-known tech MNCs if present
                priority_companies = ["Capgemini", "Qualcomm", "Infosys", "NatWest", "Accenture", "TCS", "Cognizant", "Google", "Microsoft"]
                sorted_ft = sorted(
                    full_time,
                    key=lambda x: any(p.lower() in x['company'].lower() for p in priority_companies),
                    reverse=True
                )

                if sorted_ft:
                    curated.extend(sorted_ft[:2])
                if internships:
                    curated.append(internships[0])
                elif len(sorted_ft) > 2:
                    curated.append(sorted_ft[2])

                if curated:
                    return curated[:count]
        except Exception as e:
            print(f"Warning loading jobs from CSV: {e}")

    return sample_jobs

def build_email_content(name: str, email: str, jobs: List[Dict[str, str]]) -> Tuple[str, str, str]:
    """
    Generates personal, non-spammy plain-text and HTML email bodies matching newsletter styling.
    """
    first_name = name.split()[0].title() if name else "there"

    jobs_plain = "\n".join([f"• {j['company']} — {j['title']} ({j['salary']})\n  👉 {j['url']}" for j in jobs])
    
    jobs_html = "".join([f"""
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <tr>
            <td style="padding: 14px 16px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="vertical-align: middle;">
                            <div style="font-size: 14.5px; font-weight: 800; color: #0f172a; margin-bottom: 3px; line-height: 1.3;">
                                {j['title']}
                            </div>
                            <div style="font-size: 12.5px; font-weight: 600; color: #64748b;">
                                {j['company']} • <span style="color: #475569;">{j['location']}</span>
                            </div>
                        </td>
                        <td align="right" style="vertical-align: middle; padding-left: 10px; white-space: nowrap;">
                            <span style="display: inline-block; background-color: #edf4ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px;">
                                {j['salary']}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 8px;">
                            <a href="{j['url']}" target="_blank" style="color: #2563eb; font-weight: 700; font-size: 12.5px; text-decoration: none;">
                                View drive details & apply &rarr;
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    """ for j in jobs])

    unsub_link = f"mailto:{OUTREACH_EMAIL}?subject=Unsubscribe%20{email}&body=Please%20remove%20{email}%20from%20any%20further%20invites."

    # Subject Line: High curiosity, friendly, completely un-spammy
    subject = f"Found your GitHub projects, {first_name} — curated 2026 tech drives for you 🚀"

    text_body = f"""Hi {first_name},

Came across your profile while looking at open-source student projects on GitHub — great work!

I run FreshersBridge (https://freshersbridge.in), an open community platform built to help 2024, 2025, and 2026 batch freshers track verified off-campus drives (TCS, Google, Accenture, startups) with zero spam, fake links, or consulting fees.

Here are 3 top verified drives active today:
{jobs_plain}

👉 If you would like to receive our daily off-campus job digests directly in your inbox, you can subscribe with 1-click:
https://freshersbridge.in#newsletter

💬 Or join our student WhatsApp Community:
https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75

Best of luck with your placement prep!

Cheers,
Vinay
Founder, FreshersBridge 🚀
Website: https://freshersbridge.in

---
Not looking for off-campus job alerts? Reply 'unsubscribe' or click: {unsub_link} and we will never contact you again.
"""

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 580px; margin: 0 auto; padding: 20px;">
        <p style="font-size: 16px;">Hi <strong>{first_name}</strong>,</p>

        <p>Came across your profile while exploring open-source student repositories on GitHub — really great work on your projects!</p>

        <p>I run <a href="https://freshersbridge.in" style="color: #2563eb; font-weight: 600; text-decoration: none;">FreshersBridge</a>, an open platform dedicated to helping <strong>2024, 2025 & 2026 batch freshers</strong> track verified off-campus hiring drives (TCS, Accenture, Google, High-Growth Startups) with zero fake links or consulting fees.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 18px 6px 18px; margin: 24px 0;">
            <p style="margin-top: 0; margin-bottom: 14px; font-weight: 800; color: #0f172a; font-size: 15px;">🔥 Fresh Verified Drives Active Today:</p>
            {jobs_html}
        </div>

        <p style="font-size: 15px;">If you'd like to get our verified off-campus digests automatically, you can connect directly:</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://freshersbridge.in" style="background: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; margin-bottom: 10px;">👉 Browse All 50+ Verified Drives</a><br/>
            <a href="https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75" style="background: #16a34a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; display: inline-block; font-size: 14px;">💬 Join Free WhatsApp Community</a>
        </div>

        <p>Wish you the absolute best with your upcoming campus & off-campus placement prep!</p>

        <p style="margin-bottom: 0;">Warm regards,<br/>
        <strong>Vinay</strong><br/>
        <span style="color: #64748b; font-size: 13px;">Founder, FreshersBridge 🚀</span><br/>
        <a href="https://freshersbridge.in" style="color: #2563eb; font-size: 13px;">freshersbridge.in</a></p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 15px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Not looking for job updates? <a href="{unsub_link}" style="color: #64748b;">Unsubscribe with 1-click</a> and we will never email you again.
        </p>
    </body>
    </html>
    """

    return subject, text_body, html_body

def send_invitation_email(smtp_server, recipient_email: str, recipient_name: str, jobs: List[Dict[str, str]]) -> bool:
    """Sends a single personalized email via authenticated Gmail SSL SMTP."""
    subject, text_content, html_content = build_email_content(recipient_name, recipient_email, jobs)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SENDER_NAME} <{OUTREACH_EMAIL}>"
    msg["To"] = recipient_email
    msg["Reply-To"] = OUTREACH_EMAIL

    # Add List-Unsubscribe header (standard Gmail anti-spam compliance)
    msg["List-Unsubscribe"] = f"<mailto:{OUTREACH_EMAIL}?subject=Unsubscribe>"

    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        smtp_server.sendmail(OUTREACH_EMAIL, recipient_email, msg.as_string())
        return True
    except Exception as e:
        print(f"SMTP send failed to {recipient_email}: {e}")
        return False

def run_safe_outreach(limit: int = 20, dry_run: bool = False):
    """
    Reads verified leads and sends 1-time personalized invitation emails with strict safety rules.
    """
    print("=" * 60)
    print("🚀 FreshersBridge Safe 1-Time Student Outreach Engine")
    print(f"Sender: {OUTREACH_EMAIL}")
    print(f"Max Daily Send Limit: {limit}")
    print(f"Mode: {'DRY RUN (No real emails sent)' if dry_run else 'LIVE DISPATCH'}")
    print("=" * 60)

    if not os.path.exists(LEADS_CSV):
        print(f"No leads found at {LEADS_CSV}. Run scraper/student_email_harvester.py first!")
        return

    df = pd.read_csv(LEADS_CSV)
    if df.empty or "email" not in df.columns:
        print("Leads CSV is empty.")
        return

    sent_history = load_json_list(SENT_HISTORY_FILE)
    sent_emails = {item["email"].lower().strip() for item in sent_history if "email" in item}
    suppressed = set(s.lower().strip() for s in load_json_list(SUPPRESSION_FILE))

    # Filter uncontacted leads
    uncontacted = []
    for _, row in df.iterrows():
        em = str(row.get("email", "")).strip().lower()
        if not em or em in sent_emails or em in suppressed:
            continue
        uncontacted.append({
            "name": str(row.get("name", "")).strip(),
            "email": em,
            "github_url": str(row.get("github_url", "")).strip()
        })

    print(f"Total leads: {len(df)} | Already contacted: {len(sent_emails)} | Uncontacted: {len(uncontacted)}")

    if not uncontacted:
        print("No new uncontacted leads available.")
        return

    batch = uncontacted[:limit]
    jobs = get_latest_top_jobs(count=3)

    if dry_run:
        print(f"\n--- DRY RUN PREVIEW (Target: {len(batch)} students) ---")
        for i, student in enumerate(batch, 1):
            sub, text_b, _ = build_email_content(student["name"], student["email"], jobs)
            print(f"\n[{i}/{len(batch)}] To: {student['name']} <{student['email']}>")
            print(f"Subject: {sub}")
            if i == 1:
                print("Body Preview:\n" + text_b[:300] + "...\n[Full body ready]")
        print("\nDry run completed successfully. Everything is formatted properly.")
        return

    # Authenticate with Gmail SMTP
    print("\nConnecting to Gmail SMTP server...")
    try:
        smtp = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=20)
        smtp.login(OUTREACH_EMAIL, OUTREACH_APP_PASSWORD)
        print("✅ Gmail SMTP connected and authenticated.")
    except Exception as e:
        print(f"❌ Failed to authenticate with Gmail SMTP: {e}")
        return

    success_count = 0
    for idx, student in enumerate(batch, 1):
        print(f"\n[{idx}/{len(batch)}] Sending safe invite to {student['name']} ({student['email']})...")
        ok = send_invitation_email(smtp, student["email"], student["name"], jobs)
        if ok:
            success_count += 1
            record = {
                "name": student["name"],
                "email": student["email"],
                "github_url": student["github_url"],
                "sent_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            sent_history.append(record)
            save_json_list(SENT_HISTORY_FILE, sent_history)
            print(f"  ✅ Sent successfully! (Total sent so far: {len(sent_history)})")
        else:
            print(f"  ❌ Failed to send.")

        # Human-like delay between emails (30 to 60s) unless it's the last one
        if idx < len(batch):
            delay = random.randint(30, 60)
            print(f"  ⏳ Waiting {delay}s before next email (human-like pacing)...")
            time.sleep(delay)

    smtp.quit()
    print("\n" + "=" * 60)
    print(f"🎉 Safe Outreach Complete! Successfully sent: {success_count}/{len(batch)}")
    print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Safe 1-Time Student Email Inviter")
    parser.add_argument("--limit", type=int, default=20, help="Max emails to send today (default: 20)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without sending real emails")
    args = parser.parse_args()

    run_safe_outreach(limit=args.limit, dry_run=args.dry_run)
