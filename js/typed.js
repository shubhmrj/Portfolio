/*!
 * Typed.js - Typing Animation Library
 * Simple placeholder to allow the typed animation to function
 */

// Simple placeholder implementation of Typed.js functionality
class Typed {
  constructor(element, options) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = Object.assign({
      strings: ['Web Developer', 'Designer', 'Freelancer'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    }, options);
    
    this.current = 0;
    this.currentText = '';
    this.isDeleting = false;
    
    this.type();
  }
  
  type() {
    if (!this.element) return;
    
    const fullText = this.options.strings[this.current];
    
    if (this.isDeleting) {
      // Remove a character
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      // Add a character
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }
    
    this.element.innerHTML = this.currentText;
    
    let typeSpeed = this.options.typeSpeed;
    
    if (this.isDeleting) {
      typeSpeed = this.options.backSpeed;
    }
    
    if (!this.isDeleting && this.currentText === fullText) {
      // Pause at end
      typeSpeed = this.options.backDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.current = (this.current + 1) % this.options.strings.length;
    }
    
    setTimeout(() => this.type(), typeSpeed);
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Find all elements with class 'typing-text' to apply the effect
  const typedElements = document.querySelectorAll('.typing-text');
  
  typedElements.forEach(element => {
    new Typed(element, {
      strings: ['Web Developer', 'UI/UX Designer', 'Full-Stack Developer', 'Freelancer'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true
    });
  });
});
