import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

def generate_smoke_variants():
    W, H = 2256, 382  # 2x Retina
    
    smoke_path = r'C:\Users\jadha\.gemini\antigravity-ide\brain\9cfd5353-b49b-44be-a7f3-1a4ebb6847cb\blue_smoke_bg_1789840025853.jpg'
    smoke_raw = Image.open(smoke_path).convert('RGBA')
    
    target_smoke_h = int(H * 1.35)
    smoke_aspect = smoke_raw.width / smoke_raw.height
    target_smoke_w = int(target_smoke_h * smoke_aspect)
    
    smoke_resized = smoke_raw.resize((target_smoke_w, target_smoke_h), Image.Resampling.LANCZOS)
    crop_y = int((target_smoke_h - H) / 2)
    smoke_cropped = smoke_resized.crop((0, crop_y, target_smoke_w, crop_y + H))
    
    sw, sh = smoke_cropped.size
    fade_len = int(sw * 0.45)
    fade_arr = np.ones((sh, sw), dtype=np.float32)
    for x in range(fade_len):
        fade_arr[:, x] = (x / fade_len) ** 1.5
        
    fade_mask_full = Image.fromarray((fade_arr * 255).astype(np.uint8))
    fade_mask_soft = Image.fromarray((fade_arr * 160).astype(np.uint8)) # softer 60% opacity
    
    smoke_x = W - sw
    
    font_line1 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
    font_line2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
    line1 = "Connecting ambitious freshers"
    line2 = "with verified tech drives."
    text_x = 600
    
    # Top 4px gradient line
    top_line = Image.new('RGBA', (W, 4), (0, 0, 0, 0))
    top_draw = ImageDraw.Draw(top_line)
    for x in range(W):
        t = x / W
        r = int(37 * (1 - t) + 56 * t)
        g = int(99 * (1 - t) + 189 * t)
        b = int(235 * (1 - t) + 248 * t)
        top_draw.line([(x, 0), (x, 4)], fill=(r, g, b, 255))
        
    for name, mask in [('linkedin_banner_smoke.png', fade_mask_full), ('linkedin_banner_smoke_soft.png', fade_mask_soft)]:
        canvas = Image.new('RGBA', (W, H), (255, 255, 255, 255))
        canvas.paste(smoke_cropped, (smoke_x, 0), mask=mask)
        canvas.alpha_composite(top_line, (0, 0))
        
        overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        b1 = draw.textbbox((0, 0), line1, font=font_line1)
        h1 = b1[3] - b1[1]
        b2 = draw.textbbox((0, 0), line2, font=font_line2)
        h2 = b2[3] - b2[1]
        
        line_gap = 14
        total_h = h1 + line_gap + h2
        start_y = int((H - total_h) / 2) - 4
        
        draw.text((text_x, start_y), line1, fill=(15, 23, 42, 255), font=font_line1)
        draw.text((text_x, start_y + h1 + line_gap), line2, fill=(37, 99, 235, 255), font=font_line2)
        
        canvas.alpha_composite(overlay)
        canvas.convert('RGB').save(f'public/{name}', quality=100)
        print(f"Saved: public/{name}")

if __name__ == '__main__':
    generate_smoke_variants()
