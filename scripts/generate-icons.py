#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_tomato_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    margin = size * 0.1
    tomato_size = size - 2 * margin
    
    # Draw tomato body (red circle)
    tomato_color = (231, 76, 60)  # Tomato red
    center = size // 2
    radius = int(tomato_size // 2)
    
    draw.ellipse(
        [center - radius, center - radius + margin//2, 
         center + radius, center + radius + margin//2],
        fill=tomato_color
    )
    
    # Draw stem (green)
    stem_color = (39, 174, 96)
    stem_width = size * 0.15
    stem_height = size * 0.2
    draw.rectangle(
        [center - stem_width//2, margin//2,
         center + stem_width//2, margin//2 + stem_height],
        fill=stem_color
    )
    
    # Draw leaf
    leaf_points = [
        (center, margin//2 + stem_height//2),
        (center + radius//2, margin//2),
        (center + radius, margin//2 + stem_height//3),
    ]
    draw.polygon(leaf_points, fill=stem_color)
    
    return img

# Create icons directory if it doesn't exist
icons_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(icons_dir, exist_ok=True)

# Generate icons
for size in [16, 48, 128]:
    icon = create_tomato_icon(size)
    icon.save(os.path.join(icons_dir, f'icon{size}.png'))
    print(f'Created icon{size}.png')

print('Done!')
