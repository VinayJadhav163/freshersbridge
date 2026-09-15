"""
FreshersBridge YouTube Comment Auto-Responder Bot
Automatically scans comments on all posted YouTube Shorts and replies to every viewer
with the direct application link for that specific job posting.

Features:
- Scans recent posted videos from data/posted_youtube_shorts.json
- Identifies new comments from viewers (skips comments by the channel owner)
- Replies to all viewer comments with personalized job apply link & instructions
- Deduplicates using data/replied_youtube_comments.json to never double-reply
- Supports single video test mode or full channel scan
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone

# Add scraper dir to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
HISTORY_FILE = os.path.join(DATA_DIR, "posted_youtube_shorts.json")
REPLIED_FILE = os.path.join(DATA_DIR, "replied_youtube_comments.json")

# Force UTF-8 encoding on Windows console
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.join(BASE_DIR, "scraper"))
from youtube_shorts_publisher import get_authenticated_service

def load_json(filepath, default_val=None):
    if default_val is None:
        default_val = []
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Could not read {filepath}: {e}")
    return default_val

def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_channel_owner_id(youtube):
    """Fetches the authenticated channel's own channel ID to avoid self-replying."""
    try:
        res = youtube.channels().list(part="id", mine=True).execute()
        if res.get("items"):
            return res["items"][0]["id"]
    except Exception as e:
        print(f"Warning: Could not determine channel ID: {e}")
    return None

def auto_reply_to_comments(video_filter=None, max_videos=10):
    """
    Scans recent posted videos, finds un-replied viewer comments, and replies with job link.
    """
    print("=" * 60)
    print("🤖 FreshersBridge YouTube Comment Auto-Responder")
    print(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)

    posted_shorts = load_json(HISTORY_FILE, [])
    if not posted_shorts:
        print(f"No posted shorts found in {HISTORY_FILE}. Nothing to check.")
        return 0

    replied_history = load_json(REPLIED_FILE, [])
    # Set of already replied comment IDs
    replied_ids = {r["comment_id"] for r in replied_history if "comment_id" in r}

    youtube = get_authenticated_service()
    my_channel_id = get_channel_owner_id(youtube)
    print(f"Authenticated Channel Owner ID: {my_channel_id}")

    # If video_filter provided, only check that specific video
    target_videos = []
    if video_filter:
        target_videos = [v for v in posted_shorts if v.get("youtube_video_id") == video_filter]
        if not target_videos:
            print(f"Video {video_filter} not found in history, scanning with fallback metadata...")
            target_videos = [{"youtube_video_id": video_filter, "company": "Tech Company", "title": "Software Engineer", "apply_url": "https://freshersbridge.in"}]
    else:
        # Check the last 'max_videos' published shorts (newest first)
        target_videos = posted_shorts[-max_videos:]
        target_videos.reverse()

    new_replies_count = 0

    for item in target_videos:
        video_id = item.get("youtube_video_id")
        if not video_id:
            continue

        company = item.get("company", "Tech Company")
        title = item.get("title", "Freshers Role")
        apply_url = item.get("apply_url", "https://freshersbridge.in")

        print(f"\nScanning comments for Short: [{company} - {title}] (ID: {video_id})...")

        try:
            # Request comment threads for this video
            threads_response = youtube.commentThreads().list(
                part="snippet,replies",
                videoId=video_id,
                maxResults=100,
                textFormat="plainText"
            ).execute()
        except Exception as e:
            print(f"  ⚠️ Could not fetch comments for video {video_id}: {e}")
            continue

        comment_items = threads_response.get("items", [])
        print(f"  Found {len(comment_items)} comment thread(s).")

        for thread in comment_items:
            top_level = thread["snippet"]["topLevelComment"]
            comment_id = top_level["id"]
            author_info = top_level["snippet"].get("authorChannelId", {})
            author_channel_id = author_info.get("value")
            author_name = top_level["snippet"].get("authorDisplayName", "Friend")
            comment_text = top_level["snippet"].get("textOriginal", "").strip()

            # Skip if comment is made by our own channel
            if my_channel_id and author_channel_id == my_channel_id:
                continue

            # Skip if already replied
            if comment_id in replied_ids:
                continue

            # Also check if our channel already replied inside this thread
            already_has_channel_reply = False
            replies_obj = thread.get("replies", {}).get("comments", [])
            for rep in replies_obj:
                rep_author = rep["snippet"].get("authorChannelId", {}).get("value")
                if my_channel_id and rep_author == my_channel_id:
                    already_has_channel_reply = True
                    break

            if already_has_channel_reply:
                replied_ids.add(comment_id)
                replied_history.append({
                    "comment_id": comment_id,
                    "video_id": video_id,
                    "author": author_name,
                    "comment_text": comment_text,
                    "status": "already_replied",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
                continue

            # Craft friendly, high-converting personalized reply
            reply_text = (
                f"Hey {author_name}! 👋\n\n"
                f"Here is the direct link to apply for {company} ({title}):\n"
                f"👉 {apply_url}\n\n"
                f"Apply quickly before the form closes! 🚀\n"
                f"Bookmark & Subscribe to @FreshersBridge for daily verified off-campus alerts!"
            )

            print(f"  💬 Replying to @{author_name} (Comment: '{comment_text[:40]}...')...")

            try:
                reply_body = {
                    "snippet": {
                        "parentId": comment_id,
                        "textOriginal": reply_text
                    }
                }
                youtube.comments().insert(
                    part="snippet",
                    body=reply_body
                ).execute()

                print(f"  ✅ Successfully replied to @{author_name}!")
                replied_ids.add(comment_id)
                replied_history.append({
                    "comment_id": comment_id,
                    "video_id": video_id,
                    "author": author_name,
                    "comment_text": comment_text,
                    "reply_text": reply_text,
                    "status": "replied",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
                new_replies_count += 1

            except Exception as e:
                print(f"  ❌ Error replying to comment {comment_id}: {e}")

    # Save updated tracking list
    if new_replies_count > 0 or len(replied_history) > 0:
        save_json(REPLIED_FILE, replied_history)
        print(f"\nUpdated replied comments log: {REPLIED_FILE} (Total tracked: {len(replied_history)})")

    print("\n" + "=" * 60)
    print(f"🎉 Auto-responder scan finished. Sent {new_replies_count} new reply(ies).")
    print("=" * 60)
    return new_replies_count

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FreshersBridge YouTube Comment Auto-Responder")
    parser.add_argument("--video-id", type=str, default=None, help="Scan a specific YouTube Video ID")
    parser.add_argument("--max-videos", type=int, default=10, help="Number of recent Shorts to scan (default: 10)")
    args = parser.parse_args()

    auto_reply_to_comments(video_filter=args.video_id, max_videos=args.max_videos)
