document.addEventListener('DOMContentLoaded', function() {
    // Interactive background
    const hero = document.querySelector('.hero-section');
    const layers = document.querySelectorAll('.hero-bg-layers > div');
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height } = hero.getBoundingClientRect();
        const x = clientX / width;
        const y = clientY / height;

        layers.forEach((layer, i) => {
            const speed = (i + 1) * 20;
            const translateX = (x * speed) + 'px';
            const translateY = (y * speed) + 'px';
            layer.style.transform = `translate(${translateX}, ${translateY})`;
        });
    });

    // Typing effect
    const typingText = document.querySelector('.typing-text');
    const words = typingText.dataset.typing.split(',');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = words[wordIndex];
        if (isDeleting) {
            typingText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();

    // Stats counter animation
    const stats = document.querySelectorAll('.number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        let current = 0;
        const increment = target / 50;
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        updateCount();
    });

    // Initialize Typed.js
    const typed = new Typed('.typed-text', {
        strings: ['Data Analyst', 'Python Developer', 'XR Developer', 'Full Stack Developer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;
        heroImage.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});
