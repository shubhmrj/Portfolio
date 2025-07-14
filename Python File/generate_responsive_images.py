import os
from PIL import Image
from pathlib import Path

def generate_responsive_images(image_path, output_dir=None, sizes=None):
    """
    Generate responsive image variants for different screen sizes.
    
    Args:
        image_path (str): Path to the source image
        output_dir (str, optional): Directory to save the resized images. Defaults to same as source.
        sizes (list, optional): List of widths to generate. Defaults to [300, 600, 900, 1200].
    """
    if sizes is None:
        sizes = [300, 600, 900, 1200]
    
    # Create output directory if it doesn't exist
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    else:
        output_dir = os.path.dirname(image_path)
    
    # Open the image
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (for PNGs with transparency)
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Get the base filename without extension
            base_filename = os.path.splitext(os.path.basename(image_path))[0]
            
            # Generate resized images
            for size in sizes:
                # Calculate new height maintaining aspect ratio
                width_percent = size / float(img.size[0])
                new_height = int(float(img.size[1]) * float(width_percent))
                
                # Resize the image
                resized = img.resize((size, new_height), Image.Resampling.LANCZOS)
                
                # Save as JPG
                jpg_filename = f"{base_filename}-{size}w.jpg"
                jpg_path = os.path.join(output_dir, jpg_filename)
                resized.save(jpg_path, 'JPEG', quality=85, optimize=True)
                print(f"Generated: {jpg_path}")
                
                # Save as WebP
                webp_filename = f"{base_filename}-{size}w.webp"
                webp_path = os.path.join(output_dir, webp_filename)
                resized.save(webp_path, 'WEBP', quality=85, method=6)
                print(f"Generated: {webp_path}")
                
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")

def process_directory(directory, output_dir=None, extensions=None):
    """
    Process all images in a directory.
    
    Args:
        directory (str): Directory containing images
        output_dir (str, optional): Directory to save resized images. Defaults to same as source.
        extensions (list, optional): List of file extensions to process. Defaults to ['.jpg', '.jpeg', '.png'].
    """
    if extensions is None:
        extensions = ['.jpg', '.jpeg', '.png']
    
    # Walk through the directory
    for root, _, files in os.walk(directory):
        for filename in files:
            # Check if file has a valid extension
            if any(filename.lower().endswith(ext) for ext in extensions):
                file_path = os.path.join(root, filename)
                generate_responsive_images(file_path, output_dir)

if __name__ == "__main__":
    import argparse
    
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Generate responsive image variants.')
    parser.add_argument('path', help='Path to image file or directory')
    parser.add_argument('--output', '-o', help='Output directory (default: same as source)')
    parser.add_argument('--sizes', '-s', nargs='+', type=int, default=[300, 600, 900, 1200],
                       help='List of widths to generate (default: 300 600 900 1200)')
    
    # Parse arguments
    args = parser.parse_args()
    
    # Check if path exists
    if not os.path.exists(args.path):
        print(f"Error: Path '{args.path}' does not exist")
        exit(1)
    
    # Process single file or directory
    if os.path.isfile(args.path):
        generate_responsive_images(args.path, args.output, args.sizes)
    else:
        process_directory(args.path, args.output)
