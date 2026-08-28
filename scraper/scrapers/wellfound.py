"""
Wellfound (AngelList) Scraper Module
Targets startup and remote engineering roles from Wellfound.com.
"""
import logging
import requests
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json'
}

def fetch_wellfound_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches job listings from Wellfound."""
    jobs_list = []
    
    for term in search_terms:
        try:
            logger.info(f"[Wellfound] Searching '{term}'...")
            # GraphQL / Public API search endpoint
            url = f"https://wellfound.com/api/v2/jobs/search?keyword={requests.utils.quote(term)}&remote=true"
            resp = requests.get(url, headers=HEADERS, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                listings = data.get('jobs', []) or data.get('results', [])
                for item in listings:
                    title = item.get('title') or ''
                    company = item.get('company_name') or item.get('startup', {}).get('name') or ''
                    job_url = item.get('url') or item.get('apply_url') or ''
                    if job_url and not job_url.startswith('http'):
                        job_url = f"https://wellfound.com{job_url}"
                        
                    jobs_list.append({
                        'title': title,
                        'company': company,
                        'location': item.get('location') or 'Remote',
                        'description': item.get('description') or f"{title} at startup {company}",
                        'apply_url': job_url,
                        'salary': item.get('compensation') or item.get('salary_range') or 'Equity / Salary',
                        'source_name': 'Wellfound',
                        'source_url': job_url,
                        'is_remote': True
                    })
        except Exception as e:
            logger.error(f"[Wellfound] Failed fetching '{term}': {e}")
            
    return jobs_list
