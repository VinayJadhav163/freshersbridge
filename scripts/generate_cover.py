import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Facebook HD Max Crisp Resolution
W, H = 2048, 780

def create_crisp_background(w, h):
    # Pure clean crisp canvas with subtle high-contrast gradient
    bg = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(bg)
    
    # Ultra-clean subtle vertical gradient: pure #FFFFFF top to very light crisp slate #F8FAFC at bottom
    for y in range(h):
        factor = (y / h)
        r = int(255 - (255 - 248) * factor)
        g = int(255 - (255 - 250) * factor)
        b = int(255 - (255 - 252) * factor)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Crisp modern dot grid - sharp dots, no haze
    grid_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    spacing = 44
    dot_r = 1.5
    for x in range(24, w, spacing):
        for y in range(24, h, spacing):
            # Sharp discrete dots, only on outer sides and top/bottom to keep center 100% crystal clear
            dx = abs(x - w/2) / (w/2)
            dy = abs(y - h/2) / (h/2)
            if dx > 0.35 or dy > 0.4:
                grid_draw.ellipse(
                    [(x - dot_r, y - dot_r), (x + dot_r, y + dot_r)],
                    fill=(203, 213, 225, 140)
                )
    bg.alpha_composite(grid_layer)
    
    # Crisp top accent line (4px) with vibrant blue/purple gradient
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

def draw_centered_text_in_box(draw_obj, box, text, font, fill):
    """Draws text perfectly centered horizontally and vertically inside a bounding box."""
    x1, y1, x2, y2 = box
    box_w = x2 - x1
    box_h = y2 - y1
    bbox = draw_obj.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    tx = x1 + (box_w - text_w) / 2 - bbox[0]
    ty = y1 + (box_h - text_h) / 2 - bbox[1]
    draw_obj.text((tx, ty), text, fill=fill, font=font)

