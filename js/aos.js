/* AOS (Animate On Scroll) v2.3.1 placeholder */
/* Normally this would be loaded from a CDN, but creating a local version as referenced in HTML */
console.log('AOS loaded from local file');

// Initialize AOS with default settings when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if AOS is loaded from CDN (preferred method)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease',
      once: true,
      mirror: false
    });
  } else {
    console.warn('AOS library not properly loaded');
  }
});
