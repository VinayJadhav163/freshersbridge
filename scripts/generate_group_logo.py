import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

def generate_group_logos():
    SIZE = 1024
    
    # 1. Load official emblem
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
    
    # 2. Load official typography
    logo = Image.open('public/logo.png').convert('RGBA')
    text_crop = logo.crop((12, 340, 576, 423))
    text_bbox = text_crop.getbbox()
    text_clean = text_crop.crop(text_bbox)
    
    # Common Circle Mask for Previews
    mask_circle = Image.new('L', (SIZE, SIZE), 0)
    draw_mask = ImageDraw.Draw(mask_circle)
    circle_box = (36, 36, SIZE - 36, SIZE - 36)
    draw_mask.ellipse(circle_box, fill=255)
    
    # ==========================================
    # OPTION 1: Balanced Studio Lockup (Clean & Elegant)
    # ==========================================
    ew1 = 660
    eh1 = int(round(ew1 / (emblem_clean.width / emblem_clean.height)))
    e_img1 = emblem_clean.resize((ew1, eh1), Image.Resampling.LANCZOS)
    
    tw1 = 640
    th1 = int(round(tw1 / (text_clean.width / text_clean.height)))
    t_img1 = text_clean.resize((tw1, th1), Image.Resampling.LANCZOS)
    
    gap1 = 40
    total_h1 = eh1 + gap1 + th1
    start_y1 = int(round((SIZE - total_h1) / 2)) - 6
    
    opt1 = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 255))
    opt1.alpha_composite(e_img1, (int((SIZE - ew1) / 2), start_y1))
    opt1.alpha_composite(t_img1, (int((SIZE - tw1) / 2), start_y1 + eh1 + gap1))
    opt1.convert('RGB').save('public/freshersbridge_group_logo_v1.png', quality=98)
    
    prev1 = Image.new('RGBA', (SIZE, SIZE), (241, 245, 249, 255))
    draw_p1 = ImageDraw.Draw(prev1)
    prev1.paste(opt1, (0, 0), mask=mask_circle)
    draw_p1.ellipse(circle_box, outline=(203, 213, 225, 255), width=4)
    prev1.save('public/freshersbridge_group_logo_v1_preview.png')
    
    # ==========================================
    # OPTION 2: High-Visibility Mobile Chat Edition (Larger & Maximum Impact)
    # Optimized to pop out in small 40px chat avatars on WhatsApp & Telegram
    # ==========================================
    ew2 = 720
    eh2 = int(round(ew2 / (emblem_clean.width / emblem_clean.height)))
    e_img2 = emblem_clean.resize((ew2, eh2), Image.Resampling.LANCZOS)
    
    tw2 = 700
    th2 = int(round(tw2 / (text_clean.width / text_clean.height)))
    t_img2 = text_clean.resize((tw2, th2), Image.Resampling.LANCZOS)
    
    gap2 = 36
    total_h2 = eh2 + gap2 + th2
    start_y2 = int(round((SIZE - total_h2) / 2)) - 8
    
    opt2 = Image.new('RGBA', (SIZE, SIZE), (255, 255, 255, 255))
    opt2.alpha_composite(e_img2, (int((SIZE - ew2) / 2), start_y2))
    opt2.alpha_composite(t_img2, (int((SIZE - tw2) / 2), start_y2 + eh2 + gap2))
    opt2.convert('RGB').save('public/freshersbridge_group_logo_v2.png', quality=98)
    
    prev2 = Image.new('RGBA', (SIZE, SIZE), (241, 245, 249, 255))
    draw_p2 = ImageDraw.Draw(prev2)
    prev2.paste(opt2, (0, 0), mask=mask_circle)
    draw_p2.ellipse(circle_box, outline=(203, 213, 225, 255), width=4)
    prev2.save('public/freshersbridge_group_logo_v2_preview.png')
    
    # Also save the primary default as freshersbridge_group_logo.png
    opt2.convert('RGB').save('public/freshersbridge_group_logo.png', quality=98)
    
    print("Successfully generated all logo options.")

if __name__ == '__main__':
    generate_group_logos()
