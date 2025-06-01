"""
Image processing and optimization utilities.

This module provides functions for handling image uploads, processing,
and generating responsive image variants with WebP support.
"""

import os
import logging
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

from PIL import Image, ImageOps
from flask import current_app, url_for

# Set up logging
logger = logging.getLogger(__name__)

def ensure_directory_exists(directory: Union[str, Path]) -> None:
    """Ensure that a directory exists, creating it if necessary.
    
    Args:
        directory: The directory path to check/create
    """
    try:
        os.makedirs(directory, exist_ok=True)
    except Exception as e:
        logger.error(f"Error creating directory {directory}: {str(e)}")
        raise

def is_image_file(filename: str) -> bool:
    """Check if a file is an image based on its extension.
    
    Args:
        filename: The name of the file to check
        
    Returns:
        bool: True if the file is an image, False otherwise
    """
    if not filename:
        return False
    
    # Get the file extension and normalize it (lowercase, no dot)
    ext = os.path.splitext(filename)[1].lstrip('.').lower()
    return ext in current_app.config.get('ALLOWED_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'})

def get_image_size(image_path: Union[str, Path]) -> Tuple[int, int]:
    """Get the dimensions of an image file.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        tuple: (width, height) of the image
    """
    try:
        with Image.open(image_path) as img:
            return img.size
    except Exception as e:
        logger.error(f"Error getting size for {image_path}: {str(e)}")
        return (0, 0)

def resize_image(
    image_path: Union[str, Path],
    width: int,
    height: Optional[int] = None,
    output_path: Optional[Union[str, Path]] = None,
    quality: int = 85,
    format: str = 'JPEG'
) -> Optional[Path]:
    """Resize an image to the specified dimensions.
    
    Args:
        image_path: Path to the source image
        width: Target width in pixels
        height: Target height in pixels (if None, maintains aspect ratio)
        output_path: Path to save the resized image (if None, saves in place)
        quality: Image quality (1-100)
        format: Output format (JPEG, PNG, WEBP, etc.)
        
    Returns:
        Path to the resized image, or None if there was an error
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (for JPEG)
            if format.upper() == 'JPEG' and img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate height if not specified
            if height is None:
                ratio = width / img.width
                height = int(img.height * ratio)
            
            # Resize the image
            img = ImageOps.fit(img, (width, height), method=Image.LANCZOS)
            
            # Determine output path if not specified
            if output_path is None:
                base, ext = os.path.splitext(image_path)
                output_path = f"{base}-{width}w{ext}"
            
            # Ensure output directory exists
            output_dir = os.path.dirname(output_path)
            if output_dir:
                ensure_directory_exists(output_dir)
            
            # Save the resized image
            img.save(
                output_path,
                format=format,
                quality=quality,
                optimize=True,
                progressive=True
            )
            
            return Path(output_path)
            
    except Exception as e:
        logger.error(f"Error resizing {image_path} to {width}x{height}: {str(e)}")
        return None

def convert_to_webp(
    image_path: Union[str, Path],
    quality: int = 85,
    output_path: Optional[Union[str, Path]] = None
) -> Optional[Path]:
    """Convert an image to WebP format.
    
    Args:
        image_path: Path to the source image
        quality: WebP quality (1-100)
        output_path: Path to save the WebP image (if None, replaces extension with .webp)
        
    Returns:
        Path to the converted WebP image, or None if there was an error
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (WebP requires RGB)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # Create a white background for transparent images
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])  # Paste using alpha channel as mask
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Determine output path if not specified
            if output_path is None:
                base = os.path.splitext(image_path)[0]
                output_path = f"{base}.webp"
            
            # Ensure output directory exists
            output_dir = os.path.dirname(output_path)
            if output_dir:
                ensure_directory_exists(output_dir)
            
            # Save as WebP
            img.save(
                output_path,
                'WEBP',
                quality=quality,
                method=6,  # Best quality, but slower
                lossless=False
            )
            
            # Verify the file was created
            if not os.path.exists(output_path):
                logger.error(f"Failed to create WebP file: {output_path}")
                return None
                
            return Path(output_path)
            
    except Exception as e:
        logger.error(f"Error converting {image_path} to WebP: {str(e)}")
        return None

