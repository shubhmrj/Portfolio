from django.core.management.base import BaseCommand
from django.utils import timezone
from portfolio_app.models import (
    Skill, Service, PortfolioCategory, PortfolioItem,
    Experience, Education, About, Contact, Stats
)

class Command(BaseCommand):
    help = 'Populates the database with initial portfolio data'

    def handle(self, *args, **options):
        self.stdout.write('Creating initial portfolio data...')
        
        # Create About data
        if not About.objects.exists():
            about = About.objects.create(
                name='Shubham Raj',
                title='Web Developer & UI/UX Designer',
                description='I am a passionate web developer and UI/UX designer with over 5 years of experience creating beautiful, functional websites and applications. I specialize in front-end development, responsive design, and creating intuitive user experiences.',
                email='contact@shubhamraj.com',
                phone='+91 9876543210',
                location='Mumbai, India',
                freelance_status='Available'
            )
            self.stdout.write(self.style.SUCCESS(f'Created About: {about}'))
        
        # Create Contact information
        if not Contact.objects.exists():
            contact = Contact.objects.create(
                location='Mumbai, Maharashtra, India',
                email='contact@shubhamraj.com',
                phone='+91 9876543210',
                website='www.shubhamraj.com'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Contact: {contact}'))
        
        # Create Stats
        if not Stats.objects.exists():
            stats = Stats.objects.create(
                projects_completed=150,
                happy_clients=65,
                hours_worked=1200,
                awards_won=8
            )
            self.stdout.write(self.style.SUCCESS(f'Created Stats: {stats}'))
        
        # Create Skills
        skills_data = [
            {'name': 'HTML/CSS', 'percentage': 95, 'order': 1},
            {'name': 'JavaScript', 'percentage': 90, 'order': 2},
            {'name': 'React', 'percentage': 85, 'order': 3},
            {'name': 'Python', 'percentage': 80, 'order': 4},
            {'name': 'Django', 'percentage': 75, 'order': 5},
            {'name': 'UI/UX Design', 'percentage': 85, 'order': 6},
        ]
        
        for skill_data in skills_data:
            skill, created = Skill.objects.get_or_create(
                name=skill_data['name'],
                defaults={
                    'percentage': skill_data['percentage'],
                    'order': skill_data['order']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Skill: {skill}'))
        
        # Create Services
        services_data = [
            {
                'title': 'Web Development',
                'description': 'Custom website development using the latest technologies to create responsive, fast-loading websites optimized for search engines.',
                'icon': 'fas fa-code',
                'order': 1
            },
            {
                'title': 'UI/UX Design',
                'description': 'User-centered design approach to create intuitive interfaces and seamless user experiences that engage and convert visitors.',
                'icon': 'fas fa-pencil-ruler',
                'order': 2
            },
            {
                'title': 'Mobile App Development',
                'description': 'Native and cross-platform mobile application development for iOS and Android using React Native and Flutter.',
                'icon': 'fas fa-mobile-alt',
                'order': 3
            },
            {
                'title': 'E-commerce Solutions',
                'description': 'End-to-end e-commerce website development with secure payment gateways, inventory management, and customer relationship tools.',
                'icon': 'fas fa-shopping-cart',
                'order': 4
            },
        ]
        
        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                title=service_data['title'],
                defaults={
                    'description': service_data['description'],
                    'icon': service_data['icon'],
                    'order': service_data['order']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Service: {service}'))
        
        # Create Portfolio Categories
        categories_data = [
            {'name': 'Web Development'},
            {'name': 'UI/UX Design'},
            {'name': 'Mobile App'},
            {'name': 'Branding'}
        ]
        
        created_categories = []
        for category_data in categories_data:
            category, created = PortfolioCategory.objects.get_or_create(
                name=category_data['name']
            )
            created_categories.append(category)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Category: {category}'))
        
        # Create Experience entries
        experiences_data = [
            {
                'title': 'Senior Web Developer',
                'company': 'TechCorp Inc.',
                'description': 'Led the front-end development team in creating responsive web applications using React and Redux. Implemented CI/CD pipelines and improved page load times by 40%.',
                'start_date': 'Jan 2020',
                'end_date': 'Present',
                'order': 1
            },
            {
                'title': 'UI/UX Designer',
                'company': 'DesignHub',
                'description': 'Created user interfaces and experiences for web and mobile applications. Conducted user research and usability testing to optimize designs.',
                'start_date': 'Mar 2018',
                'end_date': 'Dec 2019',
                'order': 2
            },
            {
                'title': 'Junior Developer',
                'company': 'WebSolutions',
                'description': 'Developed and maintained websites for clients using HTML, CSS, JavaScript, and PHP. Collaborated with designers to implement responsive designs.',
                'start_date': 'Jun 2016',
                'end_date': 'Feb 2018',
                'order': 3
            },
        ]
        
        for exp_data in experiences_data:
            experience, created = Experience.objects.get_or_create(
                title=exp_data['title'],
                company=exp_data['company'],
                defaults={
                    'description': exp_data['description'],
                    'start_date': exp_data['start_date'],
                    'end_date': exp_data['end_date'],
                    'order': exp_data['order']
                }
            )
            if created:
                # Add some skills to each experience
                skills_to_add = Skill.objects.all()[:3]
                for skill in skills_to_add:
                    experience.skills.add(skill)
                self.stdout.write(self.style.SUCCESS(f'Created Experience: {experience}'))
        
        # Create Education entries
        education_data = [
            {
                'degree': 'Master of Computer Science',
                'institution': 'University of Technology',
                'description': 'Specialized in Web Technologies and Human-Computer Interaction. Graduated with distinction.',
                'start_date': '2014',
                'end_date': '2016',
                'order': 1
            },
            {
                'degree': 'Bachelor of Computer Applications',
                'institution': 'City College',
                'description': 'Focused on programming fundamentals, data structures, and web development basics.',
                'start_date': '2011',
                'end_date': '2014',
                'order': 2
            },
        ]
        
        for edu_data in education_data:
            education, created = Education.objects.get_or_create(
                degree=edu_data['degree'],
                institution=edu_data['institution'],
                defaults={
                    'description': edu_data['description'],
                    'start_date': edu_data['start_date'],
                    'end_date': edu_data['end_date'],
                    'order': edu_data['order']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Education: {education}'))
        
        self.stdout.write(self.style.SUCCESS('Initial data population complete!'))
