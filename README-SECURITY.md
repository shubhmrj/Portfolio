# Portfolio Website Security Enhancements

## Overview
This document provides an overview of the security enhancements implemented in the portfolio website. These features are designed to protect against common web vulnerabilities, ensure data protection, and improve overall application security.

## Security Features Implemented

### 1. Security Headers
Comprehensive HTTP security headers have been added to all responses:

- **Content Security Policy (CSP)**: Controls which resources can be loaded by the browser
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Protects against clickjacking attacks
- **X-XSS-Protection**: Enables browser's built-in XSS protection
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **Referrer-Policy**: Controls information sent in the Referer header
- **Permissions-Policy**: Restricts which browser features can be used

### 2. CSRF Protection
Cross-Site Request Forgery protection using Flask-WTF:

- Automatically adds CSRF tokens to forms
- Validates tokens on form submission
- Custom error handling for CSRF failures

### 3. Enhanced Contact Form
The contact form has been enhanced with multiple security features:

- Client-side validation with immediate feedback
- Server-side validation and sanitization
- reCAPTCHA v3 integration for spam protection
- Rate limiting to prevent abuse
- XSS protection through input sanitization

### 4. Rate Limiting
Implemented rate limiting to protect against brute force attacks:

- Limits requests from a single IP address
- Configurable request limits and time windows
- Custom error responses for rate-limited requests

### 5. Secure Cookie Configuration
Enhanced cookie security settings:

- HttpOnly flag prevents JavaScript access
- Secure flag ensures cookies are only sent over HTTPS
- SameSite attribute helps prevent CSRF attacks

## How to Use These Features

### reCAPTCHA Configuration
To use reCAPTCHA in production:

1. Register your site at https://www.google.com/recaptcha/admin
2. Replace the placeholder keys in the Flask app configuration:
   ```python
   app.config['RECAPTCHA_SITE_KEY'] = 'your-site-key'
   app.config['RECAPTCHA_SECRET_KEY'] = 'your-secret-key'
   ```

### Secret Key Configuration
For production, set a strong secret key as an environment variable:

```bash
export SECRET_KEY="your-secure-random-key"
```

### HTTPS Configuration
The security features are designed for HTTPS. For local development:

1. You can temporarily set `SESSION_COOKIE_SECURE = False` for testing
2. For production, always use HTTPS with proper SSL/TLS configuration

## Dependencies Added

The following dependencies have been added to support these security features:

- **flask-wtf**: For CSRF protection
- **requests**: For reCAPTCHA verification
- **pyOpenSSL**: For enhanced SSL support
- **WTForms**: For form validation

Install all dependencies using:

```bash
pip install -r requirements.txt
```

## Testing Security Features

To test the security features:

1. **Contact Form**: Try submitting with invalid data or rapidly submitting multiple times
2. **CSRF Protection**: Modify or remove the CSRF token and attempt to submit the form
3. **Security Headers**: Use tools like [Security Headers](https://securityheaders.com) to check implementation

## Security Best Practices

Additional recommendations for maintaining security:

1. Regularly update all dependencies
2. Monitor for security advisories
3. Implement proper logging and monitoring
4. Use HTTPS in production
5. Store sensitive configuration in environment variables

For more details, see the full [SECURITY.md](./SECURITY.md) documentation.
