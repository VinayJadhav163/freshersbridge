"""
FreshersBridge Master Multi-Source Job Scraper & Ingestion Orchestrator
Aggregates jobs across multiple portals, normalizes data, deduplicates,
outputs standardized CSV, and optionally posts directly to FreshersBridge API.
"""
import os
import sys
import re
import logging
import datetime
import time
import pandas as pd
import requests
from dotenv import load_dotenv

# Add scraper dir to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from normalizer import normalize_job_dict
from deduplicator import deduplicate_jobs
from ai_normalizer import process_batch_with_ai, GEMINI_API_KEY
from scrapers.jobspy_wrapper import fetch_jobspy_jobs
from scrapers.unstop import fetch_unstop_jobs
from scrapers.internshala import fetch_internshala_jobs
from scrapers.naukri import fetch_naukri_jobs
from scrapers.foundit import fetch_foundit_jobs
from scrapers.hirist import fetch_hirist_jobs
from scrapers.wellfound import fetch_wellfound_jobs
from scrapers.shine import fetch_shine_jobs
from scrapers.additional_sources import fetch_cutshort_jobs, fetch_hiring_cafe_jobs

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("FreshersBridgeMasterScraper")

load_dotenv()
# Also search project root for .env.local and .env
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_dir, ".env.local"))
load_dotenv(os.path.join(root_dir, ".env"))

# Master Entry-Level Job Roles Taxonomy (Strictly 0-1 / 0-2 yrs & Trainee/Intern Roles)
ENTRY_LEVEL_ROLES_TAXONOMY = {
    'data-analytics': [
        "Data Analyst", "Junior Data Analyst", "Business Intelligence Analyst", "Business Analyst",
        "Data Visualization Analyst", "Tableau Developer", "Power BI Developer", "Reporting Analyst",
        "MIS Analyst", "Data Quality Analyst", "Junior Data Scientist", "Data Scientist Trainee",
        "Data Science Intern", "Machine Learning Engineer", "Junior Machine Learning Engineer",
        "Machine Learning Intern", "AI Engineer", "Junior AI Engineer", "AI Prompt Engineer",
        "AI/ML Analyst", "Analytics Associate", "Data Analytics Associate", "Research Data Analyst"
    ],
    'database-administration': [
        "Junior Database Administrator", "Database Administrator Trainee", "Database Operations Assistant",
        "Database Support Associate", "Database Analyst", "SQL Developer", "Junior SQL Developer",
        "SQL Support Analyst", "Database Developer", "Junior Database Developer", "Database Engineer",
        "MySQL Developer", "PostgreSQL Developer", "Oracle Database Administrator", "Database Support Engineer",
        "Database Operations Analyst"
    ],
    'devops-cloud': [
        "Cloud Support Associate", "Cloud Support Engineer", "Cloud Operations Technician",
        "Cloud Operations Associate", "Junior DevOps Engineer", "DevOps Engineer Trainee",
        "DevOps Intern", "Cloud Engineer", "Junior Cloud Engineer", "Cloud Engineer Trainee",
        "Cloud Administrator", "Junior Cloud Administrator", "Cloud Operations Engineer",
        "Cloud Support Analyst", "Junior Systems Administrator", "Linux System Administrator",
        "Infrastructure Support Engineer", "Junior Site Reliability Engineer", "Platform Support Engineer",
        "Cloud Security Analyst"
    ],
    'qa-testing': [
        "QA Manual Tester", "Manual Test Engineer", "Junior Test Engineer", "QA Engineer",
        "QA Engineer Trainee", "Software Tester", "Quality Analyst", "QA Analyst", "Test Analyst",
        "Automation QA Engineer", "Automation Test Engineer", "Junior Automation Test Engineer",
        "Selenium Tester", "Selenium Automation Tester", "Playwright Tester", "Playwright Automation Tester",
        "QA Automation Intern", "Software Testing Intern", "Mobile App Tester", "Mobile Application Tester",
        "Game Tester", "API Tester", "API Testing Engineer", "Performance Testing Engineer",
        "Test Automation Engineer"
    ],
    'software-development': [
        "Junior Software Engineer", "Software Engineer Trainee", "Software Developer",
        "Junior Software Developer", "Software Development Intern", "Associate Software Engineer",
        "Graduate Software Engineer Trainee", "Application Developer", "Junior Application Developer",
        "Backend Developer", "Junior Backend Developer", "Node.js Developer", "Junior Node.js Developer",
        "Python Developer", "Junior Python Developer", "Java Developer", "Junior Java Developer",
        "C++ Developer", "Junior C++ Developer", "C# Developer", "Junior C# Developer",
        ".NET Developer", "Junior .NET Developer", "ASP.NET Developer", "Junior ASP.NET Developer",
        "API Developer", "Junior API Developer", "Mobile App Developer", "Android Developer",
        "Junior Android Developer", "iOS Developer", "Junior iOS Developer", "Flutter Developer",
        "Junior Flutter Developer", "React Native Developer", "Junior React Native Developer",
        "Game Developer", "Junior Game Developer"
    ],
    'web-development': [
        "Frontend Developer", "Junior Frontend Developer", "Frontend Developer Trainee",
        "Web Developer", "Junior Web Developer", "Web Development Intern",
        "Full Stack Developer", "Junior Full Stack Developer", "Full Stack Developer Trainee",
        "MERN Stack Developer", "Junior MERN Stack Developer", "MEAN Stack Developer",
        "Junior MEAN Stack Developer", "React Developer", "Junior React Developer",
        "Angular Developer", "Junior Angular Developer", "Vue.js Developer", "Junior Vue.js Developer",
        "JavaScript Developer", "Junior JavaScript Developer", "HTML/CSS Developer",
        "PHP Developer", "Junior PHP Developer", "Laravel Developer", "Junior Laravel Developer",
        "WordPress Developer", "Junior WordPress Developer", "UI Developer", "Junior UI Developer",
        "Web Application Developer", "Junior Web Application Developer"
    ]
}

