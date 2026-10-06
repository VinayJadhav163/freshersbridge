import os
import json
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), '..', 'credentials', 'gsc_service_account.json')

def get_credentials():
    env_key = os.environ.get('GSC_SERVICE_ACCOUNT_KEY')
    if env_key:
        try:
            info = json.loads(env_key)
            return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        except Exception as e:
            print(f"Error parsing GSC_SERVICE_ACCOUNT_KEY: {e}")
    if os.path.exists(CREDENTIALS_FILE):
        return service_account.Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)
    return None

def fetch_all_time():
    creds = get_credentials()
    if not creds:
        print("No credentials found!")
        return

    service = build('searchconsole', 'v1', credentials=creds)
    sites_resp = service.sites().list().execute()
    sites = sites_resp.get('siteEntry', [])
    if not sites:
        print("No sites found!")
        return

    site_url = sites[0].get('siteUrl')
    print(f"Fetching all-time performance for: {site_url}")

    # GSC holds up to 16 months of data. Let's query from 2025-01-01 to 2 days ago
    start_date = "2025-01-01"
    end_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')

    # 1. Total Daily Timeline
    daily_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['date'],
        'rowLimit': 1000
    }
    daily_resp = service.searchanalytics().query(siteUrl=site_url, body=daily_body).execute()
    daily_rows = daily_resp.get('rows', [])

    # 2. Total Queries
    query_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['query'],
        'rowLimit': 1000
    }
    query_resp = service.searchanalytics().query(siteUrl=site_url, body=query_body).execute()
    query_rows = query_resp.get('rows', [])

    # 3. Total Pages
    page_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['page'],
        'rowLimit': 1000
    }
    page_resp = service.searchanalytics().query(siteUrl=site_url, body=page_body).execute()
    page_rows = page_resp.get('rows', [])

    total_clicks = sum(r.get('clicks', 0) for r in daily_rows)
    total_impressions = sum(r.get('impressions', 0) for r in daily_rows)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    avg_pos = (sum(r.get('position', 0) * r.get('impressions', 1) for r in daily_rows) / total_impressions) if total_impressions > 0 else 0

    first_day = daily_rows[0]['keys'][0] if daily_rows else "N/A"
    last_day = daily_rows[-1]['keys'][0] if daily_rows else "N/A"

    print("\n" + "=" * 60)
    print("GOOGLE SEARCH CONSOLE - ALL-TIME PERFORMANCE SUMMARY")
    print("=" * 60)
    print(f"Property URL:          {site_url}")
    print(f"Data Date Range:       {first_day} to {last_day} ({len(daily_rows)} active tracking days)")
    print(f"Total Lifetime Clicks:       {total_clicks:,}")
    print(f"Total Lifetime Impressions:  {total_impressions:,}")
    print(f"Average Click-Through Rate:  {avg_ctr:.2f}%")
    print(f"Average Search Position:     {avg_pos:.1f}")
    print(f"Total Tracked Queries:       {len(query_rows):,}")
    print(f"Total Tracked Landing Pages: {len(page_rows):,}")
    print("=" * 60)

    # Top 15 Queries
    print("\n--- TOP 15 SEARCH QUERIES ---")
    sorted_queries = sorted(query_rows, key=lambda x: (x.get('clicks', 0), x.get('impressions', 0)), reverse=True)[:15]
    for idx, q in enumerate(sorted_queries, 1):
        query_name = q['keys'][0]
        clicks = q.get('clicks', 0)
        impr = q.get('impressions', 0)
        ctr = q.get('ctr', 0) * 100
        pos = q.get('position', 0)
        print(f"[{idx:2d}] {query_name:<35} | Clicks: {clicks:3d} | Impressions: {impr:4d} | CTR: {ctr:5.1f}% | Avg Pos: #{pos:4.1f}")

    # Top 15 Pages
    print("\n--- TOP 10 LANDING PAGES ---")
    sorted_pages = sorted(page_rows, key=lambda x: (x.get('clicks', 0), x.get('impressions', 0)), reverse=True)[:10]
    for idx, p in enumerate(sorted_pages, 1):
        page_url = p['keys'][0]
        clicks = p.get('clicks', 0)
        impr = p.get('impressions', 0)
        ctr = p.get('ctr', 0) * 100
        print(f"[{idx:2d}] {page_url}")
        print(f"     Clicks: {clicks} | Impressions: {impr} | CTR: {ctr:.1f}%")

if __name__ == '__main__':
    fetch_all_time()
