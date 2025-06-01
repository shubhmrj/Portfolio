from flask import Flask, render_template, request, jsonify, send_file, abort, url_for, send_from_directory, current_app
import os
import sys
import logging
import logging.handlers  # Import logging.handlers explicitly
import traceback
from datetime import datetime
from pathlib import Path
import shutil
from PIL import Image, ImageFile
from werkzeug.middleware.proxy_fix import ProxyFix  # Import ProxyFix for reverse proxy support
from werkzeug.utils import secure_filename  # Import secure_filename for file uploads

# Add the current directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Import local modules
from utils.template_filters import register_filters
from utils.image_utils import (
    convert_to_webp,
    generate_responsive_variants,
    is_image_file,
    ensure_directory_exists
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Import custom filters
try:
    from utils.template_filters import register_filters
except ImportError as e:
    logger.warning(f"Could not import template filters: {e}")
    # Create a dummy register_filters function if the import fails
    def register_filters(app):
        pass

def create_app(config=None):
    """Create and configure the Flask application.
    
    Args:
        config: Optional configuration dictionary to update the default config

    Returns:
        Flask: Configured Flask application instance
    """
    # Create Flask app with custom static folder configuration
    app = Flask(__name__, static_folder=None)

    # Default configuration
    default_config = {
        # File upload settings
        'UPLOAD_FOLDER': 'images',  # Updated to match the actual directory structure
        'ALLOWED_EXTENSIONS': {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'},
        'MAX_CONTENT_LENGTH': 16 * 1024 * 1024,  # 16MB max upload size

        # Image optimization settings
        'WEBP_QUALITY': 85,
        'IMAGE_SIZES': [300, 600, 900, 1200],  # Widths for responsive images

        # Cache settings
        'CACHE_TYPE': 'simple',
        'CACHE_DEFAULT_TIMEOUT': 300,

        # Performance settings
        'JSONIFY_PRETTYPRINT_REGULAR': False,  # Disable pretty JSON in production
        'JSON_SORT_KEYS': False,  # Keep original key order in JSON responses

        # Security settings
        'SEND_FILE_MAX_AGE_DEFAULT': 31536000,  # 1 year cache for static files
        'PREFERRED_URL_SCHEME': 'https',
        'SESSION_COOKIE_SECURE': True,
        'SESSION_COOKIE_HTTPONLY': True,
        'SESSION_COOKIE_SAMESITE': 'Lax',
        'PERMANENT_SESSION_LIFETIME': 3600,  # 1 hour

        # Application settings
        'ENV': 'production',
        'DEBUG': False,
        'TESTING': False,
        'SECRET_KEY': os.environ.get('SECRET_KEY', 'dev-key-change-in-production')
    }

    # Apply default configuration
    app.config.update(default_config)

    # Apply custom configuration if provided
    if config:
        app.config.update(config)

    # Apply development configuration if in debug mode
    if os.environ.get('FLASK_ENV') == 'development' or app.debug:
        app.config.update(
            DEBUG=True,
            ENV='development',
            JSONIFY_PRETTYPRINT_REGULAR=True,
            SESSION_COOKIE_SECURE=False,
            PREFERRED_URL_SCHEME='http'
        )

    # Register template filters
    register_filters(app)

    # Ensure upload directory exists
    ensure_directory_exists(app.config['UPLOAD_FOLDER'])

    # Set up logging
    configure_logging(app)

    # Register blueprints and routes
    register_blueprints(app)

    # Add error handlers
    register_error_handlers(app)

    # Add context processors
    register_context_processors(app)

    # Add CLI commands
    register_commands(app)

    return app

def configure_logging(app):
    """Configure application logging."""
    if app.debug:
        # Detailed logs in development
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler('app.log')
            ]
        )
    else:
        # More concise logs in production
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]',
            handlers=[
                logging.StreamHandler(),
                logging.handlers.RotatingFileHandler(
                    'app.log',
                    maxBytes=1024 * 1024 * 5,  # 5 MB
                    backupCount=5
                )
            ]
        )

    # Disable logging for requests to static files in production
    if not app.debug:
        logging.getLogger('werkzeug').setLevel(logging.WARNING)

def register_blueprints(app):
    """Register Flask blueprints."""
    # Example: app.register_blueprint(api_bp, url_prefix='/api')
    pass

def register_error_handlers(app):
    """Register error handlers."""
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('errors/500.html'), 500

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({
            'error': 'File too large',
            'message': 'The file exceeds the maximum allowed size of 16MB'
        }), 413

