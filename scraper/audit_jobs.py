import os
import re
import requests
from dotenv import load_dotenv

# Load env variables
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_dir, ".env.local"))
load_dotenv(os.path.join(root_dir, ".env"))

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Supabase credentials missing!")
    exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Fetch all jobs
url = f"{SUPABASE_URL}/rest/v1/jobs?select=id,title,company,eligibility,description,created_at&order=created_at.desc&limit=1000"
response = requests.get(url, headers=headers)
if response.status_code != 200:
    print(f"Error fetching jobs: {response.status_code} - {response.text}")
    exit(1)

jobs = response.json()
print(f"Total jobs fetched: {len(jobs)}")

# Search for non-fresher patterns
high_exp_patterns = [
    # "X or more years", "X+ years", "X plus years", "X yrs" for X >= 3
    r'\b(?:[3-9]|1[0-9])\s*(?:or more|\+)?\s*(?:years?|yrs?|yr)\b',
    # Spelled out: "three or more years", "five years of experience", "seven years"
    r'\b(three|four|five|six|seven|eight|nine|ten|twelve|fifteen)\s*(?:or more|\+)?\s*(?:years?|yrs?|yr)\b',
    # Explicit ranges like 2-4, 3-5, 4-6, 5-8, 6-9, 7-10, 8-12 years
    r'\b(?:[2-9]|1[0-9])\s*(?:[\-\–\—\~/]|\bto\b)\s*(?:[3-9]|1[0-9])\s*(?:years?|yrs?|yr)\b',
    # "minimum 3 years", "at least 3 years", "requires 4 years", "having 5 yrs"
    r'\b(?:minimum|min|at least|require[s]?|mandat(?:e|ory)|with|having)\s*(?:of\s+)?([3-9]|1[0-9])\s*(?:years?|yrs?|yr)\b',
    # "3+ years of experience / development"
    r'\b([3-9]|1[0-9])\s*(?:or more\s+)?(?:years?|yrs?|yr)\s+(?:of\s+)?(?:hands-on\s+|relevant\s+|professional\s+|work\s+|industry\s+|software\s+|coding\s+|development\s+|technical\s+|application\s+)?(?:experience|exp|development|coding)\b',
    r'\bexperience\s*(?:required|needed|must have|of)?\s*[:\-]?\s*([3-9]|1[0-9])\s*(?:[\+\-\–\—\~/]|\bto\b)\s*[0-9]*\s*(?:years?|yrs?)\b',
    # "3+ years post-qualification experience"
    r'\b([3-9]|1[0-9])\s*(?:years?|yrs?)\s+post[- ](?:qualification|graduation)\s+experience\b',
    # Explicit "not for freshers" / "freshers need not apply"
    r'\b(freshers?\s+need\s+not\s+apply|not\s+(?:suitable\s+)?for\s+freshers?|no\s+freshers?)\b'
]

def check_non_fresher(job):
    title = str(job.get('title') or '').strip()
    desc = str(job.get('description') or '').strip()
    elig = str(job.get('eligibility') or '').strip()
    
    # 1. Title Checks
    senior_titles = [
        r'\b(senior|sr\.?|principal|staff|lead|leader|architect|manager|director|vp|vice president|avp|head of)\b',
        r'\b(consultant|specialist|expert|strategist)\b',
        r'\b(sde|sdet|qa|swe|engineer|developer|tester|mts)[- ]*(?:2|3|4|5|ii|iii|iv|v)\b',
        r'\b(ii|iii|iv|v)\b',
        r'\b(level[- ]?[2345]|l[2345]|ic[2345]|e[2345]|grade[- ]?[2345])\b',
        r'\b(intermediate|mid[- ]?level|experienced|sse)\b',
        r'\b(marketer|marketing|publisher|recruiter|talent acquisition|scrum master|people manager|business development|bde|bda)\b'
    ]
    for p in senior_titles:
        if re.search(p, title, re.I):
            return True, f"Title matched senior pattern: {p}"

    full_text = f"{title}\n{elig}\n{desc}"

    # 2. High Experience Regexes (3+ years, 4+ years, 5+ years, 7+ years, 2-4, 3-5, 5-8 yrs, etc.)
    for p in high_exp_patterns:
        m = re.search(p, full_text, re.I)
        if m:
            matched = m.group(0).lower()
            if re.search(r'\b0\s*[\-\–\—to]\s*[12]\s*(?:years?|yrs?)', matched) or re.search(r'\b1\s*[\-\–\—to]\s*2\s*(?:years?|yrs?)', matched):
                continue
            return True, f"Matched high exp pattern: {p} -> '{m.group(0)}'"
            
    return False, ""

non_fresher_jobs = []
for j in jobs:
    is_non_fresher, reason = check_non_fresher(j)
    if is_non_fresher:
        non_fresher_jobs.append((j, reason))

print(f"\nFound {len(non_fresher_jobs)} non-fresher jobs out of {len(jobs)} total jobs:")
for idx, (j, reason) in enumerate(non_fresher_jobs, 1):
    safe_title = j['title'].encode('ascii', errors='replace').decode('ascii')
    safe_company = j['company'].encode('ascii', errors='replace').decode('ascii')
    print(f"\n[{idx}] ID: {j['id']} | Title: {safe_title} | Company: {safe_company}")
    print(f"    Reason: {reason}")

