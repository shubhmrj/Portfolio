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

