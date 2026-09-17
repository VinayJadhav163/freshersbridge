"""
FreshersBridge Instagram Reel Audio Batch Downloader
Uses yt-dlp and bundled ffmpeg to batch-download and convert Instagram Reels to MP3 audio files.
Saves extracted MP3s directly to scraper/assets/audio/instagram/
"""

import os
import sys
import argparse
from typing import List

# Force UTF-8 encoding on Windows
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    import imageio_ffmpeg
    FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG_EXE = None

try:
    import yt_dlp
except ImportError:
    print("Error: yt-dlp is not installed. Run: pip install yt-dlp")
    sys.exit(1)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INSTAGRAM_AUDIO_DIR = os.path.join(BASE_DIR, "scraper", "assets", "audio", "instagram")
DEFAULT_URLS_FILE = os.path.join(BASE_DIR, "urls.txt")

os.makedirs(INSTAGRAM_AUDIO_DIR, exist_ok=True)

def download_audios(urls: List[str], output_dir: str = INSTAGRAM_AUDIO_DIR):
    clean_urls = [u.strip() for u in urls if u.strip() and not u.strip().startswith("#")]
    if not clean_urls:
        print("No valid URLs to process.")
        return

    print("=" * 60)
    print(f"Starting Instagram Audio Batch Downloader ({len(clean_urls)} items)")
    print(f"Target Directory: {output_dir}")
    print("=" * 60)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(output_dir, '%(title).50s-%(id)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'ignoreerrors': True,
        'quiet': False,
        'no_warnings': True,
    }

    if FFMPEG_EXE:
        ydl_opts['ffmpeg_location'] = os.path.dirname(FFMPEG_EXE)

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for idx, url in enumerate(clean_urls, 1):
            print(f"\n[{idx}/{len(clean_urls)}] Downloading audio from: {url}")
            try:
                ydl.download([url])
            except Exception as e:
                print(f"  -> Error downloading {url}: {e}")

    print("\n" + "=" * 60)
    existing_mp3s = [f for f in os.listdir(output_dir) if f.endswith(('.mp3', '.wav'))]
    print(f"DONE! Your Instagram audio pool now has {len(existing_mp3s)} tracks:")
    for f in existing_mp3s[-10:]:
        print(f"  - {f}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Batch download audio from Instagram Reels into MP3s")
    parser.add_argument("file", nargs="?", default=DEFAULT_URLS_FILE, help="Path to text file containing reel URLs (default: urls.txt)")
    args = parser.parse_args()

    urls_file = args.file
    if not os.path.exists(urls_file):
        # Also check for any downloaded instagram_saved_*.txt files or files inside data/
        saved_txts = [os.path.join(BASE_DIR, f) for f in os.listdir(BASE_DIR) if f.startswith("instagram_saved_") and f.endswith(".txt")]
        alt_paths = saved_txts + [
            os.path.join(BASE_DIR, "data", "urls.txt"),
            os.path.join(BASE_DIR, "data", "instagram_urls.txt"),
            "urls.txt"
        ]
        found = False
        for p in alt_paths:
            if os.path.exists(p):
                urls_file = p
                found = True
                break

        if not found:
            print(f"Error: URLs file not found at '{urls_file}'.")
            print("Please create 'urls.txt' in the FreshersBridge root directory and paste your Instagram Reel links there.")
            sys.exit(1)

    print(f"Reading URLs from: {urls_file}")
    with open(urls_file, "r", encoding="utf-8") as f:
        urls = f.readlines()

    download_audios(urls)

if __name__ == "__main__":
    main()