def generate_responsive_variants(
    image_path: Union[str, Path],
    sizes: Optional[List[int]] = None,
    output_dir: Optional[Union[str, Path]] = None,
    format: str = 'auto',
    quality: int = 85
) -> Dict[int, Path]:
    """Generate responsive image variants at different sizes.
    
    Args:
        image_path: Path to the source image
        sizes: List of target widths in pixels
        output_dir: Directory to save the variants (if None, uses the source directory)
        format: Output format ('auto', 'webp', 'jpg', 'png', etc.)
        quality: Image quality (1-100)
        
    Returns:
        Dictionary mapping sizes to generated image paths
    """
    if sizes is None:
        sizes = current_app.config.get('IMAGE_SIZES', [300, 600, 900, 1200])
    
    # Get the source directory and filename
    src_dir = os.path.dirname(image_path)
    filename = os.path.basename(image_path)
    base, ext = os.path.splitext(filename)
    
    # Determine output directory
    if output_dir is None:
        output_dir = src_dir
    
    # Ensure output directory exists
    ensure_directory_exists(output_dir)
    
    # Process each size
    variants = {}
    for size in sorted(sizes):
        try:
            # Determine output format
            output_format = format.lower()
            if output_format == 'auto':
                output_format = 'webp' if ext.lower() == '.webp' else ext.lstrip('.').lower()
            
            # Determine output filename
            output_filename = f"{base}-{size}w.{output_format}"
            output_path = os.path.join(output_dir, output_filename)
            
            # Skip if file already exists and is newer than source
            if os.path.exists(output_path) and \
               os.path.getmtime(output_path) >= os.path.getmtime(image_path):
                variants[size] = Path(output_path)
                continue
            
            # Resize the image
            result = resize_image(
                image_path=image_path,
                width=size,
                output_path=output_path,
                quality=quality,
                format=output_format.upper()
            )
            
            if result:
                variants[size] = result
                
        except Exception as e:
            logger.error(f"Error generating {size}w variant for {image_path}: {str(e)}")
    
    return variants

def generate_responsive_image(image_path, alt_text, class_name='', sizes=None):
    """
    Generate responsive image HTML with WebP fallback
    
    Args:
        image_path (str): Path to the original image
        alt_text (str): Alt text for the image
        class_name (str): CSS class for the image
        sizes (dict): Dictionary of viewport sizes and image widths
            Example: {'(max-width: 600px)': '100vw', 'default': '50vw'}
    
    Returns:
        str: HTML picture element with responsive images
    """
    path = Path(image_path)
    webp_path = path.with_suffix('.webp')
    
    # Default sizes if not provided
    if not sizes:
        sizes = {
            '(max-width: 768px)': '100vw',
            '(min-width: 769px) and (max-width: 1024px)': '50vw',
            '(min-width: 1025px)': '33vw',
            'default': '100vw'
        }
    
    # Generate srcset for both formats
    def generate_srcset(img_path):
        srcset = []
        for size in [300, 600, 900, 1200]:  # Common breakpoint widths
            srcset.append(f"{img_path.stem}-{size}w{img_path.suffix} {size}w")
        return ', '.join(srcset)
    
    # Build the picture element
    html = f'<picture class="responsive-image">\n'
    
    # WebP source (preferred)
    if webp_path.exists():
        html += '  <source \n    type="image/webp" \n    srcset="' + generate_srcset(webp_path) + '" \n    sizes="' + ', '.join([f'{k} {v}' for k, v in sizes.items()]) + '">\n'
    
    # Original image as fallback
    html += f'  <img \n    src="{path}" \n    srcset="{generate_srcset(path)}" \n    sizes="{sizes}" \n    alt="{alt_text}" \n    class="{class_name}" \n    loading="lazy" \n    decoding="async">\n'
    
    html += '</picture>'
    return html
