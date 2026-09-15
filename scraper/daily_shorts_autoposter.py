"""
FreshersBridge Daily YouTube Shorts Autoposter
Autonomous scheduler script that:
1. Checks data/posted_youtube_shorts.json to avoid duplicate postings.
2. Selects the top freshest unposted job opening from scraped listings.
3. Automatically generates the 9:16 video reel with synced audio.
4. Uploads to YouTube Shorts via YouTube Data API v3.
5. Records the posted job ID and Shorts URL in data/posted_youtube_shorts.json.
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "scraper", "output")
HISTORY_FILE = os.path.join(DATA_DIR, "posted_youtube_shorts.json")
JOBS_CSV = os.path.join(OUTPUT_DIR, "latest_freshersbridge_jobs.csv")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Add scraper dir to sys.path for internal imports
sys.path.insert(0, os.path.join(BASE_DIR, "scraper"))
from social_video_generator import create_video_reel
from youtube_shorts_publisher import upload_short, post_first_comment

def load_history():
    """Loads records of previously posted jobs."""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not read history file: {e}")
    return []

def save_history(history):
    """Saves updated history of posted jobs."""
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)
    print(f"Updated posting history: {HISTORY_FILE} ({len(history)} total posted)")

def get_next_job_to_post(history):
    """
    Selects the next top unposted job opening.
    Prioritizes top recognizable tech companies and high-paying roles.
    """
    if not os.path.exists(JOBS_CSV):
        print(f"Warning: Jobs CSV not found at {JOBS_CSV}")
        return None

    try:
        df = pd.read_csv(JOBS_CSV)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return None

    if df.empty:
        print("Jobs CSV is empty.")
        return None

    # Track already posted apply_urls and title+company combos
    posted_urls = {h.get("apply_url") for h in history if h.get("apply_url")}
    posted_combos = {f"{h.get('company')}_{h.get('title')}".lower() for h in history}

    # Filter out already posted jobs
    unposted = []
    for _, row in df.iterrows():
        job_dict = row.to_dict()
        combo = f"{job_dict.get('company')}_{job_dict.get('title')}".lower()
        url = str(job_dict.get("apply_url", ""))
        
        if url in posted_urls or combo in posted_combos:
            continue
        unposted.append(job_dict)

    if not unposted:
        print("All jobs in current CSV have already been posted! Re-cycling top job.")
        return df.iloc[0].to_dict()

    unposted_df = pd.DataFrame(unposted)
    
    # Priority list for high-converting brand names
    tier1_brands = "Google|Microsoft|Amazon|TCS|Accenture|Infosys|Wipro|Cognizant|Deloitte|IBM|Oracle|Capgemini"
    tier1_df = unposted_df[unposted_df["company"].astype(str).str.contains(tier1_brands, case=False, na=False)]
    
    if not tier1_df.empty:
        return tier1_df.iloc[0].to_dict()

    return unposted[0]

def run_daily_autoposter(privacy_status="public"):
    """
    Executes the full automated workflow: select job -> render video -> upload to YouTube.
    """
    print("=" * 60)
    print(f"🚀 FreshersBridge Daily YouTube Shorts Autoposter")
    print(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print(f"Target Privacy: {privacy_status}")
    print("=" * 60)

    history = load_history()
    job = get_next_job_to_post(history)

    if not job:
        print("No eligible job found to post. Exiting.")
        return False

    company = str(job.get("company", "Tech Company")).strip()
    title = str(job.get("title", "Software Engineer")).strip()
    salary = str(job.get("salary", "Best in Industry")).strip()
    location = str(job.get("location", "Pan-India")).strip()
    apply_url = str(job.get("apply_url", "https://freshersbridge.in")).strip()

    print(f"\n[1/3] Selected Job for Today's Short:")
    print(f"  🏢 Company:  {company}")
    print(f"  💼 Role:     {title}")
    print(f"  💰 CTC:      {salary}")
    print(f"  📍 Location: {location}")

    # 1. Render 9:16 Video Reel
    company_clean = "".join(c for c in company if c.isalnum()).lower()
    timestamp_slug = datetime.now().strftime("%Y%m%d")
    output_filename = f"{company_clean}_{timestamp_slug}_daily_short.mp4"

    print(f"\n[2/3] Rendering 9:16 Video Reel ({output_filename})...")
    video_path, cover_path, caption_path = create_video_reel(job, output_filename=output_filename)

    # 2. Prepare Shorts Metadata
    short_title = f"🚨 {company} is Hiring Freshers 2026! 💼 #Shorts"
    with open(caption_path, "r", encoding="utf-8") as f:
        caption_content = f.read()

    # 3. Upload to YouTube Shorts
    print(f"\n[3/3] Uploading to YouTube Shorts...")
    upload_res = upload_short(
        video_path=video_path,
        title=short_title,
        description=caption_content,
        privacy_status=privacy_status
    )

    # 4. Automatically Post Official First Comment with Direct Apply Link
    first_comment_text = (
        f"👇 DIRECT APPLY LINK FOR {company.upper()}:\n"
        f"🔗 {apply_url}\n\n"
        f"📌 Tip: Save & share with friends! All links verified on FreshersBridge.in 🚀"
    )
    post_first_comment(upload_res.get("video_id"), first_comment_text)

    # 5. Record to Posting History
    record = {
        "id": len(history) + 1,
        "company": company,
        "title": title,
        "salary": salary,
        "location": location,
        "apply_url": apply_url,
        "youtube_video_id": upload_res.get("video_id"),
        "shorts_url": upload_res.get("short_url"),
        "privacy": privacy_status,
        "posted_at": datetime.now(timezone.utc).isoformat()
    }
    history.append(record)
    save_history(history)

    print("\n" + "=" * 60)
    print("✅ Successfully published today's YouTube Short!")
    print(f"🔗 View Short: {upload_res.get('short_url')}")
    print("=" * 60)
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FreshersBridge Daily YouTube Shorts Autoposter")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"], help="Privacy status")
    args = parser.parse_args()

    success = run_daily_autoposter(privacy_status=args.privacy)
    if not success:
        sys.exit(1)
