"""
FreshersBridge Social Video Generator (Reels / Shorts / TikTok)
Automates ready-to-post 9:16 vertical MP4 video reels (1080x1920) from scraped job postings.

Features:
- Premium Glassmorphic 9:16 Visual Poster Design
- Crisp Typography & Brand Aesthetics (Zero missing glyphs)
- Company Brand Accents (Microsoft, TCS, Accenture, Google, etc.)
- Audio Engine: Automatically muxes background music from trending audios
- Micro-Animations: Smooth entrance slide, pulsing "APPLY NOW", dynamic live clock & progress bar
- Auto-Caption & Hashtags Generator (.txt file alongside every MP4)
"""

import os
import sys
import glob
import math
import random
import re
import argparse
import requests
import pandas as pd
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from moviepy import VideoClip, AudioFileClip

# File Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
AUDIO_DIR = os.path.join(ASSETS_DIR, "audio")
LOGOS_DIR = os.path.join(ASSETS_DIR, "logos")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
REELS_OUTPUT_DIR = os.path.join(OUTPUT_DIR, "reels")
TRENDING_AUDIO_CSV = os.path.join(ASSETS_DIR, "trending_audio.csv")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(LOGOS_DIR, exist_ok=True)
os.makedirs(REELS_OUTPUT_DIR, exist_ok=True)

# Video Dimensions & Settings
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 8.0  # 8.0 seconds optimal for 100% completion rate & loop replay

# Fonts (Uses bundled TrueType fonts first for 100% cross-platform Ubuntu/Windows parity)
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
BUNDLED_BOLD = os.path.join(FONTS_DIR, "font_bold.ttf")
BUNDLED_REGULAR = os.path.join(FONTS_DIR, "font_regular.ttf")

FONT_BOLD = BUNDLED_BOLD if os.path.exists(BUNDLED_BOLD) else "C:\\Windows\\Fonts\\segoeuib.ttf"
FONT_REGULAR = BUNDLED_REGULAR if os.path.exists(BUNDLED_REGULAR) else "C:\\Windows\\Fonts\\segoeui.ttf"
FONT_HEAVY = BUNDLED_BOLD if os.path.exists(BUNDLED_BOLD) else "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_EMOJI = "C:\\Windows\\Fonts\\seguiemj.ttf"

# Brand Colors & Badges for Major Companies
COMPANY_THEMES = {
    "MICROSOFT": {"bg": (0, 120, 215), "accent": "#00a4ef", "symbol": "MS"},
    "GOOGLE": {"bg": (234, 67, 53), "accent": "#4285f4", "symbol": "G"},
    "AMAZON": {"bg": (255, 153, 0), "accent": "#ff9900", "symbol": "AZ"},
    "ACCENTURE": {"bg": (161, 0, 255), "accent": "#a100ff", "symbol": "AC"},
    "TCS": {"bg": (0, 75, 151), "accent": "#0052cc", "symbol": "TCS"},
    "INFOSYS": {"bg": (0, 114, 187), "accent": "#0284c7", "symbol": "INFY"},
    "WIPRO": {"bg": (37, 99, 235), "accent": "#3b82f6", "symbol": "WIP"},
    "COGNIZANT": {"bg": (15, 23, 42), "accent": "#0ea5e9", "symbol": "CTS"},
    "DEFAULT": {"bg": (30, 58, 138), "accent": "#38bdf8", "symbol": "FB"},
}

def get_font(path, size):
    try:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
        # Fallback to bundled
        if os.path.exists(BUNDLED_BOLD):
            return ImageFont.truetype(BUNDLED_BOLD, size)
        return ImageFont.load_default()
    except Exception:
        return ImageFont.load_default()

