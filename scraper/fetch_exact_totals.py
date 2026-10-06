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

def fetch_exact_totals():
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
    
    # Query with no dimension filter to get the exact aggregate totals shown on the GSC Dashboard
    start_date = "2026-08-01"
    end_date = datetime.now().strftime('%Y-%m-%d')

    body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': ['date']
    }
    resp = service.searchanalytics().query(siteUrl=site_url, body=body).execute()
    rows = resp.get('rows', [])

    print("\n" + "=" * 50)
    print("DAILY BREAKDOWN MATCHING GOOGLE SEARCH CONSOLE UI")
    print("=" * 50)
    total_c = 0
    total_i = 0
    for r in sorted(rows, key=lambda x: x['keys'][0], reverse=True):
        date_str = r['keys'][0]
        clicks = int(r.get('clicks', 0))
        impressions = int(r.get('impressions', 0))
        ctr = r.get('ctr', 0) * 100
        pos = r.get('position', 0)
        total_c += clicks
        total_i += impressions
        print(f"{date_str}: {clicks:3d} clicks | {impressions:5d} impressions | CTR: {ctr:5.1f}% | Avg Pos: #{pos:.1f}")

    print("=" * 50)
    print(f"TOTAL CLICKS:      {total_c:,}")
    print(f"TOTAL IMPRESSIONS: {total_i:,}")
    avg_ctr = (total_c / total_i * 100) if total_i > 0 else 0
    print(f"AVERAGE CTR:       {avg_ctr:.2f}%")
    print("=" * 50)

if __name__ == '__main__':
    fetch_exact_totals()
