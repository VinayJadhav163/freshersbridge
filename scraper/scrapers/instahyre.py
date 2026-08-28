"""
Instahyre Scraper Module
Targets high-tech and developer fresher jobs in India from Instahyre.com.
"""
import logging
import re
import requests
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*'
}

def fetch_instahyre_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches job listings from Instahyre with rich skills, locations, and employer details."""
    jobs_list = []
    
    for term in search_terms:
        try:
            url = f"https://www.instahyre.com/api/v1/job_search?query={requests.utils.quote(term)}&offset=0&limit={results_wanted}"
            logger.info(f"[Instahyre] Searching '{term}'...")
            
            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                objects = data.get('objects', [])
                for item in objects:
                    title = (item.get('title') or item.get('candidate_title') or '').strip()
                    if not title:
                        continue
                        
                    employer = item.get('employer') or {}
                    company = (employer.get('company_name') or item.get('employer_name') or '').strip()
                    company_note = (employer.get('instahyre_note') or employer.get('company_tagline') or '').strip()
                    
                    job_url = (item.get('public_url') or f"https://www.instahyre.com/job-{item.get('id')}").strip()
                    
                    if not company and job_url:
                        match = re.search(r'-at-([a-z0-9\-]+)-([a-z]+)/?$', job_url, re.IGNORECASE)
                        if match:
                            company = match.group(1).replace('-', ' ').title()
                            
                    if not company:
                        company = "Fast-Growing Tech Startup"
                        
                    # Instahyre returns location in 'locations' field (e.g. 'Bangalore', 'Hyderabad', 'Work from Home')
                    loc_val = item.get('locations') or item.get('location') or 'Bangalore'
                    if isinstance(loc_val, list):
                        loc_str = ", ".join(loc_val)
                    else:
                        loc_str = str(loc_val)
                        
                    # Extract skill keywords directly provided by Instahyre
                    keywords = item.get('keywords') or []
                    skills_str = ", ".join(keywords) if isinstance(keywords, list) else ""
                    
                    # Generate rich JD using Instahyre company note and metadata
                    desc_body = f"""### About {company}
{company_note if company_note else f"{company} is a leading high-growth technology company currently hiring for {title}."}

### Role Overview & Responsibilities
- Contribute to the development, optimization, and scaling of software solutions as a **{title}**.
- Design clean, maintainable architecture using: {skills_str if skills_str else 'modern tech stack'}.
- Collaborate closely with product managers, tech leads, and peer engineers.

### Key Technical Stack & Skills
- {skills_str if skills_str else 'Programming fundamentals, problem solving, data structures'}
- Clean code principles and modern development workflows.
""".strip()
                    
                    jobs_list.append({
                        'title': title,
                        'company': company,
                        'location': loc_str,
                        'query_location': loc_str,
                        'description': desc_body,
                        'skills': skills_str,
                        'raw_keywords': keywords,
                        'apply_url': job_url,
                        'salary': 'Competitive / As per Industry Standards',
                        'source_name': 'Instahyre',
                        'source_url': job_url,
                        'is_remote': 'work from home' in loc_str.lower() or 'remote' in loc_str.lower()
                    })
        except Exception as e:
            logger.error(f"[Instahyre] Failed fetching '{term}': {e}")
            
    return jobs_list