def register_context_processors(app):
    """Register template context processors."""
    @app.context_processor
    def inject_now():
        return {'now': datetime.utcnow()}

    @app.context_processor
    def inject_config():
        return {'config': app.config}

def register_commands(app):
    """Register Click commands."""
    @app.cli.command('init-db')
    def init_db():
        """Initialize the database."""
        # Add database initialization code here
        print('Initialized the database.')

    @app.cli.command('optimize-images')
    def optimize_images():
        """Optimize all images in the upload folder."""
        from utils.image_utils import generate_responsive_variants
        import glob

        upload_dir = app.config['UPLOAD_FOLDER']
        image_patterns = [f'*.{ext}' for ext in app.config['ALLOWED_EXTENSIONS']]

        for pattern in image_patterns:
            for image_path in glob.glob(os.path.join(upload_dir, pattern)):
                try:
                    # Skip responsive variants
                    if any(f'-{size}w.' in image_path for size in app.config['IMAGE_SIZES']):
                        continue

                    # Generate responsive variants
                    variants = generate_responsive_variants(
                        image_path,
                        sizes=app.config['IMAGE_SIZES'],
                        output_dir=upload_dir,
                        quality=app.config['WEBP_QUALITY']
                    )

                    # Convert to WebP
                    webp_path = convert_to_webp(
                        image_path,
                        quality=app.config['WEBP_QUALITY']
                    )

                    if webp_path:
                        # Generate responsive variants for WebP
                        generate_responsive_variants(
                            str(webp_path),
                            sizes=app.config['IMAGE_SIZES'],
                            output_dir=upload_dir,
                            format='webp',
                            quality=app.config['WEBP_QUALITY']
                        )

                    print(f'Processed: {os.path.basename(image_path)}')

                except Exception as e:
                    print(f'Error processing {image_path}: {str(e)}')

        print('Image optimization complete.')

# Create the Flask application
app = create_app()

# Add ProxyFix for running behind a reverse proxy
app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=1,
    x_proto=1,
    x_host=1,
    x_prefix=1
)

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    if not isinstance(filename, str) or not filename:
        return False
    
    # Handle case where filename might be a path
    basename = os.path.basename(filename)
    if '.' not in basename:
        return False
        
    ext = basename.rsplit('.', 1)[1].lower()
    return ext in app.config['ALLOWED_EXTENSIONS']

def convert_to_webp(image_path, quality=85):
    """
    Convert an image to WebP format.
    
    Args:
        image_path (str): Path to the source image
        quality (int): WebP quality (1-100)
        
    Returns:
        str: Path to the converted WebP image, or None if conversion failed
    """
    try:
        # Skip if already a WebP image
        if image_path.lower().endswith('.webp'):
            return image_path
            
        # Generate output path
        base_path = os.path.splitext(image_path)[0]
        output_path = f"{base_path}.webp"
        
        # Skip if WebP already exists and is newer than source
        if os.path.exists(output_path) and os.path.getmtime(output_path) > os.path.getmtime(image_path):
            return output_path
            
        # Open the image
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (for PNGs with transparency)
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as WebP
            img.save(output_path, 'WEBP', quality=quality, optimize=True, method=6)
            
            # Verify the WebP was created
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                return output_path
            
            return None
            
    except Exception as e:
        logger.error(f"Error converting {image_path} to WebP: {str(e)}")
        return None

def generate_responsive_images(image_path, output_dir=None, sizes=None):
    """
    Generate responsive image variants at different sizes.
    
    Args:
        image_path (str): Path to the source image
        output_dir (str, optional): Directory to save the generated images
        sizes (list, optional): List of widths to generate
        
    Returns:
        dict: Dictionary of generated image paths by size
    """
    if sizes is None:
        sizes = app.config['IMAGE_SIZES']
        
    if output_dir is None:
        output_dir = os.path.dirname(image_path)
    
    generated = {}
    
    try:
        with Image.open(image_path) as img:
            # Get the base filename without extension
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            ext = os.path.splitext(image_path)[1].lower()
            
            # If it's a WebP file, use .webp extension, otherwise use original extension
            output_ext = '.webp' if ext == '.webp' else ext
            
            for width in sizes:
                try:
                    # Calculate new size maintaining aspect ratio
                    w_percent = width / float(img.size[0])
                    height = int(float(img.size[1]) * float(w_percent))
                    
                    # Resize the image
                    resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                    
                    # Create output filename
                    output_filename = f"{base_name}-{width}w{output_ext}"
                    output_path = os.path.join(output_dir, output_filename)
                    
                    # Save the resized image
                    if output_ext == '.webp':
                        resized_img.save(output_path, 'WEBP', quality=85, optimize=True, method=6)
                    else:
                        # For other formats, use the original format
                        resized_img.save(output_path, quality=85, optimize=True)
                    
                    generated[width] = output_path
                    logger.info(f"Generated responsive image: {output_path}")
                    
                except Exception as e:
                    logger.error(f"Error generating {width}w image for {image_path}: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error processing {image_path}: {str(e)}")
    
    return generated

