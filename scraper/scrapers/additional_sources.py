"""
Additional Sources Module
Covers: Cutshort, Hiring.cafe, TimesJobs, WayUp, Simplify
"""
import logging
import re
import json
import tls_client
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def fetch_cutshort_jobs(search_terms: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches tech job listings from Cutshort.io."""
    jobs_list = []
    session = tls_client.Session(client_identifier="chrome_120")
    
    for term in search_terms:
        try:
            term_slug = term.replace(' ', '-').lower()
            url = f"https://cutshort.io/jobs/{term_slug}-jobs"
            logger.info(f"[Cutshort] Querying '{term}'...")
            
            resp = session.get(url, timeout_seconds=10)
            if resp.status_code == 200:
                match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', resp.text)
                if match:
                    data = json.loads(match.group(1))
                    ds = data.get('props', {}).get('pageProps', {}).get('dehydratedState', {})
                    queries = ds.get('queries', [])
                    
                    for q in queries:
                        q_data = q.get('state', {}).get('data', {})
                        if isinstance(q_data, dict):
                            items = q_data.get('jobs', []) or q_data.get('posts', []) or q_data.get('data', [])
                            if isinstance(items, list):
                                for item in items[:results_wanted]:
                                    title = item.get('title') or item.get('role') or ''
                                    company = item.get('companyName') or item.get('company', {}).get('name') or 'Cutshort Startup'
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
    session = tls_client.Session(client_identifier="chrome_120")
    
    for term in search_terms:
        try:
            url = f"https://hiring.cafe/api/search?q={term}&limit={results_wanted}"
            logger.info(f"[Hiring.cafe] Querying '{term}'...")
            resp = session.get(url, timeout_seconds=10)
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
