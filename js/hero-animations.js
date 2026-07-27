document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero-section');
    const layers = document.querySelectorAll('.hero-bg-layers > div');

    if (hero && layers.length) {
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
    }

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

    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;
            heroImage.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
    }
});