def generate_banner():
    img = create_crisp_background(W, H)
    
    # High-DPI Sharp Fonts
    font_bold_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 72)
    font_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 28)
    font_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 21)
    font_eyebrow = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 14)
    font_cta = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 23)
    font_trust = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
    
    # 1. ICON: Crop emblem and size proportionally to match font height
    raw_icon = Image.open('public/icon.png').convert('RGBA')
    bbox = raw_icon.getbbox()
    cropped_icon = raw_icon.crop(bbox)
    orig_w, orig_h = cropped_icon.size
    aspect = orig_w / orig_h # 2.12448
    
    # Scaled down to match the visual height of the 72pt font (~72px)
    icon_h = 74
    icon_w = int(round(icon_h * aspect)) # ~157 px
    icon_resized = cropped_icon.resize((icon_w, icon_h), Image.Resampling.LANCZOS)
    
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 2. Eyebrow Badge - Fixed optical padding
    eyebrow_text = "OFFICIAL OFF-CAMPUS PLATFORM"
    eb_bbox = draw.textbbox((0, 0), eyebrow_text, font=font_eyebrow)
    eb_w = eb_bbox[2] - eb_bbox[0]
    eb_h = eb_bbox[3] - eb_bbox[1]
    
    # Balanced padding: 22px horizontal, 10px vertical (height 36px)
    pill_w = eb_w + 44
    pill_h = 36
    pill_y = 65
    eb_box = ((W - pill_w) / 2, pill_y, (W + pill_w) / 2, pill_y + pill_h)
    
    draw_pill(draw, eb_box, bg_color=(238, 242, 255, 255), border_color=(199, 210, 254, 255), border_width=1.5)
    draw_centered_text_in_box(draw, eb_box, eyebrow_text, font=font_eyebrow, fill=(67, 56, 202, 255))
    
    # 3. Main Brand Lockup: [Cropped Icon] + "FreshersBridge"
    title_text = "FreshersBridge"
    tb_bbox = draw.textbbox((0, 0), title_text, font=font_bold_title)
    tb_w = tb_bbox[2] - tb_bbox[0]
    tb_h = tb_bbox[3] - tb_bbox[1]
    
    gap = 24
    total_lockup_w = icon_w + gap + tb_w
    lockup_x = (W - total_lockup_w) / 2
    lockup_y = 138
    
    # Vertically align icon with optical center of text
    # text optical center: lockup_y + tb_bbox[1] + tb_h / 2
    text_center_y = lockup_y + tb_bbox[1] + tb_h / 2
    icon_y = int(round(text_center_y - icon_h / 2))
    
    # Composite the cropped emblem
    img.alpha_composite(overlay)
    img.alpha_composite(icon_resized, (int(round(lockup_x)), icon_y))
    
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Deep crisp navy title
    draw.text((lockup_x + icon_w + gap, lockup_y), title_text, fill=(11, 15, 25, 255), font=font_bold_title)
    
    # 4. Subtitle
    sub_text = "India's Dedicated Off-Campus Job Portal for Freshers"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((W - sub_w)/2, 254), sub_text, fill=(30, 41, 59, 255), font=font_sub)
    
    # 5. Three Feature Badges
    badges = [
        ("100% Verified Drives Daily", (16, 185, 129)),  # Emerald
        ("Free ATS Resume Builder", (37, 99, 235)),      # Royal Blue
        ("Direct Official Apply Links", (147, 51, 234))   # Purple
    ]
    
    badge_boxes_w = []
    pad_h = 26
    for text, _ in badges:
        bb = draw.textbbox((0, 0), text, font=font_badge)
        tw = bb[2] - bb[0]
        badge_boxes_w.append(tw + pad_h*2 + 24)
        
    badge_gap = 20
    total_badges_w = sum(badge_boxes_w) + badge_gap * (len(badges) - 1)
    badge_start_x = (W - total_badges_w) / 2
    badge_y = 346
    badge_h = 60
    
    cur_x = badge_start_x
    for i, (text, dot_color) in enumerate(badges):
        bw = badge_boxes_w[i]
        box = (cur_x, badge_y, cur_x + bw, badge_y + badge_h)
        
        # Crisp subtle shadow
        shadow_box = (cur_x, badge_y + 3, cur_x + bw, badge_y + badge_h + 3)
        draw_pill(draw, shadow_box, bg_color=(15, 23, 42, 18), radius=30)
        
        # Card Body
        draw_pill(draw, box, bg_color=(255, 255, 255, 255), border_color=(203, 213, 225, 255), border_width=1.5, radius=30)
        
        # Saturated color dot with crisp border
        dot_r = 5.5
        dot_x = cur_x + pad_h
        dot_y = badge_y + badge_h / 2
        # Outer ring
        draw.ellipse(
            [(dot_x - dot_r - 3, dot_y - dot_r - 3), (dot_x + dot_r + 3, dot_y + dot_r + 3)],
            fill=dot_color + (40,)
        )
        # Inner dot
        draw.ellipse(
            [(dot_x - dot_r, dot_y - dot_r), (dot_x + dot_r, dot_y + dot_r)],
            fill=dot_color + (255,)
        )
        
        # Vertically center badge text
        bb = draw.textbbox((0, 0), text, font=font_badge)
        b_th = bb[3] - bb[1]
        text_y_badge = badge_y + (badge_h - b_th) / 2 - bb[1]
        draw.text((dot_x + dot_r + 13, text_y_badge), text, fill=(15, 23, 42, 255), font=font_badge)
        cur_x += bw + badge_gap
        
    # 6. High-Visibility CTA Button: "Visit freshersbridge.in  →"
    cta_text = "Visit freshersbridge.in  →"
    cta_bbox = draw.textbbox((0, 0), cta_text, font=font_cta)
    cta_tw = cta_bbox[2] - cta_bbox[0]
    cta_th = cta_bbox[3] - cta_bbox[1]
    
    cta_pad_x = 40
    cta_pad_y = 16
    cta_w = cta_tw + cta_pad_x * 2
    cta_h = cta_th + cta_pad_y * 2
    cta_y = 472
    cta_box = ((W - cta_w)/2, cta_y, (W + cta_w)/2, cta_y + cta_h)
    
    # Shadow for CTA
    cta_shadow = ((W - cta_w)/2, cta_y + 4, (W + cta_w)/2, cta_y + cta_h + 4)
    draw_pill(draw, cta_shadow, bg_color=(29, 78, 216, 65), radius=35)
    # Vibrant Royal Blue Button
    draw_pill(draw, cta_box, bg_color=(37, 99, 235, 255), border_color=(29, 78, 216, 255), border_width=1.5, radius=35)
    draw_centered_text_in_box(draw, cta_box, cta_text, font=font_cta, fill=(255, 255, 255, 255))
    
    # 7. Flank Cards for wide desktop balance
    font_card_title = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
    font_card_sub = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 14)
    font_card_val = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 20)
    
    # Left Card
    left_card_box = (80, 220, 340, 360)
    draw_pill(draw, (left_card_box[0], left_card_box[1]+4, left_card_box[2], left_card_box[3]+4), bg_color=(15, 23, 42, 16), radius=20)
    draw_pill(draw, left_card_box, bg_color=(255, 255, 255, 255), border_color=(203, 213, 225, 255), border_width=1.5, radius=20)
    draw.ellipse([(110, 246), (124, 260)], fill=(16, 185, 129, 255))
    draw.text((134, 245), "FRESH OFF-CAMPUS", fill=(71, 85, 105, 255), font=font_card_title)
    draw.text((110, 282), "50+ Drives Added", fill=(15, 23, 42, 255), font=font_card_val)
    draw.text((110, 314), "Updated 10 mins ago", fill=(100, 116, 139, 255), font=font_card_sub)
    
    # Right Card
    right_card_box = (1708, 220, 1968, 360)
    draw_pill(draw, (right_card_box[0], right_card_box[1]+4, right_card_box[2], right_card_box[3]+4), bg_color=(15, 23, 42, 16), radius=20)
    draw_pill(draw, right_card_box, bg_color=(255, 255, 255, 255), border_color=(203, 213, 225, 255), border_width=1.5, radius=20)
    draw.ellipse([(1738, 246), (1752, 260)], fill=(37, 99, 235, 255))
    draw.text((1762, 245), "ATS RESUME SCORE", fill=(71, 85, 105, 255), font=font_card_title)
    draw.text((1738, 282), "98% Pass Rate", fill=(15, 23, 42, 255), font=font_card_val)
    draw.text((1738, 314), "Recruiter Approved Format", fill=(100, 116, 139, 255), font=font_card_sub)

    # 8. Safe Footer Micro-trust
    trust_text = "•   0% REGISTRATION FEES   •   ZERO SPAM   •   100% FREE FOR STUDENTS"
    tr_bbox = draw.textbbox((0, 0), trust_text, font=font_trust)
    tr_w = tr_bbox[2] - tr_bbox[0]
    draw.text(((W - tr_w)/2, 595), trust_text, fill=(71, 85, 105, 255), font=font_trust)
    
    img.alpha_composite(overlay)
    
    # Save output as pristine uncompressed 2048x780 PNG
    output_path = 'public/facebook_cover_white.png'
    img.convert('RGB').save(output_path, 'PNG', optimize=True)
    print(f"Generated crystal clear {output_path} at {W}x{H}!")

if __name__ == '__main__':
    generate_banner()
