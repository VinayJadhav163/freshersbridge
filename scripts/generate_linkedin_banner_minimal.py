import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def generate_minimal_linkedin_banners():
    W, H = 2256, 382 # 2x Retina (1128x191)
    
    # Fonts
    font_hero = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 58)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 27)
    font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
    
    # =========================================================================
    # OPTION 1: Ultra-Clean Modern Studio (Light, Minimalist, Silicon Valley style)
    # No duplicate logo! No duplicate "FreshersBridge" name!
    # =========================================================================
    bg1 = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    draw1 = ImageDraw.Draw(bg1)
    
    # Very subtle, premium light gradient: pure #FFFFFF to soft airy blue #F0F7FF
    for x in range(W):
        t = x / W
        r = int(255 - (255 - 240) * t)
        g = int(255 - (255 - 247) * t)
        b = int(255 - (255 - 255) * t)
        draw1.line([(x, 0), (x, H)], fill=(r, g, b, 255))
        
    # Subtle top accent strip (electric blue to purple)
    for x in range(W):
        t = x / W
        r = int(37 * (1 - t) + 124 * t)
        g = int(99 * (1 - t) + 58 * t)
        b = int(235 * (1 - t) + 237 * t)
        draw1.line([(x, 0), (x, 4)], fill=(r, g, b, 255))
        
    # Decorative subtle organic ambient blur on the far right
    glow = Image.new('RGBA', (600, 300), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse([50, 20, 550, 280], fill=(59, 130, 246, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(50))
    bg1.alpha_composite(glow, (W - 650, 40))
    
    overlay1 = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od1 = ImageDraw.Draw(overlay1)
    
    # Start text with safe clearance from bottom-left logo (x = 340)
    text_x = 320
    
    # Eyebrow tag: VERIFIED OFF-CAMPUS HIRING
    tag_text = "OFF-CAMPUS TECH HIRING • 2024, 2025 & 2026 BATCH"
    od1.text((text_x, 80), tag_text, fill=(37, 99, 235, 255), font=font_badge)
    
    # Hero Heading: Connecting Ambitious Freshers with Verified Tech Drives
    hero_text = "Connecting ambitious freshers with verified tech drives."
    od1.text((text_x, 120), hero_text, fill=(15, 23, 42, 255), font=font_hero)
    
    # Subtitle: Direct official applications, syllabus breakdowns & zero consultancies
    sub_text = "Direct official career portals • Free ATS resume builder • Zero fake consultancies"
    od1.text((text_x, 204), sub_text, fill=(71, 85, 105, 255), font=font_sub)
    
    # Clean website pill on far right
    site_text = "freshersbridge.in"
    sb = od1.textbbox((0, 0), site_text, font=font_badge)
    sw = sb[2] - sb[0]
    site_x = W - sw - 90
    site_y = 150
    # Soft pill container
    od1.rounded_rectangle([site_x - 20, site_y - 10, site_x + sw + 20, site_y + 36], radius=20, fill=(255, 255, 255, 220), outline=(203, 213, 225, 255), width=1)
    od1.text((site_x, site_y), site_text, fill=(15, 23, 42, 255), font=font_badge)
    
    bg1.alpha_composite(overlay1)
    bg1.convert('RGB').save('public/linkedin_banner_minimal_light.png', quality=98)
    
    # =========================================================================
    # OPTION 2: Premium Dark Tech Contrast (Linear / Stripe style)
    # Creates dramatic high contrast behind the white logo!
    # =========================================================================
    bg2 = Image.new('RGBA', (W, H), (11, 15, 25, 255)) # Deep slate navy #0B0F19
    draw2 = ImageDraw.Draw(bg2)
    
    # Deep subtle gradient from left #0B0F19 to right #141A2E
    for x in range(W):
        t = x / W
        r = int(11 + (20 - 11) * t)
        g = int(15 + (26 - 15) * t)
        b = int(25 + (46 - 25) * t)
        draw2.line([(x, 0), (x, H)], fill=(r, g, b, 255))
        
    # Ambient glowing light orbs on the right
    orb1 = Image.new('RGBA', (500, 300), (0, 0, 0, 0))
    o_draw1 = ImageDraw.Draw(orb1)
    o_draw1.ellipse([50, 20, 450, 280], fill=(56, 189, 248, 40)) # Cyan glow
    orb1 = orb1.filter(ImageFilter.GaussianBlur(60))
    bg2.alpha_composite(orb1, (W - 550, 20))
    
    orb2 = Image.new('RGBA', (500, 300), (0, 0, 0, 0))
    o_draw2 = ImageDraw.Draw(orb2)
    o_draw2.ellipse([50, 20, 450, 280], fill=(99, 102, 241, 45)) # Indigo glow
    orb2 = orb2.filter(ImageFilter.GaussianBlur(70))
    bg2.alpha_composite(orb2, (W - 850, 40))
    
    # Top accent line
    for x in range(W):
        t = x / W
        r = int(37 * (1 - t) + 147 * t)
        g = int(99 * (1 - t) + 51 * t)
        b = int(235 * (1 - t) + 234 * t)
        draw2.line([(x, 0), (x, 4)], fill=(r, g, b, 255))
        
    overlay2 = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    od2 = ImageDraw.Draw(overlay2)
    
    od2.text((text_x, 80), tag_text, fill=(56, 189, 248, 255), font=font_badge)
    od2.text((text_x, 120), hero_text, fill=(255, 255, 255, 255), font=font_hero)
    od2.text((text_x, 204), sub_text, fill=(148, 163, 184, 255), font=font_sub)
    
    # Dark site pill
    od2.rounded_rectangle([site_x - 20, site_y - 10, site_x + sw + 20, site_y + 36], radius=20, fill=(255, 255, 255, 20), outline=(255, 255, 255, 40), width=1)
    od2.text((site_x, site_y), site_text, fill=(255, 255, 255, 255), font=font_badge)
    
    bg2.alpha_composite(overlay2)
    bg2.convert('RGB').save('public/linkedin_banner_minimal_dark.png', quality=98)
    
    print("Generated both minimal banners successfully.")

if __name__ == '__main__':
    generate_minimal_linkedin_banners()
