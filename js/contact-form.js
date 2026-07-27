// Contact Form Handler (clean version)

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
    
    // Temporarily disable reCAPTCHA (site key placeholder causes hanging)
    // loadRecaptchaScript();
    
    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Reset previous errors
        document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(el => {
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
            sanitizeInput(formData.get('name'));
            sanitizeInput(formData.get('email'));
            sanitizeInput(formData.get('subject'));
            sanitizeInput(formData.get('message'));
            // Call async submit
            submitForm(formData);
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
                formButton.innerHTML = '<button type="submit" class="primary-btn">Send Message <i class="fas fa-paper-plane"></i></button>';
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                // Show error message
                formStatus.innerHTML = `<div class="alert alert-danger animate__animated animate__fadeIn">${data.message}</div>`;
                formStatus.style.display = 'block';
                formButton.innerHTML = '<button type="submit" class="primary-btn">Send Message <i class="fas fa-paper-plane"></i></button>';
            }
        })
        .catch(error => {
            // Show error message
            formStatus.innerHTML = '<div class="alert alert-danger animate__animated animate__fadeIn">An error occurred. Please try again later.</div>';
            formStatus.style.display = 'block';
            formButton.innerHTML = '<button type="submit" class="primary-btn">Send Message <i class="fas fa-paper-plane"></i></button>';
            console.error('Error:', error);
        });
    }
});
