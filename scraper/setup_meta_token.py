"""
Helper script to exchange a short-lived Meta User Access Token for a permanent/long-lived
Page Access Token and auto-discover Facebook Page ID and Instagram Account ID.
"""

import sys
import os
import json
import urllib.request
import urllib.parse

def setup_meta(app_id: str, app_secret: str, user_access_token: str):
    print("=" * 60)
    print("FreshersBridge Meta (Instagram & Facebook) Setup Tool")
    print("=" * 60)

    # Step 1: Exchange for Long-Lived User Token (60 days)
    print("\n[1/4] Exchanging for Long-Lived User Token...")
    exchange_url = (
        f"https://graph.facebook.com/v21.0/oauth/access_token?"
        f"grant_type=fb_exchange_token&"
        f"client_id={app_id}&"
        f"client_secret={app_secret}&"
        f"fb_exchange_token={user_access_token}"
    )
    try:
        req = urllib.request.Request(exchange_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            long_lived_user_token = data.get("access_token")
            print("  -> Success! Acquired 60-Day User Token.")
    except Exception as e:
        print(f"  -> Exchange notice (using provided token directly): {e}")
        long_lived_user_token = user_access_token

    # Step 2: Fetch Accounts (Facebook Pages managed by user)
    print("\n[2/4] Discovering Facebook Pages and Page Access Tokens...")
    accounts_url = (
        f"https://graph.facebook.com/v21.0/me/accounts?"
        f"fields=id,name,access_token,instagram_business_account{{id,username}}&"
        f"access_token={long_lived_user_token}"
    )
    pages = []
    try:
        req = urllib.request.Request(accounts_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("data", [])
    except Exception as e:
        print(f"  -> Error fetching pages: {e}")

    if not pages:
        print("  -> No Facebook Pages found under this user account!")
        print("  -> Checking user directly for Instagram account...")
        # Direct check
        direct_url = f"https://graph.facebook.com/v21.0/me?fields=id,name&access_token={long_lived_user_token}"
        try:
            req = urllib.request.Request(direct_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as resp:
                u = json.loads(resp.read().decode("utf-8"))
                print(f"  -> User identified: {u.get('name')} (ID: {u.get('id')})")
        except Exception:
            pass
        return

    print(f"  -> Found {len(pages)} Facebook Page(s):")
    target_page = None
    for p in pages:
        ig = p.get("instagram_business_account", {})
        print(f"     - Page: {p.get('name')} (ID: {p.get('id')}) | IG: {ig.get('username', 'None')} (IG ID: {ig.get('id', 'None')})")
        if "freshers" in p.get("name", "").lower() or target_page is None:
            target_page = p

    if not target_page:
        target_page = pages[0]

    page_id = target_page.get("id")
    page_name = target_page.get("name")
    page_token = target_page.get("access_token")
    ig_account = target_page.get("instagram_business_account") or {}
    ig_id = ig_account.get("id")
    ig_username = ig_account.get("username")

    print("\n[3/4] Selected Target Identity:")
    print(f"  -> Page Name: {page_name}")
    print(f"  -> Facebook Page ID: {page_id}")
    print(f"  -> Instagram Username: {ig_username or 'Not Connected'}")
    print(f"  -> Instagram Account ID: {ig_id or 'Not Connected'}")
    print(f"  -> Never-Expiring Page Token: {page_token[:15]}...{page_token[-10:]}")

    # Step 3: Save to .env.local
    print("\n[4/4] Updating local environment (.env.local)...")
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local")
    env_lines = []
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            env_lines = f.readlines()

    keys_to_update = {
        "META_ACCESS_TOKEN": page_token,
        "FACEBOOK_PAGE_ID": page_id,
        "INSTAGRAM_ACCOUNT_ID": ig_id or "",
        "META_APP_ID": app_id,
        "META_APP_SECRET": app_secret
    }

    new_lines = []
    seen_keys = set()
    for line in env_lines:
        updated = False
        for k, v in keys_to_update.items():
            if line.startswith(f"{k}=") or line.startswith(f"#{k}="):
                new_lines.append(f"{k}={v}\n")
                seen_keys.add(k)
                updated = True
                break
        if not updated:
            new_lines.append(line)

    for k, v in keys_to_update.items():
        if k not in seen_keys:
            new_lines.append(f"{k}={v}\n")

    with open(env_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)

    print(f"  -> Successfully updated {env_path}!")
    print("\n" + "=" * 60)
    print("SETUP COMPLETE! Your Meta Reels Autoposter is fully wired.")
    print("=" * 60)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python setup_meta_token.py <app_id> <app_secret> <user_token>")
        sys.exit(1)
    setup_meta(sys.argv[1], sys.argv[2], sys.argv[3])
