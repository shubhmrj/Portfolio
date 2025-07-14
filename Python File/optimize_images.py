import os
from PIL import Image
from pathlib import Path

def convert_to_webp(source):
    """Convert an image to WebP format with quality settings."""
    destination = os.path.splitext(source)[0] + ".webp"
    
    # Skip if WebP already exists and is newer than source
    if os.path.exists(destination) and os.path.getmtime(destination) > os.path.getmtime(source):
        print(f"Skipping {source} - WebP already exists and is up to date")
        return
    
    try:
        # Open the image
        image = Image.open(source)
        
        # Convert to RGB if necessary (for PNGs with transparency)
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Save as WebP with quality settings
        image.save(destination, 'webp', quality=85, method=6)
        print(f"Converted {source} to {destination}")
        
    except Exception as e:
        print(f"Error converting {source}: {str(e)}")

def optimize_images(directory):
    """Optimize all images in the given directory and its subdirectories."""
    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png']
    
    # Walk through the directory
    for root, _, files in os.walk(directory):
        for filename in files:
            # Check if file is an image
            if any(filename.lower().endswith(ext) for ext in image_extensions):
                file_path = os.path.join(root, filename)
                convert_to_webp(file_path)

if __name__ == "__main__":
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define directories to process
    directories = [
        os.path.join(script_dir, 'static', 'images'),
        os.path.join(script_dir, 'images')
    ]
    
    # Process each directory
    for directory in directories:
        if os.path.exists(directory):
            print(f"Processing directory: {directory}")
            optimize_images(directory)
        else:
            print(f"Directory not found: {directory}")
    
    print("Image optimization complete!")
