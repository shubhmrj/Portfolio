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
    
    // Magnetic effect
    const magneticItems = document.querySelectorAll('.magnetic-item');
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const bound = this.getBoundingClientRect();
            const mouseX = e.clientX - bound.left - bound.width / 2;
            const mouseY = e.clientY - bound.top - bound.height / 2;
            
            gsap.to(this, {
                duration: 0.3,
                x: mouseX * 0.2,
                y: mouseY * 0.2,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                x: 0,
                y: 0,
                ease: "power2.out"
            });
        });
    });

    // Click effect
    document.addEventListener('click', function(e) {
        createParticles(e.clientX, e.clientY);
    });

    // Interactive background
    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.92) {
            createRipple(e.clientX, e.clientY);
        }
    });
});

function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.querySelector('.interactive-bg').appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}
