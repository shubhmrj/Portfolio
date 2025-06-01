# Django Portfolio Website

This is a dynamic portfolio website built with Django. It allows you to showcase your skills, services, portfolio items, experiences, education, and more through a beautiful, responsive interface with a content management system.

## Features

- Responsive design
- Dynamic content management through Django admin
- Portfolio showcase with filtering by categories
- Contact form with message storage
- Resume/CV section with timeline
- Skills and services sections
- Animated statistics
- Smooth animations and transitions

## Installation

1. Clone the repository
2. Install the requirements:
   ```
   pip install -r requirements.txt
   ```
3. Apply migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
4. Create a superuser to access the admin panel:
   ```
   python manage.py createsuperuser
   ```
5. Run the development server:
   ```
   python manage.py runserver
   ```
6. Visit http://127.0.0.1:8000/ in your browser to see the website
7. Access the admin panel at http://127.0.0.1:8000/admin/ to manage your content

## Content Management

After creating a superuser, you can log in to the admin panel to add and manage your content:

1. **Skills**: Add your technical skills with proficiency percentages
2. **Services**: Add services you offer with descriptions and icons
3. **Portfolio**: Create categories and add portfolio items with images
4. **Experience**: Add your work experience with timeline
5. **Education**: Add your educational background
6. **About**: Add your personal information
7. **Contact**: Add your contact information
8. **Stats**: Update your statistics (projects completed, clients, etc.)

## Customization

You can customize the website by:

1. Modifying the templates in `portfolio_app/templates/`
2. Updating the CSS in `portfolio_app/static/css/`
3. Changing the JavaScript functionality in `portfolio_app/static/js/`

## Deployment

For production deployment:

1. Set `DEBUG = False` in settings.py
2. Configure your production database
3. Set up static files serving with a web server
4. Configure environment variables for sensitive information

## License

This project is open-source and available for personal and commercial use.