@app.route('/')
def index():
    """
    Render the home page with optimized images.
    
    Returns:
        Rendered template for the home page
    """
    logger.info('Home page accessed')
    return render_template('index.html')

@app.route('/blog')
def blog():
    """Render the blog page"""
    logger.info('Blog page accessed')
    return render_template('blog.html')

@app.route('/health')
def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    
    Returns:
        JSON response with status and version information
    """
    try:
        # Check if upload directory is writable
        upload_dir = app.config['UPLOAD_FOLDER']
        test_file = os.path.join(upload_dir, '.healthcheck')
        
        # Try to create a test file
        os.makedirs(upload_dir, exist_ok=True)
        with open(test_file, 'w') as f:
            f.write('healthcheck')
        os.remove(test_file)
        
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'timestamp': datetime.utcnow().isoformat(),
            'environment': app.config['ENV'],
            'debug': app.debug
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Handle file uploads with automatic optimization and responsive image generation.
    
    Supports:
    - Image format conversion to WebP
    - Generation of responsive image variants
    - Preservation of original files
    - Detailed error reporting
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No file part in the request'
        }), 400
    
    file = request.files['file']
    
    # Check if no file was selected
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No file selected'
        }), 400
    
    # Check if the file has an allowed extension
    if not file or not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'File type not allowed',
            'allowed_types': list(app.config['ALLOWED_EXTENSIONS'])
        }), 400
    
    try:
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Secure the filename and create full path
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the original file
        file.save(filepath)
        logger.info(f"Saved uploaded file to {filepath}")
        
        # Initialize response data
        response_data = {
            'success': True,
            'original': filename,
            'original_path': filepath,
            'variants': {}
        }
        
        # Process the image if it's an image file
        if file.content_type.startswith('image/'):
            # Generate WebP version
            webp_path = None
            try:
                webp_path = convert_to_webp(filepath, app.config['WEBP_QUALITY'])
                if webp_path:
                    response_data['webp'] = os.path.basename(webp_path)
                    response_data['webp_path'] = webp_path
                    logger.info(f"Created WebP version: {webp_path}")
            except Exception as e:
                error_msg = f"Error creating WebP version: {str(e)}"
                logger.error(error_msg, exc_info=True)
                response_data['webp_error'] = error_msg
            
            # Generate responsive variants for original
            try:
                orig_variants = generate_responsive_images(
                    filepath,
                    output_dir=app.config['UPLOAD_FOLDER']
                )
                if orig_variants:
                    response_data['variants']['original'] = {
                        str(size): os.path.basename(path)
                        for size, path in orig_variants.items()
                    }
                    logger.info(f"Generated {len(orig_variants)} responsive variants for original")
            except Exception as e:
                error_msg = f"Error generating responsive variants: {str(e)}"
                logger.error(error_msg, exc_info=True)
                response_data['variants_error'] = error_msg
            
            # Generate responsive variants for WebP if it was created
            if webp_path and os.path.exists(webp_path):
                try:
                    webp_variants = generate_responsive_images(
                        webp_path,
                        output_dir=app.config['UPLOAD_FOLDER']
                    )
                    if webp_variants:
                        response_data['variants']['webp'] = {
                            str(size): os.path.basename(path)
                            for size, path in webp_variants.items()
                        }
                        logger.info(f"Generated {len(webp_variants)} responsive WebP variants")
                except Exception as e:
                    error_msg = f"Error generating WebP responsive variants: {str(e)}"
                    logger.error(error_msg, exc_info=True)
                    response_data['webp_variants_error'] = error_msg
        
        return jsonify(response_data)
        
    except Exception as e:
        error_msg = f"Error processing uploaded file: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing the file',
            'details': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/images/<path:filename>')
def serve_image(filename):
    """
    Serve optimized images with WebP support and proper caching.
    
    Features:
    - Automatic WebP serving when supported by the client
    - Case-insensitive filename matching
    - Proper caching headers
    - Error handling and logging
    """
    try:
        # Security check: Prevent directory traversal
        if '..' in filename or filename.startswith('/'):
            abort(404)
        
        # Get the file path
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        base, ext = os.path.splitext(filepath)
        ext = ext.lower()
        
        # Check if client supports WebP and the file is an image that can be converted to WebP
        webp_supported = 'image/webp' in request.headers.get('Accept', '')
        is_convertible_image = ext in ['.jpg', '.jpeg', '.png']
        
        # Try to serve WebP if supported and available
        if webp_supported and is_convertible_image:
            webp_path = f"{base}.webp"
            if os.path.exists(webp_path):
                response = send_from_directory(
                    os.path.dirname(webp_path),
                    os.path.basename(webp_path)
                )
                response.headers['Content-Type'] = 'image/webp'
                return set_cache_headers(response, webp_path)
        
        # Check for responsive image variants
        if any(x in filename for x in ['-300w', '-600w', '-900w', '-1200w']):
            if not os.path.exists(filepath):
                # Try to find a case-insensitive match
                directory = os.path.dirname(filepath)
                if os.path.exists(directory):
                    for f in os.listdir(directory):
                        if f.lower() == filename.lower():
                            response = send_from_directory(directory, f)
                            return set_cache_headers(response, os.path.join(directory, f))
        
        # Fall back to the original file if it exists
        if os.path.exists(filepath):
            response = send_from_directory(
                os.path.dirname(filepath),
                os.path.basename(filepath)
            )
            return set_cache_headers(response, filepath)
        
        # If file doesn't exist, try to find a similar file (case-insensitive)
        directory = os.path.dirname(filepath)
        if os.path.exists(directory):
            for f in os.listdir(directory):
                if f.lower() == filename.lower():
                    response = send_from_directory(directory, f)
                    return set_cache_headers(response, os.path.join(directory, f))
        
        # If we get here, the file doesn't exist
        logger.warning(f"Image not found: {filename}")
        abort(404)
        
    except Exception as e:
        logger.error(f"Error serving image {filename}: {str(e)}", exc_info=True)
        abort(404)

def get_image_url(filename, width=None, format=None, absolute=False):
    """
    Generate a URL for an image, optionally specifying width and format.
    
    Args:
        filename: Name of the image file
        width: Optional width for responsive images (e.g., 300, 600, 900, 1200)
        format: Optional format ('webp', 'jpg', etc.)
        absolute: If True, return an absolute URL
        
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
        logger.error(f"Error generating image URL for {filename}: {str(e)}")
        return ""

