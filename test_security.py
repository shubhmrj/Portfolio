#!/usr/bin/env python
"""
Security Test Script for Portfolio Website

This script tests the security features implemented in the portfolio website,
including CSRF protection, rate limiting, and security headers.
"""

import requests
import time
import re
import sys
from colorama import init, Fore, Style

# Initialize colorama for cross-platform colored output
init()

# Configuration
BASE_URL = "http://localhost:5000"  # Change if your server runs on a different port
HEADERS = {
    "User-Agent": "SecurityTestScript/1.0"
}

def print_success(message):
    print(f"{Fore.GREEN}[✓] {message}{Style.RESET_ALL}")

def print_error(message):
    print(f"{Fore.RED}[✗] {message}{Style.RESET_ALL}")

def print_info(message):
    print(f"{Fore.BLUE}[i] {message}{Style.RESET_ALL}")

def print_warning(message):
    print(f"{Fore.YELLOW}[!] {message}{Style.RESET_ALL}")

def print_header(message):
    print(f"\n{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{message.center(60)}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'=' * 60}{Style.RESET_ALL}\n")

def test_server_availability():
    """Test if the server is running"""
    print_header("Testing Server Availability")
    try:
        response = requests.get(f"{BASE_URL}/", headers=HEADERS, timeout=5)
        if response.status_code == 200:
            print_success(f"Server is running at {BASE_URL}")
            return True
        else:
            print_error(f"Server returned status code {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to connect to server: {e}")
        print_info("Make sure the Flask server is running")
        return False

def test_security_headers():
    """Test if security headers are properly implemented"""
    print_header("Testing Security Headers")
    try:
        response = requests.get(f"{BASE_URL}/", headers=HEADERS)
        headers = response.headers
        
        # Check for required security headers
        security_headers = {
            "Content-Security-Policy": "Content Security Policy",
            "X-Content-Type-Options": "X-Content-Type-Options",
            "X-Frame-Options": "X-Frame-Options",
            "X-XSS-Protection": "XSS Protection",
            "Strict-Transport-Security": "HSTS",
            "Referrer-Policy": "Referrer Policy",
            "Permissions-Policy": "Permissions Policy"
        }
        
        for header, name in security_headers.items():
            if header in headers:
                print_success(f"{name} header is present: {headers[header]}")
            else:
                print_error(f"{name} header is missing")
    
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to test security headers: {e}")

def test_csrf_protection():
    """Test CSRF protection on the contact form"""
    print_header("Testing CSRF Protection")
    try:
        # First get the page to extract CSRF token (if visible in the page)
        session = requests.Session()
        response = session.get(f"{BASE_URL}/", headers=HEADERS)
        
        # Try to submit the form without a CSRF token
        form_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Security Test",
            "message": "This is a security test message."
        }
        
        response = session.post(
            f"{BASE_URL}/contact", 
            data=form_data,
            headers={**HEADERS, "X-Requested-With": "XMLHttpRequest"}
        )
        
        if response.status_code == 400 and "CSRF" in response.text:
            print_success("CSRF protection is working: Form submission without token was rejected")
        else:
            print_warning("CSRF protection test results are inconclusive")
            print_info(f"Status code: {response.status_code}, Response: {response.text[:100]}...")
    
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to test CSRF protection: {e}")

def test_rate_limiting():
    """Test rate limiting on the contact form"""
    print_header("Testing Rate Limiting")
    try:
        # Make multiple requests in quick succession
        print_info("Sending multiple requests to test rate limiting...")
        
        rate_limited = False
        for i in range(10):
            response = requests.post(
                f"{BASE_URL}/contact",
                data={
                    "name": "Test User",
                    "email": "test@example.com",
                    "message": "Rate limit test"
                },
                headers={**HEADERS, "X-Requested-With": "XMLHttpRequest"}
            )
            
            print_info(f"Request {i+1}: Status code {response.status_code}")
            
            if response.status_code == 429:
                print_success(f"Rate limiting detected after {i+1} requests")
                rate_limited = True
                break
            
            # Small delay to not overwhelm the server
            time.sleep(0.1)
        
        if not rate_limited:
            print_warning("Rate limiting not detected or threshold is higher than 10 requests")
    
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to test rate limiting: {e}")

def main():
    print_header("Portfolio Website Security Test")
    
    # Test if server is running
    if not test_server_availability():
        print_error("Cannot proceed with tests. Make sure the server is running.")
        sys.exit(1)
    
    # Run all tests
    test_security_headers()
    test_csrf_protection()
    test_rate_limiting()
    
    print_header("Security Test Complete")

if __name__ == "__main__":
    main()
