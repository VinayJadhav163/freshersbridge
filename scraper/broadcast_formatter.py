"""
FreshersBridge WhatsApp & Telegram Community Broadcast Formatter
Splits scraped jobs into 8-job curated digest blocks (Morning, Afternoon, Evening)
and dispatches to Telegram Bot & Pabbly Webhook.
"""
import os
import re
import json
import time
import logging
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

logger = logging.getLogger("FreshersBridgeBroadcast")

def get_slot_title() -> str:
    """Returns dynamic slot label based on Indian Standard Time (IST)."""
    utc_now = datetime.now(timezone.utc)
    ist_now = utc_now + timedelta(hours=5, minutes=30)
    hour = ist_now.hour

    if 5 <= hour < 12:
        return "🌅 MORNING FRESHERS DIGEST (Top 8 Curated Drop)"
    elif 12 <= hour < 17:
        return "☀️ AFTERNOON FRESHERS DIGEST (Top 8 Curated Drop)"
    else:
        return "🌙 EVENING FRESHERS DIGEST (Top 8 Curated Drop)"

COMMON_HEADER_TOP = """*📌Great Opportunities open for freshers candidates*
*Tailor your resume. Improve your chances.*
*👉 Check your resume with our ATS Resume Scanner:*
https://freshersbridge.in/career-tools"""

OPPORTUNITIES_HEADER = "*🔥 Today's Fresh Opportunities:*"

WHATSAPP_FOOTER = """━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 BROWSE ALL 50+ FRESH JOBS & INTERNSHIPS TODAY:
https://www.freshersbridge.in/jobs

🧮 HR Email Scripts + In-Hand Salary Calculator:
https://freshersbridge.in/career-tools

📸 Follow FreshersBridge on Instagram:
https://www.instagram.com/freshersbridge?igsi=MTVsbm50enlhNGYybg==

📢 Get daily job alerts on Telegram:
https://t.me/freshersbridge

📩 Want job alerts directly in your inbox?
Subscribe to the FreshersBridge Newsletter and get new job & internship updates directly by email:
👉 https://freshersbridge.in

📤 Share with your friends, batchmates & college groups!
━━━━━━━━━━━━━━━━━━━━━━━━━━
FreshersBridge 🚀 | Jobs • Internships • Career Tools"""

TELEGRAM_FOOTER = """━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 BROWSE ALL 50+ FRESH JOBS & INTERNSHIPS TODAY:
https://www.freshersbridge.in/jobs

🧮 HR Email Scripts + In-Hand Salary Calculator:
https://freshersbridge.in/career-tools

📸 Follow FreshersBridge on Instagram:
https://www.instagram.com/freshersbridge?igsi=MTVsbm50enlhNGYybg==

💬 Join our WhatsApp Community:
https://chat.whatsapp.com/JmP90QfUMs7Jj7gYALUj75?s=cl&p=a&ilr=1

📩 Want job alerts directly in your inbox?
Subscribe to the FreshersBridge Newsletter and get new job & internship updates directly by email:
👉 https://freshersbridge.in

📤 Share with your friends, batchmates & college groups!
━━━━━━━━━━━━━━━━━━━━━━━━━━
FreshersBridge 🚀 | Jobs • Internships • Career Tools"""

