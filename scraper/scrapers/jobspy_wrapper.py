"""
JobSpy Scraper Wrapper
Covers: LinkedIn, Indeed India, Glassdoor, ZipRecruiter, Google Jobs
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

def fetch_jobspy_jobs(search_terms: List[str], locations: List[str], results_wanted: int = 15) -> List[Dict[str, Any]]:
    """Fetches jobs using python-jobspy across LinkedIn, Indeed India, Glassdoor, ZipRecruiter, Google."""
    jobs_list = []
    
    try:
        from jobspy import scrape_jobs
    except ImportError:
        logger.warning("python-jobspy package not installed yet. Skipping JobSpy provider.")
        return jobs_list

    site_names = ["linkedin", "indeed"]

    for term in search_terms:
        for loc in locations:
            city_loc = loc.split(',')[0].strip()
            try:
                logger.info(f"[JobSpy] Searching '{term}' in '{city_loc}'...")
                
                scraped_df = scrape_jobs(
                    site_name=site_names,
                    search_term=term,
                    location=city_loc,
                    results_wanted=results_wanted,
                    country_indeed='india' if any(c in loc.lower() for c in ['india', 'bangalore', 'bengaluru', 'mumbai', 'pune', 'hyderabad', 'delhi', 'noida', 'gurgaon', 'chennai', 'kolkata']) else 'usa',
                    linkedin_fetch_description=True,
                    hours_old=72,  # Fresh jobs in last 72 hours
                )
                
                if scraped_df is not None and not scraped_df.empty:
                    for _, row in scraped_df.iterrows():
                        site_raw = str(row.get('site') or 'JobSpy').lower()
                        if 'linkedin' in site_raw:
                            site_name = 'LinkedIn'
                        elif 'indeed' in site_raw:
                            site_name = 'Indeed'
                        elif 'google' in site_raw:
                            site_name = 'Google Jobs'
                        else:
                            site_name = str(row.get('site') or 'Job Portal').title()

                        raw_desc = row.get('description')
                        if raw_desc is None or str(raw_desc).lower() == 'nan':
                            desc_str = ""
                        else:
                            desc_str = str(raw_desc).strip()

                        raw_loc = row.get('location')
                        if raw_loc is None or str(raw_loc).lower() == 'nan':
                            loc_str = loc
                        else:
                            loc_str = str(raw_loc).strip()

                        # Build clean salary string from JobSpy metadata if available
                        salary_str = ""
                        min_amt = row.get('min_amount')
                        max_amt = row.get('max_amount')
                        interval = str(row.get('interval') or '').strip().lower()
                        currency = str(row.get('currency') or 'INR').strip().upper()
                        sym = '$' if 'USD' in currency else ('₹' if currency in ['INR', ''] else f"{currency} ")

                        try:
                            min_val = float(min_amt) if min_amt is not None and str(min_amt).lower() != 'nan' else None
                            max_val = float(max_amt) if max_amt is not None and str(max_amt).lower() != 'nan' else None
                            
                            if min_val and max_val:
                                if interval in ['yearly', 'annual', 'yr', 'year'] and min_val >= 50000 and sym == '₹':
                                    salary_str = f"₹{min_val/100000:.1f} - {max_val/100000:.1f} LPA".replace('.0', '')
                                elif interval in ['monthly', 'month', 'mo']:
                                    salary_str = f"{sym}{int(min_val):,} - {sym}{int(max_val):,} / month"
                                elif interval in ['hourly', 'hour', 'hr']:
                                    salary_str = f"{sym}{min_val:.0f} - {sym}{max_val:.0f} / hour"
                                else:
                                    salary_str = f"{sym}{int(min_val):,} - {sym}{int(max_val):,}"
                            elif min_val:
                                if interval in ['yearly', 'annual', 'yr', 'year'] and min_val >= 50000 and sym == '₹':
                                    salary_str = f"₹{min_val/100000:.1f} LPA".replace('.0', '')
                                elif interval in ['monthly', 'month', 'mo']:
                                    salary_str = f"{sym}{int(min_val):,} / month"
                                else:
                                    salary_str = f"{sym}{int(min_val):,}"
                        except Exception:
                            salary_str = ""

                        if not salary_str:
                            raw_sal = row.get('salary')
                            if raw_sal is not None and str(raw_sal).lower() not in ['nan', 'none', '']:
                                salary_str = str(raw_sal).strip()

                        jobs_list.append({
                            'title': str(row.get('title') or '').strip(),
                            'company': str(row.get('company') or '').strip(),
                            'location': loc_str,
                            'query_location': loc,
                            'description': desc_str,
                            'apply_url': str(row.get('job_url') or row.get('site_url') or '').strip(),
                            'salary': salary_str,
                            'source_name': site_name,
                            'source_url': str(row.get('job_url') or '').strip(),
                            'is_remote': bool(row.get('is_remote') or 'remote' in loc.lower())
                        })
            except Exception as e:
                logger.error(f"[JobSpy] Error scraping term '{term}' in '{city_loc}': {e}")

    return jobs_list
