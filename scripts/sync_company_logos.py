import os
import urllib.request
import json
import re

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "companies")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Curated high-res vector logos from SimpleIcons
VECTOR_LOGOS = {
    "cisco": "https://cdn.simpleicons.org/cisco",
    "qualcomm": "https://cdn.simpleicons.org/qualcomm",
    "fujitsu": "https://cdn.simpleicons.org/fujitsu",
    "goldmansachs": "https://cdn.simpleicons.org/goldmansachs",
    "pwc": "https://cdn.simpleicons.org/pwc",
    "oracle": "https://cdn.simpleicons.org/oracle",
    "sap": "https://cdn.simpleicons.org/sap",
    "intel": "https://cdn.simpleicons.org/intel",
    "nvidia": "https://cdn.simpleicons.org/nvidia",
    "amd": "https://cdn.simpleicons.org/amd",
    "samsung": "https://cdn.simpleicons.org/samsung",
    "dell": "https://cdn.simpleicons.org/dell",
    "hp": "https://cdn.simpleicons.org/hp",
    "siemens": "https://cdn.simpleicons.org/siemens",
    "bosch": "https://cdn.simpleicons.org/bosch",
    "philips": "https://cdn.simpleicons.org/philips",
    "swiggy": "https://cdn.simpleicons.org/swiggy",
    "zomato": "https://cdn.simpleicons.org/zomato",
    "paytm": "https://cdn.simpleicons.org/paytm",
    "phonepe": "https://cdn.simpleicons.org/phonepe",
    "razorpay": "https://cdn.simpleicons.org/razorpay",
    "zoho": "https://cdn.simpleicons.org/zoho",
    "postman": "https://cdn.simpleicons.org/postman",
    "zerodha": "https://cdn.simpleicons.org/zerodha",
    "atlassian": "https://cdn.simpleicons.org/atlassian",
    "servicenow": "https://cdn.simpleicons.org/servicenow",
    "adobe": "https://cdn.simpleicons.org/adobe",
    "uber": "https://cdn.simpleicons.org/uber",
    "paypal": "https://cdn.simpleicons.org/paypal",
    "stripe": "https://cdn.simpleicons.org/stripe",
    "spotify": "https://cdn.simpleicons.org/spotify",
    "barclays": "https://cdn.simpleicons.org/barclays",
    "hsbc": "https://cdn.simpleicons.org/hsbc",
    "mastercard": "https://cdn.simpleicons.org/mastercard",
    "visa": "https://cdn.simpleicons.org/visa",
}

def download_file(url, dest_path):
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                content = response.read()
                if len(content) > 100:
                    with open(dest_path, 'wb') as f:
                        f.write(content)
                    print(f"[OK] Saved: {os.path.basename(dest_path)} ({len(content)} bytes)")
                    return True
    except Exception as e:
        print(f"[FAIL] Failed {url}: {e}")
    return False

def main():
    print(f"Downloading verified vector brand logos to: {OUTPUT_DIR}\n")
    
    # Download official SVG vector brand logos
    for slug, url in VECTOR_LOGOS.items():
        dest = os.path.join(OUTPUT_DIR, f"{slug}.svg")
        if not os.path.exists(dest):
            download_file(url, dest)
        else:
            print(f"- Already exists: {slug}.svg")

    print("\nVerified logo sync complete!")

if __name__ == "__main__":
    main()
