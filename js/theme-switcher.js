// Theme Switcher for Portfolio Website
// Modified to make dark mode the default for better text and animation visibility

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Check for saved theme preference, otherwise default to dark mode
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme based on saved preference or default to dark
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        // Default to dark theme for better visibility of text and animations
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Save the default preference
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    // Add transition class after initial theme is set (prevents flash during page load)
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 100);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        // Add animation class
        document.body.classList.add('theme-transition');
        
        // Toggle theme
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        
        // Only change if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', newTheme);
            
            if (newTheme === 'dark') {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    });
});
