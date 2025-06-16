/**
 * Portfolio Interactive Features
 * Handles filtering, animations, and interactive elements for the portfolio section
 */

document.addEventListener('DOMContentLoaded', function() {
    // Portfolio filtering functionality
    const filterButtons = document.querySelectorAll('.portfolio-filter li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Initialize AOS animation library if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Filter portfolio items
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    if (item.getAttribute('data-category').includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Add hover effects (desktop) or tap toggle (touch)
    const hasHoverSupport = window.matchMedia('(hover: hover)').matches;

    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');

        if (hasHoverSupport) {
            item.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateY(0)';
            });
            item.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                overlay.style.transform = 'translateY(10px)';
            });
        } else {
            // Touch: toggle details on tap
            item.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    overlay.classList.toggle('show');
                }
            });
        }
    });

    // Touch overlay show class style insertion
    if (!hasHoverSupport) {
        const styleTag = document.createElement('style');
        styleTag.textContent = `.portfolio-overlay.show{opacity:1 !important;transform:translateY(0)!important}`;
        document.head.appendChild(styleTag);
    }
    
    // Handle portfolio item click to show details
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only trigger if not clicking on a link
            if (!e.target.closest('a')) {
                const portfolioIdEl = this.querySelector('[data-portfolio-id]');
                if (portfolioIdEl) {
                    const portfolioId = portfolioIdEl.getAttribute('data-portfolio-id');
                    console.log(`Portfolio item ${portfolioId} clicked`);
                }
                // Simulate click on the view project button if present
                const viewBtn = this.querySelector('.btn-view-project');
                if (viewBtn) {
                    viewBtn.click();
                }
            }
        });
    });
});

// Add smooth transition styles for filtering
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-item {
            transition: all 0.4s ease;
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
});
