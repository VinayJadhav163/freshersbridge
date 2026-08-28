# FreshersBridge Job Scraper & AI Ingestion Engine

A standalone, high-performance job aggregation and verification pipeline designed for **FreshersBridge**.

---

## 🏗️ Architecture Overview

The scraping and AI engine is **completely decoupled** from the main Next.js web application:
1. **Aggregates:** Scrapes live freshers & entry-level jobs across LinkedIn, Indeed India, Instahyre, Shine, Naukri, Foundit, and tech job boards.
2. **Filters & Verifies:** Uses Google Gemini Flash AI (with multi-layer fallback) + strict fresher experience gatekeepers ($\le 1$ year / 2024–2026 graduates).
3. **Exports:** Produces a single, clean, standardized CSV file: `scraper/output/latest_freshersbridge_jobs.csv`.

---

## 💻 1. Running on Laptop / Desktop

### Step 1: Install Dependencies (First time only)
```bash
pip install -r scraper/requirements.txt
```

### Step 2: Run the Pipeline
```bash
python scraper/main.py
```
* **Output:** `scraper/output/latest_freshersbridge_jobs.csv`
* **Execution Time:** ~45 to 60 seconds.

---

## 📱 2. Running on Mobile Phone

### Option A: GitHub Actions (Recommended — Zero Phone Setup)
1. Open your repository on GitHub in your phone's browser.
2. Tap **Actions** $\to$ Select **"FreshersBridge 2-Hour Job Scraper"**.
3. Tap **"Run workflow"**.
4. Once completed (~1 min), download the `freshersbridge-scraped-jobs-csv` artifact directly to your phone.

### Option B: Android Termux
```bash
pkg install python git
cd FreshersBridge
pip install -r scraper/requirements.txt
python scraper/main.py
```

---

## 🚀 3. Uploading to FreshersBridge

1. Open your browser and navigate to:
   `https://freshersbridge.in/admin` (or `http://localhost:3000/admin`)
2. Enter your Admin Key: `freshersbridgeadmin2026`.
3. Go to the **CSV Import** tab or click **Upload CSV**.
4. Select `latest_freshersbridge_jobs.csv` and click **Import Jobs**.
5. All verified freshers listings and internships are immediately live on the portal!

---

## ⚙️ Configuration (`.env.local` / `.env`)

```env
# Google Gemini Flash API Key (100% Free Tier from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Admin Access Key for Portal
ADMIN_ACCESS_KEY=freshersbridgeadmin2026
```
