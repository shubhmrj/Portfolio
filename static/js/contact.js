document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send form data to server
            fetch('/contact', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                const messageElement = document.getElementById('formMessage');
                messageElement.textContent = data.message;
                messageElement.classList.add('success-message');
                messageElement.classList.remove('error-message');
                messageElement.style.display = 'block';
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Show error message
                const messageElement = document.getElementById('formMessage');
                messageElement.textContent = 'There was an error sending your message. Please try again.';
                messageElement.classList.add('error-message');
                messageElement.classList.remove('success-message');
                messageElement.style.display = 'block';
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});
