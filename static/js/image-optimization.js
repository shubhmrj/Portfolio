document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images with Intersection Observer
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            // Add loaded class when image is loaded
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                        lazyImage.classList.add('loaded');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            let active = false;

            const lazyLoad = function() {
                if (active === false) {
                    active = true;

                    setTimeout(() => {
                        lazyImages.forEach(lazyImage => {
                            if (
                                (lazyImage.getBoundingClientRect().top <= window.innerHeight &&
                                lazyImage.getBoundingClientRect().bottom >= 0) &&
                                getComputedStyle(lazyImage).display !== 'none'
                            ) {
                                lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                                lazyImage.classList.add('loaded');
                                lazyImages = lazyImages.filter(image => image !== lazyImage);
                            }
                        });

                        active = false;
                    }, 200);
                }
            };

            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            lazyLoad();
        }
    }

    // Add smooth zoom effect on portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        
        if (img && overlay) {
            item.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
                overlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                overlay.style.opacity = '0';
            });
        }
    });

    // Handle click on portfolio items
    document.querySelectorAll('.portfolio-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const portfolioId = this.getAttribute('data-portfolio-id');
            // Here you can add code to show a modal or navigate to a detailed view
            console.log('Portfolio item clicked:', portfolioId);
            // Example: openModal(portfolioId);
        });
    });
});

// Function to preload images
function preloadImages(images) {
    images.forEach(image => {
        const img = new Image();
        img.src = image;
    });
}

// Preload above-the-fold images
const criticalImages = [
    'images/hero-image.jpg',
    'images/portfolio-1.jpg',
    'images/portfolio-2.jpg',
    'images/portfolio-3.jpg'
];

// Start preloading critical images
preloadImages(criticalImages);
