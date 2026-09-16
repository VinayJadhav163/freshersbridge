"""
FreshersBridge YouTube Shorts Automated Publisher
Uploads 9:16 vertical job alert videos directly to YouTube Shorts via YouTube Data API v3.

Features:
- Seamless OAuth 2.0 flow with token caching (credentials/youtube_token.json)
- Resumable video upload with progress monitoring
- Automatic #Shorts metadata formatting (Title, Description, Tags, Category)
- Privacy controls: 'public', 'unlisted', or 'private'
"""

import os
import sys
import json
import time
import argparse

# Force UTF-8 on Windows console output to prevent charmap codec errors
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import google.auth
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDENTIALS_DIR = os.path.join(BASE_DIR, "credentials")
CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, "youtube_client_secret.json")
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, "youtube_token.json")

# Scopes required to upload videos and manage/reply to comments
UPLOAD_SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
]

ALL_SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

def is_headless():
    """Detects whether script is running in headless CI environment (e.g. GitHub Actions)."""
    return bool(
        os.environ.get("GITHUB_ACTIONS")
        or os.environ.get("CI")
        or not (sys.stdin and sys.stdin.isatty())
    )

def get_authenticated_service(require_comment_scope=False):
    """
    Retrieves or establishes authenticated YouTube API service.
    Caches token in credentials/youtube_token.json for subsequent automated runs.
    
    In CI / headless environments:
    - Never opens a local desktop browser.
    - Uses existing token and refreshes access_token automatically via refresh_token.
    - Does not discard valid upload tokens if optional comment permissions are absent.
    """
    creds = None
    
    # Check if credentials are provided via environment variables (e.g., GitHub Actions CI)
    if (not os.path.exists(TOKEN_FILE) or os.path.getsize(TOKEN_FILE) == 0) and os.environ.get("YOUTUBE_TOKEN_JSON"):
        os.makedirs(CREDENTIALS_DIR, exist_ok=True)
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(os.environ["YOUTUBE_TOKEN_JSON"].strip())

    if (not os.path.exists(CLIENT_SECRET_FILE) or os.path.getsize(CLIENT_SECRET_FILE) == 0) and os.environ.get("YOUTUBE_CLIENT_SECRET_JSON"):
        os.makedirs(CREDENTIALS_DIR, exist_ok=True)
        with open(CLIENT_SECRET_FILE, "w", encoding="utf-8") as f:
            f.write(os.environ["YOUTUBE_CLIENT_SECRET_JSON"].strip())

    granted_scopes = []
    # 1. Check for existing cached token
    if os.path.exists(TOKEN_FILE):
        try:
            with open(TOKEN_FILE, "r", encoding="utf-8") as f:
                raw_token_data = json.load(f)
            granted_scopes = raw_token_data.get("scopes", [])
            creds = Credentials.from_authorized_user_file(TOKEN_FILE)
            print("Loaded cached YouTube authentication token.", flush=True)
        except Exception as e:
            print(f"Failed to load cached token: {e}", flush=True)
            creds = None

    # 2. Refresh expired token using refresh_token if possible
    if creds and creds.expired and creds.refresh_token:
        try:
            print("Refreshing expired YouTube access token...", flush=True)
            creds.refresh(Request())
            # Save updated refreshed token to file
            with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                f.write(creds.to_json())
            print("Successfully refreshed YouTube access token.", flush=True)
        except Exception as e:
            print(f"Warning: Token refresh attempt failed: {e}", flush=True)

    # 3. Handle comment scope check if specifically requested
    has_comment_scope = "https://www.googleapis.com/auth/youtube.force-ssl" in (creds.scopes if creds and creds.scopes else granted_scopes)
    if require_comment_scope and not has_comment_scope:
        if is_headless():
            print("⚠️ [CI/Headless] Current YouTube token lacks 'youtube.force-ssl' comment scope.", flush=True)
            return None
        print("Existing token lacks comment permissions (youtube.force-ssl). Upgrading scopes locally...", flush=True)
        creds = None

    # 4. If credentials missing or invalid:
    if not creds or not creds.valid:
        if is_headless():
            raise RuntimeError(
                "[ERROR] No valid YouTube credentials found in headless CI environment!\n"
                "Please verify that YOUTUBE_CLIENT_SECRET_JSON and YOUTUBE_TOKEN_JSON secrets are configured in GitHub repository settings."
            )

        if not os.path.exists(CLIENT_SECRET_FILE):
            raise FileNotFoundError(
                f"\n[ERROR] YouTube Client Secret file not found at: {CLIENT_SECRET_FILE}\n"
                f"To enable automated YouTube Shorts uploads:\n"
                f"1. Go to Google Cloud Console (https://console.cloud.google.com/)\n"
                f"2. Enable 'YouTube Data API v3'\n"
                f"3. Create an OAuth 2.0 Client ID (Desktop App)\n"
                f"4. Download the JSON and save it as: credentials/youtube_client_secret.json\n"
            )
        
        print("\nInitiating YouTube OAuth authorization in your web browser...", flush=True)
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, ALL_SCOPES)
        creds = flow.run_local_server(port=8080, prompt="consent", open_browser=True)

        os.makedirs(CREDENTIALS_DIR, exist_ok=True)
        with open(TOKEN_FILE, "w", encoding="utf-8") as token:
            token.write(creds.to_json())
        print(f"Saved persistent YouTube authentication token to: {TOKEN_FILE}", flush=True)

    return build("youtube", "v3", credentials=creds)

