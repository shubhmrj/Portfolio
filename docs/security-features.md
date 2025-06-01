# Portfolio Website Security Features

## Overview

This document provides detailed information about the security features implemented in the portfolio website. These enhancements protect against common web vulnerabilities, ensure data protection, and improve overall application security.

## Table of Contents

1. [Security Headers](#security-headers)
2. [CSRF Protection](#csrf-protection)
3. [Rate Limiting](#rate-limiting)
4. [reCAPTCHA Integration](#recaptcha-integration)
5. [Input Validation & Sanitization](#input-validation--sanitization)
6. [Secure Cookie Configuration](#secure-cookie-configuration)
7. [Proxy Handling](#proxy-handling)
8. [Testing Security Features](#testing-security-features)
9. [Production Deployment Recommendations](#production-deployment-recommendations)

## Security Headers

The application implements comprehensive security headers to protect against various attacks:

```python
@app.after_request
def add_security_headers(response):
    # Content Security Policy
    response.headers['Content-Security-Policy'] = "default-src 'self'; " \
                                               "script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://unpkg.com https://cdn.jsdelivr.net https://www.google.com https://www.gstatic.com 'unsafe-inline'; " \
                                               "style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://unpkg.com 'unsafe-inline'; " \
                                               "img-src 'self' data: https:; " \
                                               "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " \
                                               "connect-src 'self' https://www.google.com; " \
                                               "frame-src 'self' https://www.google.com;"
    
    # Prevent MIME type sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    
    # Enable XSS protection
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # HTTP Strict Transport Security (HSTS)
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    
    # Referrer Policy
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Feature Policy
    response.headers['Permissions-Policy'] = "camera=(), microphone=(), geolocation=()"
    
    return response
```

### Header Descriptions

- **Content Security Policy (CSP)**: Controls which resources can be loaded by the browser, preventing XSS attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing which can lead to security vulnerabilities
- **X-Frame-Options**: Protects against clickjacking attacks by controlling whether the page can be embedded in frames
- **X-XSS-Protection**: Enables the browser's built-in XSS protection mechanisms
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections for enhanced security
- **Referrer-Policy**: Controls how much referrer information is included with requests
- **Permissions-Policy**: Restricts which browser features and APIs can be used

## CSRF Protection

Cross-Site Request Forgery protection is implemented using Flask-WTF:

```python
# Initialize CSRF protection
csrf = CSRFProtect(app)

# Handle CSRF errors
@app.errorhandler(CSRFError)
def handle_csrf_error(e):
    logger.warning(f'CSRF error: {str(e)}')
    return jsonify({
        'success': False,
        'message': 'CSRF validation failed. Please refresh the page and try again.'
    }), 400
```

This protection:
- Automatically adds CSRF tokens to forms
- Validates tokens on form submission
- Provides custom error handling for CSRF failures

## Rate Limiting

Rate limiting protects against brute force attacks and DoS attempts:

```python
# Rate limiting implementation
request_history = {}

def rate_limit(max_requests=10, window=60):
    """Rate limiting decorator to prevent abuse"""
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # Get client IP
            ip = request.remote_addr
            current_time = time.time()
            
            # Initialize or clean up old requests
            if ip not in request_history:
                request_history[ip] = []
            request_history[ip] = [t for t in request_history[ip] if current_time - t < window]
            
            # Check if rate limit is exceeded
            if len(request_history[ip]) >= max_requests:
                logger.warning(f'Rate limit exceeded for IP: {ip}')
                return jsonify({
                    'success': False,
                    'message': 'Too many requests. Please try again later.'
                }), 429
            
            # Add current request timestamp
            request_history[ip].append(current_time)
            
            return f(*args, **kwargs)
        return wrapped
    return decorator
```

The rate limiting implementation:
- Tracks requests by IP address
- Configurable request limits and time windows
- Returns 429 Too Many Requests when limit is exceeded

## reCAPTCHA Integration

Google reCAPTCHA v3 is integrated to protect forms from spam and abuse:

```python
# Verify reCAPTCHA token
def verify_recaptcha(token):
    """Verify reCAPTCHA token with Google"""
    if not token:
        return False
        
    try:
        response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': app.config['RECAPTCHA_SECRET_KEY'],
                'response': token
            }
        )
        result = response.json()
        return result.get('success', False) and result.get('score', 0) > 0.5
    except Exception as e:
        logger.error(f'reCAPTCHA verification error: {str(e)}')
        return False
```

The reCAPTCHA implementation:
- Uses invisible reCAPTCHA v3 for frictionless user experience
- Performs server-side verification of tokens
- Uses score-based bot detection (threshold of 0.5)

## Input Validation & Sanitization

Input validation and sanitization prevent injection attacks:

```python
# Validate email format
email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
if not email_pattern.match(email):
    logger.warning(f'Invalid email format: {email}')
    return jsonify({
        'success': False,
        'message': 'Please enter a valid email address.'
    }), 400

# Sanitize inputs to prevent XSS
name = name.replace('<', '&lt;').replace('>', '&gt;')
email = email.replace('<', '&lt;').replace('>', '&gt;')
subject = subject.replace('<', '&lt;').replace('>', '&gt;')
message = message.replace('<', '&lt;').replace('>', '&gt;')
```

The validation and sanitization:
- Validates email format using regex
- Sanitizes inputs by encoding HTML entities
- Provides both client-side and server-side validation

## Secure Cookie Configuration

Secure cookie settings protect session data:

```python
app.config['SESSION_COOKIE_SECURE'] = True  # Only send cookies over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
```

These settings:
- `HttpOnly` prevents JavaScript access to cookies, mitigating XSS attacks
- `Secure` ensures cookies are only sent over HTTPS connections
- `SameSite` prevents CSRF attacks by controlling when cookies are sent

## Proxy Handling

Proper proxy handling ensures correct IP detection:

```python
# Fix for proper IP handling behind proxies
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
```

This configuration:
- Correctly handles X-Forwarded-For headers
- Prevents IP spoofing in proxy environments
- Ensures rate limiting works correctly behind proxies

## Testing Security Features

A test script (`test_security.py`) is provided to verify security implementations:

```bash
python test_security.py
```

The script tests:
- Security headers implementation
- CSRF protection
- Rate limiting functionality

## Production Deployment Recommendations

### Environment Variables

Store sensitive configuration in environment variables:

```bash
export SECRET_KEY="your-secure-random-key"
export RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
export RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
```

### HTTPS Configuration

Always use HTTPS in production:

- Use a valid SSL/TLS certificate
- Configure proper cipher suites
- Consider using Let's Encrypt for free certificates

### Regular Updates

Keep dependencies updated to patch security vulnerabilities:

```bash
pip install --upgrade -r requirements.txt
```

### Logging and Monitoring

Implement comprehensive logging and monitoring:

- Log security-related events
- Set up alerts for suspicious activities
- Regularly review logs for potential security issues
