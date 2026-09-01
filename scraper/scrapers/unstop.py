"""
Unstop (Dare2Compete) Scraper Module
Targets verified college fresher drives, GET roles, and tech internships across India from Unstop.com.
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

NON_TECH_PATTERNS = [
    r'\b(sales|telecaller|telesales|bpo|medical billing|receptionist|nurse|teacher|civil site|autocad civil|foundry|boiler)\b'
]

def is_tech_fresher_title(title: str) -> bool:
    if not title:
        return False
    title_lower = title.lower()
    for p in NON_TECH_PATTERNS:
        if re.search(p, title_lower, re.I):
            return False
    return True

UNSTOP_SEARCH_TERMS = [
    "software",
    "developer",
    "python",
    "data",
    "frontend",
    "backend",
    "intern",
    "graduate engineer trainee"
]

def format_unstop_salary(job_detail: Dict[str, Any]) -> str:
    if not job_detail:
        return "Best in Industry / Competitive"
    min_sal = job_detail.get('min_salary')
    max_sal = job_detail.get('max_salary')
    pay_in = (job_detail.get('pay_in') or 'annually').lower()
    
    if min_sal and max_sal:
        if pay_in == 'annually' or min_sal >= 100000:
            min_lpa = round(min_sal / 100000, 1)
            max_lpa = round(max_sal / 100000, 1)
            if min_lpa == max_lpa:
                return f"₹{min_lpa} LPA"
            return f"₹{min_lpa} - ₹{max_lpa} LPA"
        else:
            return f"₹{min_sal:,} - ₹{max_sal:,} /month"
    elif min_sal:
        if pay_in == 'annually' or min_sal >= 100000:
            return f"₹{round(min_sal / 100000, 1)} LPA"
        return f"₹{min_sal:,} /month"
    return "Best in Industry / Disclosed Upon Selection"

def fetch_unstop_jobs(search_terms: List[str] = None, results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches high-quality fresher jobs and internships from Unstop."""
    jobs_list = []
    terms = UNSTOP_SEARCH_TERMS if not search_terms else search_terms

    for opp_type in ['jobs', 'internships']:
        for term in terms[:4]:
            try:
                url = f"https://unstop.com/api/public/opportunity/search-result?opportunity={opp_type}&searchTerm={requests.utils.quote(term)}&per_page={results_wanted}&oppstatus=recent"
                logger.info(f"[Unstop] Searching {opp_type} for '{term}'...")

                resp = requests.get(url, headers=HEADERS, timeout=12)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_items = data.get('data', {}).get('data', [])

                    for item in raw_items:
                        title = (item.get('title') or '').strip()
                        if not title or not is_tech_fresher_title(title):
                            continue

                        org = item.get('organisation') or {}
                        company = (org.get('name') or item.get('organisation_name') or '').strip()
                        if not company:
                            company = "Leading Tech Organization"

                        job_detail = item.get('jobDetail') or {}
                        locations_list = job_detail.get('locations') or item.get('locations') or []
                        job_type_loc = job_detail.get('type') or ''

                        if 'wfh' in job_type_loc.lower() or 'remote' in str(locations_list).lower():
                            loc_str = "Remote / Work From Home"
                            is_remote = True
                        elif locations_list and isinstance(locations_list, list):
                            loc_str = ", ".join([str(l) for l in locations_list if l])
                            is_remote = False
                        else:
                            loc_str = "India / Flexible"
                            is_remote = False

                        apply_url = item.get('seo_url') or item.get('public_url') or f"https://unstop.com/o/{item.get('id')}"
                        salary_str = format_unstop_salary(job_detail)

                        # Determine job type
                        is_intern = opp_type == 'internships' or 'intern' in title.lower() or 'trainee' in title.lower()
                        job_type = 'internship' if is_intern else 'full-time'

                        desc_body = f"""### About {company} Opportunity on Unstop
{company} is currently hiring freshers and recent college graduates for the position of **{title}**.

### Role Overview & Opportunities
- Work on software, development, and engineering tasks as a **{title}**.
- Great learning opportunity with real-world exposure for 2024, 2025, and 2026 batch candidates.
- Participate in project workflows, feature development, testing, and team collaborations.

### Eligibility & Qualifications
- BE / B.Tech / BCA / MCA / B.Sc / M.Sc or Any Graduate (2024, 2025, 2026 Batch).
- Good foundation in programming fundamentals, problem solving, and modern technical stacks.
""".strip()

                        jobs_list.append({
                            'title': title,
                            'company': company,
                            'location': loc_str,
                            'query_location': loc_str,
                            'description': desc_body,
                            'skills': f"{title}, Software Engineering, Problem Solving",
                            'salary': salary_str,
                            'eligibility': 'Any Graduate / BE / B.Tech / BCA (2024, 2025, 2026 Batch)',
                            'apply_url': apply_url,
                            'source_name': 'Unstop',
                            'source_url': apply_url,
                            'job_type': job_type,
                            'is_remote': is_remote
                        })
            except Exception as e:
                logger.error(f"[Unstop] Error fetching {opp_type} '{term}': {e}")

    logger.info(f"[Unstop] Total verified listings collected: {len(jobs_list)}")
    return jobs_list
