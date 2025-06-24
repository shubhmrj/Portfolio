// Mobile navigation toggle
// Shows or hides the main navigation list when the hamburger icon is tapped on small screens

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const toggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.main-nav');
        const socials = document.querySelector('.social-icons');
        if (!toggle || !nav || !socials) return;

        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
            socials.classList.toggle('mobile-visible');
        });

        // Optional: hide particles on very small screens to boost performance
        if (window.innerWidth < 576) {
            const particles = document.getElementById('particles-js');
            if (particles) {
                particles.style.display = 'none';
            }
        }
    });
})();
