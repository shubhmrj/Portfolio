/*
===================================
    Portfolio Website JavaScript
    Based on Modern Portfolio Template
    Author: Portfolio Developer
    Date: June 1, 2025
===================================
*/

// Preloader Functionality - Optimized for faster loading
const preloader = document.getElementById('preloader');

// Hide preloader as soon as content is loaded
window.addEventListener('load', () => {
    // Only wait a minimal time to ensure animations are ready
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 100);
});

// Fallback in case load event doesn't fire
setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
    }
}, 2000); // Max 2 second wait

// Performance optimization - Lazy load images
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Animate skill bars when they come into view
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if ('IntersectionObserver' in window) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const progress = skillBar.getAttribute('data-progress');
                    skillBar.style.width = progress + '%';
                    observer.unobserve(skillBar);
                }
            });
        }, { threshold: 0.3 });
        
        skillBars.forEach(bar => skillObserver.observe(bar));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }
}

// Initialize contact form animations and functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    // Add focus animations to form inputs
    formInputs.forEach(input => {
        // Focus animations
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // If input has value on page load, add focused class
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Form submission with animation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animate button on submit
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                formSuccess.classList.add('show');
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitButton.disabled = false;
                
                // Reset form after successful submission
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 3000);
            }, 1500);
        });
    }
}

// Initialize timeline animation
function initTimeline() {
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    const timelineProgressBar = document.getElementById('timelineProgressBar');
    
    if (!timelineBlocks.length || !timelineProgressBar) return;
    
    // Function to update timeline progress bar based on scroll position
    function updateTimelineProgress() {
        const timelineWrapper = document.querySelector('.timeline-wrapper');
        if (!timelineWrapper) return;
        
        const timelineTop = timelineWrapper.offsetTop;
        const timelineHeight = timelineWrapper.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // Calculate progress percentage
        let progress = 0;
        
        if (scrollPosition > timelineTop) {
            progress = Math.min(100, ((scrollPosition - timelineTop) / timelineHeight) * 100);
        }
        
        // Update progress bar height
        timelineProgressBar.style.height = `${progress}%`;
        
        // Add active class to timeline blocks that are in view
        timelineBlocks.forEach(block => {
            const blockTop = block.offsetTop + timelineWrapper.offsetTop;
            const blockHeight = block.offsetHeight;
            
            if (scrollPosition > blockTop && scrollPosition < blockTop + blockHeight) {
                block.classList.add('active');
            }
        });
    }
    
    // Initialize timeline progress
    updateTimelineProgress();
    
    // Update timeline progress on scroll
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
}

// Performance optimization - Defer non-critical JavaScript
function deferNonCriticalJS() {
    // Create a list of scripts to load after page load
    const deferredScripts = [
        // Add any third-party scripts that aren't critical for initial render
        // Example: analytics, social media widgets, etc.
        // { src: 'https://example.com/analytics.js', async: true, defer: true }
    ];
    
    // Load deferred scripts after page load
    if (deferredScripts.length > 0) {
        window.addEventListener('load', () => {
            deferredScripts.forEach(script => {
                const scriptEl = document.createElement('script');
                scriptEl.src = script.src;
                if (script.async) scriptEl.async = true;
                if (script.defer) scriptEl.defer = true;
                document.body.appendChild(scriptEl);
            });
        });
    }
    
    // Optimize event listeners by using passive listeners where possible
    const supportsPassive = (function() {
        let result = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() { result = true; return true; }
            });
            window.addEventListener('test', null, opts);
            window.removeEventListener('test', null, opts);
        } catch (e) {}
        return result;
    })();
    
    // Use passive listeners for touch and wheel events if supported
    const passiveListenerOpt = supportsPassive ? { passive: true } : false;
    document.addEventListener('touchstart', function(){}, passiveListenerOpt);
    document.addEventListener('wheel', function(){}, passiveListenerOpt);
}

