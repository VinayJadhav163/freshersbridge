"""
FreshersBridge WhatsApp & Telegram Community Broadcast Formatter
Splits scraped jobs into 10-job message blocks and dispatches to Pabbly Webhook / Saves to text file.
"""
import os
import re
import json
import logging
import requests
from datetime import datetime
from typing import List, Dict, Any

logger = logging.getLogger("FreshersBridgeBroadcast")

HEADER_PROMO = """*📌 Top Tech & Internship Opportunities Open for Freshers (2024, 2025, 2026 Batch)*

*📌 Score & Fix your Resume with ATS Resume Scanner:*
https://freshersbridge.in/career-tools

*📌 12 HR Email Scripts & In-Hand Salary Calculator:*
https://freshersbridge.in/career-tools"""

FOOTER_PROMO = """━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Follow FreshersBridge for daily curated alerts: https://freshersbridge.in
💬 Share with your batchmates & college groups!"""

def format_single_job_block(job: Dict[str, Any]) -> str:
    """Formats a single job into structured WhatsApp/Telegram card."""
    company = str(job.get('company') or 'Top Tech Company').strip()
    title = str(job.get('title') or 'Software Engineer').strip()
    eligibility = str(job.get('eligibility') or 'B.E / B.Tech / BCA / MCA / Any Graduate').strip()
    location = str(job.get('location') or 'Pan-India / Remote').strip()
    salary = str(job.get('salary') or 'Competitive / Best in Industry').strip()
    slug = str(job.get('slug') or '').strip()
    
    # Determine passing year / batch text
    if any(yr in eligibility for yr in ['2024', '2025', '2026', '2027', '2028']):
        batches = [yr for yr in ['2028', '2027', '2026', '2025', '2024'] if yr in eligibility]
        passing_year = " | ".join(batches) if batches else "2026 | 2025 | 2024"
    else:
        passing_year = "2026 | 2025 | 2024 (Freshers & Students)"
        
    if slug:
        apply_link = f"https://freshersbridge.in/jobs/{slug}"
    else:
        apply_link = str(job.get('apply_url') or 'https://freshersbridge.in/jobs').strip()

    return f"""🔗 Company : {company}
Role : {title}
Qualification : {eligibility}
Passing Year : {passing_year}
Location : {location}
Salary : {salary}
📌 Apply Link : {apply_link}"""

def generate_broadcast_messages(jobs: List[Dict[str, Any]], chunk_size: int = 10) -> List[str]:
    """Splits jobs into batches of 10 and generates structured broadcast messages."""
    if not jobs:
        return []
        
    messages = []
    total_jobs = len(jobs)
    
    for i in range(0, total_jobs, chunk_size):
        chunk = jobs[i:i + chunk_size]
        batch_num = (i // chunk_size) + 1
        total_batches = (total_jobs + chunk_size - 1) // chunk_size
        
        job_blocks = "\n\n".join([format_single_job_block(j) for j in chunk])
        
        msg = f"""{HEADER_PROMO}

{job_blocks}

{FOOTER_PROMO}"""
        messages.append(msg)
        
    return messages

def dispatch_to_pabbly(messages: List[str], webhook_url: str = None) -> bool:
    """Dispatches each 10-job message block to Pabbly Connect Webhook."""
    target_url = webhook_url or os.getenv("PABBLY_WEBHOOK_URL")
    if not target_url or not target_url.strip():
        logger.info("ℹ️ PABBLY_WEBHOOK_URL not configured. Skipping automated Pabbly webhook dispatch.")
        return False
        
    logger.info(f"🚀 Dispatching {len(messages)} message batches to Pabbly Webhook: {target_url}")
    success_count = 0
    
    for idx, msg in enumerate(messages, 1):
        try:
            payload = {
                "batch_index": idx,
                "total_batches": len(messages),
                "message_title": f"FreshersBridge Batch #{idx} ({datetime.now().strftime('%d %b %Y')})",
                "message_text": msg,
                "timestamp": datetime.now().isoformat()
            }
            resp = requests.post(target_url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
            if resp.status_code in [200, 201, 202]:
                logger.info(f"✅ Pabbly Batch #{idx}/{len(messages)} dispatched successfully.")
                success_count += 1
            else:
                logger.warning(f"⚠️ Pabbly Batch #{idx} failed with status {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"❌ Error sending Batch #{idx} to Pabbly: {e}")
            
    logger.info(f"🎉 Pabbly Dispatch Complete: {success_count}/{len(messages)} batches sent successfully.")
    return success_count > 0

def save_broadcasts_file(messages: List[str], output_dir: str = None) -> str:
    """Saves all generated broadcast chunks to a clean text file for easy copy-pasting."""
    if not messages:
        return ""
        
    if not output_dir:
        output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    filepath = os.path.join(output_dir, f"{today_str}_whatsapp_broadcasts.txt")
    
    divider = "\n\n" + "=" * 60 + "\n\n"
    content = divider.join([f"📢 --- MESSAGE BATCH #{idx + 1} OF {len(messages)} ---\n\n{msg}" for idx, msg in enumerate(messages)])
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    logger.info(f"💾 Saved {len(messages)} WhatsApp/Telegram broadcast message blocks to: {filepath}")
    return filepath
