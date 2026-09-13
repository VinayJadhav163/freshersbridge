"""
FreshersBridge - Automated Google Search Console Analytics & Insights Bot
Fetches real search performance (queries, pages, impressions, clicks, CTR, position)
via the official Search Console API (free tier).
Identifies "Striking Distance" keywords to optimize for instant rank boosts.
"""

import os
import json
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), '..', 'credentials', 'gsc_service_account.json')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def get_credentials():
    # 1. Try env var (used in GitHub Actions)
    env_key = os.environ.get('GSC_SERVICE_ACCOUNT_KEY')
    if env_key:
        try:
            info = json.loads(env_key)
            return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
        except Exception as e:
            print(f"Error parsing GSC_SERVICE_ACCOUNT_KEY env var: {e}")

    # 2. Try local file
    if os.path.exists(CREDENTIALS_FILE):
        return service_account.Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=SCOPES)

    return None

def fetch_gsc_data():
    creds = get_credentials()
    if not creds:
        print("[!] No service account credentials found.")
        print("    Ensure GSC_SERVICE_ACCOUNT_KEY is set or credentials/gsc_service_account.json exists.")
        return

    service = build('searchconsole', 'v1', credentials=creds)

    # 1. Discover accessible properties
    sites_resp = service.sites().list().execute()
    sites = sites_resp.get('siteEntry', [])

    if not sites:
        print("\n" + "=" * 70)
        print("[!] NOTICE: Service account authenticated, but NO SITES FOUND.")
        print("    You must add the service account email as a User in Google Search Console:")
        print("    Email: gsc-bot@freshersbridge-seo.iam.gserviceaccount.com")
        print("    Steps:")
        print("    1. Go to https://search.google.com/search-console")
        print("    2. Select your property (e.g. freshersbridge.com)")
        print("    3. Click Settings (left sidebar) -> Users and permissions -> Add user")
        print("    4. Paste: gsc-bot@freshersbridge-seo.iam.gserviceaccount.com (Permission: Full or Restricted)")
        print("=" * 70 + "\n")
        return

    print(f"[*] Found {len(sites)} site(s) connected to service account:")
    for s in sites:
        print(f"    - {s.get('siteUrl')} ({s.get('permissionLevel')})")

    # Pick the primary property
    site_url = sites[0].get('siteUrl')
    print(f"[*] Fetching performance for: {site_url}")

    end_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')

    # Query 1: Top Search Queries
    query_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['query'],
        'rowLimit': 500
    }
    query_resp = service.searchanalytics().query(siteUrl=site_url, body=query_body).execute()
    queries = query_resp.get('rows', [])

    # Query 2: Top Pages
    page_body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['page'],
        'rowLimit': 100
    }
    page_resp = service.searchanalytics().query(siteUrl=site_url, body=page_body).execute()
    pages = page_resp.get('rows', [])

    # Process metrics
    total_clicks = sum(r.get('clicks', 0) for r in queries)
    total_impressions = sum(r.get('impressions', 0) for r in queries)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    avg_position = (sum(r.get('position', 0) for r in queries) / len(queries)) if queries else 0

    # Categorize Queries
    top_clicks = sorted(queries, key=lambda x: x.get('clicks', 0), reverse=True)[:20]
    high_impressions = sorted(queries, key=lambda x: x.get('impressions', 0), reverse=True)[:20]
    
    # Striking distance: Position 4 to 20 with impressions >= 10 (Prime candidates for immediate ranking boosts)
    striking_distance = [
        r for r in queries
        if 4.0 <= r.get('position', 0) <= 20.0 and r.get('impressions', 0) >= 10
    ]
    striking_distance = sorted(striking_distance, key=lambda x: x.get('impressions', 0), reverse=True)

    summary = {
        'site_url': site_url,
        'period': f"{start_date} to {end_date}",
        'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
        'total_queries_tracked': len(queries),
        'total_clicks': total_clicks,
        'total_impressions': total_impressions,
        'avg_ctr_percent': round(avg_ctr, 2),
        'avg_position': round(avg_position, 1),
        'top_queries_by_clicks': [
            {
                'query': r['keys'][0],
                'clicks': r.get('clicks', 0),
                'impressions': r.get('impressions', 0),
                'ctr': round(r.get('ctr', 0) * 100, 2),
                'position': round(r.get('position', 0), 1)
            } for r in top_clicks
        ],
        'striking_distance_opportunities': [
            {
                'query': r['keys'][0],
                'clicks': r.get('clicks', 0),
                'impressions': r.get('impressions', 0),
                'ctr': round(r.get('ctr', 0) * 100, 2),
                'position': round(r.get('position', 0), 1),
                'optimization_action': 'Target in H2/H3 heading + Title tag booster to push into Top 3'
            } for r in striking_distance[:25]
        ],
        'top_pages': [
            {
                'url': r['keys'][0],
                'clicks': r.get('clicks', 0),
                'impressions': r.get('impressions', 0),
                'ctr': round(r.get('ctr', 0) * 100, 2),
                'position': round(r.get('position', 0), 1)
            } for r in pages[:15]
        ]
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    json_path = os.path.join(OUTPUT_DIR, 'gsc_performance.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"[+] Saved performance report: {json_path}")

    # Generate Markdown Summary Report
    md_path = os.path.join(OUTPUT_DIR, 'gsc_insights.md')
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(f"# Google Search Console Automated Performance Report\n\n")
        f.write(f"**Property**: `{site_url}`  \n")
        f.write(f"**Period**: {start_date} to {end_date}  \n")
        f.write(f"**Updated At**: {summary['generated_at']}  \n\n")
        f.write(f"### 📊 Overall Performance\n")
        f.write(f"- **Total Clicks**: **{total_clicks:,}**\n")
        f.write(f"- **Total Impressions**: **{total_impressions:,}**\n")
        f.write(f"- **Average CTR**: **{round(avg_ctr, 2)}%**\n")
        f.write(f"- **Average Position**: **{round(avg_position, 1)}**\n")
        f.write(f"- **Total Ranking Queries**: **{len(queries)}**\n\n")

        f.write(f"### 🚀 High-Impact 'Striking Distance' Keywords (Positions 4 – 20)\n")
        f.write(f"These queries are already ranking on Page 1 or 2 with high impressions. Optimizing their titles/content will drive immediate traffic:\n\n")
        f.write(f"| Query | Impressions | Clicks | CTR | Position | Action |\n")
        f.write(f"|---|---|---|---|---|---|\n")
        for op in summary['striking_distance_opportunities'][:15]:
            f.write(f"| **{op['query']}** | {op['impressions']} | {op['clicks']} | {op['ctr']}% | #{op['position']} | {op['optimization_action']} |\n")

        f.write(f"\n### 🏆 Top 10 Search Queries by Clicks\n\n")
        f.write(f"| Query | Clicks | Impressions | CTR | Position |\n")
        f.write(f"|---|---|---|---|---|\n")
        for q in summary['top_queries_by_clicks'][:10]:
            f.write(f"| {q['query']} | **{q['clicks']}** | {q['impressions']} | {q['ctr']}% | #{q['position']} |\n")

        f.write(f"\n### 📄 Top 10 Landing Pages\n\n")
        f.write(f"| Page URL | Clicks | Impressions | CTR |\n")
        f.write(f"|---|---|---|---|\n")
        for p in summary['top_pages'][:10]:
            f.write(f"| `{p['url']}` | **{p['clicks']}** | {p['impressions']} | {p['ctr']}% |\n")

    print(f"[+] Saved insights markdown: {md_path}")

if __name__ == '__main__':
    fetch_gsc_data()
