"""
Hirist.tech Scraper Module
Targets IT and Software Engineering jobs in India from Hirist.tech.
"""
import logging
import requests
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json'
}

def fetch_hirist_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches job listings from Hirist.tech."""
    jobs_list = []
    
    for term in search_terms:
        try:
            url = f"https://www.hirist.tech/api/v2/search?keywords={requests.utils.quote(term)}&exp=0-2&page=1"
            logger.info(f"[Hirist] Querying '{term}'...")
            
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                job_list = data.get('jobs', []) or data.get('data', [])
                for item in job_list:
                    title = item.get('title') or ''
                    company = item.get('company_name') or item.get('company') or ''
                    job_url = item.get('url') or item.get('job_url') or ''
                    if job_url and not job_url.startswith('http'):
                        job_url = f"https://www.hirist.tech{job_url}"
                        
                    jobs_list.append({
                        'title': title,
                        'company': company,
                        'location': item.get('location') or 'India',
                        'description': item.get('snippet') or item.get('description') or f"{title} role at {company}",
                        'apply_url': job_url,
                        'salary': item.get('salary') or 'Not Disclosed',
                        'source_name': 'Hirist',
                        'source_url': job_url,
                        'is_remote': 'remote' in str(item.get('location')).lower()
                    })
        except Exception as e:
            logger.error(f"[Hirist] Failed fetching '{term}': {e}")
            
    return jobs_list
