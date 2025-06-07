document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initAboutParticles();
    initPortfolioShapes();
    initContactWaves();
    // Initialize Portfolio shapes
    const shapesContainer = document.querySelector('.floating-shapes');
    if (shapesContainer) {
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.width = Math.random() * 100 + 50 + 'px';
            shape.style.height = shape.style.width;
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 2 + 's';
            shapesContainer.appendChild(shape);
        }
    }

    // Initialize intersection observer for animations
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});

function initHeroAnimation() {
    const hero = document.querySelector('.hero-bg-animation');
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 100;
        const y = (clientY / window.innerHeight) * 100;
        hero.style.backgroundPosition = `${x}% ${y}%`;
    });
}

function initAboutParticles() {
    const container = document.querySelector('.about-particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(particle);
    }
}

function initPortfolioShapes() {
    const container = document.querySelector('.floating-shapes');
    for (let i = 0; i < 10; i++) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.width = `${Math.random() * 100 + 50}px`;
        shape.style.height = shape.style.width;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        container.appendChild(shape);
    }
}

function initContactWaves() {
    const container = document.querySelector('.contact-waves');
    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.animationDelay = `${i * 0.5}s`;
        container.appendChild(wave);
    }
}