def set_cache_headers(response, filepath):
    """
    Set appropriate cache headers for static files.
    
    Args:
        response: Flask response object
        filepath: Path to the file being served
        
    Returns:
        Response with cache headers set
    """
    try:
        # Set cache control headers (1 year for immutable resources)
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        
        # Set last modified header
        mtime = os.path.getmtime(filepath)
        response.last_modified = mtime
        
        # Set ETag for cache validation
        import hashlib
        etag = hashlib.md5(f"{filepath}-{mtime}".encode()).hexdigest()
        response.set_etag(etag)
        
        # Handle If-None-Match and If-Modified-Since headers
        return response.make_conditional(request)
        
    except Exception as e:
        logger.warning(f"Error setting cache headers for {filepath}: {str(e)}")
        return response

@app.route('/optimize-images')
def optimize_all_images():
    """
    Optimize all images in the upload folder.
    Converts to WebP and generates responsive variants.
    """
    try:
        optimized = []
        failed = []
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Get list of files in the upload directory
        try:
            files = os.listdir(app.config['UPLOAD_FOLDER'])
        except Exception as e:
            logger.error(f"Error listing files in {app.config['UPLOAD_FOLDER']}: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': f'Could not read upload directory: {str(e)}'
            }), 500
        
        # Process each file
        for filename in files:
            try:
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Skip directories and non-image files
                if not os.path.isfile(filepath) or not allowed_file(filename):
                    continue
                
                # Skip already processed files (WebP or responsive variants)
                base_name = os.path.splitext(filename)[0]
                if any(x in filename for x in ['.webp', '-300w', '-600w', '-900w', '-1200w']):
                    logger.debug(f"Skipping already processed file: {filename}")
                    continue
                
                logger.info(f"Processing image: {filename}")
                
                # Generate WebP version
                webp_path = None
                try:
                    webp_path = convert_to_webp(filepath, app.config['WEBP_QUALITY'])
                    if webp_path:
                        logger.info(f"Created WebP version: {os.path.basename(webp_path)}")
                except Exception as e:
                    logger.error(f"Error creating WebP version of {filename}: {str(e)}")
                
                # Generate responsive variants for original
                try:
                    orig_variants = generate_responsive_images(
                        filepath, 
                        output_dir=app.config['UPLOAD_FOLDER']
                    )
                    logger.info(f"Generated {len(orig_variants)} responsive variants for {filename}")
                except Exception as e:
                    logger.error(f"Error generating responsive variants for {filename}: {str(e)}")
                
                # Generate responsive variants for WebP if it was created
                if webp_path and os.path.exists(webp_path):
                    try:
                        webp_variants = generate_responsive_images(
                            webp_path,
                            output_dir=app.config['UPLOAD_FOLDER']
                        )
                        logger.info(f"Generated {len(webp_variants)} responsive WebP variants for {os.path.basename(webp_path)}")
                    except Exception as e:
                        logger.error(f"Error generating responsive WebP variants: {str(e)}")
                
                optimized.append(filename)
                
            except Exception as e:
                error_msg = f"Error processing {filename}: {str(e)}"
                logger.error(error_msg, exc_info=True)
                failed.append({
                    'file': filename,
                    'error': error_msg
                })
        
        # Prepare response
        response = {
            'status': 'completed',
            'optimized': {
                'count': len(optimized),
                'files': optimized
            },
            'message': f'Successfully processed {len(optimized)} images'
        }
        
        if failed:
            response.update({
                'failed': {
                    'count': len(failed),
                    'files': [f['file'] for f in failed]
                },
                'message': f'Processed {len(optimized)} images, {len(failed)} failed'
            })
        
        return jsonify(response)
        
    except Exception as e:
        error_msg = f"Unexpected error in optimize_all_images: {str(e)}"
        logger.error(error_msg, exc_info=True)
        return jsonify({
            'status': 'error',
            'message': 'An unexpected error occurred',
            'error': error_msg,
            'traceback': traceback.format_exc()
        }), 500

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    if request.method == 'POST':
        try:
            name = request.form.get('name')
            email = request.form.get('email')
            subject = request.form.get('subject')
            message = request.form.get('message')
            
            # Validate form data
            if not all([name, email, message]):
                logger.warning('Contact form submission with missing required fields')
                return jsonify({
                    'success': False, 
                    'message': 'Please fill in all required fields.'
                }), 400
            
            # Log contact submission
            logger.info(f'Contact form submission from {name} ({email})')
            
            # Here you would typically save to database or send email
            # For now, we'll just return a success message
            return jsonify({
                'success': True, 
                'message': 'Thank you! Your message has been sent successfully.'
            })
            
        except Exception as e:
            logger.error(f'Error in contact form: {str(e)}')
            return jsonify({
                'success': False, 
                'message': 'An error occurred. Please try again later.'
            }), 500