def slugify(text: str) -> str:
    """Generates a clean URL slug matching FreshersBridge database standard."""
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def format_single_job_block(job: Dict[str, Any]) -> str:
    """Formats a single job into structured WhatsApp/Telegram card strictly pointing to FreshersBridge portal."""
    company = str(job.get('company') or 'Top Tech Company').strip()
    title = str(job.get('title') or 'Software Engineer').strip()
    eligibility = str(job.get('eligibility') or 'B.E / B.Tech / BCA / MCA / Any Graduate').strip()
    location = str(job.get('location') or 'Pan-India / Remote').strip()
    salary = str(job.get('salary') or 'Competitive / Best in Industry').strip()
    slug = str(job.get('slug') or '').strip()
    
    # Always generate FreshersBridge portal URL - never expose third party links in broadcasts
    if not slug:
        slug = slugify(f"{title}-{company}")
        
    is_internship = job.get('job_type') == 'internship' or any(k in title.lower() for k in ['intern', 'internship', 'trainee'])
    section = 'internships' if is_internship else 'jobs'
    apply_link = f"https://freshersbridge.in/{section}/{slug}"

    return f"""🔗 Company : {company}
Role : {title}
Qualification : {eligibility}
Location : {location}
Salary : {salary}
📌 Apply Link : {apply_link}"""

