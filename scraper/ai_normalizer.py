"""
FreshersBridge AI-Powered Batch Job Normalizer & Verifier
Uses Google Gemini Flash API with Batch Evaluation (5-6 jobs per request).
Includes automatic graceful fallback to the rule engine if quota is reached.
"""
import os
import re
import json
import time
import logging
import requests
from typing import Dict, List, Any, Optional, Tuple
from dotenv import load_dotenv

# Load env variables
load_dotenv()
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(root_dir, ".env.local"))
load_dotenv(os.path.join(root_dir, ".env"))

logger = logging.getLogger("FreshersBridgeAINormalizer")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest"]

SYSTEM_PROMPT = """You are an expert technical recruiter and job data extraction agent for FreshersBridge, an Indian career platform exclusively for Freshers (0-1 years of experience, 2024/2025/2026 batch graduates, and college interns).

Your task:
Analyze the array of Raw Job Details provided and return a JSON array containing the evaluated and structured object for each job.

EVALUATION RULES:
1. FRESHER VERIFICATION:
   - Is this job suitable for Freshers (0-1 years of experience, 0-2 years, final year students, college interns, or 2024/2025/2026 batches)?
   - If the job explicitly mandates 2+, 3+, 4+, 5+ years of experience, or is a Senior/Lead/Manager/Architect/Principal role, set "is_fresher_eligible": false and provide "rejection_reason".
   - If it's a Graduate Engineer Trainee (GET), Management Trainee, Trainee Engineer, Intern, Associate, or Entry-Level, set "is_fresher_eligible": true.

2. JOB TYPE CLASSIFICATION:
   - "internship" if it is a Student Internship, Summer Intern, Winter Intern, or Fellowship.
   - "full_time" for all permanent entry-level jobs, Trainee Engineers, Graduate Trainees, and Associate roles.

3. CATEGORY CLASSIFICATION:
   Must be one of these exact slugs:
   - "web-development" (Frontend, React, Next.js, Angular, Full Stack, UI/UX, Node.js)
   - "software-development" (Java, Python, C++, Backend, Mobile, Android/iOS, Embedded, Core Engineering)
   - "data-analytics" (Data Analyst, Business Analyst, BI, Machine Learning, AI, Data Science)
   - "devops-cloud" (DevOps, AWS, Azure, GCP, Docker, Kubernetes, Linux, SysAdmin)
   - "qa-testing" (QA, Software Testing, Manual Testing, Automation, Selenium)
   - "database-administration" (DBA, SQL Developer, Oracle, PostgreSQL, MongoDB)

4. SKILLS EXTRACTION:
   - Extract 4 to 8 authentic technical skills explicitly mentioned in the JD.
   - For Core Engineering / Electrical / Mechanical roles, extract actual domain skills (e.g. Power Systems, ETAP, AutoCAD). Do NOT hallucinate software skills if not mentioned.

5. SALARY STANDARDIZATION:
   - Standardize into LPA (e.g. "₹4.0 - 6.5 LPA", "₹3.5 LPA") or Monthly Stipend (e.g. "₹20,000 - ₹30,000 / month").
   - If not mentioned or unclear, use "Not Disclosed / As per Industry Standards".

6. CLEAN FORMATTED DESCRIPTION:
   - Format into clean, high-value sections:
     Key Responsibilities:
     • Bullet point 1
     • Bullet point 2
     
     Requirements & Qualifications:
     • Education & required experience
     • Technical skills
   - Strip out recruiter phone numbers, tracking tags, and legal disclaimer fluff.

Output Format: A JSON array of objects matching this exact structure:
[
  {
    "job_id": int,
    "is_fresher_eligible": true | false,
    "rejection_reason": string,
    "standard_title": string,
    "job_type": "full_time" | "internship",
    "category_slug": "web-development" | "software-development" | "data-analytics" | "devops-cloud" | "qa-testing" | "database-administration",
    "location": string,
    "eligibility": string,
    "skills": ["Skill1", "Skill2", "Skill3"],
    "salary": string,
    "formatted_description": string
  }
]
"""

# Tracks if Gemini quota is exhausted to avoid repeated failing network calls
IS_QUOTA_EXHAUSTED = False

