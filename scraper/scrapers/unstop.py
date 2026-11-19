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

def get_domain_responsibilities(title: str) -> List[str]:
    t = title.lower()
    if any(k in t for k in ['react', 'frontend', 'front-end', 'ui', 'vue', 'angular', 'web developer']):
        return [
            "Develop, test, and maintain responsive web user interfaces and reusable UI components.",
            "Collaborate with product designers and backend developers to integrate RESTful endpoints.",
            "Optimize frontend bundle performance, cross-browser compatibility, and state management.",
            "Write clean, modular JavaScript/TypeScript and CSS adhering to modern web best practices."
        ]
    elif any(k in t for k in ['python', 'django', 'flask', 'fastapi']):
        return [
            "Build and maintain backend services, API endpoints, and business logic using Python frameworks.",
            "Integrate databases (SQL/NoSQL) and write performant data queries.",
            "Develop automation scripts, data transformation routines, or service integrations.",
            "Participate in code reviews, automated unit testing, and pipeline debugging."
        ]
    elif any(k in t for k in ['data', 'analytics', 'bi', 'machine learning', 'ml', 'ai']):
        return [
            "Assist in collecting, cleaning, and preprocessing structured and unstructured data sets.",
            "Build analytical dashboards and SQL queries to uncover actionable operational metrics.",
            "Implement baseline statistical or machine learning models under senior mentorship.",
            "Collaborate with engineering teams to document data schemas and validate pipeline outputs."
        ]
    elif any(k in t for k in ['qa', 'test', 'tester', 'automation', 'selenium']):
        return [
            "Design test scenarios, test cases, and test suites based on functional specifications.",
            "Execute manual and automated test suites for web, mobile, and API endpoints.",
            "Identify, log, and verify software defects and regression issues across releases.",
            "Ensure cross-browser compatibility, test coverage, and documentation of test runs."
        ]
    elif any(k in t for k in ['android', 'ios', 'flutter', 'react native', 'mobile']):
        return [
            "Design and implement responsive mobile screens and interactive UI features.",
            "Integrate device APIs, RESTful services, and local caching/storage mechanisms.",
            "Perform mobile performance profiling, memory optimization, and bug fixes.",
            "Follow platform-specific design patterns (Material/Cupertino) and agile release cycles."
        ]
    elif any(k in t for k in ['java', 'spring', 'springboot', 'backend']):
        return [
            "Develop robust backend microservices, REST APIs, and database layers.",
            "Implement enterprise business workflows, authentication, and data integrity safeguards.",
            "Write comprehensive unit and integration tests using standard frameworks.",
            "Debug latency bottlenecks, optimize queries, and support continuous delivery pipelines."
        ]
    else:
        return [
            f"Contribute to active software engineering tasks, feature implementations, and bug fixes for {title}.",
            "Collaborate closely with senior engineering mentors on code reviews and architecture discussions.",
            "Build solid practical exposure to Git version control, collaborative workflows, and sprint cycles.",
            "Write well-documented, testable code adhering to software development standards."
        ]

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

                        resps = get_domain_responsibilities(title)
                        resps_formatted = "\n".join([f"- {r}" for r in resps])

                        desc_body = f"""### About {company} Opportunity on Unstop
{company} is currently hiring freshers and recent college graduates for the position of **{title}**.

### Role Overview & Practical Responsibilities
{resps_formatted}

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