def balance_jobs_by_source(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Interleaves jobs across different sources (Unstop, Internshala, LinkedIn, Shine, Naukri) for balanced broadcast diversity."""
    if not jobs:
        return []
    from collections import defaultdict
    source_buckets = defaultdict(list)
    for j in jobs:
        src = str(j.get('source_name') or 'Portal').title()
        source_buckets[src].append(j)
        
    balanced = []
    max_len = max(len(v) for v in source_buckets.values()) if source_buckets else 0
    for i in range(max_len):
        for src, bucket in sorted(source_buckets.items()):
            if i < len(bucket):
                balanced.append(bucket[i])
    return balanced

def generate_broadcast_messages(jobs: List[Dict[str, Any]], platform: str = 'whatsapp', chunk_size: int = 8) -> List[str]:
    """Splits jobs into batches of 8 and generates structured broadcast messages for WhatsApp or Telegram."""
    if not jobs:
        return []
        
    # Balance sources so Batch #1 has diverse mix (Unstop, Internshala, LinkedIn, Shine, etc.)
    balanced_jobs = balance_jobs_by_source(jobs)
    messages = []
    total_jobs = len(balanced_jobs)
    is_telegram = platform.lower() == 'telegram'
    footer = TELEGRAM_FOOTER if is_telegram else WHATSAPP_FOOTER
    slot_label = get_slot_title()

    # Telegram uses ** for markdown bolding, WhatsApp uses *
    b = "**" if is_telegram else "*"

    header_top = f"""{b}📌Great Opportunities open for freshers candidates{b}
{b}Tailor your resume. Improve your chances.{b}
{b}👉 Check your resume with our ATS Resume Scanner:{b}
https://freshersbridge.in/career-tools"""

    opps_header = f"{b}🔥 Today's Fresh Opportunities:{b}"
    
    for i in range(0, total_jobs, chunk_size):
        chunk = balanced_jobs[i:i + chunk_size]
        batch_num = (i // chunk_size) + 1
        job_blocks = "\n\n".join([format_single_job_block(j) for j in chunk])
        
        # Batch #1 gets the dynamic session label (Morning/Afternoon/Evening) without ✨ emoji
        batch_header = (
            f"{header_top}\n\n{opps_header}\n{b}{slot_label}{b}"
            if batch_num == 1
            else f"{header_top}\n\n{opps_header} {b}(Batch #{batch_num}){b}"
        )
        
        msg = f"""{batch_header}

{job_blocks}

{footer}"""
        messages.append(msg)
        
    return messages

def dispatch_to_telegram(messages: List[str], bot_token: str = None, channel_id: str = None, send_all: bool = False) -> bool:
    """Dispatches 8-job curated message block to Telegram Channel."""
    token = bot_token or os.getenv("TELEGRAM_BOT_TOKEN")
    chat = channel_id or os.getenv("TELEGRAM_CHANNEL_ID") or os.getenv("TELEGRAM_CHAT_ID")
    
    if not token or not chat:
        logger.info("ℹ️ TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not configured. Skipping automated Telegram dispatch.")
        return False
        
    # In automated 3x daily runs, send the top curated batch (Batch #1) to prevent group spam
    to_send = messages if send_all else messages[:1]
    logger.info(f"✈️ Dispatching {len(to_send)} curated message batch(es) to Telegram Channel: {chat}")
    success_count = 0
    tg_url = f"https://api.telegram.org/bot{token}/sendMessage"
    
    for idx, msg in enumerate(to_send, 1):
        try:
            payload = {
                "chat_id": chat,
                "text": msg,
                "parse_mode": "Markdown",
                "disable_web_page_preview": False
            }
            resp = requests.post(tg_url, json=payload, timeout=20)
            if resp.status_code == 200:
                logger.info(f"✅ Telegram Batch #{idx} delivered successfully.")
                success_count += 1
            else:
                logger.warning(f"⚠️ Telegram Batch #{idx} failed: {resp.status_code} - {resp.text}")
        except Exception as e:
            logger.error(f"❌ Error sending Batch #{idx} to Telegram: {e}")
            
        if idx < len(to_send):
            time.sleep(2.0)
            
    logger.info(f"🎉 Telegram Automation Complete: {success_count}/{len(to_send)} batch(es) delivered.")
    return success_count > 0

def dispatch_to_evolution_whatsapp(messages: List[str], api_url: str = None, api_key: str = None, instance_name: str = None, recipient: str = None, send_all: bool = False) -> bool:
    """Dispatches curated 8-job message block to WhatsApp Group/Community via Evolution-Go API on AWS."""
    base_url = api_url or os.getenv("EVOLUTION_API_URL") or "http://65.0.170.65:8080"
    key = api_key or os.getenv("EVOLUTION_API_KEY") or "FreshersBridgeSecret2026"
    inst = instance_name or os.getenv("EVOLUTION_INSTANCE_NAME") or "freshersbridge"
    target = recipient or os.getenv("WHATSAPP_GROUP_ID") or "120363410671332403@g.us"

    if not base_url or not target:
        logger.info("ℹ️ EVOLUTION_API_URL or WHATSAPP_GROUP_ID not configured. Skipping automated WhatsApp dispatch.")
        return False

    to_send = messages if send_all else messages[:1]
    logger.info(f"💬 Dispatching {len(to_send)} curated message batch(es) to WhatsApp Group: {target}")
    success_count = 0
    endpoint = f"{base_url.rstrip('/')}/send/text"

    for idx, msg in enumerate(to_send, 1):
        try:
            payload = {
                "name": inst,
                "number": target,
                "text": msg
            }
            resp = requests.post(endpoint, json=payload, headers={"apikey": key, "Content-Type": "application/json"}, timeout=20)
            if resp.status_code in [200, 201]:
                logger.info(f"✅ WhatsApp Batch #{idx} delivered successfully to {target}.")
                success_count += 1
            else:
                logger.warning(f"⚠️ WhatsApp Batch #{idx} failed: {resp.status_code} - {resp.text}")
        except Exception as e:
            logger.error(f"❌ Error sending Batch #{idx} to WhatsApp: {e}")

        if idx < len(to_send):
            time.sleep(2.0)

    logger.info(f"🎉 WhatsApp Automation Complete: {success_count}/{len(to_send)} batch(es) delivered.")
    return success_count > 0

def save_broadcasts_file(messages: List[str], filename: str = "whatsapp_broadcasts.txt", output_dir: str = None) -> str:
    """Saves all generated broadcast chunks to a clean text file for easy copy-pasting."""
    if not messages:
        return ""
        
    if not output_dir:
        output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    filepath = os.path.join(output_dir, f"{today_str}_{filename}")
    
    divider = "\n\n" + "=" * 60 + "\n\n"
    content = divider.join([f"📢 --- MESSAGE BATCH #{idx + 1} OF {len(messages)} ---\n\n{msg}" for idx, msg in enumerate(messages)])
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    logger.info(f"💾 Saved {len(messages)} broadcast blocks to: {filepath}")
    return filepath
