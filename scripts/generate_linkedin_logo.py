import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

def generate_crisp_linkedin_logos():
    # 1. Load official high-res emblem
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
    text_clean = text_crop.crop(text_crop.getbbox())
    
    # ========================================================
    # 1. ULTRA-HD 1200 x 1200 (For Crisp Retina & High-DPI Display)
    # LinkedIn accepts up to 8MB and downsamples for Retina
    # ========================================================
    SIZE_HD = 1200
    ew_hd = 840
    eh_hd = int(round(ew_hd / (emblem_clean.width / emblem_clean.height)))
    e_hd = emblem_clean.resize((ew_hd, eh_hd), Image.Resampling.LANCZOS)
    
    tw_hd = 820
    th_hd = int(round(tw_hd / (text_clean.width / text_clean.height)))
    t_hd = text_clean.resize((tw_hd, th_hd), Image.Resampling.LANCZOS)
    
    gap_hd = 46
    total_h_hd = eh_hd + gap_hd + th_hd
    start_y_hd = int(round((SIZE_HD - total_h_hd) / 2)) - 8
    
    hd_canvas = Image.new('RGBA', (SIZE_HD, SIZE_HD), (255, 255, 255, 255))
    hd_canvas.alpha_composite(e_hd, (int((SIZE_HD - ew_hd) / 2), start_y_hd))
    hd_canvas.alpha_composite(t_hd, (int((SIZE_HD - tw_hd) / 2), start_y_hd + eh_hd + gap_hd))
    
    # Save Ultra HD (1200x1200)
    hd_canvas.convert('RGB').save('public/linkedin_logo_ultra_hd.png', quality=100)
    print("Saved: public/linkedin_logo_ultra_hd.png (1200x1200)")
    
    # ========================================================
    # 2. ULTRA-SHARP 300 x 300 (Downsampled from 1200 with UnsharpMask)
    # This prevents the blurry interpolation artifact
    # ========================================================
    SIZE_300 = 300
    # Resize from the 1200 master with high quality Lanczos
    logo_300 = hd_canvas.resize((SIZE_300, SIZE_300), Image.Resampling.LANCZOS)
    
    # Apply subtle unsharp mask filter to restore micro-contrast and edge sharpness
    logo_300_sharp = logo_300.filter(ImageFilter.UnsharpMask(radius=1.2, percent=140, threshold=2))
    logo_300_sharp.convert('RGB').save('public/linkedin_logo_300x300.png', quality=100)
    print("Saved: public/linkedin_logo_300x300.png (300x300 razor sharp)")

if __name__ == '__main__':
    generate_crisp_linkedin_logos()
