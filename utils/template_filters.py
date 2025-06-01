from .image_utils import generate_responsive_image
import os
from flask import url_for, current_app, request
from urllib.parse import urljoin

def register_filters(app):
    """Register all custom template filters."""
    app.jinja_env.filters['responsive_image'] = responsive_image
    app.jinja_env.filters['image_url'] = image_url
    app.jinja_env.filters['webp_url'] = webp_url

def image_url(filename, width=None, format=None, absolute=False):
    """
    Generate a URL for an image, with optional width and format.
    
    Args:
        filename (str): Name of the image file
        width (int, optional): Width for responsive images (e.g., 300, 600, 900, 1200)
        format (str, optional): Image format ('webp', 'jpg', 'png', etc.)
        absolute (bool): Whether to generate an absolute URL
        
    Returns:
        str: Generated image URL
    """
    try:
        # Handle case where filename is a Path object
        if hasattr(filename, 'name'):
            filename = str(filename.name)
            
        # Get base name and extension
        base, ext = os.path.splitext(filename)
        ext = ext.lstrip('.').lower()
        
        # Handle format specification
        if format:
            ext = format.lower()
        
        # Handle responsive image width
        if width is not None and str(width).isdigit():
            filename = f"{base}-{width}w.{ext}"
        else:
            filename = f"{base}.{ext}"
        
        # Generate URL
        url = url_for('serve_image', filename=filename, _external=absolute)
        
        # Ensure forward slashes
        return url.replace('\\', '/')
        
    except Exception as e:
        current_app.logger.error(f"Error generating image URL for {filename}: {str(e)}")
        return ""

def webp_url(filename, width=None, absolute=False):
    """
    Generate a WebP URL for an image, with optional width.
    
    Args:
        filename (str): Name of the image file
        width (int, optional): Width for responsive images
        absolute (bool): Whether to generate an absolute URL
        
    Returns:
        str: Generated WebP image URL
    """
    return image_url(filename, width=width, format='webp', absolute=absolute)

def responsive_image(image_path, alt_text='', class_name='', lazy_loading=True, **kwargs):
    """
    Generate responsive image HTML with WebP fallback.
    
    Args:
        image_path (str): Path to the image file
        alt_text (str): Alt text for the image
        class_name (str): CSS class(es) for the image
        lazy_loading (bool): Whether to use lazy loading
        **kwargs: Additional attributes for the img tag
        
    Returns:
        str: HTML string for the responsive image
    """
    try:
        # Get the base URL for the image
        base_url = url_for('serve_image', _external=False).rstrip('/')
        
        # Generate srcset for both WebP and original format
        srcset = []
        webp_srcset = []
        
        # Default sizes for responsive images
        sizes = kwargs.pop('sizes', '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.333vw')
        
        # Add standard image sizes
        for size in current_app.config.get('IMAGE_SIZES', [300, 600, 900, 1200]):
            # Original format
            srcset.append(f"{image_url(image_path, width=size, absolute=False)} {size}w")
            # WebP format
            webp_srcset.append(f"{webp_url(image_path, width=size, absolute=False)} {size}w")
        
        # Add original size if not already included
        if 'original' not in ' '.join(srcset):
            srcset.append(f"{image_url(image_path, absolute=False)} 1x")
            webp_srcset.append(f"{webp_url(image_path, absolute=False)} 1x")
        
        # Build class string
        classes = ['responsive-image']
        if class_name:
            classes.append(class_name)
        if lazy_loading:
            classes.append('lazyload')
        
        # Build attributes string
        attrs = ' '.join([f'{k}="{v}"' for k, v in kwargs.items()])
        
        # Generate the HTML
        html = f'''
        <picture>
            <!-- WebP format -->
            <source 
                type="image/webp" 
                srcset="{', '.join(webp_srcset)}"
                {'data-sizes="auto"' if lazy_loading else f'sizes="{sizes}"'}
                {attrs}>
                
            <!-- Fallback to original format -->
            <img
                src="{image_url(image_path, absolute=False)}"
                srcset="{', '.join(srcset)}"
                sizes="{sizes if not lazy_loading else 'auto'}"
                alt="{alt_text}"
                class="{' '.join(classes)}"
                {'loading="lazy"' if lazy_loading else ''}
                {attrs}
                onerror="this.onerror=null; this.src=this.getAttribute('src')">
        </picture>
        '''
        
        return html.strip()
        
    except Exception as e:
        current_app.logger.error(f"Error generating responsive image for {image_path}: {str(e)}")
        # Fallback to a simple image tag
        return f'<img src="{image_url(image_path, absolute=False)}" alt="{alt_text}" class="{class_name}" {attrs}>'
