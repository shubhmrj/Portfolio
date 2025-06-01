/*!
 * Typed.js - Typing Animation Library
 * Simple placeholder to allow the typed animation to function
 */

// Enhanced implementation of a typing animation similar to Typed.js
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with class 'typing-text'
    const typingElements = document.querySelectorAll('.typing-text');
    
    // Words to type - these will be displayed in sequence
    const words = [
        'Web Developer',
        'UI/UX Designer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer'
    ];
    
    // Apply typing animation to each element
    typingElements.forEach(element => {
        // Store the original text as the first word if it exists
        const originalText = element.textContent.trim();
        if (originalText && originalText !== '') {
            // If element already has text, use it as the first word
            words.unshift(originalText);
        }
        
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100; // Base typing speed
        
        // Clear the initial text to start fresh
        element.textContent = '';
        
        function type() {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                // Deleting text
                element.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                // Typing text
                element.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal speed when typing
            }
            
            // If word is complete, start deleting after a pause
            if (!isDeleting && currentCharIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1500; // Longer pause at the end of word
            }
            
            // If word is deleted, move to next word
            if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before starting new word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start the typing animation with a slight delay to ensure DOM is fully loaded
        setTimeout(type, 1500); // Initial delay before starting
    });
});

// Initialize typing effect when the page has fully loaded
window.addEventListener('load', function() {
    // This ensures the typing effect starts after the page is completely loaded
    // and the preloader is gone
    const typingElements = document.querySelectorAll('.typing-text');
    if (typingElements.length > 0 && !window.typingInitialized) {
        window.typingInitialized = true;
    }
});
