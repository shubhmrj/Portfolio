/*
 * Portfolio - Main JavaScript File
 * For animations, preloader handling, and interactions
 */

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Force hide preloader immediately to solve the loading issue
    const preloader = document.getElementById('preloader');
    if (preloader) {
        console.log('Removing preloader');
        preloader.style.display = 'none';
    }

    // Initialize all components
    initScrolling();
    initTypingAnimation();
    initAOS();
    initParticles();
    initNavigationHighlight();
    initBackToTop();
});

// Initialize AOS (Animate on Scroll)
function initAOS() {
    if (typeof AOS !== 'undefined') {
        console.log('Initializing AOS');
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
}

// Handle smooth scrolling for all anchor links
function initScrolling() {
    console.log('Initializing smooth scrolling');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update active navigation link
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Initialize typing animation for dynamic text
function initTypingAnimation() {
    console.log('Setting up typing animation');
    const typingElement = document.querySelector('.typing-text');
    if (typingElement && typeof Typed !== 'undefined') {
        new Typed('.typing-text', {
            strings: ['Web Developer', 'UI/UX Designer', 'Full Stack Developer', 'Freelancer'],
            typeSpeed: 70,
            backSpeed: 30,
            loop: true
        });
    } else {
        console.log('Typed.js not loaded or typing element not found');
    }
}

// Initialize particles background if available
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        console.log('Initializing particles');
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#2196F3' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#2196F3', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } }
            }
        });
    }
}

// Initialize scroll-based navigation highlighting
function initNavigationHighlight() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize back-to-top button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
