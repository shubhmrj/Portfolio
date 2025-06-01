from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.http import require_POST
from .models import (
    Skill, Service, PortfolioCategory, PortfolioItem,
    Experience, Education, About, Contact, ContactMessage, Stats
)

def home(request):
    # Get all the data needed for the homepage
    skills = Skill.objects.all()
    services = Service.objects.all()
    portfolio_categories = PortfolioCategory.objects.all()
    portfolio_items = PortfolioItem.objects.all()
    experiences = Experience.objects.all()
    educations = Education.objects.all()
    
    # Get single instance models
    about = About.objects.first()
    contact = Contact.objects.first()
    stats = Stats.objects.first()
    
    # If stats doesn't exist, create default stats
    if not stats:
        stats = Stats.objects.create(
            projects_completed=150,
            happy_clients=65,
            hours_worked=1200,
            awards_won=8
        )
    
    context = {
        'skills': skills,
        'services': services,
        'portfolio_categories': portfolio_categories,
        'portfolio_items': portfolio_items,
        'experiences': experiences,
        'educations': educations,
        'about': about,
        'contact': contact,
        'stats': stats,
    }
    
    return render(request, 'portfolio_app/index.html', context)

@require_POST
def contact_form(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Create a new contact message
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # If AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': True, 'message': 'Your message has been sent successfully!'})
        
        # If normal form submission
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home')
    
    return redirect('home')
