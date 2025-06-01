import os
from PIL import Image
from pathlib import Path

def convert_to_webp(source_path, quality=80):
    """Convert image to WebP format"""
    try:
        destination = source_path.with_suffix('.webp')
        image = Image.open(source_path)
        
        # Convert RGBA to RGB if necessary (WebP doesn't support RGBA with quality < 100)
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        
        # Save as WebP
        image.save(destination, 'webp', quality=quality, optimize=True)
        print(f"Converted {source_path} to {destination}")
        return destination
    except Exception as e:
        print(f"Error converting {source_path}: {e}")
        return None

def process_directory(directory='images'):
    """Process all JPG/PNG images in the directory"""
    image_extensions = ('.jpg', '.jpeg', '.png')
    images_dir = Path(directory)
    
    if not images_dir.exists():
        print(f"Directory {directory} does not exist")
        return
    
    for img_path in images_dir.glob('*'):
        if img_path.suffix.lower() in image_extensions:
            webp_path = img_path.with_suffix('.webp')
            if not webp_path.exists():  # Skip if WebP version already exists
                convert_to_webp(img_path)

if __name__ == "__main__":
    # Process both root images directory and static/images if it exists
    process_directory('images')
    if os.path.exists('static/images'):
        process_directory('static/images')
