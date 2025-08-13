from django.contrib import admin
from .models import UserProfile, Note, Comment

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'bio']
    search_fields = ['user__username', 'user__email']
    list_filter = ['user__date_joined']
    readonly_fields = ['user']  # Make user field readonly since it's auto-assigned

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at', 'author']
    search_fields = ['title', 'content', 'author__username']
    readonly_fields = ['created_at', 'updated_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new object
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['content_preview', 'author', 'note', 'created_at']
    list_filter = ['created_at', 'author', 'note']
    search_fields = ['content', 'author__username', 'note__title']
    readonly_fields = ['created_at']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new object
            obj.author = request.user
        super().save_model(request, obj, form, change)
