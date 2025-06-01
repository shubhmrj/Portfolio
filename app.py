from flask import Flask, render_template, request, jsonify, send_file, abort, url_for, send_from_directory
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create Flask app with custom static folder configuration
app = Flask(__name__, static_folder=None)

@app.route('/')
def index():
    """Render the home page"""
    logger.info('Home page accessed')
    return render_template('index.html')

@app.route('/blog')
def blog():
    """Render the blog page"""
    logger.info('Blog page accessed')
    return render_template('blog.html')

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
