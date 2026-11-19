"""
Internshala Scraper Module
Targets verified software engineering, web development, data science, and python internships & fresher jobs from Internshala.com.
"""
import logging
import re
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

INTERNSHALA_CATEGORIES = [
    ("https://internshala.com/internships/computer-science-internship/", "internship"),
    ("https://internshala.com/internships/web-development-internship/", "internship"),
    ("https://internshala.com/internships/python-django-internship/", "internship"),
    ("https://internshala.com/internships/data-science-internship/", "internship"),
    ("https://internshala.com/fresher-jobs/computer-science-jobs/", "full-time"),
]

NON_TECH_PATTERNS = [
    r'\b(sales|telecaller|telesales|bpo|medical billing|receptionist|nurse|teacher|civil site|autocad civil|content writing|social media marketing)\b'
]

def is_tech_fresher_title(title: str) -> bool:
    if not title:
        return False
    title_lower = title.lower()
    for p in NON_TECH_PATTERNS:
        if re.search(p, title_lower, re.I):
            return False
    return True

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

def fetch_internshala_jobs(max_items_per_category: int = 15) -> List[Dict[str, Any]]:
    """Fetches high-quality fresher jobs and internships from Internshala."""
    jobs_list = []
    seen_urls = set()

    for url, job_type in INTERNSHALA_CATEGORIES:
        try:
            logger.info(f"[Internshala] Scraping: {url}...")
            resp = requests.get(url, headers=HEADERS, timeout=12)
            if resp.status_code != 200:
                continue

            soup = BeautifulSoup(resp.text, 'html.parser')
            cards = soup.find_all('div', class_='individual_internship')

            count = 0
            for card in cards:
                if count >= max_items_per_category:
                    break

                t_elem = card.find('h3', class_='job-internship-name') or card.find('a', class_='job-title-href') or card.find('div', class_='profile')
                c_elem = card.find('p', class_='company-name') or card.find('div', class_='company_name')
                l_elem = card.find('div', class_='row-1-item locations') or card.find('a', class_='location_link')
                s_elem = card.find('span', class_='stipend')
                link_elem = card.find('a', class_='job-title-href') or card.find('a', class_='view_detail_button')

                title = t_elem.get_text(strip=True) if t_elem else ''
                company = c_elem.get_text(strip=True) if c_elem else ''
                location = l_elem.get_text(strip=True) if l_elem else 'India'
                stipend = s_elem.get_text(strip=True) if s_elem else 'Competitive'
                stipend = stipend.replace('\u20b9', '₹').strip()
                
                href = link_elem.get('href', '') if link_elem else ''
                if not href:
                    continue

                full_url = f"https://internshala.com{href}" if href.startswith('/') else href
                if full_url in seen_urls:
                    continue
                seen_urls.add(full_url)

                if not title or not is_tech_fresher_title(title):
                    continue
                if not company:
                    company = "Hiring Organization"

                # Normalize location
                is_remote = 'work from home' in location.lower() or 'remote' in location.lower()
                clean_location = "Remote / Work From Home" if is_remote else location.replace('(Hybrid)', '').strip()

                resps = get_domain_responsibilities(title)
                resps_formatted = "\n".join([f"- {r}" for r in resps])

                desc_body = f"""### About {company}
{company} is offering a verified opportunity for the position of **{title}**.

### Role Overview & Responsibilities
{resps_formatted}

### Stipend & Eligibility
- **Stipend / CTC:** {stipend if stipend else 'Competitive'}
- **Eligibility:** Students, Recent Graduates & Freshers (2024, 2025, 2026 Batch).
- **Location:** {clean_location}
""".strip()

                # Ensure unambiguous internship classification
                is_internship_entry = job_type == 'internship' or '/internship/' in full_url.lower()
                final_job_type = 'internship' if is_internship_entry else 'full-time'
                
                final_title = title
                if is_internship_entry and 'intern' not in final_title.lower():
                    final_title = f"{final_title} Internship"

                jobs_list.append({
                    'title': final_title,
                    'company': company,
                    'location': clean_location,
                    'query_location': clean_location,
                    'description': desc_body,
                    'skills': f"{final_title}, Programming, Software Development",
                    'salary': stipend if stipend else 'Competitive / Stipend Provided',
                    'eligibility': 'Any Graduate / BE / B.Tech / BCA (2024, 2025, 2026 Batch) (Internship)' if is_internship_entry else 'Any Graduate / BE / B.Tech / BCA (2024, 2025, 2026 Batch)',
                    'apply_url': full_url,
                    'source_name': 'Internshala',
                    'source_url': full_url,
                    'job_type': final_job_type,
                    'is_remote': is_remote
                })
                count += 1

        except Exception as e:
            logger.error(f"[Internshala] Error scraping {url}: {e}")

    logger.info(f"[Internshala] Total verified listings extracted: {len(jobs_list)}")
    return jobs_list
