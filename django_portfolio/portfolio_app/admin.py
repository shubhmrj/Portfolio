from django.contrib import admin
from .models import (
    Skill, Service, PortfolioCategory, PortfolioItem,
    Experience, Education, About, Contact, ContactMessage, Stats
)

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'percentage', 'order')
    list_editable = ('percentage', 'order')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    list_editable = ('icon', 'order')
    search_fields = ('title', 'description')

@admin.register(PortfolioCategory)
class PortfolioCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'date_created', 'featured', 'order')
    list_editable = ('featured', 'order')
    list_filter = ('categories', 'featured')
    search_fields = ('title', 'subtitle', 'description')
    filter_horizontal = ('categories',)

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'end_date', 'order')
    list_editable = ('order',)
    search_fields = ('title', 'company', 'description')
    filter_horizontal = ('skills',)

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date', 'order')
    list_editable = ('order',)
    search_fields = ('degree', 'institution', 'description')

@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'phone', 'location')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'location', 'website')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'date_sent', 'is_read')
    list_filter = ('is_read', 'date_sent')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'date_sent')
    list_editable = ('is_read',)

@admin.register(Stats)
class StatsAdmin(admin.ModelAdmin):
    list_display = ('projects_completed', 'happy_clients', 'hours_worked', 'awards_won')
    list_editable = ('happy_clients', 'hours_worked', 'awards_won')
