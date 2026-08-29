"""
Naukri.com Scraper Module
Targets Indian fresher & GET (Graduate Engineer Trainee) job postings on Naukri.
"""
import logging
import requests
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'appid': '109',
    'systemid': 'Naukri',
    'Referer': 'https://www.naukri.com/'
}

def fetch_naukri_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches fresher job postings from Naukri.com."""
    jobs_list = []
    
    for term in search_terms:
        for loc in locations:
            try:
                # Naukri Search API (Filtered to 24 hours fresh jobs)
                clean_term = term.replace(' ', '-').lower()
                url = f"https://www.naukri.com/jobapi/v3/search?noOfResults={results_wanted}&keyword={requests.utils.quote(term)}&location={requests.utils.quote(loc)}&jobAge=1&sort=date"
                logger.info(f"[Naukri] Querying '{term}' in '{loc}' (last 24 hours)...")
                
                resp = requests.get(url, headers=HEADERS, timeout=8)
                if resp.status_code == 200:
                    data = resp.json()
                    job_details = data.get('jobDetails', [])
                    for item in job_details:
                        title = item.get('title') or ''
                        company = item.get('companyName') or ''
                        jd_url = item.get('jdURL') or ''
                        if jd_url and not jd_url.startswith('http'):
                            jd_url = f"https://www.naukri.com{jd_url}"
                            
                        placeholders = item.get('placeholders', [])
                        location_text = loc
                        for ph in placeholders:
                            if ph.get('type') == 'location':
                                location_text = ph.get('label') or loc
                                
                        jobs_list.append({
                            'title': title,
                            'company': company,
                            'location': location_text,
                            'description': item.get('jobDescription') or f"{title} role at {company}",
                            'apply_url': jd_url or f"https://www.naukri.com/{clean_term}-jobs",
                            'salary': item.get('salaryDetail', {}).get('label') or 'Not Disclosed',
                            'source_name': 'Naukri',
                            'source_url': jd_url or f"https://www.naukri.com/{clean_term}-jobs",
                            'is_remote': 'remote' in location_text.lower() or 'work from home' in location_text.lower()
                        })
            except Exception as e:
                logger.error(f"[Naukri] Failed fetching '{term}' in '{loc}': {e}")
                
    return jobs_list
