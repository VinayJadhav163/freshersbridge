"""
Instahyre Scraper Module
Targets strictly fresher, trainee, intern, and entry-level developer roles in India from Instahyre.com.
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

# Strict exclusion list for experienced, senior, and non-entry-level roles
SENIOR_OR_NON_TECH_PATTERNS = [
    r'\b(senior|sr\.?|principal|staff|lead|leader|architect|manager|director|vp|vice president|avp|head of|head|founding)\b',
    r'\b(consultant|specialist|expert|strategist)\b',
    r'\b(sde|sdet|qa|swe|engineer|developer|tester|mts)[- ]*(?:2|3|4|5|ii|iii|iv|v)\b',
    r'\b(ii|iii|iv|v)\b',
    r'\b(level[- ]?[2345]|l[2345]|ic[2345]|e[2345]|grade[- ]?[2345])\b',
    r'\b(intermediate|mid[- ]?level|experienced|sse)\b',
    r'\b(marketer|marketing|sales|publisher|recruiter|talent acquisition|scrum master|people manager|business development|bde|bda)\b'
]

def is_valid_instahyre_fresher(title: str) -> bool:
    """Verifies that the role title is strictly entry-level and has no senior/experienced indicators."""
    if not title:
        return False
    title_lower = title.lower()
    for p in SENIOR_OR_NON_TECH_PATTERNS:
        if re.search(p, title_lower, re.IGNORECASE):
            return False
    return True

# Dedicated fresher-targeted search queries for Instahyre
INSTAHYRE_FRESHER_TERMS = [
    "Intern",
    "Trainee",
    "Graduate Engineer Trainee",
    "Junior Developer",
    "Junior Software Engineer",
    "Junior QA",
    "Junior Data Analyst",
    "Associate Software Engineer",
    "Fresher"
]

def fetch_instahyre_jobs(search_terms: List[str] = None, locations: List[str] = None, results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches job listings from Instahyre with strict fresher & entry-level filtering."""
    jobs_list = []
    terms_to_search = INSTAHYRE_FRESHER_TERMS if not search_terms else search_terms

    for term in terms_to_search[:5]:
        try:
            url = f"https://www.instahyre.com/api/v1/job_search?query={requests.utils.quote(term)}&offset=0&limit={results_wanted}"
            logger.info(f"[Instahyre] Searching '{term}'...")

            resp = requests.get(url, headers=HEADERS, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                objects = data.get('objects', [])
                for item in objects:
                    title = (item.get('title') or item.get('candidate_title') or '').strip()
                    if not title or not is_valid_instahyre_fresher(title):
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
                        company = "Tech Startup"

                    # Instahyre returns location in 'locations' field
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
{company_note if company_note else f"{company} is a leading technology organization hiring for entry-level {title}."}

### Role Overview & Responsibilities
- Work closely with development and engineering teams as a **{title}**.
- Design clean, maintainable code using: {skills_str if skills_str else 'modern programming technologies'}.
- Participate in code reviews, bug fixes, and feature releases.

### Key Technical Stack & Skills
- {skills_str if skills_str else 'Programming fundamentals, problem solving, data structures'}
- Clean code principles and eager learning mindset.
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

    logger.info(f"[Instahyre] Total strictly verified entry-level jobs extracted: {len(jobs_list)}")
    return jobs_list
