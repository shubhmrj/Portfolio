/* Interactive Features JavaScript */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation transparency on scroll
    const header = document.getElementById('header');
    
    // Function to handle scroll events
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Call once on page load to set initial state
    handleScroll();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu if it's open
            document.body.classList.remove('mobile-menu-open');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Add hover animations to elements
    const animateElements = document.querySelectorAll('.hero-buttons a, .portfolio-item, .feature-card');
    
    animateElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add parallax effect to hero image
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            heroSection.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
        });
    }
    
    // Add typing effect to the typing-text element
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const phrases = ['Content Writer', 'Storyteller', 'Creative Mind', 'Professional Writer'];
        let currentPhrase = 0;
        let currentChar = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        function typeEffect() {
            const phrase = phrases[currentPhrase];
            
            if (isDeleting) {
                typingElement.textContent = phrase.substring(0, currentChar - 1);
                currentChar--;
                typeSpeed = 50;
            } else {
                typingElement.textContent = phrase.substring(0, currentChar + 1);
                currentChar++;
                typeSpeed = 150;
            }
            
            if (!isDeleting && currentChar === phrase.length) {
                isDeleting = true;
                typeSpeed = 1000; // Pause at end of phrase
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typeSpeed = 500; // Pause before typing next phrase
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        // Start the typing effect after a delay
        setTimeout(typeEffect, 1000);
    }
});
