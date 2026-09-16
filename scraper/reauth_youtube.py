"""
FreshersBridge YouTube OAuth Re-Authorization Utility
Run this script locally on your desktop machine (with a browser) to authorize all scopes:
1. https://www.googleapis.com/auth/youtube.upload (Upload Shorts)
2. https://www.googleapis.com/auth/youtube (Account & channel management)
3. https://www.googleapis.com/auth/youtube.force-ssl (Comments reading & auto-replying)

After authorization completes:
- It saves the fresh credentials to credentials/youtube_token.json
- It prints the compact JSON string to paste into GitHub Secrets as YOUTUBE_TOKEN_JSON
"""

import os
import sys
import json
from google_auth_oauthlib.flow import InstalledAppFlow

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDENTIALS_DIR = os.path.join(BASE_DIR, "credentials")
CLIENT_SECRET_FILE = os.path.join(CREDENTIALS_DIR, "youtube_client_secret.json")
TOKEN_FILE = os.path.join(CREDENTIALS_DIR, "youtube_token.json")

ALL_SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl"
]

def reauthorize():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"❌ Error: Client secret file not found at: {CLIENT_SECRET_FILE}")
        print("Please ensure credentials/youtube_client_secret.json exists.")
        sys.exit(1)

    print("=" * 65)
    print("🔑 FreshersBridge YouTube OAuth Full Re-Authorization")
    print("Scopes requested:")
    for s in ALL_SCOPES:
        print(f"  - {s}")
    print("=" * 65)
    print("\nOpening your browser for Google authentication...")
    print("Please log in with the Google Account that manages the FreshersBridge channel.")
    print("Click 'Allow' to grant video upload and comment management permissions.\n")

    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, ALL_SCOPES)
    creds = flow.run_local_server(port=8080, prompt="consent", open_browser=True)

    os.makedirs(CREDENTIALS_DIR, exist_ok=True)
    token_json_str = creds.to_json()
    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        f.write(token_json_str)

    print("\n" + "=" * 65)
    print(f"✅ Success! Authorized and saved fresh token to:\n   {TOKEN_FILE}")
    print("=" * 65)
    print("\n👉 Next Step (To enable automated comments in GitHub Actions):")
    print("1. Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions")
    print("2. Edit the secret: YOUTUBE_TOKEN_JSON")
    print("3. Replace its value with the single-line JSON string below:")
    print("-" * 65)
    print(token_json_str)
    print("-" * 65)
    print("\nOnce updated, the comment responder and first comment pinning will be fully active in GitHub Actions! 🚀\n")

if __name__ == "__main__":
    reauthorize()
