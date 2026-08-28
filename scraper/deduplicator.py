"""
FreshersBridge Job Deduplicator
Computes hashes and canonical URLs to remove duplicate listings across 15+ portals.
"""
import hashlib
import re
from typing import List, Dict, Any

def clean_url(url: str) -> str:
    """Removes tracking query parameters from job URLs."""
    if not url:
        return ""
    # Strip utm_*, ref, tracking parameters
    cleaned = re.sub(r'([?&])(utm_[^&]+|ref=[^&]+|tracking[^&]+|trk=[^&]+)', '', url)
    cleaned = cleaned.rstrip('?&')
    return cleaned

def generate_job_fingerprint(job: Dict[str, Any]) -> str:
    """Generates unique SHA256 hash based on company, title, and location."""
    company = re.sub(r'[^a-z0-9]', '', (job.get('company') or '').lower())
    title = re.sub(r'[^a-z0-9]', '', (job.get('title') or '').lower())
    location = re.sub(r'[^a-z0-9]', '', (job.get('location') or '').lower())
    
    # Strip common suffixes like 'pvt ltd', 'inc', 'llc'
    company = re.sub(r'(pvtltd|ltd|inc|llc|technologies|solutions)', '', company)
    
    raw = f"{company}:{title}:{location}"
    return hashlib.sha256(raw.encode('utf-8')).hexdigest()

def deduplicate_jobs(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicates list of job dicts using fingerprint hashes and clean URLs."""
    seen_hashes = set()
    seen_urls = set()
    unique_jobs = []

    for job in jobs:
        url = clean_url(job.get('apply_url') or '')
        if url:
            job['apply_url'] = url

        fingerprint = generate_job_fingerprint(job)
        
        if fingerprint in seen_hashes:
            continue
        if url and url in seen_urls:
            continue

        seen_hashes.add(fingerprint)
        if url:
            seen_urls.add(url)
            
        unique_jobs.append(job)

    return unique_jobs
