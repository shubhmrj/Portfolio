/*
===================================
    Portfolio Website JavaScript
    Based on Modern Portfolio Template
    Author: Portfolio Developer
    Date: June 1, 2025
===================================
*/

$(document).ready(function() {
    'use strict';

    // Initialize AOS Animation Library
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out',
        mirror: false
    });

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
        
        if (experienceCounter) {
            const experienceTarget = 10;
            let experienceCount = 0;
            const experienceSpeed = 100;
            
            const experienceTimer = setInterval(() => {
                experienceCount++;
                experienceCounter.textContent = experienceCount + '+';
                
                if (experienceCount >= experienceTarget) {
                    clearInterval(experienceTimer);
                    experienceCounter.innerHTML = experienceTarget + '<span class="plus">+</span>';
                }
            }, experienceSpeed);
        }
        
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