// Document Ready Function
$(document).ready(function() {
    'use strict';

    // Initialize AOS Animation Library with performance optimizations
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        disable: 'mobile' // Disable animations on mobile for better performance
    });

    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize skill bars animation
    initSkillBars();

    // Initialize contact form animations
    initContactForm();
    
    // Initialize timeline animations
    initTimeline();
    
    // Apply performance optimizations
    deferNonCriticalJS();

    // Scroll Progress Indicator
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
        
        // Add glow effect when scrolling
        if (progress > 0) {
            scrollProgress.style.boxShadow = `0 0 10px rgba(33, 150, 243, ${0.5 + (progress/200)})`;
        }
        
        // Update navigation indicator
        updateNavIndicator();
    });
    
    // Cursor Trail Effect
    function createCursorTrail() {
        const trailCount = 15; // Number of trail elements
        const body = document.querySelector('body');
        
        // Create trail elements
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.transitionDelay = `${i * 0.02}s`;
            body.appendChild(trail);
        }
        
        const trails = document.querySelectorAll('.cursor-trail');
        let mouseX = 0, mouseY = 0;
        
        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Show the first trail element immediately
            trails[0].style.opacity = '1';
            trails[0].style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        });
        
        // Animate trail elements
        function animateTrails() {
            trails.forEach((trail, index) => {
                if (index === 0) return; // Skip the first one as it follows cursor directly
                
                setTimeout(() => {
                    trail.style.opacity = '1';
                    trail.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${1 - (index * 0.05)})`;
                }, index * 30);
            });
            
            requestAnimationFrame(animateTrails);
        }
        
        animateTrails();
    }
    
    // Initialize cursor trail effect
    createCursorTrail();
    
    // Custom Mouse Cursor
    function createCustomCursor() {
        const body = document.querySelector('body');
        
        // Create cursor elements
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        
        body.appendChild(cursor);
        body.appendChild(cursorDot);
        
        // Add active class to body to hide default cursor
        body.classList.add('custom-cursor-active');
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });
        
        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .feature-card, .nav-dot, .experience-card, .expertise-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    }
    
    // Initialize custom cursor
    createCustomCursor();
    
    // Navigation Indicator Functionality
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');
    
    function updateNavIndicator() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === current) {
                dot.classList.add('active');
            }
        });
    }
    
    // Smooth scroll for navigation dots
    navDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Initialize Typed.js for dynamic text rotation
    var typed = new Typed('.typing-text', {
        strings: [
            'Software Developer',
            'Game Development Expert',
            'Data Analyst'
        ],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1500,
        startDelay: 1000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Preloader
    $(window).on('load', function() {
        // Add preloader functionality if needed
        $('.preloader').fadeOut(1000);
    });

    // Add floating animation to elements
    function floatingAnimation() {
        $('.floating').each(function() {
            var floatingSection = $(this);
            var floatingHeight = Math.random() * 20 + 10;
            var floatingTime = Math.random() * 2 + 2;
            var floatingDelay = Math.random();
            
            floatingSection.css({
                'animation': 'floating ' + floatingTime + 's ease-in-out infinite',
                'animation-delay': floatingDelay + 's'
            });
        });
    }
    
    floatingAnimation();

    // Mobile Menu Toggle with animation
    $('.mobile-menu-toggle').on('click', function() {
        $('.main-nav').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.mobile-menu-toggle, .main-nav').length) {
            $('.main-nav').removeClass('active');
            $('.mobile-menu-toggle').removeClass('active');
        }
    });

    // Sticky Header with enhanced animation
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('sticky animate__animated animate__fadeInDown');
            $('.back-to-top').addClass('active');
        } else {
            $('#header').removeClass('sticky animate__animated animate__fadeInDown');
            $('.back-to-top').removeClass('active');
        }
    });

    // Smooth Scrolling with enhanced easing
    $('a[href*="#"]:not([href="#"])').on('click', function() {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000, 'easeInOutExpo');
                return false;
            }
        }
    });

    // Active Link Switching with enhanced transition
    $(window).on('scroll', function() {
        var scrollDistance = $(window).scrollTop() + 100;
        
        // Highlight menu item based on scroll position
        $('section').each(function() {
            if ($(this).offset().top <= scrollDistance) {
                $('.main-nav a.active').removeClass('active');
                $('.main-nav a[href="#' + $(this).attr('id') + '"]').addClass('active');
            }
        });
    });

    // Portfolio Filter with enhanced animations
    $('.portfolio-filter li').on('click', function() {
        const value = $(this).attr('data-filter');
        $('.portfolio-filter li').removeClass('active');
        $(this).addClass('active');
        
        if (value === 'all') {
            $('.portfolio-item').addClass('animate__animated animate__fadeIn');
            $('.portfolio-item').show();
        } else {
            $('.portfolio-item').removeClass('animate__animated animate__fadeIn');
            $('.portfolio-item').hide();
            $('.portfolio-item[data-category*="' + value + '"]').addClass('animate__animated animate__fadeIn');
            $('.portfolio-item[data-category*="' + value + '"]').show();
        }
    });

    // Animate numbers in stats section
    $('.stat-item h3').each(function() {
        var $this = $(this);
        var stat = $this.text();
        if (stat.includes('+')) {
            var statNum = parseInt(stat);
            $this.prop('Counter', 0).animate({
                Counter: statNum
            }, {
                duration: 2000,
                easing: 'swing',
                step: function(now) {
                    $this.text(Math.ceil(now) + '+');
                }
            });
        }
    });
    
    // Number Counter Animation for About Section
    function startCounterAnimation() {
        const experienceCounter = document.getElementById('experienceCounter');
        const projectCounter = document.getElementById('projectCounter');
        
        if (projectCounter) {
            const projectTarget = 241;
            let projectCount = 0;
            const projectSpeed = 10;
            
            const projectTimer = setInterval(() => {
                projectCount += 5;
                projectCounter.textContent = projectCount + ' Projects';
                
                if (projectCount >= projectTarget) {
                    clearInterval(projectTimer);
                    projectCounter.textContent = projectTarget + ' Projects';
                }
            }, projectSpeed);
        }
    }
    
    // Initialize counter animation when about section is in viewport
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounterAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(aboutSection);
    }
    
    // Initialize vanilla-tilt.js for 3D hover effect on feature cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.feature-card'), {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.05
        });
    }
    
    // Back to Top Button with enhanced animation
    $('.back-to-top').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'easeInOutExpo');
        return false;
    });

    // Contact Form Submission with enhanced feedback
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        // Form validation and submission logic
        // This would typically send data to a backend server
        
        // Show success message with animation
        $(this).find('.form-button').html('<div class="sending-msg">Sending message...</div>');
        
        setTimeout(function() {
            $('#contactForm').find('.form-button').html('<div class="success-msg animate__animated animate__fadeIn">Message sent successfully!</div>');
            $('#contactForm').trigger('reset');
            
            setTimeout(function() {
                $('#contactForm').find('.form-button').html('<button type="submit" class="btn primary-btn">Send Message</button>');
            }, 3000);
        }, 1500);
    });
});

// Add custom ease functions for smoother animations
$.extend($.easing, {
    easeInOutExpo: function(x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

// Initialize particles.js for background animation
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#2196F3'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.2,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#2196F3',
                opacity: 0.15,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Add CSS animation for floating elements
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}
.typing-text {
    color: #ff6b6b;
    font-weight: 600;
}
.service-card:hover .service-icon {
    transform: translateY(-10px);
    background-color: rgba(255, 107, 107, 0.2);
}
.service-card:hover .service-icon i {
    transform: scale(1.2);
}
.service-icon i {
    transition: all 0.3s ease;
}
</style>
`);

