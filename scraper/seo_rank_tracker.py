"""
FreshersBridge 100% Free Automated SEO Rank Tracker
Checks search rankings for FreshersBridge target keywords without paid APIs.
Tracks position history over time in data/seo_rank_report.json.
Zero external pip dependencies (standard library only).
"""

import urllib.request
import urllib.parse
import json
import re
import time
import os
from datetime import datetime

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
TARGET_DOMAIN = "freshersbridge.in"

# Priority Tracking Keywords (based on real GSC search performance data)
CORE_KEYWORDS = [
    "accenture recruitment process 2026",
    "infosys sp and dse package",
    "infosys sp dse package",
    "digital specialist engineer (dse)",
    "tcs nqt 2026 syllabus",
    "tcs nqt syllabus 2026",
    "cognizant careers for freshers",
    "data analyst fresher jobs india",
    "software engineer intern india",
    "off campus drive 2026 for freshers",
    "hr round interview questions freshers",
    "ats friendly resume for freshers",
    "accenture technical assessment questions 2026",
    "wipro elite nth 2026 syllabus",
]


def check_keyword_rank(keyword: str) -> dict:
    """Check where freshersbridge.in appears in search results for a keyword."""
    # Using DuckDuckGo HTML endpoint (zero CAPTCHA, clean HTML, free)
    encoded_query = urllib.parse.quote(keyword)
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}"

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept-Language": "en-US,en;q=0.9",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode("utf-8", errors="ignore")
            time.sleep(1.5)  # Gentle respectful delay

            # Extract result links
            links = re.findall(r'<a class="result__url" href="([^"]+)"', html)
            if not links:
                links = re.findall(r'href="([^"]*freshersbridge\.in[^"]*)"', html)

            for idx, link in enumerate(links[:30]):
                if TARGET_DOMAIN in link:
                    return {
                        "keyword": keyword,
                        "found": True,
                        "position": idx + 1,
                        "page": 1 if idx < 10 else (2 if idx < 20 else 3),
                        "url": link.strip(),
                    }

            return {
                "keyword": keyword,
                "found": False,
                "position": ">30",
                "page": ">3",
                "url": None,
            }
    except Exception as err:
        return {
            "keyword": keyword,
            "found": False,
            "position": "check_error",
            "page": None,
            "url": None,
            "error": str(err),
        }


def run_rank_tracker():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting FreshersBridge Automated Rank Tracker...")
    print(f"Tracking Domain: https://{TARGET_DOMAIN}")
    print(f"Monitoring {len(CORE_KEYWORDS)} Core Focus Keywords...\n")

    results = []
    top_page_1 = 0
    top_page_2 = 0

    for i, kw in enumerate(CORE_KEYWORDS, 1):
        print(f"[{i}/{len(CORE_KEYWORDS)}] Checking rank for: '{kw}'...")
        res = check_keyword_rank(kw)
        results.append(res)
        if res["found"]:
            pos = res["position"]
            page = res["page"]
            if page == 1:
                top_page_1 += 1
                print(f"   -> Found on PAGE 1 (Position #{pos})! URL: {res['url']}")
            elif page == 2:
                top_page_2 += 1
                print(f"   -> Found on PAGE 2 (Position #{pos}). URL: {res['url']}")
            else:
                print(f"   -> Found at Position #{pos}. URL: {res['url']}")
        else:
            print(f"   -> Position: {res['position']}")

    # Load previous history if available
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, ".."))
    data_dir = os.path.join(project_root, "data")
    os.makedirs(data_dir, exist_ok=True)
    report_file = os.path.join(data_dir, "seo_rank_report.json")

    history = []
    if os.path.exists(report_file):
        try:
            with open(report_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                if isinstance(existing_data, dict) and "history" in existing_data:
                    history = existing_data["history"][-20:]  # Keep last 20 snapshots
        except Exception:
            pass

    current_snapshot = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total_tracked": len(CORE_KEYWORDS),
        "page_1_rankings": top_page_1,
        "page_2_rankings": top_page_2,
        "rankings": results,
    }

    history.append(current_snapshot)

    full_report = {
        "latest": current_snapshot,
        "history": history,
    }

    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(full_report, f, indent=2, ensure_ascii=False)

    print("\n=======================================================")
    print(f"Rank tracking complete! Results saved to {report_file}")
    print(f"Page 1 Rankings: {top_page_1} | Page 2 Rankings: {top_page_2}")
    print("=======================================================\n")


if __name__ == "__main__":
    run_rank_tracker()