def call_gemini_api(payload_text: str, api_key: str) -> Tuple[Optional[List[Dict[str, Any]]], bool]:
    """
    Calls Gemini Flash using Structured JSON generation.
    Returns: (parsed_results, is_quota_exhausted)
    """
    global IS_QUOTA_EXHAUSTED
    if IS_QUOTA_EXHAUSTED:
        return None, True

    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"{SYSTEM_PROMPT}\n\nRAW JOBS BATCH:\n{payload_text}"}]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json",
            "temperature": 0.2,
            "maxOutputTokens": 4096
        }
    }

    for model_name in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            response = requests.post(url, headers=headers, json=body, timeout=25)
            
            if response.status_code == 200:
                result_json = response.json()
                text_content = result_json['candidates'][0]['content']['parts'][0]['text']
                parsed = json.loads(text_content)
                if isinstance(parsed, list):
                    return parsed, False
                elif isinstance(parsed, dict) and "jobs" in parsed:
                    return parsed["jobs"], False
                elif isinstance(parsed, dict):
                    return [parsed], False
                return None, False
                
            elif response.status_code == 429:
                err_text = response.text.lower()
                if "quota exceeded" in err_text or "resource_exhausted" in err_text:
                    logger.warning(f"⚠️ Gemini API Daily Free-Tier Limit reached on {model_name}.")
                    IS_QUOTA_EXHAUSTED = True
                    return None, True
                time.sleep(1)
            elif response.status_code == 503:
                continue
            else:
                logger.warning(f"Gemini API status {response.status_code} on {model_name}")
                
        except Exception as e:
            logger.warning(f"Gemini request exception on {model_name}: {e}")
            
    return None, False

def process_batch_with_ai(jobs_batch: List[Dict[str, Any]], api_key: Optional[str] = None) -> Tuple[List[Tuple[bool, Optional[Dict[str, Any]], str]], bool]:
    """
    Processes a batch of 5-6 jobs in a single API call.
    Returns: (results_list, is_quota_exhausted)
    """
    key_to_use = api_key or GEMINI_API_KEY
    if not key_to_use:
        return [(False, None, "No GEMINI_API_KEY found") for _ in jobs_batch], True

    formatted_batch = []
    for idx, job in enumerate(jobs_batch):
        title = str(job.get('title') or '').strip()
        company = str(job.get('company') or '').strip()
        location = str(job.get('location') or '').strip()
        description = str(job.get('description') or '').strip()[:1800]
        
        formatted_batch.append({
            "job_id": idx,
            "title": title,
            "company": company,
            "raw_location": location,
            "raw_description": description
        })

    batch_payload = json.dumps(formatted_batch, ensure_ascii=False)
    ai_results, quota_exhausted = call_gemini_api(batch_payload, key_to_use)

    if quota_exhausted or not ai_results:
        return [(False, None, "AI quota exhausted or unavailable") for _ in jobs_batch], quota_exhausted

    results_map = {}
    for item in ai_results:
        j_id = item.get("job_id")
        if j_id is not None:
            results_map[j_id] = item

    output = []
    for idx, job in enumerate(jobs_batch):
        ai_res = results_map.get(idx)
        if not ai_res:
            output.append((False, None, "AI processing failed"))
            continue

        if not ai_res.get('is_fresher_eligible', False):
            reason = ai_res.get('rejection_reason', 'Not suitable for freshers / senior role')
            output.append((False, None, f"Rejected by AI: {reason}"))
            continue

        skills_list = ai_res.get('skills') or []
        if isinstance(skills_list, list):
            skills_str = ", ".join([s.strip() for s in skills_list if s.strip()])
        else:
            skills_str = str(skills_list)

        apply_url = str(job.get('apply_url') or job.get('job_url') or '').strip()
        source_name = str(job.get('source_name') or 'Direct Portal').strip()

        normalized = {
            'title': ai_res.get('standard_title') or job.get('title'),
            'company': job.get('company'),
            'location': ai_res.get('location') or job.get('location') or 'Bangalore, Karnataka, India',
            'eligibility': ai_res.get('eligibility') or 'B.E / B.Tech / BCA / MCA / Any Tech Graduate',
            'skills': skills_str,
            'description': ai_res.get('formatted_description') or job.get('description'),
            'apply_url': apply_url,
            'salary': ai_res.get('salary') or 'Not Disclosed / As per Industry Standards',
            'category_slug': ai_res.get('category_slug') or 'software-development',
            'job_type': ai_res.get('job_type') or 'full_time',
            'source_name': source_name,
            'source_url': apply_url,
            'featured_job': 'false',
            'application_deadline': ''
        }

        output.append((True, normalized, "Success"))

    return output, False