# High-yield search terms for portal scraping
SEARCH_TERMS = [
    "Junior Software Engineer",
    "Software Engineer Trainee",
    "Junior Frontend Developer",
    "Junior Full Stack Developer",
    "Junior Backend Developer",
    "Junior Python Developer",
    "Junior Java Developer",
    "Junior Data Analyst",
    "Junior Machine Learning Engineer",
    "Junior DevOps Engineer",
    "Cloud Support Associate",
    "Automation Test Engineer",
    "Junior Test Engineer",
    "Junior SQL Developer",
    "React Developer Fresher",
    "Software Development Intern"
]

# Targeted Indian Locations
LOCATIONS = [
    "Bangalore, India",
    "Hyderabad, India",
    "Pune, India",
    "Mumbai, India",
    "Gurugram, India",
    "Noida, India",
    "Chennai, India",
    "Remote"
]

def is_fresher_job(job: dict) -> bool:
    """
    Bulletproof multi-stage gatekeeper for FreshersBridge.
    Strictly accepts ONLY:
    - 0-1 years of experience
    - 0-2 years maximum (entry level)
    - 2024, 2025, 2026 Batch Graduates
    - Internships, Apprenticeships, Trainees (GET/MT in Tech)
    
    Strictly rejects:
    - Non-tech / Civil / Electrical Substation / Mechanical / Factory / Sales roles
    - Any mention of 2+ / 3+ / 4+ / 5+ / 2-4 / 3-5 / 4-6 / 5-8 years of experience
    - Senior / Lead / Principal / Staff / Architect / Manager / Director / AVP / Consultant
    - Level II / 2 / SDE-2 / SDE II / SDET II / SDET-2 / L2 / Intermediate / II / III / IV
    """
    raw_title = str(job.get('title') or '').strip()
    raw_desc = str(job.get('description') or '').strip()
    raw_elig = str(job.get('eligibility') or '').strip()
    raw_exp = str(job.get('experience') or job.get('years_of_experience') or job.get('exp') or job.get('min_exp') or job.get('experience_level') or '').strip()
    
    title_lower = raw_title.lower()
    full_text = f"{raw_title}\n{raw_elig}\n{raw_exp}\n{raw_desc}"
    
    # 1. STRICT TITLE REJECTIONS (Immediate Disqualification)
    senior_title_patterns = [
        r'\b(senior|sr\.?|principal|staff|lead|leader|architect|manager|director|vp|vice president|avp|head of|head|founding)\b',
        r'\b(consultant|specialist|expert|strategist)\b',
        # SDE, SDET, QA, Engineer, Developer Level 2, 3, 4, II, III, IV
        r'\b(sde|sdet|qa|swe|engineer|developer|tester|mts|member technical staff)[- ]*(?:2|3|4|5|ii|iii|iv|v)\b',
        # Standalone Roman Numerals in titles like "SDET II", "Software Engineer III", "QA II"
        r'\b(ii|iii|iv|v)\b',
        r'\b(level[- ]?[2345]|l[2345]|ic[2345]|e[2345]|grade[- ]?[2345])\b',
        r'\b(intermediate|mid[- ]?level|experienced|sse)\b',
        r'\b(marketer|marketing|publisher|recruiter|talent acquisition|scrum master|people manager|business development|bde|bda)\b'
    ]
    for p in senior_title_patterns:
        if re.search(p, title_lower, re.I):
            return False

    # 2. STRICT NON-TECH / HEAVY INDUSTRIAL / SALES / CIVIL / ELECTRICAL SUBSTATION REJECTIONS
    non_tech_patterns = [
        r'\b(substation|switchgear|busbar\s+protection|transformer\s+(?:differential|protection|main)|siprotec|reyrolle|omicron\s+test|iec\s*61850)\b',
        r'\b(hvac|piping\s+design|civil\s+site|construction\s+site|structural\s+drafting|autocad\s+civil|mechanical\s+maintenance|cnc\s+machine|factory\s+loading|foundry|boiler)\b',
        r'\b(sales[- ]acquisition|purchase\s+order\s+amendment|claim\s+management|vendor\s+sourcing|procurement\s+executive|programmatic\s+sales)\b',
        r'\b(nurse|bpo|telesales|telecaller|tele-sales|data\s+entry\s+operator|back\s+office\s+executive|medical\s+billing)\b'
    ]
    for p in non_tech_patterns:
        if re.search(p, full_text, re.I):
            return False

    # 3. STRICT EXPERIENCE REJECTIONS (Unicode dashes, plus signs, word variations)
    high_exp_regexes = [
        # Explicit ranges like 4-6, 3-5, 2-4, 4 to 6, 2-3 years / yrs
        r'\b(?:[2-9]|1[0-9])\s*(?:[\-\–\—\~/]|\bto\b)\s*(?:[2-9]|1[0-9])\s*(?:years?|yrs?|yr)\b',
        # 2+, 3+, 4+, 5+ years / yrs
        r'\b(?:[2-9]|1[0-9])\s*(?:\+|\bplus\b)\s*(?:years?|yrs?|yr)\b',
        # "2 years minimum", "2 yrs min", "3 years required"
        r'\b(?:[2-9]|1[0-9])\s*(?:years?|yrs?|yr)\s*(?:minimum|min|mandatory|required|desired|needed)',
        # "minimum 2 years", "at least 3 yrs", "min of 2 years"
        r'\b(?:minimum|min|at least|require[s]?|mandat(?:e|ory)|with|having)\s*(?:of\s+)?([2-9]|1[0-9])\s*(?:years?|yrs?|yr)\b',
        # "2 years of experience / development / hands-on"
        r'\b([2-9]|1[0-9])\s*(?:years?|yrs?|yr)\s+(?:of\s+)?(?:hands-on\s+|relevant\s+|professional\s+|work\s+|industry\s+|software\s+|coding\s+|development\s+|technical\s+|application\s+)?(?:experience|exp|development|coding)\b',
        r'\bexperience\s*(?:required|needed|must have|of)?\s*[:\-]?\s*([2-9]|1[0-9])\s*(?:[\+\-\–\—\~/]|\bto\b)\s*[0-9]*\s*(?:years?|yrs?)\b',
        r'\b([2-9]|1[0-9])\s*(?:years?|yrs?)\s+post[- ](?:qualification|graduation)\s+experience\b'
    ]
    
    for regex in high_exp_regexes:
        match = re.search(regex, full_text, re.I)
        if match:
            matched_str = match.group(0).lower()
            # Safety check: do not trigger on '0-2 years' or '0 - 1 years' or '0 to 2 years'
            if re.search(r'\b0\s*[\-\–\—to]\s*[12]\s*(?:years?|yrs?)', matched_str):
                continue
            return False

    # 4. Explicit non-fresher statements
    if re.search(r'\b(freshers?\s+need\s+not\s+apply|not\s+(?:suitable\s+)?for\s+freshers?|no\s+freshers?)\b', full_text, re.I):
        return False

    return True

