from django.db import models
from django.utils.text import slugify

class Skill(models.Model):
    name = models.CharField(max_length=100)
    percentage = models.IntegerField()
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, help_text="FontAwesome icon class")
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']

class PortfolioCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Portfolio Categories"

class PortfolioItem(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='portfolio/')
    link = models.URLField(blank=True)
    categories = models.ManyToManyField(PortfolioCategory, related_name='portfolio_items')
    date_created = models.DateField()
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    @property
    def categories_as_string(self):
        return " ".join([category.slug for category in self.categories.all()])
    
    class Meta:
        ordering = ['order', '-date_created']

class Experience(models.Model):
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.CharField(max_length=20)  # Using CharField for flexibility (e.g., "Jan 2020")
    end_date = models.CharField(max_length=20)  # Using CharField for flexibility (e.g., "Present")
    skills = models.ManyToManyField(Skill, blank=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.title} at {self.company}"
    
    class Meta:
        ordering = ['order']

class Education(models.Model):
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    start_date = models.CharField(max_length=20)
    end_date = models.CharField(max_length=20)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.degree} at {self.institution}"
    
    class Meta:
        ordering = ['order']
        verbose_name_plural = "Education"

class About(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    freelance_status = models.CharField(max_length=20, default="Available")
    cv_url = models.FileField(upload_to='cv/', blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "About"

class Contact(models.Model):
    location = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True)
    
    def __str__(self):
        return self.email

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
    
    class Meta:
        ordering = ['-date_sent']

class Stats(models.Model):
    projects_completed = models.IntegerField(default=0)
    happy_clients = models.IntegerField(default=0)
    hours_worked = models.IntegerField(default=0)
    awards_won = models.IntegerField(default=0)
    
    def __str__(self):
        return "Portfolio Statistics"
    
    class Meta:
        verbose_name_plural = "Stats"
