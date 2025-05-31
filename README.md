# Modern Portfolio Website

## Overview
This is a modern, responsive portfolio website template based on the design you requested. It's built with HTML, CSS, and JavaScript (jQuery) and is fully customizable to showcase your work and skills.

## Features
- Responsive design that works on all devices
- Modern and clean UI with smooth animations
- Portfolio filtering system
- Contact form
- Blog section with link to detailed blog page
- Pricing section
- Resume/experience timeline
- Services showcase
- Animated stats counter

## File Structure
```
Portfolio/
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
├── images/                # All website images
├── index.html            # Main portfolio page
└── blog.html            # Blog page
```

## Customization

### Personal Information
Edit the `index.html` file to update:
- Your name and title in the hero section
- About me information
- Services you offer
- Portfolio items
- Resume/experience details
- Pricing plans
- Contact information

### Styling
Customize colors and styling in the `css/style.css` file. The main colors are defined as CSS variables at the top of the file:

```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #546de5;
    --dark-color: #2c3e50;
    --light-color: #ecf0f1;
    --grey-color: #7f8c8d;
    /* ... other variables ... */
}
```

### Images
Replace the placeholder images in the `images/` directory with your own:
- `hero-image.jpg` - Your profile or hero section image
- `about-image.jpg` - Image for the about section
- `portfolio-1.jpg` through `portfolio-6.jpg` - Your work samples
- `blog-1.jpg` through `blog-3.jpg` - Blog post thumbnails

## Notes
- The contact form is set up for demonstration purposes only. To make it functional, you'll need to implement server-side processing.
- All placeholder images should be replaced with your actual content before publishing the site.

## Next Steps
1. Replace all placeholder text with your actual information
2. Add your own images to the images folder
3. Customize colors and styling to match your personal brand
4. If needed, extend the blog.html page with your blog content
5. Deploy to your preferred hosting service
