"""
Additional Sources Module
Covers: Cutshort, Hiring.cafe, TimesJobs, WayUp, Simplify
"""
import logging
import re
import json
import requests
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

def fetch_cutshort_jobs(search_terms: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches tech job listings from Cutshort.io."""
    jobs_list = []
    
    use_tls = False
    tls_session = None
    try:
        import tls_client
        tls_session = tls_client.Session(client_identifier="chrome_120")
        use_tls = True
    except Exception:
        use_tls = False
    
    for term in search_terms:
        try:
            term_slug = term.replace(' ', '-').lower()
            url = f"https://cutshort.io/jobs/{term_slug}-jobs"
            logger.info(f"[Cutshort] Querying '{term}'...")
            
            if use_tls and tls_session:
                resp = tls_session.get(url, timeout_seconds=10)
            else:
                resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', resp.text)
                if match:
                    page_props = (data.get('props') or {}).get('pageProps') or {}
                    ds = page_props.get('dehydratedState') or {}
                    queries = ds.get('queries', []) if isinstance(ds, dict) else []
                    
                    for q in queries:
                        if not isinstance(q, dict):
                            continue
                        state = q.get('state') or {}
                        q_data = state.get('data') or {}
                        if isinstance(q_data, dict):
                            items = q_data.get('jobs', []) or q_data.get('posts', []) or q_data.get('data', [])
                            if isinstance(items, list):
                                for item in items[:results_wanted]:
                                    if not isinstance(item, dict):
                                        continue
                                    title = item.get('title') or item.get('role') or ''
                                    company = item.get('companyName') or (item.get('company') or {}).get('name') or 'Cutshort Startup'
                                    slug = item.get('slug') or item.get('publicUrl') or ''
                                    job_url = f"https://cutshort.io/job/{slug}" if slug and not slug.startswith('http') else url
                                    
                                    jobs_list.append({
                                        'title': title,
                                        'company': company,
                                        'location': item.get('location') or 'India',
                                        'description': item.get('description') or f"{title} role at {company}",
                                        'apply_url': job_url,
                                        'salary': item.get('salaryText') or 'Competitive',
                                        'source_name': 'Cutshort',
                                        'source_url': job_url,
                                        'is_remote': 'remote' in str(item.get('location')).lower()
                                    })
        except Exception as e:
            logger.error(f"[Cutshort] Failed fetching '{term}': {e}")
            
    return jobs_list

def fetch_hiring_cafe_jobs(search_terms: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches developer and remote tech jobs from Hiring.cafe."""
    jobs_list = []
    
    use_tls = False
    tls_session = None
    try:
        import tls_client
        tls_session = tls_client.Session(client_identifier="chrome_120")
        use_tls = True
    except Exception:
        use_tls = False
    
    for term in search_terms:
        try:
            url = f"https://hiring.cafe/api/search?q={term}&limit={results_wanted}"
            logger.info(f"[Hiring.cafe] Querying '{term}'...")
            if use_tls and tls_session:
                resp = tls_session.get(url, timeout_seconds=10)
            else:
                resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                try:
                    data = resp.json()
                    results = data.get('results', []) or data.get('jobs', [])
                    for item in results:
                        title = item.get('title') or ''
                        company = item.get('company') or item.get('company_name') or 'Hiring.cafe Employer'
                        apply_url = item.get('apply_url') or item.get('url') or ''
                        jobs_list.append({
                            'title': title,
                            'company': company,
                            'location': item.get('location') or 'Remote',
                            'description': item.get('description') or f"{title} position at {company}",
                            'apply_url': apply_url or 'https://hiring.cafe',
                            'salary': item.get('salary') or 'Competitive',
                            'source_name': 'Hiring.cafe',
                            'source_url': apply_url or 'https://hiring.cafe',
                            'is_remote': True
                        })
                except Exception:
                    pass
        except Exception as e:
            logger.error(f"[Hiring.cafe] Failed fetching '{term}': {e}")
            
    return jobs_list