def run_pipeline(use_ai: bool = False):
    logger.info("Starting FreshersBridge Multi-Source Job Scraper Pipeline...")
    if use_ai:
        if GEMINI_API_KEY:
            logger.info("🤖 Google Gemini 1.5 Flash AI Engine ENABLED for intelligent verification & extraction.")
        else:
            logger.warning("⚠️ --ai flag set, but GEMINI_API_KEY not found in environment. Falling back to rule-based normalizer.")
            use_ai = False

    all_raw_jobs = []

    # 1. Fetch JobSpy (LinkedIn, Indeed India, Glassdoor, Google Jobs)
    try:
        jobspy_jobs = fetch_jobspy_jobs(SEARCH_TERMS[:4], LOCATIONS[:4], results_wanted=15)
        logger.info(f"Collected {len(jobspy_jobs)} jobs from JobSpy providers (LinkedIn, Indeed).")
        all_raw_jobs.extend(jobspy_jobs)
    except Exception as e:
        logger.error(f"JobSpy execution failed: {e}")

    # 2. Fetch Unstop (India's Top Campus & Fresher Drive Portal)
    try:
        unstop_jobs = fetch_unstop_jobs(SEARCH_TERMS[:4], results_wanted=15)
        logger.info(f"Collected {len(unstop_jobs)} jobs from Unstop.")
        all_raw_jobs.extend(unstop_jobs)
    except Exception as e:
        logger.error(f"Unstop execution failed: {e}")

    # 3. Fetch Internshala (Top Verified Tech Internships & Fresher Jobs)
    try:
        internshala_jobs = fetch_internshala_jobs(max_items_per_category=15)
        logger.info(f"Collected {len(internshala_jobs)} jobs from Internshala.")
        all_raw_jobs.extend(internshala_jobs)
    except Exception as e:
        logger.error(f"Internshala execution failed: {e}")

    # 4. Fetch Shine
    try:
        shine_jobs = fetch_shine_jobs(SEARCH_TERMS[:3], LOCATIONS[:3], results_wanted=12)
        logger.info(f"Collected {len(shine_jobs)} jobs from Shine.")
        all_raw_jobs.extend(shine_jobs)
    except Exception as e:
        logger.error(f"Shine execution failed: {e}")

    # 4. Fetch additional providers (Foundit, Naukri, Cutshort, Hirist, Wellfound)
    for fetch_fn, name in [
        (lambda: fetch_naukri_jobs(SEARCH_TERMS[:2], LOCATIONS[:2], 5), "Naukri"),
        (lambda: fetch_foundit_jobs(SEARCH_TERMS[:2], LOCATIONS[:2], 5), "Foundit"),
        (lambda: fetch_cutshort_jobs(SEARCH_TERMS[:2], 5), "Cutshort"),
        (lambda: fetch_hirist_jobs(SEARCH_TERMS[:2], LOCATIONS[:2], 5), "Hirist"),
        (lambda: fetch_wellfound_jobs(SEARCH_TERMS[:2], LOCATIONS[:2], 5), "Wellfound"),
    ]:
        try:
            extra_jobs = fetch_fn()
            if extra_jobs:
                logger.info(f"Collected {len(extra_jobs)} jobs from {name}.")
                all_raw_jobs.extend(extra_jobs)
        except Exception as e:
            logger.debug(f"{name} scraper skipped/failed: {e}")

    logger.info(f"Total raw jobs collected across all sources: {len(all_raw_jobs)}")

    # Deduplicate raw jobs first
    unique_raw_jobs = deduplicate_jobs(all_raw_jobs)
    logger.info(f"Unique raw jobs to evaluate: {len(unique_raw_jobs)}")

    final_jobs = []

    if use_ai and GEMINI_API_KEY:
        logger.info("🤖 Processing listings with Gemini Flash AI in fast batches...")
        
        # Pre-filter obvious non-freshers to minimize API calls
        candidate_jobs = [job for job in unique_raw_jobs if job.get('title') and is_fresher_job(job)]
        logger.info(f"Candidate jobs after fast pre-filter: {len(candidate_jobs)} (from {len(unique_raw_jobs)} raw)")

        batch_size = 6
        accepted_count = 0
        rejected_count = 0
        quota_exceeded = False

        for i in range(0, len(candidate_jobs), batch_size):
            batch = candidate_jobs[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(candidate_jobs) + batch_size - 1) // batch_size
            logger.info(f"[Batch {batch_num}/{total_batches}] AI analyzing {len(batch)} jobs...")

            batch_results, is_exhausted = process_batch_with_ai(batch, GEMINI_API_KEY)

            if is_exhausted:
                logger.warning("⚠️ Gemini Free-Tier Daily Quota reached. Seamlessly normalizing remaining jobs with rule engine...")
                quota_exceeded = True
                # Normalize this batch and all remaining candidate jobs with rule engine
                remaining_candidates = candidate_jobs[i:]
                for rem_job in remaining_candidates:
                    if is_fresher_job(rem_job):
                        norm_job = normalize_job_dict(rem_job, query_loc=rem_job.get('query_location', ''))
                        final_jobs.append(norm_job)
                        accepted_count += 1
                break

            for is_valid, normalized_job, msg in batch_results:
                if is_valid and normalized_job and is_fresher_job(normalized_job):
                    final_jobs.append(normalized_job)
                    accepted_count += 1
                    logger.info(f"  ✓ ACCEPTED: {normalized_job['title']} [{normalized_job['category_slug']}] ({normalized_job['job_type']})")
                else:
                    rejected_count += 1
                    logger.info(f"  ✗ REJECTED: {msg}")

            # Small pause between batches to prevent rate spikes
            if i + batch_size < len(candidate_jobs):
                time.sleep(1.5)

        logger.info(f"AI Ingestion Summary: {accepted_count} Verified Freshers Accepted, {rejected_count} Discarded.")
    else:
        # Fallback to rule-based normalization
        fresher_jobs = [job for job in unique_raw_jobs if job.get('title') and is_fresher_job(job)]
        logger.info(f"Jobs retained after heuristic fresher filtering: {len(fresher_jobs)}")

        final_jobs = [
            normalize_job_dict(job, query_loc=job.get('query_location', ''))
            for job in fresher_jobs
            if is_fresher_job(job)
        ]

    # Final Strict Quality Gatekeeper Pass
    clean_final_jobs = [job for job in final_jobs if is_fresher_job(job)]
    logger.info(f"Total verified jobs ready for export: {len(clean_final_jobs)}")

    if not clean_final_jobs:
        logger.warning("No jobs were verified in this run. Exiting.")
        return

    # Export to clean CSV with today's date in filename (e.g. 2026-08-29_freshersbridge_jobs.csv)
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M")
    dated_filename = f"{today_str}_freshersbridge_jobs.csv"
    dated_filepath = os.path.join(output_dir, dated_filename)

    df = pd.DataFrame(clean_final_jobs)
    
    # Enforce standard column ordering
    columns_order = [
        'title', 'company', 'location', 'eligibility', 'skills', 
        'description', 'apply_url', 'salary', 'category_slug', 
        'source_name', 'source_url', 'featured_job', 'application_deadline'
    ]
    
    for col in columns_order:
        if col not in df.columns:
            df[col] = ''
            
    df = df[columns_order]
    try:
        df.to_csv(dated_filepath, index=False, encoding='utf-8-sig')
        logger.info(f"Successfully generated clean CSV artifact: {dated_filepath}")
    except PermissionError:
        alt_filename = f"{timestamp_str}_freshersbridge_jobs.csv"
        alt_filepath = os.path.join(output_dir, alt_filename)
        df.to_csv(alt_filepath, index=False, encoding='utf-8-sig')
        logger.warning(f"⚠️ '{dated_filename}' was open/locked by Excel. Saved clean CSV to: {alt_filepath}")



    # Step 6: Direct Automatic Publishing to FreshersBridge Database
    api_url = os.getenv("FRESHERSBRIDGE_API_URL") or "https://freshersbridge.in/api/admin/jobs/bulk"
    admin_key = os.getenv("ADMIN_ACCESS_KEY") or os.getenv("NEXT_PUBLIC_ADMIN_ACCESS_KEY")
    
    if admin_key:
        logger.info(f"🚀 Auto-Publishing {len(clean_final_jobs)} verified non-duplicate jobs directly to: {api_url}")
        try:
            resp = requests.post(
                api_url,
                json={'jobs': clean_final_jobs, 'admin_key': admin_key},
                headers={'Content-Type': 'application/json', 'x-admin-key': admin_key},
                timeout=60
            )
            if resp.status_code == 200:
                logger.info(f"🎉 Direct Auto-Publish succeeded! Response: {resp.json().get('message', 'OK')}")
            else:
                logger.error(f"❌ Direct Auto-Publish failed with status code {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"❌ Direct Auto-Publish request error: {e}")
    else:
        logger.warning("⚠️ ADMIN_ACCESS_KEY not found in environment. Direct DB auto-publish skipped. CSV saved locally.")

    # Step 7: Generate 8-Job Curated WhatsApp & Telegram Broadcast Messages & Automated Dispatch
    try:
        from broadcast_formatter import generate_broadcast_messages, save_broadcasts_file, dispatch_to_pabbly, dispatch_to_telegram, dispatch_to_evolution_whatsapp, get_slot_title
        wa_messages = generate_broadcast_messages(clean_final_jobs, platform='whatsapp', chunk_size=8)
        tg_messages = generate_broadcast_messages(clean_final_jobs, platform='telegram', chunk_size=8)
        
        if wa_messages:
            slot = get_slot_title()
            logger.info(f"📢 Generated {len(wa_messages)} structured 8-job broadcast blocks ({slot}).")
            save_broadcasts_file(wa_messages, filename="whatsapp_broadcasts.txt", output_dir=output_dir)
            save_broadcasts_file(tg_messages, filename="telegram_broadcasts.txt", output_dir=output_dir)
            
            # 1. Automated Telegram Channel Dispatch (Dispatches top curated batch to avoid spam)
            tg_token = os.getenv("TELEGRAM_BOT_TOKEN")
            tg_channel = os.getenv("TELEGRAM_CHANNEL_ID") or os.getenv("TELEGRAM_CHAT_ID")
            if tg_token and tg_channel:
                dispatch_to_telegram(tg_messages, bot_token=tg_token, channel_id=tg_channel, send_all=False)
                
            # 2. Automated WhatsApp Community Dispatch via Evolution-Go on AWS
            wa_group_id = os.getenv("WHATSAPP_GROUP_ID") or "120363410671332403@g.us"
            wa_api_url = os.getenv("EVOLUTION_API_URL") or "http://65.0.170.65:8080"
            wa_api_key = os.getenv("EVOLUTION_API_KEY") or "FreshersBridgeSecret2026"
            if wa_group_id and wa_api_url:
                dispatch_to_evolution_whatsapp(wa_messages, api_url=wa_api_url, api_key=wa_api_key, recipient=wa_group_id, send_all=False)

            # 3. Automated Pabbly Connect Webhook Dispatch (Optional fallback)
            pabbly_url = os.getenv("PABBLY_WEBHOOK_URL")
            if pabbly_url:
                dispatch_to_pabbly(whatsapp_messages=wa_messages, telegram_messages=tg_messages, webhook_url=pabbly_url, send_all=False)
    except Exception as e:
        logger.error(f"⚠️ Broadcast formatting / Dispatch error: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="FreshersBridge Master Job Scraper & AI Ingestion Pipeline")
    parser.add_argument("--ai", action="store_true", default=True, help="Enable Google Gemini 1.5 Flash AI verification & enrichment")
    parser.add_argument("--no-ai", action="store_false", dest="ai", help="Disable AI and use rule-based normalizer")
    args = parser.parse_args()

    run_pipeline(use_ai=args.ai)
