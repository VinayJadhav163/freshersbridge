"""
Shine.com Scraper Module
Targets Indian fresher & tech job postings from Shine.com via Next.js state payload.
"""
import logging
import re
import json
import tls_client
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def fetch_shine_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 10) -> List[Dict[str, Any]]:
    """Fetches job listings from Shine.com."""
    jobs_list = []
    session = tls_client.Session(client_identifier="chrome_120")
    
    for term in search_terms:
        for loc in locations:
            try:
                term_slug = term.replace(' ', '-').lower()
                loc_slug = loc.split(',')[0].strip().replace(' ', '-').lower()
                url = f"https://www.shine.com/job-search/{term_slug}-jobs-in-{loc_slug}?sort=date"
                logger.info(f"[Shine] Searching '{term}' in '{loc}'...")
                
                resp = session.get(url, timeout_seconds=10)
                if resp.status_code == 200:
                    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', resp.text)
                    if match:
                        data = json.loads(match.group(1))
                        sr_data = data.get('props', {}).get('pageProps', {}).get('initialState', {}).get('jsrp', {}).get('searchresult', {}).get('data', {})
                        items = sr_data.get('results', [])
                        
                        for item in items[:results_wanted]:
                            title = (item.get('jJT') or item.get('title') or '').strip()
                            if not title:
                                continue

                            # Strict Freshness filter: Skip jobs older than 1 day (last 24 hours freshness rule)
                            from datetime import datetime
                            post_date_str = str(item.get('jPDate') or item.get('jCDate') or item.get('posted_date') or '').strip()
                            if post_date_str:
                                try:
                                    clean_date_str = post_date_str.split('.')[0].replace('Z', '')
                                    post_dt = datetime.fromisoformat(clean_date_str)
                                    age_days = (datetime.now() - post_dt).days
                                    if age_days > 1:
                                        logger.info(f"[Shine] Skipping job older than 24 hours ({age_days} days old): {title}")
                                        continue
                                except Exception:
                                    pass
                                
                            company = (item.get('jCName') or item.get('company_name') or 'Hiring Organization').strip()
                            raw_loc = item.get('jLoc') or loc
                            if isinstance(raw_loc, list):
                                location_str = ", ".join([str(x) for x in raw_loc])
                            else:
                                location_str = str(raw_loc)
                                
                            slug = str(item.get('jSlug') or '').strip().strip('/')
                            job_id = str(item.get('id') or '').strip()
                            
                            if slug:
                                if slug.startswith('http'):
                                    job_url = slug
                                else:
                                    # If slug already ends with the job_id, do NOT append it again
                                    if job_id and not slug.endswith(job_id):
                                        job_url = f"https://www.shine.com/jobs/{slug}/{job_id}"
                                    else:
                                        job_url = f"https://www.shine.com/jobs/{slug}"
                            else:
                                job_url = url
                            
                            raw_desc = (item.get('jJD') or '').strip()
                            # Clean HTML tags
                            clean_desc = re.sub(r'<[^>]+>', ' ', raw_desc)
                            clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()
                            
                            skills_val = item.get('jKeySkills') or item.get('skills') or []
                            skills_list = []
                            if isinstance(skills_val, list):
                                skills_list = skills_val
                            elif isinstance(skills_val, str):
                                skills_list = [s.strip() for s in skills_val.split(',') if s.strip()]
                                
                            jobs_list.append({
                                'title': title,
                                'company': company,
                                'location': location_str,
                                'query_location': loc,
                                'description': clean_desc,
                                'raw_keywords': skills_list,
                                'apply_url': job_url,
                                'salary': str(item.get('jSal') or item.get('jPack') or 'Not Disclosed'),
                                'source_name': 'Shine',
                                'source_url': job_url,
                                'is_remote': 'remote' in location_str.lower()
                            })
            except Exception as e:
                logger.error(f"[Shine] Failed fetching '{term}' in '{loc}': {e}")
                
    return jobs_list
