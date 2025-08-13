
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	bio = models.TextField(blank=True, null=True)
	profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

	def __str__(self):
		return self.user.username

class Note(models.Model):
	title = models.CharField(max_length=100)
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    
	def __str__(self):
		return self.title

class Comment(models.Model):
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
	note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='comments')

	def __str__(self):
		return f'Comment by {self.author.username} on {self.note.title}'
	