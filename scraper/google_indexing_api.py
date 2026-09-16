"""
FreshersBridge Automated Google Indexing API Client
Directly alerts Googlebot to crawl and index freshly published job postings and internships
within 2-4 hours instead of waiting 2-3 days for standard sitemap discovery.

Google Indexing API Documentation:
https://developers.google.com/search/apis/indexing-api/v3/quickstart
"""

import os
import sys
import json
import logging
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("GoogleIndexingAPI")

SCOPES = ["https://www.googleapis.com/auth/indexing"]
INDEXING_ENDPOINT = "https://indexing.googleapis.com/v1/urlNotifications:publish"
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "..", "credentials", "gsc_service_account.json")
LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "google_indexing_log.json")


def get_credentials():
    """Retrieve Google Service Account credentials with indexing scope."""
    # 1. Environment variable (GitHub Actions secret)
    env_key = os.environ.get("GSC_SERVICE_ACCOUNT_KEY")
    if env_key:
        try:
            info = json.loads(env_key)
            return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        except Exception as e:
            logger.error(f"Failed to parse GSC_SERVICE_ACCOUNT_KEY env var: {e}")

    # 2. Local credentials file
    if os.path.exists(CREDENTIALS_FILE):
        try:
            return service_account.Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
        except Exception as e:
            logger.error(f"Failed to load credentials from {CREDENTIALS_FILE}: {e}")

    return None


def get_indexing_service():
    """Build the authenticated Indexing API discovery service."""
    creds = get_credentials()
    if not creds:
        return None
    return build("indexing", "v3", credentials=creds, cache_discovery=False)


def record_indexing_history(url: str, notification_type: str, status: str, response_data: dict = None):
    """Save indexing submission log to data/google_indexing_log.json for audit and monitoring."""
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    history = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
                if not isinstance(history, list):
                    history = []
        except Exception:
            history = []

    record = {
        "url": url,
        "type": notification_type,
        "status": status,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "response": response_data or {},
    }

    history.insert(0, record)
    history = history[:200]  # Keep last 200 entries

    try:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        logger.warning(f"Failed to write to {LOG_FILE}: {e}")


def notify_url(url: str, notification_type: str = "URL_UPDATED", dry_run: bool = False) -> dict:
    """
    Publish a URL notification to Google Indexing API.
    notification_type: 'URL_UPDATED' (for new/edited jobs) or 'URL_DELETED' (for closed roles)
    """
    if dry_run:
        logger.info(f"[DRY-RUN] Would submit {notification_type} for: {url}")
        return {"status": "dry-run", "url": url}

    service = get_indexing_service()
    if not service:
        logger.warning("No Google Service Account credentials found. Skipping Indexing API notification.")
        return {"status": "skipped_no_creds", "url": url}

    body = {
        "url": url,
        "type": notification_type,
    }

    try:
        response = service.urlNotifications().publish(body=body).execute()
        notify_meta = response.get("urlNotificationMetadata", {})
        latest_update = notify_meta.get("latestUpdate", {}).get("notifyTime", "unknown")
        logger.info(f"✅ Successfully notified Googlebot for: {url} (Notify Time: {latest_update})")
        record_indexing_history(url, notification_type, "success", response)
        return {"status": "success", "response": response}
    except HttpError as err:
        logger.error(f"❌ Google Indexing API error for {url}: {err}")
        record_indexing_history(url, notification_type, f"error_{err.resp.status}", {"details": str(err)})
        return {"status": "error", "error": str(err)}
    except Exception as e:
        logger.error(f"❌ Unexpected error notifying Google Indexing API: {e}")
        record_indexing_history(url, notification_type, "exception", {"details": str(e)})
        return {"status": "error", "error": str(e)}


def batch_notify_urls(urls: list[str], notification_type: str = "URL_UPDATED", dry_run: bool = False) -> list[dict]:
    """Notify Google for a list of URLs."""
    results = []
    logger.info(f"🚀 Dispatching {len(urls)} URLs to Google Indexing API...")
    for idx, url in enumerate(urls, start=1):
        res = notify_url(url, notification_type=notification_type, dry_run=dry_run)
        results.append(res)
    return results


def fetch_latest_job_urls(limit: int = 15) -> list[str]:
    """Fetch latest job canonical URLs from FreshersBridge database/API."""
    from dotenv import load_dotenv
    load_dotenv()
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    load_dotenv(os.path.join(root_dir, ".env.local"))
    load_dotenv(os.path.join(root_dir, ".env"))

    # Try supabase direct query if available
    try:
        supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
        if supabase_url and supabase_key:
            import requests
            headers = {
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
            }
            resp = requests.get(
                f"{supabase_url}/rest/v1/jobs?select=slug,created_at&order=created_at.desc&limit={limit}",
                headers=headers,
                timeout=10,
            )
            if resp.status_code == 200:
                jobs = resp.json()
                urls = [f"https://freshersbridge.in/jobs/{j['slug']}" for j in jobs if j.get("slug")]
                return urls
    except Exception as e:
        logger.warning(f"Could not query Supabase directly: {e}")

    return []


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="FreshersBridge Google Indexing API Tool")
    parser.add_argument("--url", type=str, help="Single URL to notify Googlebot")
    parser.add_argument("--latest", type=int, default=0, help="Notify top N latest jobs from database")
    parser.add_argument("--type", type=str, default="URL_UPDATED", choices=["URL_UPDATED", "URL_DELETED"])
    parser.add_argument("--dry-run", action="store_true", help="Simulate without calling Google API")
    args = parser.parse_args()

    if args.url:
        notify_url(args.url, notification_type=args.type, dry_run=args.dry_run)
    elif args.latest > 0:
        latest_urls = fetch_latest_job_urls(limit=args.latest)
        if not latest_urls:
            print("[!] No job URLs found from database.")
        else:
            print(f"[*] Found {len(latest_urls)} latest job URLs:")
            for u in latest_urls:
                print(f"    - {u}")
            batch_notify_urls(latest_urls, notification_type=args.type, dry_run=args.dry_run)
    else:
        # Default test
        print("[*] Checking Google Indexing API credentials...")
        creds = get_credentials()
        if creds:
            print(f"[+] Credentials found! Service account: {creds.service_account_email}")
            print(f"    Scopes: {creds.scopes}")
        else:
            print("[!] No GSC_SERVICE_ACCOUNT_KEY env var or credentials/gsc_service_account.json file.")
