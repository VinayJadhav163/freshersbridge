import os
from PIL import Image, ImageDraw, ImageFont

def generate_clean_minimal_banners():
    W, H = 2256, 382  # 2x Retina
    
    font_line1 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
    font_line2 = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 64)
    
    line1 = "Connecting ambitious freshers"
    line2 = "with verified tech drives."
    
    # Safe clearance from logo box on bottom-left
    text_x = 600
    
    # =========================================================================
    # OPTION 1: Pure Clean Minimalist White (No pill, No blurry glow, 100% Crisp)
    # =========================================================================
    bg_light = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    draw_l = ImageDraw.Draw(bg_light)
    
    # Ultra-clean subtle vertical gradient: pure #FFFFFF to very light crisp slate #F8FAFC
    for y in range(H):
        factor = (y / H)
        r = int(255 - (255 - 248) * factor)
        g = int(255 - (255 - 250) * factor)
        b = int(255 - (255 - 252) * factor)
        draw_l.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Crisp top accent line (4px) with vibrant blue/purple gradient
    top_line = Image.new('RGBA', (W, 4), (0, 0, 0, 0))
    top_draw = ImageDraw.Draw(top_line)
    for x in range(W):
        t = x / W
        r = int(37 * (1 - t) + 124 * t)
        g = int(99 * (1 - t) + 58 * t)
        b = int(235 * (1 - t) + 237 * t)
        top_draw.line([(x, 0), (x, 4)], fill=(r, g, b, 255))
    bg_light.alpha_composite(top_line, (0, 0))
    
    overlay_l = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    odl = ImageDraw.Draw(overlay_l)
    
    b1 = odl.textbbox((0, 0), line1, font=font_line1)
    h1 = b1[3] - b1[1]
    b2 = odl.textbbox((0, 0), line2, font=font_line2)
    h2 = b2[3] - b2[1]
    
    line_gap = 14
    total_h = h1 + line_gap + h2
    start_y = int((H - total_h) / 2) - 4
    
    # Deep slate line 1, Royal Blue line 2
    odl.text((text_x, start_y), line1, fill=(15, 23, 42, 255), font=font_line1)
    odl.text((text_x, start_y + h1 + line_gap), line2, fill=(37, 99, 235, 255), font=font_line2)
    
    bg_light.alpha_composite(overlay_l)
    bg_light.convert('RGB').save('public/linkedin_banner_clean_white.png', quality=100)
    
    # Also save as linkedin_banner_bold_light.png for convenience
    bg_light.convert('RGB').save('public/linkedin_banner_bold_light.png', quality=100)
    print("Saved: public/linkedin_banner_clean_white.png")
    
    # =========================================================================
    # OPTION 2: Pure Clean Minimalist Dark (No pill, subtle ambient depth)
    # =========================================================================
    bg_dark = Image.new('RGBA', (W, H), (10, 15, 26, 255))
    draw_d = ImageDraw.Draw(bg_dark)
    
    for x in range(W):
        t = x / W
        r = int(10 + (18 - 10) * t)
        g = int(15 + (25 - 15) * t)
        b = int(26 + (42 - 26) * t)
        draw_d.line([(x, 0), (x, H)], fill=(r, g, b, 255))
        
    for x in range(W):
        t = x / W
        r = int(37 * (1 - t) + 147 * t)
        g = int(99 * (1 - t) + 51 * t)
        b = int(235 * (1 - t) + 234 * t)
        draw_d.line([(x, 0), (x, 4)], fill=(r, g, b, 255))
        
    overlay_d = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    odd = ImageDraw.Draw(overlay_d)
    
    odd.text((text_x, start_y), line1, fill=(255, 255, 255, 255), font=font_line1)
    odd.text((text_x, start_y + h1 + line_gap), line2, fill=(147, 197, 253, 255), font=font_line2)
    
    bg_dark.alpha_composite(overlay_d)
    bg_dark.convert('RGB').save('public/linkedin_banner_bold_dark.png', quality=100)
    print("Saved: public/linkedin_banner_bold_dark.png")

if __name__ == '__main__':
    generate_clean_minimal_banners()