def upload_short(video_path, title=None, description=None, tags=None, privacy_status="public"):
    """
    Uploads a video to YouTube with Shorts optimization.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    youtube = get_authenticated_service()

    # Defaults if not passed
    if not title:
        basename = os.path.basename(video_path).replace(".mp4", "").replace("_", " ").title()
        title = f"{basename} #Shorts"
    elif "#Shorts" not in title and "#shorts" not in title:
        title = f"{title[:80]} #Shorts"

    if not description:
        description = (
            f"{title}\n\n"
            "Freshers Off-Campus Hiring Drive!\n"
            "Apply Link is active on FreshersBridge: https://freshersbridge.in\n\n"
            "#Shorts #FreshersJobs #OffCampusHiring #Batch2026 #JobAlert #FreshersBridge"
        )
    elif "#Shorts" not in description:
        description = f"{description}\n\n#Shorts #FreshersJobs"

    if not tags:
        tags = [
            "Shorts", "FreshersJobs", "OffCampusHiring", "Batch2026", "Batch2025", 
            "SoftwareEngineer", "FreshersBridge", "ITJobs", "HiringAlert"
        ]

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": tags,
            "categoryId": "27"  # Education (or 28 for Science & Technology)
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    print(f"\n--- Uploading YouTube Short ---")
    print(f"Title: {title}")
    print(f"Privacy: {privacy_status}")
    print(f"Video File: {video_path}")

    media = MediaFileUpload(
        video_path,
        mimetype="video/mp4",
        chunksize=1024 * 1024 * 4,  # 4MB chunks
        resumable=True
    )

    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            percent = int(status.progress() * 100)
            print(f"Uploading: {percent}% complete...")

    video_id = response.get("id")
    short_url = f"https://www.youtube.com/shorts/{video_id}"
    watch_url = f"https://www.youtube.com/watch?v={video_id}"

    print(f"\nSuccessfully Uploaded YouTube Short!")
    print(f"Shorts URL: {short_url}")
    print(f"Watch URL:  {watch_url}")

    return {
        "video_id": video_id,
        "short_url": short_url,
        "watch_url": watch_url,
        "title": title,
        "status": privacy_status
    }

def post_first_comment(video_id, comment_text):
    """
    Posts an official top-level comment on a video (e.g. direct apply link).
    Gracefully handles missing comment scope without crashing the video publishing workflow.
    """
    if not video_id:
        return None

    try:
        youtube = get_authenticated_service(require_comment_scope=False)
        if not youtube:
            print(f"⚠️ YouTube client not available to post first comment on {video_id}.")
            return None

        body = {
            "snippet": {
                "videoId": video_id,
                "topLevelComment": {
                    "snippet": {
                        "textOriginal": comment_text
                    }
                }
            }
        }
        response = youtube.commentThreads().insert(
            part="snippet",
            body=body
        ).execute()
        comment_id = response.get("id")
        print(f"✅ Posted official first comment on video {video_id} (ID: {comment_id})")
        return response
    except HttpError as e:
        if e.resp.status == 403 and "insufficientPermissions" in str(e):
            print(f"ℹ️ First comment skipped: Current YouTube token does not have 'youtube.force-ssl' permission.")
            print(f"   (Video Short was published successfully! Run local re-auth to enable automated comment posting.)")
        else:
            print(f"⚠️ Warning: Could not post first comment on {video_id}: {e}")
        return None
    except Exception as e:
        print(f"⚠️ Warning: Could not post first comment on {video_id}: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload a 9:16 Video to YouTube Shorts")
    parser.add_argument("--video", type=str, required=False, help="Path to .mp4 video file")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"], help="Video privacy")
    parser.add_argument("--title", type=str, default=None, help="Short title")
    args = parser.parse_args()

    # If no video path provided, find the latest rendered reel in scraper/output/reels/
    video_to_upload = args.video
    if not video_to_upload:
        reels_dir = os.path.join(BASE_DIR, "scraper", "output", "reels")
        reels = [os.path.join(reels_dir, f) for f in os.listdir(reels_dir) if f.endswith(".mp4")]
        if reels:
            # Pick most recently created
            reels.sort(key=os.path.getmtime, reverse=True)
            video_to_upload = reels[0]
            print(f"No --video specified. Selected latest rendered reel: {os.path.basename(video_to_upload)}")
        else:
            print("No reels found in scraper/output/reels/. Run social_video_generator.py first.")
            sys.exit(1)

    try:
        res = upload_short(video_to_upload, title=args.title, privacy_status=args.privacy)
        print("\nAll done! Check your YouTube channel studio.")
    except FileNotFoundError as e:
        print(e)
        sys.exit(1)
    except Exception as e:
        print(f"\nUpload failed: {e}")
        sys.exit(1)
