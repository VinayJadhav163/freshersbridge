import os
import re
import json
import time
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

def is_strictly_non_fresher(job):
    title = str(job.get('title') or '').strip()
    desc = str(job.get('description') or '').strip()
    elig = str(job.get('eligibility') or '').strip()
    full_text = f"{title}\n{elig}\n{desc}"
    
    # 1. Title Rejections
    title_lower = title.lower()
    senior_title_patterns = [
        r'\b(senior|sr\.?|principal|staff|lead|leader|architect|manager|director|vp|vice president|avp|head of|head)\b',
        r'\b(consultant|specialist|expert|strategist)\b',
        r'\b(sde|sdet|qa|swe|engineer|developer|tester|mts)[- ]*(?:2|3|4|5|ii|iii|iv|v)\b',
        r'\b(ii|iii|iv|v)\b',
        r'\b(level[- ]?[2345]|l[2345]|ic[2345]|e[2345]|grade[- ]?[2345])\b',
        r'\b(intermediate|mid[- ]?level|experienced|sse)\b',
        r'\b(marketer|marketing|publisher|recruiter|talent acquisition|scrum master|people manager|business development|bde|bda)\b'
    ]
    for p in senior_title_patterns:
        if re.search(p, title_lower, re.I):
            return True, f"Title rejection: '{p}'"
            
    # 2. Non-tech & Industrial roles
    non_tech_patterns = [
        r'\b(substation|switchgear|busbar\s+protection|transformer\s+(?:differential|protection|main)|siprotec|reyrolle|omicron\s+test|iec\s*61850)\b',
        r'\b(hvac|piping\s+design|civil\s+site|construction\s+site|structural\s+drafting|autocad\s+civil|mechanical\s+maintenance|cnc\s+machine|factory\s+loading|foundry|boiler)\b',
        r'\b(nurse|bpo|telesales|telecaller|tele-sales|data\s+entry\s+operator|back\s+office\s+executive|medical\s+billing)\b'
    ]
    for p in non_tech_patterns:
        if re.search(p, full_text, re.I):
            return True, f"Non-tech / industrial role: '{p}'"

    # 3. High Experience Regexes (>= 3 years or ranges like 2-5, 3-5, 5-8, 7+ years)
    high_exp_regexes = [
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
    
    for regex in high_exp_regexes:
        m = re.search(regex, full_text, re.I)
        if m:
            matched_str = m.group(0).lower()
            # Do not trigger on '0-2 years' or '0 to 2 years' or '1-2 years' or '0-1 yr'
            if re.search(r'\b0\s*[\-\–\—to]\s*[12]\s*(?:years?|yrs?)', matched_str) or re.search(r'\b1\s*[\-\–\—to]\s*2\s*(?:years?|yrs?)', matched_str):
                continue
            return True, f"High exp requirement: '{m.group(0)}'"

    return False, ""

def main():
    print("Fetching all jobs from Supabase...")
    all_jobs = []
    page = 0
    page_size = 1000
    
    while True:
        offset = page * page_size
        url = f"{SUPABASE_URL}/rest/v1/jobs?select=id,title,company,eligibility,description,created_at&order=created_at.desc&limit={page_size}&offset={offset}"
        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            print(f"Error fetching page {page}: {res.status_code} - {res.text}")
            break
        data = res.json()
        if not data:
            break
        all_jobs.extend(data)
        if len(data) < page_size:
            break
        page += 1

    print(f"Total jobs in database: {len(all_jobs)}")

    to_delete = []
    for job in all_jobs:
        is_invalid, reason = is_strictly_non_fresher(job)
        if is_invalid:
            to_delete.append((job['id'], job['title'], job['company'], reason))

    print(f"\nFound {len(to_delete)} non-fresher / senior jobs to delete.")
    
    # Delete in batches via Supabase REST API
    deleted_count = 0
    for chunk_start in range(0, len(to_delete), 50):
        chunk = to_delete[chunk_start:chunk_start + 50]
        ids = [item[0] for item in chunk]
        
        # In Supabase PostgREST, delete by id=in.(id1,id2,...)
        ids_param = f"in.({','.join(ids)})"
        del_url = f"{SUPABASE_URL}/rest/v1/jobs?id={ids_param}"
        del_res = requests.delete(del_url, headers=headers)
        
        if del_res.status_code in [200, 204]:
            deleted_count += len(chunk)
            print(f"Deleted batch {chunk_start // 50 + 1}: {len(chunk)} jobs (Total: {deleted_count}/{len(to_delete)})")
        else:
            print(f"Failed deleting batch: {del_res.status_code} - {del_res.text}")
            # Try individually as fallback
            for item in chunk:
                ind_url = f"{SUPABASE_URL}/rest/v1/jobs?id=eq.{item[0]}"
                ind_res = requests.delete(ind_url, headers=headers)
                if ind_res.status_code in [200, 204]:
                    deleted_count += 1
                    
        time.sleep(0.3)

    print(f"\nSuccessfully cleaned up {deleted_count} non-fresher jobs from Supabase!")

if __name__ == '__main__':
    main()
