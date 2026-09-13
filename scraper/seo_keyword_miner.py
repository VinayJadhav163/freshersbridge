"""
FreshersBridge 100% Free Automated SEO Keyword Miner
Mines real-time search queries and long-tail student search terms from Google's Suggest engine.
Zero API cost, zero external dependencies (uses standard library only).
"""

import urllib.request
import urllib.parse
import json
import time
import os
import string
from datetime import datetime

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

# Core Role Seeds
ROLE_SEEDS = [
    "data analyst fresher",
    "software engineer fresher",
    "frontend developer fresher",
    "backend developer fresher",
    "full stack developer fresher",
    "python developer fresher",
    "java developer fresher",
    "qa engineer fresher",
    "devops engineer fresher",
    "cloud engineer fresher",
    "ai ml engineer fresher",
]

# Hiring Intent Seeds
INTENT_SEEDS = [
    "freshers jobs",
    "fresher jobs",
    "internship for btech students",
    "internship for freshers",
    "off campus drive 2026",
    "remote fresher jobs",
    "jobs without experience",
]

# Target Hiring Companies
COMPANY_SEEDS = [
    "tcs nqt",
    "infosys sp dse",
    "accenture recruitment freshers",
    "cognizant freshers",
    "wipro elite nth",
    "capgemini freshers",
]

# Top Indian Tech Hubs
CITIES = ["bangalore", "pune", "hyderabad", "noida", "chennai", "remote"]


def fetch_google_suggestions(query: str, delay: float = 0.15) -> list[str]:
    """Query Google's live Suggest endpoint for search suggestions in India."""
    url = f"https://suggestqueries.google.com/complete/search?client=chrome&hl=en-IN&gl=in&q={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode("utf-8", errors="ignore"))
            time.sleep(delay)
            if isinstance(data, list) and len(data) > 1 and isinstance(data[1], list):
                return [s.strip().lower() for s in data[1] if isinstance(s, str)]
    except Exception as err:
        pass
    return []


def categorize_keyword(kw: str) -> str:
    """Categorize keyword into an actionable cluster."""
    kw_lower = kw.lower()
    if any(p in kw_lower for p in ["syllabus", "pattern", "questions", "interview", "how to", "eligibility", "preparation", "package", "salary"]):
        return "guide_opportunities"
    if any(c in kw_lower for c in ["intern", "internship", "trainee", "stipend"]):
        return "internships"
    if any(w in kw_lower for w in ["remote", "work from home", "wfh"]):
        return "remote_work"
    if any(c in kw_lower for c in ["tcs", "infosys", "accenture", "cognizant", "wipro", "capgemini", "amazon"]):
        return "company_specific"
    return "general_freshers"


def run_miner():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting FreshersBridge Free SEO Keyword Miner...")

    all_keywords = set()
    role_keywords = {}
    company_keywords = {}
    intent_keywords = {}
    guide_opportunities = set()

    # 1. Mine Role Keywords (with alphabetic a-z expansion)
    print("\n[1/3] Mining Tech Role Keywords...")
    for role in ROLE_SEEDS:
        role_list = set()
        # Direct query
        direct = fetch_google_suggestions(role)
        role_list.update(direct)
        all_keywords.update(direct)

        # Alphabetic expansion for deep long-tail queries (a-z)
        for char in string.ascii_lowercase:
            expanded = fetch_google_suggestions(f"{role} {char}")
            role_list.update(expanded)
            all_keywords.update(expanded)

        role_keywords[role] = sorted(list(role_list))
        print(f"  -> '{role}': discovered {len(role_list)} variations")

    # 2. Mine Company Specific Queries (Syllabus, Drives, Packages)
    print("\n[2/3] Mining Company Hiring & Drive Keywords...")
    for company in COMPANY_SEEDS:
        comp_list = set()
        direct = fetch_google_suggestions(company)
        comp_list.update(direct)
        all_keywords.update(direct)

        # Expand with key intent modifiers
        for modifier in ["syllabus", "package", "exam pattern", "eligibility", "coding questions", "2026"]:
            expanded = fetch_google_suggestions(f"{company} {modifier}")
            comp_list.update(expanded)
            all_keywords.update(expanded)

        company_keywords[company] = sorted(list(comp_list))
        print(f"  -> '{company}': discovered {len(comp_list)} variations")

    # 3. Mine Hiring Intent & Location Keywords
    print("\n[3/3] Mining General Hiring & Internship Keywords...")
    for intent in INTENT_SEEDS:
        intent_list = set()
        direct = fetch_google_suggestions(intent)
        intent_list.update(direct)
        all_keywords.update(direct)

        for city in CITIES:
            expanded = fetch_google_suggestions(f"{intent} in {city}")
            intent_list.update(expanded)
            all_keywords.update(expanded)

        intent_keywords[intent] = sorted(list(intent_list))
        print(f"  -> '{intent}': discovered {len(intent_list)} variations")

    # Separate out all high-converting Guide & Article Opportunities
    for kw in all_keywords:
        if categorize_keyword(kw) == "guide_opportunities":
            guide_opportunities.add(kw)

    # Prepare structured output
    output_data = {
        "metadata": {
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
            "total_unique_keywords": len(all_keywords),
            "total_guide_opportunities": len(guide_opportunities),
            "source": "Google Live Autocomplete (India en-IN/gl-in)",
        },
        "guide_topic_opportunities": sorted(list(guide_opportunities)),
        "by_role": role_keywords,
        "by_company": company_keywords,
        "by_intent": intent_keywords,
        "top_keywords_sample": sorted(list(all_keywords))[:100],
    }

    # Ensure output directory exists
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))
    data_dir = os.path.join(project_root, "data")
    os.makedirs(data_dir, exist_ok=True)

    output_path = os.path.join(data_dir, "seo_keywords.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully mined {len(all_keywords)} total unique keywords!")
    print(f"Found {len(guide_opportunities)} high-intent guide/article topic opportunities.")
    print(f"Saved database to: {output_path}\n")


if __name__ == "__main__":
    run_miner()
