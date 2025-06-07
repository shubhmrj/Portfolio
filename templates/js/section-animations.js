document.addEventListener('DOMContentLoaded', function() {
    // Initialize section-specific animations
    initHeroAnimation();
    initAboutAnimation();
    initSkillsAnimation();
    initPortfolioAnimation();
    initContactAnimation();
});

function initHeroAnimation() {
    const hero = document.querySelector('#home');
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = hero.getBoundingClientRect();
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        
        hero.style.setProperty('--mouse-x', x);
        hero.style.setProperty('--mouse-y', y);
    });
}

function initAboutAnimation() {
    const particles = [];
    const particlesCount = 50;
    const about = document.querySelector('#about .about-particles');
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        about.appendChild(particle);
        particles.push({
            el: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            speed: Math.random() * 2 + 1
        });
    }
    
    function animateParticles() {
        particles.forEach(particle => {
            particle.y -= particle.speed;
            if (particle.y < -10) particle.y = 110;
            particle.el.style.transform = `translate(${particle.x}%, ${particle.y}%)`;
        });
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Add the remaining initialization functions...
