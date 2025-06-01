// Enhanced Contact Form with Security Features

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formButton = document.querySelector('.form-button');
    const formStatus = document.getElementById('formStatus');
    
    // Initialize reCAPTCHA v3
    function initRecaptcha() {
        // This function will be called when the reCAPTCHA script is loaded
        console.log('reCAPTCHA initialized');
    }
    
    // Load reCAPTCHA script dynamically
    function loadRecaptchaScript() {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=6LexampleTokenHere';
        script.async = true;
        script.defer = true;
        script.onload = initRecaptcha;
        document.head.appendChild(script);
    }
    
    // Load reCAPTCHA
    loadRecaptchaScript();
    
    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Reset previous errors
        document.querySelectorAll('.form-control').forEach(el => {
            el.classList.remove('is-invalid');
        });
        
        let isValid = true;
        let errorMessage = '';
        
        // Validate name
        if (name === '') {
            document.getElementById('name').classList.add('is-invalid');
            errorMessage = 'Please enter your name';
            isValid = false;
        }
        
        // Validate email
        if (email === '') {
            document.getElementById('email').classList.add('is-invalid');
            errorMessage = errorMessage || 'Please enter your email';
            isValid = false;
        } else if (!isValidEmail(email)) {
            document.getElementById('email').classList.add('is-invalid');
            errorMessage = errorMessage || 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate message
        if (message === '') {
            document.getElementById('message').classList.add('is-invalid');
            errorMessage = errorMessage || 'Please enter your message';
            isValid = false;
        }
        
        // Display error message if validation fails
        if (!isValid && formStatus) {
            formStatus.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            formStatus.style.display = 'block';
        }
        
        return isValid;
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Sanitize input to prevent XSS
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return false;
            }
            
            // Show loading state
            formButton.innerHTML = '<div class="sending-msg"><i class="fas fa-spinner fa-spin"></i> Sending message...</div>';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Sanitize inputs
            const sanitizedData = {
                name: sanitizeInput(formData.get('name')),
                email: sanitizeInput(formData.get('email')),
                subject: sanitizeInput(formData.get('subject')),
                message: sanitizeInput(formData.get('message'))
            };
            
            // Get reCAPTCHA token
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LexampleTokenHere', {action: 'contact_form'})
                        .then(function(token) {
                            // Add token to form data
                            formData.append('recaptcha_token', token);
                            
                            // Send form data to server
                            submitForm(formData);
                        });
                });
            } else {
                // Fallback if reCAPTCHA is not loaded
                submitForm(formData);
            }
        });
    }
    
    // Submit form data to server
    function submitForm(formData) {
        fetch('/contact', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success message
                formStatus.innerHTML = `<div class="alert alert-success animate__animated animate__fadeIn">${data.message}</div>`;
                formStatus.style.display = 'block';
                contactForm.reset();
                formButton.innerHTML = '<button type="submit" class="btn primary-btn">Send Message</button>';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                // Show error message
                formStatus.innerHTML = `<div class="alert alert-danger animate__animated animate__fadeIn">${data.message}</div>`;
                formStatus.style.display = 'block';
                formButton.innerHTML = '<button type="submit" class="btn primary-btn">Send Message</button>';
            }
        })
        .catch(error => {
            // Show error message
            formStatus.innerHTML = '<div class="alert alert-danger animate__animated animate__fadeIn">An error occurred. Please try again later.</div>';
            formStatus.style.display = 'block';
            formButton.innerHTML = '<button type="submit" class="btn primary-btn">Send Message</button>';
            console.error('Error:', error);
        });
    }
});
