from flask import Flask, render_template, request, jsonify, send_file, abort, url_for, send_from_directory, current_app
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from PIL import Image, ImageFile
from werkzeug.middleware.proxy_fix import ProxyFix  # Import ProxyFix for reverse proxy support
from werkzeug.utils import secure_filename  # Import secure_filename for file uploads

def create_app(config=None):
    # Create Flask app with custom static folder configuration
    app = Flask(__name__, static_folder=None)

    # Default configuration
    default_config = {

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

    return app


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

@app.route('/')
def index():
    # logger.info('Home page accessed')
    return render_template('index.html')


def send_email(name, email, subject, message):
    try:
        mail_server = os.environ.get('MAIL_SERVER')
        mail_port = int(os.environ.get('MAIL_PORT', 587))
        mail_username = os.environ.get('MAIL_USERNAME')
        mail_password = os.environ.get('MAIL_PASSWORD')
        # If MAIL_RECIPIENT not provided, send to the authenticated user.
        mail_recipient = os.environ.get('MAIL_RECIPIENT', mail_username)

        if not all([mail_server, mail_username, mail_password]):
            # logger.warning('Mail environment variables not fully configured; skipping actual email send.')
            return False

        import smtplib
        from email.message import EmailMessage

        msg = EmailMessage()
        msg['Subject'] = f"Portfolio Contact: {subject}"
        msg['From'] = mail_username
        msg['To'] = mail_recipient
        msg.set_content(f"Name: {name}\nEmail: {email}\n\n{message}")

        with smtplib.SMTP(mail_server, mail_port) as server:
            server.starttls()
            server.login(mail_username, mail_password)
            server.send_message(msg)

        # logger.info('Contact email sent successfully')
        return True

    except Exception as e:
        # logger.error(f'Error sending contact email: {str(e)}', exc_info=True)
        return False


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
                # logger.warning('Contact form submission with missing required fields')
                return jsonify({
                    'success': False, 
                    'message': 'Please fill in all required fields.'
                }), 400
            
            # Log contact submission
            # logger.info(f'Contact form submission from {name} ({email})')
            
            # Attempt to send email
            email_sent = send_email(name, email, subject, message)

            return jsonify({
                'success': True,
                'message': 'Thank you! Your message has been sent successfully.' if email_sent else 'Thank you! Your message has been received.'
            })
            
        except Exception as e:
            # logger.error(f'Error in contact form: {str(e)}')
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
            # logger.warning('Resume file not found')
            abort(404)
            
        # logger.info('Resume download requested')
        return send_file(resume_path, as_attachment=True, download_name='Shubham_Raj_Resume.pdf')
    except Exception as e:
        # logger.error(f'Error in resume download: {str(e)}')
        return jsonify({'error': 'An error occurred while downloading the resume.'}), 500

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    # logger.warning(f'404 error: {request.path}')
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    # logger.error(f'500 error: {str(e)}')
    return render_template('500.html'), 500

@app.context_processor
def inject_current_year():
    """Inject current year into all templates"""
    return {'current_year': datetime.now().year}

# Routes to serve static files from root directories
@app.route('/css/<path:filename>')
def serve_css(filename):
    # logger.info(f'Serving CSS file: {filename}')
    response = send_from_directory('css', filename)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/js/<path:filename>')
def serve_js(filename):
    # logger.info(f'Serving JS file: {filename}')
    response = send_from_directory('js', filename)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/images/<path:filename>')
def serve_images(filename):
    # logger.info(f'Serving image file: {filename}')
    response = send_from_directory('images', filename)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/files/<path:filename>')
def serve_files(filename):
    # logger.info(f'Serving file: {filename}')
    return send_from_directory('files', filename)

if __name__ == '__main__':
    try:
        # Check if directories exist
        for directory in ['css', 'js', 'images', 'templates']:
            if not os.path.exists(directory):
                # logger.warning(f'{directory} directory not found - creating it')
                os.makedirs(directory, exist_ok=True)
        
        # Start the Flask application
        print('\n' + '='*50)
        print('  Starting Flask Development Server')
        print('  Press Ctrl+C to quit')
        print('='*50 + '\n')
        
        # logger.info('Starting Flask application')
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=True, use_debugger=True, use_evalex=True)
        
    except Exception as e:
        # logger.error(f'Failed to start Flask application: {str(e)}')
        print(f'\nError: Failed to start server - {str(e)}')
        print('Please check the logs for more details.')