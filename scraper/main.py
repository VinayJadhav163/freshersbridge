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
from scrapers.naukri import fetch_naukri_jobs
from scrapers.foundit import fetch_foundit_jobs
from scrapers.instahyre import fetch_instahyre_jobs
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

# Search terms targeted for Indian Freshers, Entry-Level & Remote roles
SEARCH_TERMS = [
    "Software Engineer Intern",
    "Associate Software Engineer",
    "Graduate Engineer Trainee",
    "Frontend Developer Intern",
    "Full Stack Developer Intern",
    "React Developer",
    "Java Developer Fresher",
    "Python Developer Fresher",
    "Data Analyst Intern",
    "QA Automation Engineer Intern",
    "Junior Backend Developer"
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
    - Internships, Apprenticeships, Trainees (GET/MT)
    
    Strictly rejects:
    - Any mention of 2+ / 3+ / 4+ / 5+ / 2-4 / 3-5 / 5-8 years of experience
    - Senior / Lead / Principal / Staff / Architect / Manager / Director / AVP / Consultant
    - Level II / 2 / SDE-2 / SDE II / L2 / Intermediate
    """
    raw_title = str(job.get('title') or '').strip()
    raw_desc = str(job.get('description') or '').strip()
    raw_elig = str(job.get('eligibility') or '').strip()
    
    title_lower = raw_title.lower()
    full_text = f"{raw_title}\n{raw_elig}\n{raw_desc}"
    
    # 1. STRICT TITLE REJECTIONS (Immediate Disqualification)
    senior_title_patterns = [
        r'\b(senior|sr\.?|principal|staff|lead|architect|manager|director|vp|vice president|avp|head of)\b',
        r'\b(consultant|specialist|expert)\b',
        r'\b(sde[- ]?(?:2|3|ii|iii)|software engineer[- ]?(?:2|3|ii|iii)|engineer[- ]?(?:2|3|ii|iii)|developer[- ]?(?:2|3|ii|iii))\b',
        r'\b(level[- ]?[23]|l[23])\b',
        r'\b(intermediate|mid[- ]?level|experienced)\b'
    ]
    for p in senior_title_patterns:
        if re.search(p, title_lower, re.I):
            return False

    # 2. STRICT EXPERIENCE REJECTIONS (Unicode dashes, plus signs, word variations)
    high_exp_regexes = [
        r'\b(?:[2-9]|1[0-9])\s*(?:\+|\bplus\b)\s*(?:years?|yrs?)\b',
        r'\b(?:[2-9]|1[0-9])\s*(?:[\-\–\—\~/]|\bto\b)\s*(?:[2-9]|1[0-9])\s*(?:years?|yrs?)\b',
        r'\b(?:minimum|min|at least|require[s]?|mandat(?:e|ory)|with|having)\s*(?:of\s+)?([2-9]|1[0-9])\s*(?:years?|yrs?)\b',
        r'\b(?:[2-9]|1[0-9])\s*(?:years?|yrs?)\s+(?:of\s+)?(?:hands-on\s+|relevant\s+|professional\s+|work\s+|industry\s+|software\s+|coding\s+|development\s+|technical\s+)?(?:experience|exp)\b',
        r'\bexperience\s*(?:required|needed|must have|of)\s*:\s*([2-9]|1[0-9])\s*(?:[\+\-\–\—\~/]|\bto\b)\s*[0-9]*\s*(?:years?|yrs?)\b',
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

    # 3. Explicit non-fresher statements
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
        jobspy_jobs = fetch_jobspy_jobs(SEARCH_TERMS[:4], LOCATIONS[:4], results_wanted=12)
        logger.info(f"Collected {len(jobspy_jobs)} jobs from JobSpy providers (LinkedIn, Indeed).")
        all_raw_jobs.extend(jobspy_jobs)
    except Exception as e:
        logger.error(f"JobSpy execution failed: {e}")

    # 2. Fetch Instahyre
    try:
        instahyre_jobs = fetch_instahyre_jobs(SEARCH_TERMS[:4], LOCATIONS[:3], results_wanted=12)
        logger.info(f"Collected {len(instahyre_jobs)} jobs from Instahyre.")
        all_raw_jobs.extend(instahyre_jobs)
    except Exception as e:
        logger.error(f"Instahyre execution failed: {e}")

    # 3. Fetch Shine
    try:
        shine_jobs = fetch_shine_jobs(SEARCH_TERMS[:3], LOCATIONS[:3], results_wanted=10)
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



    # Step 6: Direct API Upload to FreshersBridge (if configured)
    api_url = os.getenv("FRESHERSBRIDGE_API_URL")
    admin_key = os.getenv("ADMIN_ACCESS_KEY")
    
    if api_url and admin_key:
        logger.info(f"Posting {len(clean_final_jobs)} jobs directly to FreshersBridge API endpoint: {api_url}")
        try:
            resp = requests.post(
                api_url,
                json={'jobs': clean_final_jobs, 'admin_key': admin_key},
                headers={'Content-Type': 'application/json', 'x-admin-key': admin_key},
                timeout=60
            )
            if resp.status_code == 200:
                logger.info(f"Direct API Sync succeeded! Response: {resp.json().get('message', 'OK')}")
            else:
                logger.error(f"Direct API Sync failed with status code {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"Direct API Sync request error: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="FreshersBridge Master Job Scraper & AI Ingestion Pipeline")
    parser.add_argument("--ai", action="store_true", default=True, help="Enable Google Gemini 1.5 Flash AI verification & enrichment")
    parser.add_argument("--no-ai", action="store_false", dest="ai", help="Disable AI and use rule-based normalizer")
    args = parser.parse_args()

    run_pipeline(use_ai=args.ai)
