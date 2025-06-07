document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const heroSection = document.getElementById('home');
    
    function updateHeader() {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition < heroBottom) {
            header.classList.add('transparent');
            header.classList.remove('solid');
        } else {
            header.classList.remove('transparent');
            header.classList.add('solid');
        }
    }

    // Initial check
    updateHeader();

    // Update on scroll
    window.addEventListener('scroll', updateHeader);
});
