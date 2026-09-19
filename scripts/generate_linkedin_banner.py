import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def create_crisp_canvas(w, h):
    bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(bg)
    
    # Ultra-clean subtle horizontal gradient
    for x in range(w):
        factor = (x / w)
        r = int(255 - (255 - 246) * factor)
        g = int(255 - (255 - 249) * factor)
        b = int(255 - (255 - 255) * factor)
        draw.line([(x, 0), (x, h)], fill=(r, g, b, 255))
        
    # Subtle modern dot grid on right & top
    grid_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    spacing = 34
    dot_r = 1.5
    for x in range(24, w, spacing):
        for y in range(24, h, spacing):
            if x > w * 0.38:
                grid_draw.ellipse(
                    [(x - dot_r, y - dot_r), (x + dot_r, y + dot_r)],
                    fill=(203, 213, 225, 110)
                )
    bg.alpha_composite(grid_layer)
    
    # Top vibrant accent line (5px) with blue to purple gradient
    top_line = Image.new('RGBA', (w, 5), (0, 0, 0, 0))
    top_draw = ImageDraw.Draw(top_line)
    for x in range(w):
        t = x / w
        r = int(37 * (1 - t) + 147 * t)
        g = int(99 * (1 - t) + 51 * t)
        b = int(235 * (1 - t) + 234 * t)
        top_draw.line([(x, 0), (x, 5)], fill=(r, g, b, 255))
    bg.alpha_composite(top_line, (0, 0))
    
    return bg

def draw_pill(draw_obj, box, bg_color, border_color=None, border_width=1, radius=None):
    x1, y1, x2, y2 = [int(round(v)) for v in box]
    if radius is None:
        radius = int(round((y2 - y1) / 2))
    else:
        radius = int(round(radius))
    draw_obj.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=bg_color, outline=border_color, width=int(border_width))

def generate_linkedin_banner():
    # 2x Retina: 2256 x 382
    W, H = 2256, 382
    img = create_crisp_canvas(W, H)
    
    font_bold_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 30)
    font_pill = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
    font_cta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 24)
    
    # Load official emblem
    im_insta = Image.open('public/instagram_profile_white.png').convert('RGB')
    arr = np.array(im_insta)
    mask = (arr[:, :, 0] < 250) | (arr[:, :, 1] < 250) | (arr[:, :, 2] < 250)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    bbox_emblem = (cols[0], rows[0], cols[-1] + 1, rows[-1] + 1)
    
    emblem_rgb = im_insta.crop(bbox_emblem)
    emblem_arr = np.array(emblem_rgb.convert('RGBA'))
    diff = 255 - np.mean(emblem_arr[:, :, :3], axis=2)
    alpha = np.clip(diff * 3.5, 0, 255).astype(np.uint8)
    emblem_arr[:, :, 3] = alpha
    emblem_clean = Image.fromarray(emblem_arr)
    
    # Left margin 380px gives generous clearance for company logo overlay on LinkedIn desktop
    content_x = 380
    
    eh = 124
    ew = int(round(eh * (emblem_clean.width / emblem_clean.height)))
    emblem_resized = emblem_clean.resize((ew, eh), Image.Resampling.LANCZOS)
    emblem_y = int((H - eh) / 2) - 8
    img.alpha_composite(emblem_resized, (content_x, emblem_y))
    
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    title_x = content_x + ew + 34
    title_y = 86
    draw.text((title_x, title_y), "FreshersBridge", fill=(15, 23, 42, 255), font=font_bold_title)
    
    # Official Badge
    badge_text = "OFFICIAL"
    badge_font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
    bb = draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = bb[2] - bb[0]
    tb = draw.textbbox((0, 0), "FreshersBridge", font=font_bold_title)
    tw = tb[2] - tb[0]
    badge_x = title_x + tw + 20
    badge_box = (badge_x, title_y + 14, badge_x + bw + 24, title_y + 48)
    draw_pill(draw, badge_box, bg_color=(238, 242, 255, 255), border_color=(199, 210, 254, 255), border_width=1.5)
    draw.text((badge_x + 12, title_y + 17), badge_text, fill=(67, 56, 202, 255), font=badge_font)
    
    # Subtitle
    sub_y = title_y + 76
    draw.text((title_x, sub_y), "India's Dedicated Off-Campus Job Portal for 2024, 2025 & 2026 Freshers", fill=(71, 85, 105, 255), font=font_sub)
    
    # Feature Badges with crisp emerald dots
    features = [
        "100% Verified Drives",
        "Direct Apply Links",
        "Free ATS Resume Builder",
        "Daily WhatsApp & Telegram Alerts"
    ]
    cur_px = title_x
    pill_y = sub_y + 54
    for f_text in features:
        fb = draw.textbbox((0, 0), f_text, font=font_pill)
        fw = fb[2] - fb[0]
        # Pill box with dot
        p_w = fw + 46
        p_box = (cur_px, pill_y, cur_px + p_w, pill_y + 38)
        draw_pill(draw, p_box, bg_color=(248, 250, 252, 255), border_color=(226, 232, 240, 255), border_width=1.2)
        
        # Emerald dot
        dot_x = cur_px + 16
        dot_y = pill_y + 19
        draw.ellipse([(dot_x - 4, dot_y - 4), (dot_x + 4, dot_y + 4)], fill=(16, 185, 129, 255))
        
        draw.text((cur_px + 28, pill_y + 7), f_text, fill=(30, 41, 59, 255), font=font_pill)
        cur_px += p_w + 14
        
    # Right-side CTA Button: freshersbridge.in →
    cta_text = "freshersbridge.in  →"
    cb = draw.textbbox((0, 0), cta_text, font=font_cta)
    cw = cb[2] - cb[0]
    cta_x = W - cw - 70
    cta_y = int((H - 58) / 2)
    cta_box = (cta_x, cta_y, cta_x + cw + 46, cta_y + 58)
    
    draw_pill(draw, (cta_x, cta_y + 3, cta_x + cw + 46, cta_y + 61), bg_color=(37, 99, 235, 30), radius=29)
    draw_pill(draw, cta_box, bg_color=(37, 99, 235, 255), border_color=(29, 78, 216, 255), border_width=1, radius=29)
    draw.text((cta_x + 23, cta_y + 13), cta_text, fill=(255, 255, 255, 255), font=font_cta)
    
    img.alpha_composite(overlay)
    
    # Save 2x Retina Version (2256 x 382)
    img.convert('RGB').save('public/linkedin_banner_2x.png', quality=98)
    
    # Save Standard 1x Version (1128 x 191)
    img_1x = img.resize((1128, 191), Image.Resampling.LANCZOS)
    img_1x.convert('RGB').save('public/linkedin_banner.png', quality=98)
    print("Banner generated successfully.")

if __name__ == '__main__':
    generate_linkedin_banner()
