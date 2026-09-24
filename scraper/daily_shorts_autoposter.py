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
from social_video_generator import create_video_reel, get_freshersbridge_job_url, generate_social_caption
from youtube_shorts_publisher import upload_short, post_first_comment
from meta_reels_publisher import publish_to_meta_platforms

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

    # Feature all diverse companies (Startups, Mid-tier IT, Product companies, Fintechs & MNCs)
    return unposted[0]

def run_daily_autoposter(privacy_status="public", force=False):
    """
    Executes the full automated workflow: select job -> render video -> upload to YouTube.
    Includes a 150-minute cooldown protection against duplicate runs.
    """
    print("=" * 60)
    print(f"🚀 FreshersBridge Daily YouTube Shorts Autoposter")
    print(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print(f"Target Privacy: {privacy_status}")
    print(f"Force Mode: {force}")
    print("=" * 60)

    history = load_history()

    # Smart Deduplication Guard: Check if a reel was already posted within the last 2.5 hours (150 mins)
    if not force and history:
        last_entry = history[-1]
        last_posted = last_entry.get("posted_at")
        if last_posted:
            try:
                last_dt = datetime.fromisoformat(last_posted.replace("Z", "+00:00"))
                now_dt = datetime.now(timezone.utc)
                diff_mins = (now_dt - last_dt).total_seconds() / 60.0
                if diff_mins < 150:
                    print(f"⏸️ COOLDOWN ACTIVE: Video #{last_entry.get('id')} ({last_entry.get('company')}) was already posted {diff_mins:.1f} minutes ago.")
                    print(f"   Posted at: {last_posted}")
                    print(f"   Skipping duplicate run to protect scheduled 3x daily pacing (morning, afternoon, evening).")
                    print(f"   (Pass --force to override this cooldown if manual post is desired).")
                    return True
            except Exception as e:
                print(f"⚠️ Warning during cooldown check: {e}")

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
    upload_res = None
    try:
        upload_res = upload_short(
            video_path=video_path,
            title=short_title,
            description=caption_content,
            privacy_status=privacy_status
        )

        # 4. Automatically Post Official First Comment with Direct Apply Link
        fb_url = get_freshersbridge_job_url(job)
        first_comment_text = (
            f"👇 DIRECT APPLY LINK FOR {company.upper()}:\n"
            f"🔗 {fb_url}\n\n"
            f"🌐 Verified Off-Campus Opportunities: https://freshersbridge.in 🚀\n"
            f"📌 Tip: Save & share with friends looking for a job!"
        )
        if upload_res and upload_res.get("video_id"):
            post_first_comment(upload_res.get("video_id"), first_comment_text)
    except Exception as yt_err:
        print(f"\n❌ [YouTube Shorts Upload Failed]: {yt_err}")
        print("⚠️ If this is due to 'invalid_grant' (token expired/revoked):")
        print("   1. Switch Google Cloud OAuth Consent Screen from 'Testing' to 'In Production'.")
        print("   2. Run `python scraper/reauth_youtube.py` on your computer to generate a new long-lived token.")
        print("   3. Update GitHub Secret `YOUTUBE_TOKEN_JSON` with the new token string.\n")
        upload_res = {"video_id": None, "short_url": None, "error": str(yt_err)}

    fb_url = get_freshersbridge_job_url(job)

    # 5. Cross-Post to Instagram Reels & Facebook Page Reels
    print(f"\n[4/4] Cross-Publishing to Instagram & Facebook Reels...")
    meta_filename = f"{company_clean}_{timestamp_slug}_meta_reel.mp4"
    meta_video_path, meta_cover_path, _ = create_video_reel(job, output_filename=meta_filename, platform="instagram")
    
    # Generate dedicated Meta caption with "Follow @freshersbridge" (Never "Subscribe" or "#Shorts")
    meta_caption = generate_social_caption(job, platform="instagram")

    meta_comment_text = (
        f"👇 DIRECT APPLY LINK FOR {company.upper()}:\n"
        f"🔗 {fb_url}\n\n"
        f"🌐 Explore 50+ fresh verified fresher jobs & internships: https://freshersbridge.in 🚀\n"
        f"📌 Tip: Tag and share with batchmates looking for off-campus drives!"
    )
    meta_results = publish_to_meta_platforms(
        video_path=meta_video_path if (meta_video_path and os.path.exists(meta_video_path)) else video_path,
        caption=meta_caption,
        comment_text=meta_comment_text,
        cover_path=meta_cover_path or cover_path
    )

    # 6. Record to Posting History
    record = {
        "id": len(history) + 1,
        "company": company,
        "title": title,
        "salary": salary,
        "location": location,
        "apply_url": apply_url,
        "freshersbridge_url": fb_url,
        "youtube_video_id": upload_res.get("video_id"),
        "shorts_url": upload_res.get("short_url"),
        "meta_results": meta_results,
        "privacy": privacy_status,
        "posted_at": datetime.now(timezone.utc).isoformat()
    }
    history.append(record)
    save_history(history)

    print("\n" + "=" * 60)
    print("✅ Successfully published today's YouTube Short & Social Reel!")
    print(f"🔗 YouTube Short: {upload_res.get('short_url')}")
    if meta_results.get("instagram", {}).get("url"):
        print(f"📸 Instagram Reel: {meta_results['instagram']['url']}")
    if meta_results.get("facebook", {}).get("url"):
        print(f"📘 Facebook Reel:  {meta_results['facebook']['url']}")
    print("=" * 60)
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FreshersBridge Daily YouTube Shorts Autoposter")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"], help="Privacy status")
    parser.add_argument("--force", action="store_true", default=False, help="Force upload bypassing the 150-minute cooldown guard")
    args = parser.parse_args()

    success = run_daily_autoposter(privacy_status=args.privacy, force=args.force)
    if not success:
        sys.exit(1)