def render_supersampled_icon(icon_type, target_size=42, bg_color=(16, 185, 129), fg_color="#ffffff"):
    """
    Renders crystal-clear, silky-smooth vector icons using 4x supersampling + Lanczos filtering.
    Guarantees zero pixelation, jagged edges, or aliasing.
    """
    scale = 4
    s = target_size * scale
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    
    # Outer circle with soft border
    d.ellipse([2, 2, s - 3, s - 3], fill=bg_color)
    d.ellipse([2, 2, s - 3, s - 3], outline=(255, 255, 255, 120), width=max(2, int(s * 0.03)))
    
    # Render crystal clear inner vectors
    if icon_type == "check":
        pts = [(s * 0.26, s * 0.52), (s * 0.44, s * 0.70), (s * 0.76, s * 0.32)]
        d.line(pts, fill=fg_color, width=int(s * 0.09), joint="curve")
    elif icon_type == "lightning":
        pts = [
            (s * 0.54, s * 0.13),
            (s * 0.22, s * 0.50),
            (s * 0.48, s * 0.50),
            (s * 0.36, s * 0.87),
            (s * 0.78, s * 0.44),
            (s * 0.52, s * 0.44)
        ]
        d.polygon(pts, fill=fg_color)
    elif icon_type == "star":
        cx, cy = s / 2, s / 2
        r_out, r_in = s * 0.35, s * 0.16
        pts = []
        for i in range(10):
            angle = i * math.pi / 5 - math.pi / 2
            r = r_out if i % 2 == 0 else r_in
            pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        d.polygon(pts, fill=fg_color)
    elif icon_type == "pin":
        cx, cy = s / 2, s * 0.39
        d.ellipse([cx - s * 0.20, cy - s * 0.20, cx + s * 0.20, cy + s * 0.20], fill=fg_color)
        d.polygon([(cx - s * 0.18, cy + s * 0.08), (cx + s * 0.18, cy + s * 0.08), (cx, s * 0.82)], fill=fg_color)
        d.ellipse([cx - s * 0.08, cy - s * 0.08, cx + s * 0.08, cy + s * 0.08], fill=bg_color)
    elif icon_type == "rupee":
        font = ImageFont.truetype(FONT_BOLD, int(s * 0.54))
        bb = font.getbbox("₹")
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        d.text(((s - w) // 2, (s - h) // 2 - bb[1]), "₹", font=font, fill=fg_color)
    elif icon_type == "degree":
        # Graduation cap icon
        pts_cap = [(s * 0.18, s * 0.42), (s * 0.50, s * 0.26), (s * 0.82, s * 0.42), (s * 0.50, s * 0.58)]
        d.polygon(pts_cap, fill=fg_color)
        # Lower skullcap curve
        d.polygon([(s * 0.30, s * 0.50), (s * 0.70, s * 0.50), (s * 0.65, s * 0.68), (s * 0.35, s * 0.68)], fill=fg_color)
        # Tassel line
        d.line([(s * 0.80, s * 0.43), (s * 0.84, s * 0.65)], fill=fg_color, width=int(s * 0.04))
    elif icon_type == "arrow":
        pts = [(s * 0.30, s * 0.22), (s * 0.72, s * 0.50), (s * 0.30, s * 0.78)]
        d.polygon(pts, fill=fg_color)
    else:
        d.ellipse([s * 0.35, s * 0.35, s * 0.65, s * 0.65], fill=fg_color)
        
    return canvas.resize((target_size, target_size), Image.Resampling.LANCZOS)

def draw_pill_badge(card_img, x, y, icon_type, label_prefix, label_val, font_prefix, font_val, prefix_color, val_color, icon_bg=(16, 185, 129), icon_fg="#ffffff", radius=18, padding_x=16, padding_y=10):
    """
    Renders an elegant, desaturated modern glassmorphism pill with crystal-clear supersampled icon.
    """
    draw = ImageDraw.Draw(card_img)
    
    # Calculate widths
    bb_p = font_prefix.getbbox(label_prefix)
    pw = bb_p[2] - bb_p[0]
    
    bb_v = font_val.getbbox(label_val)
    vw = bb_v[2] - bb_v[0]
    th = max(bb_p[3] - bb_p[1], bb_v[3] - bb_v[1])

    icon_size = 40
    w = icon_size + 14 + pw + 8 + vw + padding_x * 2
    h = icon_size + padding_y * 2
    
    # Refined Glassmorphic Pill Background (dark, harmonious, non-screaming)
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=(20, 29, 49, 235), outline=(47, 63, 94, 255), width=1)
    
    # Render and Paste 4x Supersampled Icon
    icon_img = render_supersampled_icon(icon_type, target_size=icon_size, bg_color=icon_bg, fg_color=icon_fg)
    ix = x + 10
    iy = y + padding_y
    card_img.paste(icon_img, (ix, iy), icon_img)

    # Prefix Text (e.g. "CTC: ")
    tx = ix + icon_size + 14
    ty_p = y + (h - (bb_p[3] - bb_p[1])) // 2 - bb_p[1]
    draw.text((tx, ty_p), label_prefix, font=font_prefix, fill=prefix_color)

    # Value Text (e.g. "₹4.5 - ₹6.5 LPA")
    vx = tx + pw + 8
    ty_v = y + (h - (bb_v[3] - bb_v[1])) // 2 - bb_v[1]
    draw.text((vx, ty_v), label_val, font=font_val, fill=val_color)
    return w, h



def render_background_base():
    """Renders a sleek deep dark cyber gradient with subtle glows."""
    img = Image.new("RGB", (WIDTH, HEIGHT), "#050811")
    draw = ImageDraw.Draw(img)
    
    # Vertical gradient
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(5 + (12 - 5) * ratio)
        g = int(8 + (20 - 8) * ratio)
        b = int(17 + (38 - 17) * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    glow_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_overlay)
    
    # Cyan Glow top right
    for r in range(420, 0, -25):
        alpha = int(32 * (1.0 - r / 420.0))
        glow_draw.ellipse([WIDTH - 250 - r, 80 - r, WIDTH - 250 + r, 80 + r], fill=(6, 182, 212, alpha))
        
    # Violet Glow bottom left
    for r in range(480, 0, -30):
        alpha = int(36 * (1.0 - r / 480.0))
        glow_draw.ellipse([180 - r, HEIGHT - 380 - r, 180 + r, HEIGHT - 380 + r], fill=(124, 58, 237, alpha))

    # Indigo Glow center
    for r in range(500, 0, -40):
        alpha = int(22 * (1.0 - r / 500.0))
        glow_draw.ellipse([WIDTH // 2 - r, HEIGHT // 2 - r, WIDTH // 2 + r, HEIGHT // 2 + r], fill=(37, 99, 235, alpha))

    img = Image.alpha_composite(img.convert("RGBA"), glow_overlay).convert("RGB")
    return img

def get_company_logo_image(company_name, max_size=(76, 76)):
    """
    Retrieves or downloads the real official company logo (transparent PNG)
    via cached assets or Google Favicon 128px API.
    """
    if not company_name:
        return None

    clean = company_name.lower().strip()
    for drop in ["pvt", "ltd", "limited", "technologies", "technology", "solutions", "services", "inc", "corp", "corporation", "llc", "india"]:
        clean = re.sub(r'\b' + drop + r'\b', '', clean).strip()
    clean_slug = "".join(c for c in clean if c.isalnum() or c == "_").strip("_")
    if not clean_slug:
        clean_slug = "company"

    domain_map = {
        "tcs": "tcs.com",
        "tataconsultancyservices": "tcs.com",
        "infosys": "infosys.com",
        "wipro": "wipro.com",
        "cognizant": "cognizant.com",
        "accenture": "accenture.com",
        "capgemini": "capgemini.com",
        "google": "google.com",
        "microsoft": "microsoft.com",
        "amazon": "amazon.com",
        "deloitte": "deloitte.com",
        "ibm": "ibm.com",
        "oracle": "oracle.com",
        "meta": "meta.com",
        "apple": "apple.com",
        "adobe": "adobe.com"
    }
    domain = domain_map.get(clean_slug, f"{clean_slug}.com")
    cached_path = os.path.join(LOGOS_DIR, f"{clean_slug}.png")

    if not os.path.exists(cached_path) or os.path.getsize(cached_path) == 0:
        try:
            favicon_url = f"https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://{domain}&size=128"
            resp = requests.get(favicon_url, timeout=3)
            if resp.status_code == 200 and len(resp.content) > 200:
                with open(cached_path, "wb") as f:
                    f.write(resp.content)
        except Exception:
            pass

    if os.path.exists(cached_path) and os.path.getsize(cached_path) > 200:
        try:
            logo = Image.open(cached_path).convert("RGBA")
            logo.thumbnail(max_size, Image.Resampling.LANCZOS)
            return logo
        except Exception:
            pass

    return None

def render_job_card(job):
    """
    Renders the central glassmorphic card for the job posting.
    Returns transparent RGBA image of size (960, 1070).
    """
    card_w = 960
    card_h = 1070
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    
    # Glassmorphic Card Container (Pure, clean rounded rect - NO extraneous top line)
    draw.rounded_rectangle([0, 0, card_w, card_h], radius=36, fill=(13, 20, 36, 245), outline=(56, 189, 248, 210), width=3)

    # Company Theme determination
    company = str(job.get("company", "Tech Global")).strip()
    theme = COMPANY_THEMES.get("DEFAULT")
    for k, v in COMPANY_THEMES.items():
        if k in company.upper():
            theme = v
            break
            
    initials = theme["symbol"] if theme != COMPANY_THEMES.get("DEFAULT") else "".join([w[0] for w in company.split()[:2]]).upper()[:3] or "FB"

    # Company Avatar Box (105x105) - Renders Real Logo if Available
    avatar_x, avatar_y = 50, 45
    logo_img = get_company_logo_image(company, max_size=(76, 76))

    if logo_img:
        # Clean white card background with rounded corners for maximum logo contrast
        draw.rounded_rectangle([avatar_x, avatar_y, avatar_x + 105, avatar_y + 105], radius=24, fill=(255, 255, 255, 245), outline=(56, 189, 248, 200), width=2)
        lw, lh = logo_img.size
        card.paste(logo_img, (avatar_x + (105 - lw) // 2, avatar_y + (105 - lh) // 2), logo_img)
    else:
        # Fallback to initials if no logo available
        draw.rounded_rectangle([avatar_x, avatar_y, avatar_x + 105, avatar_y + 105], radius=24, fill=theme["bg"], outline=(255, 255, 255, 200), width=2)
        font_init = get_font(FONT_HEAVY, 38)
        ibbox = font_init.getbbox(initials)
        iw = ibbox[2] - ibbox[0]
        ih = ibbox[3] - ibbox[1]
        draw.text((avatar_x + 52 - iw // 2, avatar_y + 52 - ih // 2 - ibbox[1]), initials, font=font_init, fill="#ffffff")

    # Company Name
    font_comp = get_font(FONT_BOLD, 46)
    draw.text((avatar_x + 130, avatar_y + 8), company.upper(), font=font_comp, fill="#ffffff")
    
    # Verified Badge Pill with Supersampled Checkmark
    font_badge = get_font(FONT_BOLD, 22)
    v_text = "VERIFIED HIRING DRIVE"
    v_bb = font_badge.getbbox(v_text)
    v_tw = v_bb[2] - v_bb[0]
    v_th = v_bb[3] - v_bb[1]
    v_h = 36
    v_w = 26 + 10 + v_tw + 20
    v_x, v_y = avatar_x + 130, avatar_y + 64
    draw.rounded_rectangle([v_x, v_y, v_x + v_w, v_y + v_h], radius=12, fill=(6, 78, 59, 230), outline=(16, 185, 129, 255), width=1)
    check_icon = render_supersampled_icon("check", target_size=24, bg_color=(16, 185, 129), fg_color="#ffffff")
    card.paste(check_icon, (v_x + 8, v_y + (v_h - 24) // 2), check_icon)
    draw.text((v_x + 38, v_y + (v_h - v_th) // 2 - v_bb[1]), v_text, font=font_badge, fill="#34d399")

    # Horizontal Divider Line
    draw.line([(50, 180), (card_w - 50, 180)], fill=(51, 65, 85, 180), width=2)

    # Job Role Title
    title = str(job.get("title", "Software Engineer")).strip()
    font_title = get_font(FONT_BOLD, 40)
    
    lines = []
    words = title.split()
    current_line = []
    for w in words:
        current_line.append(w)
        test_str = " ".join(current_line)
        if font_title.getbbox(test_str)[2] > (card_w - 110):
            current_line.pop()
            lines.append(" ".join(current_line))
            current_line = [w]
    if current_line:
        lines.append(" ".join(current_line))
    lines = lines[:2]  # max 2 lines
    
    ty = 208
    for line in lines:
        draw.text((50, ty), line, font=font_title, fill="#38bdf8")
        ty += 52

    # Highlight Badges Grid (Crisp Supersampled Modern Pills)
    pills_y = max(ty + 18, 325)
    font_pill_prefix = get_font(FONT_BOLD, 26)
    font_pill_val = get_font(FONT_BOLD, 26)

    # 1. Salary CTC Pill
    salary_raw = str(job.get("salary", "")).strip()
    if not salary_raw or salary_raw.lower() in ["not disclosed", "nan", "competitive"]:
        salary_text = "Competitive (₹4.5 - ₹7.5 LPA)"
    else:
        salary_text = salary_raw
    draw_pill_badge(card, 50, pills_y, "rupee", "CTC:", salary_text, font_pill_prefix, font_pill_val,
                    prefix_color="#34d399", val_color="#f8fafc", icon_bg=(16, 185, 129))

    # 2. Batch Pill
    pills_y += 68
    batch_text = "2024, 2025 & 2026 Passouts"
    draw_pill_badge(card, 50, pills_y, "star", "Batch:", batch_text, font_pill_prefix, font_pill_val,
                    prefix_color="#38bdf8", val_color="#f8fafc", icon_bg=(14, 165, 233))

    # 3. Location Pill
    pills_y += 68
    location_text = str(job.get("location", "Pan-India / Remote")).strip()
    if len(location_text) > 34:
        location_text = location_text[:32] + "..."
    draw_pill_badge(card, 50, pills_y, "pin", "Location:", location_text, font_pill_prefix, font_pill_val,
                    prefix_color="#c084fc", val_color="#f8fafc", icon_bg=(139, 92, 246))

    # 4. Eligibility Degree Pill
    pills_y += 68
    eligibility_text = str(job.get("eligibility", "B.E / B.Tech / BCA / MCA / B.Sc")).strip()
    if len(eligibility_text) > 36:
        eligibility_text = eligibility_text[:34] + "..."
    draw_pill_badge(card, 50, pills_y, "degree", "Degree:", eligibility_text, font_pill_prefix, font_pill_val,
                    prefix_color="#93c5fd", val_color="#f8fafc", icon_bg=(99, 102, 241))

    # 5. Experience / Freshers
    pills_y += 68
    draw_pill_badge(card, 50, pills_y, "lightning", "Experience:", "0 - 1 Years (Freshers Eligible)", font_pill_prefix, font_pill_val,
                    prefix_color="#fcd34d", val_color="#f8fafc", icon_bg=(245, 158, 11))

    # Skills Row
    skills_y = pills_y + 80
    font_skill_header = get_font(FONT_BOLD, 23)
    font_skill_tag = get_font(FONT_BOLD, 22)
    draw.text((50, skills_y), "REQUIRED SKILLS & TECHNOLOGIES:", font=font_skill_header, fill="#94a3b8")
    
    skills_raw = str(job.get("skills", "Problem Solving, Python, Java, SQL, Git")).split(",")
    skills_list = [s.strip() for s in skills_raw if s.strip()][:4]
    
    sx = 50
    sy = skills_y + 36
    for sk in skills_list:
        if len(sk) > 16:
            sk = sk[:14] + ".."
        bbox = font_skill_tag.getbbox(sk)
        bw = (bbox[2] - bbox[0]) + 32
        bh = (bbox[3] - bbox[1]) + 20
        draw.rounded_rectangle([sx, sy, sx + bw, sy + bh], radius=12, fill=(15, 23, 42, 255), outline=(56, 189, 248, 180), width=1)
        draw.text((sx + 16, sy + 10 - bbox[1]), sk, font=font_skill_tag, fill="#38bdf8")
        sx += bw + 14
        if sx > (card_w - 200):
            break

    # Bottom Apply Button Inside Card
    btn_y = card_h - 115
    btn_w = card_w - 100
    draw.rounded_rectangle([50, btn_y, 50 + btn_w, btn_y + 80], radius=22, fill=(37, 99, 235, 255), outline=(96, 165, 250, 255), width=2)
    
    font_btn = get_font(FONT_HEAVY, 32)
    btn_text = "APPLY LINK ACTIVE"
    bb = font_btn.getbbox(btn_text)
    btw = bb[2] - bb[0]
    bth = bb[3] - bb[1]
    
    arrow_size = 28
    total_content_w = btw + 16 + arrow_size
    content_x = 50 + (btn_w - total_content_w) // 2
    content_y = btn_y + (80 - bth) // 2 - bb[1]
    
    draw.text((content_x, content_y), btn_text, font=font_btn, fill="#ffffff")
    arrow_icon = render_supersampled_icon("arrow", target_size=arrow_size, bg_color=(59, 130, 246), fg_color="#ffffff")
    card.paste(arrow_icon, (content_x + btw + 16, btn_y + (80 - arrow_size) // 2), arrow_icon)

    return card

def generate_social_caption(job, platform="youtube"):
    """Generates viral social media caption with hashtags for YouTube / Instagram / FB."""
    company = str(job.get("company", "Top Tech Company")).strip()
    title = str(job.get("title", "Software Engineer")).strip()
    salary = str(job.get("salary", "Best in Industry")).strip()
    location = str(job.get("location", "Pan-India")).strip()
    apply_url = str(job.get("apply_url", "https://freshersbridge.in")).strip()

    if platform.lower() == "youtube":
        apply_instructions = f"""📌 HOW TO APPLY:
1️⃣ Direct application link is pinned in the TOP COMMENT below!
2️⃣ Direct Link: {apply_url}
3️⃣ Share this Short with batchmates looking for off-campus jobs!"""
        cta_footer = "🔔 Subscribe to @FreshersBridge for daily verified fresher jobs & hiring alerts!"
        tags = f"#Shorts #FreshersJobs #OffCampusHiring #{company.lower().replace(' ', '')} #Batch2026 #Batch2025 #FreshersBridge #SoftwareEngineer #JobAlerts #HiringAlert"
    else:
        apply_instructions = f"""📌 HOW TO APPLY:
1️⃣ Comment "APPLY" below and we will send you the direct application link in DM!
2️⃣ Or click the Link in Bio: freshersbridge.in
3️⃣ Tag a friend who is actively looking for off-campus opportunities!"""
        cta_footer = "🔔 Follow @freshersbridge for daily verified fresher jobs, internships & off-campus updates."
        tags = f"#freshersjobs #offcampushiring #{company.lower().replace(' ', '')} #batch2026 #batch2025 #freshersbridge #softwareengineer #jobalerts #hiringfreshers #itjobs #campusplacement #techjobs"

    caption = f"""🚨 OFF-CAMPUS HIRING ALERT: {company.upper()} is Hiring!

💼 Role: {title}
🏢 Company: {company}
💰 Package: {salary}
🎓 Batch Eligible: 2024, 2025 & 2026 Passouts
📍 Location: {location}
⚡ Experience: Freshers / 0-1 Years

{apply_instructions}

{cta_footer}

---
{tags}
"""
    return caption

def create_video_reel(job_data, audio_path=None, output_filename="sample_freshers_reel.mp4", platform="youtube"):
    """
    Assembles a full 9:16 vertical video reel with motion, card entrance,
    dynamic progress bar, and synced audio.
    Automatically adapts video duration to match the audio track length!
    Supports platform-specific audio: 'youtube', 'instagram', or 'facebook'.
    """
    output_path = os.path.join(REELS_OUTPUT_DIR, output_filename)
    cover_image_path = os.path.join(REELS_OUTPUT_DIR, output_filename.replace(".mp4", "_cover.png"))
    caption_path = os.path.join(REELS_OUTPUT_DIR, output_filename.replace(".mp4", "_caption.txt"))
    
    # 1. Resolve Platform Audio & Auto-Adapt Duration
    audio_clip = None
    if not audio_path or not os.path.exists(audio_path):
        platform_audio_dir = os.path.join(AUDIO_DIR, platform.lower())
        search_dirs = [platform_audio_dir, os.path.join(AUDIO_DIR, "youtube"), AUDIO_DIR]
        audio_files = []
        for sdir in search_dirs:
            if os.path.exists(sdir):
                found = glob.glob(os.path.join(sdir, "*.wav")) + glob.glob(os.path.join(sdir, "*.mp3"))
                if found:
                    audio_files = found
                    break
        if audio_files:
            audio_path = random.choice(audio_files)
            print(f"Selected [{platform.upper()}] audio track: {os.path.basename(audio_path)}")

    if audio_path and os.path.exists(audio_path):
        try:
            audio_clip = AudioFileClip(audio_path)
            # Cap long audio tracks (e.g. full songs from Pixabay) to a punchy 15 seconds
            if audio_clip.duration > 18.0:
                audio_clip = audio_clip.subclipped(0, 15.0)
            duration = round(audio_clip.duration, 2)
            print(f"Auto-adapting video reel duration to match audio length: {duration}s ({os.path.basename(audio_path)})")
        except Exception as e:
            print(f"Audio load warning: {e}")
            duration = DURATION
    else:
        duration = DURATION
        print(f"No audio file provided; using default duration: {duration}s")

    # 2. Prepare Base Backdrop and Job Card
    base_bg = render_background_base()
    card_img = render_job_card(job_data)
    
    # 3. Header & Static Elements
    header_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(header_img)
    
    # Top Brand Pill with Supersampled Lightning Icon
    font_brand = get_font(FONT_BOLD, 26)
    brand_text = "FRESHERSBRIDGE.IN | DAILY JOBS"
    bb_b = font_brand.getbbox(brand_text)
    bw = (bb_b[2] - bb_b[0]) + 75
    bh = (bb_b[3] - bb_b[1]) + 24
    bx = (WIDTH - bw) // 2
    by = 105
    hdraw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=20, fill=(30, 58, 138, 230), outline=(56, 189, 248, 255), width=2)
    icon_lightning = render_supersampled_icon("lightning", target_size=26, bg_color=(37, 99, 235), fg_color="#38bdf8")
    header_img.paste(icon_lightning, (bx + 14, by + (bh - 26) // 2), icon_lightning)
    hdraw.text((bx + 48, by + 12 - bb_b[1]), brand_text, font=font_brand, fill="#ffffff")

    # Attention Title
    font_alert = get_font(FONT_HEAVY, 52)
    alert_text = "OFF-CAMPUS HIRING 2026!"
    ab = font_alert.getbbox(alert_text)
    hdraw.text(((WIDTH - (ab[2] - ab[0])) // 2, 190), alert_text, font=font_alert, fill="#facc15")
    
    # Subhead
    font_sub = get_font(FONT_REGULAR, 30)
    sub_text = "Immediate Openings for Engineering & Graduates"
    sb = font_sub.getbbox(sub_text)
    hdraw.text(((WIDTH - (sb[2] - sb[0])) // 2, 260), sub_text, font=font_sub, fill="#94a3b8")

    # Bottom Viral CTA Banner (y: 1480 to 1840)
    cta_box_y = 1475
    cta_box_w = 960
    cta_box_h = 320
    cta_box_x = 60
    
    hdraw.rounded_rectangle([cta_box_x, cta_box_y, cta_box_x + cta_box_w, cta_box_y + cta_box_h],
                            radius=28, fill=(17, 24, 39, 240), outline=(245, 158, 11, 255), width=2)
    
    font_cta_bold = get_font(FONT_BOLD, 34)
    font_cta_sub = get_font(FONT_REGULAR, 28)
    font_dm_hook = get_font(FONT_HEAVY, 34)

    if platform.lower() == "youtube":
        # YouTube Shorts specific CTA (Points directly to Comments)
        hdraw.text((cta_box_x + 40, cta_box_y + 35), "DIRECT APPLY LINK PINNED IN COMMENTS!", font=font_dm_hook, fill="#fbbf24")
        hdraw.line([(cta_box_x + 40, cta_box_y + 90), (cta_box_x + cta_box_w - 40, cta_box_y + 90)], fill=(75, 85, 99, 180), width=1)
        
        icon_cta_arrow1 = render_supersampled_icon("arrow", target_size=24, bg_color=(14, 165, 233), fg_color="#ffffff")
        header_img.paste(icon_cta_arrow1, (cta_box_x + 36, cta_box_y + 118), icon_cta_arrow1)
        hdraw.text((cta_box_x + 72, cta_box_y + 115), "Apply Link is active on: FreshersBridge.in", font=font_cta_bold, fill="#ffffff")

        icon_cta_arrow2 = render_supersampled_icon("arrow", target_size=22, bg_color=(56, 189, 248), fg_color="#ffffff")
        header_img.paste(icon_cta_arrow2, (cta_box_x + 38, cta_box_y + 178), icon_cta_arrow2)
        hdraw.text((cta_box_x + 72, cta_box_y + 175), "Check Top Pinned Comment for Direct Apply Link", font=font_cta_sub, fill="#38bdf8")

        icon_cta_star = render_supersampled_icon("star", target_size=22, bg_color=(132, 204, 22), fg_color="#ffffff")
        header_img.paste(icon_cta_star, (cta_box_x + 38, cta_box_y + 233), icon_cta_star)
        hdraw.text((cta_box_x + 72, cta_box_y + 230), "Save this Short & Share with friends who need a job!", font=font_cta_sub, fill="#a3e635")
    else:
        # Instagram/Facebook specific CTA (DMs & Stories)
        hdraw.text((cta_box_x + 40, cta_box_y + 35), "COMMENT 'APPLY' TO GET DIRECT LINK IN DM!", font=font_dm_hook, fill="#fbbf24")
        hdraw.line([(cta_box_x + 40, cta_box_y + 90), (cta_box_x + cta_box_w - 40, cta_box_y + 90)], fill=(75, 85, 99, 180), width=1)
        
        icon_cta_arrow1 = render_supersampled_icon("arrow", target_size=24, bg_color=(14, 165, 233), fg_color="#ffffff")
        header_img.paste(icon_cta_arrow1, (cta_box_x + 36, cta_box_y + 118), icon_cta_arrow1)
        hdraw.text((cta_box_x + 72, cta_box_y + 115), "Apply Link is active on: FreshersBridge.in", font=font_cta_bold, fill="#ffffff")

        icon_cta_arrow2 = render_supersampled_icon("arrow", target_size=22, bg_color=(56, 189, 248), fg_color="#ffffff")
        header_img.paste(icon_cta_arrow2, (cta_box_x + 38, cta_box_y + 178), icon_cta_arrow2)
        hdraw.text((cta_box_x + 72, cta_box_y + 175), "Link in Bio & Instagram Stories (Direct Apply)", font=font_cta_sub, fill="#38bdf8")

        icon_cta_star = render_supersampled_icon("star", target_size=22, bg_color=(132, 204, 22), fg_color="#ffffff")
        header_img.paste(icon_cta_star, (cta_box_x + 38, cta_box_y + 233), icon_cta_star)
        hdraw.text((cta_box_x + 72, cta_box_y + 230), "Save this Reel & Share with friends who need a job!", font=font_cta_sub, fill="#a3e635")

    # Composite static frame
    static_frame = base_bg.copy().convert("RGBA")
    static_frame = Image.alpha_composite(static_frame, header_img)

    # 4. Dynamic Frame Rendering Function for MoviePy
    target_card_x = 60
    target_card_y = 355

    def make_frame(t):
        frame = static_frame.copy()
        
        # Entrance Animation (0 to 0.55s): Card slides up with ease-out cubic
        if t < 0.55:
            progress = t / 0.55
            ease = 1.0 - math.pow(1.0 - progress, 3)
            current_y = int(target_card_y + (1.0 - ease) * 160)
        else:
            current_y = target_card_y

        # Paste the Card onto the frame
        frame.paste(card_img, (target_card_x, current_y), card_img)

        # Dynamic overlay (Pulse + Progress Bar)
        draw_dynamic = ImageDraw.Draw(frame)

        # Top Right Live Pulse Dot
        pulse = 0.5 + 0.5 * math.sin(t * 7.0)
        pulse_r = int(12 + 4 * pulse)
        dot_x, dot_y = WIDTH - 80, 52
        draw_dynamic.ellipse([dot_x - pulse_r, dot_y - pulse_r, dot_x + pulse_r, dot_y + pulse_r], fill=(239, 68, 68, int(150 + 105 * pulse)))
        font_live = get_font(FONT_HEAVY, 22)
        draw_dynamic.text((WIDTH - 165, 40), "LIVE", font=font_live, fill="#ef4444")

        # Bottom Progress Bar dynamically timed to exact audio duration
        bar_y = 1885
        bar_h = 10
        draw_dynamic.rectangle([0, bar_y, WIDTH, bar_y + bar_h], fill=(30, 41, 59, 220))
        bar_progress = min(max(t / duration, 0.0), 1.0)
        draw_dynamic.rectangle([0, bar_y, int(WIDTH * bar_progress), bar_y + bar_h], fill=(56, 189, 248, 255))

        return np.array(frame.convert("RGB"))

    # Save Cover Thumbnail at t=min(1.8, duration / 2)
    cover_time = min(1.8, duration / 2.0)
    cover_np = make_frame(cover_time)
    try:
        if os.path.exists(cover_image_path):
            try:
                os.remove(cover_image_path)
            except Exception:
                pass
        Image.fromarray(cover_np).save(cover_image_path, quality=95)
        print(f"Saved Cover Thumbnail: {cover_image_path}")
    except Exception as e:
        alt_cover = cover_image_path.replace(".png", "_v2.png")
        Image.fromarray(cover_np).save(alt_cover, quality=95)
        cover_image_path = alt_cover
        print(f"Saved Cover Thumbnail (alt): {cover_image_path}")

    # Save Social Caption & Hashtags
    caption_text = generate_social_caption(job_data, platform=platform)
    try:
        with open(caption_path, "w", encoding="utf-8") as f:
            f.write(caption_text)
        print(f"Saved Social Caption: {caption_path}")
    except Exception as e:
        print(f"Caption save warning: {e}")

    # 5. Generate Video Clip with Exact Audio Duration
    clip = VideoClip(make_frame, duration=duration)
    if audio_clip:
        clip = clip.with_audio(audio_clip)

    # 6. Render MP4
    print(f"Rendering {duration}s 9:16 Reel ({output_filename})...")
    clip.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio_codec="aac" if clip.audio else None,
        preset="fast",
        logger="bar"
    )
    print(f"Completed Video Reel: {output_path} ({duration}s)")
    return output_path, cover_image_path, caption_path

def get_jobs_from_csv(count=1):
    """Fetches top freshest jobs from the scraper output CSV."""
    csv_path = os.path.join(OUTPUT_DIR, "latest_freshersbridge_jobs.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            if not df.empty:
                # Filter for major recognizable companies first
                pattern = "Microsoft|Google|TCS|Accenture|Infosys|Amazon|Wipro|Cognizant|Deloitte|IBM"
                top_df = df[df["company"].astype(str).str.contains(pattern, case=False, na=False)]
                if not top_df.empty:
                    jobs = [row.to_dict() for _, row in top_df.head(count).iterrows()]
                    return jobs
                return [row.to_dict() for _, row in df.head(count).iterrows()]
        except Exception as e:
            print(f"Error reading jobs CSV: {e}")

    return [{
        "title": "Associate Software Engineer",
        "company": "Accenture",
        "salary": "₹4.5 - ₹6.5 LPA",
        "location": "Bangalore / Hyderabad / Pune",
        "eligibility": "B.E / B.Tech / MCA (2024 / 2025 / 2026)",
        "skills": "Java, Python, Cloud Computing, SQL, Agile",
        "apply_url": "https://freshersbridge.in"
    }]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Social Reels/Shorts for FreshersBridge Jobs")
    parser.add_argument("--count", type=int, default=1, help="Number of job reels to generate")
    parser.add_argument("--publish-youtube", action="store_true", help="Auto-publish generated reels to YouTube Shorts")
    parser.add_argument("--privacy", type=str, default="public", choices=["public", "unlisted", "private"], help="Privacy status on YouTube")
    args = parser.parse_args()

    jobs = get_jobs_from_csv(count=args.count)
    print(f"Found {len(jobs)} jobs to generate reels for.")

    for i, job in enumerate(jobs):
        company_clean = "".join(c for c in str(job.get("company", "job")) if c.isalnum()).lower()
        filename = f"{company_clean}_hiring_reel.mp4"
        out_video, out_cover, out_caption = create_video_reel(job, output_filename=filename)

        if args.publish_youtube:
            try:
                from youtube_shorts_publisher import upload_short
                company_name = str(job.get("company", "Company")).strip()
                title = f"🚨 {company_name} is Hiring Freshers 2026! 💼 #Shorts"
                with open(out_caption, "r", encoding="utf-8") as f:
                    caption_content = f.read()
                upload_short(out_video, title=title, description=caption_content, privacy_status=args.privacy)
            except Exception as e:
                print(f"YouTube upload error: {e}")
