"""
Foundit (Monster India) Scraper Module
Targets Indian fresher & remote job postings on Foundit.in.
"""
import logging
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
}

def fetch_foundit_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches job listings from Foundit (Monster India)."""
    jobs_list = []
    
    for term in search_terms:
        for loc in locations:
            try:
                query_str = term.replace(' ', '-').lower()
                loc_str = loc.split(',')[0].strip().replace(' ', '-').lower()
                url = f"https://www.foundit.in/srp/results?query={requests.utils.quote(term)}&locations={requests.utils.quote(loc)}"
                logger.info(f"[Foundit] Searching '{term}' in '{loc}'...")
                
                resp = requests.get(url, headers=HEADERS, timeout=8)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    cards = soup.select('.card-apply-content, .job-apply-card, div[data-job-id]')
                    
                    for card in cards[:results_wanted]:
                        title_elem = card.select_one('.job-title, .title, h3, a[href*="job"]')
                        company_elem = card.select_one('.company-name, .company, .name')
                        loc_elem = card.select_one('.location, .loc')
                        link_elem = card.select_one('a[href]')
                        
                        if title_elem:
                            title = title_elem.get_text(strip=True)
                            company = company_elem.get_text(strip=True) if company_elem else 'Foundit Recruiter'
                            location = loc_elem.get_text(strip=True) if loc_elem else loc
                            href = link_elem['href'] if link_elem and 'href' in link_elem.attrs else ''
                            if href and not href.startswith('http'):
                                href = f"https://www.foundit.in{href}"
                                
                            jobs_list.append({
                                'title': title,
                                'company': company,
                                'location': location,
                                'description': f"{title} opening at {company}",
                                'apply_url': href or url,
                                'salary': 'Not Disclosed',
                                'source_name': 'Foundit',
                                'source_url': href or url,
                                'is_remote': 'remote' in location.lower()
                            })
            except Exception as e:
                logger.error(f"[Foundit] Failed fetching '{term}' in '{loc}': {e}")
                
    return jobs_list