@app.route('/download-resume')
def download_resume():
    """Serve resume download"""
    try:
        resume_path = os.path.join('files', 'resume.pdf')
        if not os.path.exists(resume_path):
            logger.warning('Resume file not found')
            abort(404)
            
        logger.info('Resume download requested')
        return send_file(resume_path, as_attachment=True, download_name='Shubham_Raj_Resume.pdf')
    except Exception as e:
        logger.error(f'Error in resume download: {str(e)}')
        return jsonify({'error': 'An error occurred while downloading the resume.'}), 500

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    logger.warning(f'404 error: {request.path}')
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.error(f'500 error: {str(e)}')
    return render_template('500.html'), 500

@app.context_processor
def inject_current_year():
    """Inject current year into all templates"""
    return {'current_year': datetime.now().year}

# Routes to serve static files from root directories
@app.route('/css/<path:filename>')
def serve_css(filename):
    logger.info(f'Serving CSS file: {filename}')
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    logger.info(f'Serving JS file: {filename}')
    return send_from_directory('js', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    logger.info(f'Serving image file: {filename}')
    return send_from_directory('images', filename)

@app.route('/files/<path:filename>')
def serve_files(filename):
    logger.info(f'Serving file: {filename}')
    return send_from_directory('files', filename)

if __name__ == '__main__':
    # Check if directories exist
    for directory in ['css', 'js', 'images', 'templates']:
        if not os.path.exists(directory):
            logger.warning(f'{directory} directory not found - creating it')
            os.makedirs(directory, exist_ok=True)
            
    # Start the Flask application
    logger.info('Starting Flask application')
    app.run(debug=True, host='0.0.0.0', port=5000)
