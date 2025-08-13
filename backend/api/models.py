
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	bio = models.TextField(blank=True, null=True)
	profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.user.username
	
	def get_liked_notes_count(self):
		"""Return the count of notes liked by this user"""
		return self.liked_notes.count()
	
	def get_notes_count(self):
		"""Return the count of notes created by this user"""
		return self.user.notes.count()

class Note(models.Model):
	title = models.CharField(max_length=100)
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
	tags = models.CharField(max_length=100, blank=True, null=True)
	likes = models.ManyToManyField(UserProfile, related_name='liked_notes', blank=True)
	views = models.PositiveIntegerField(default=0)
	
	class Meta:
		ordering = ['-created_at']  # Show newest notes first
	
	def __str__(self):
		return self.title
	
	def get_likes_count(self):
		"""Return the number of likes for this note"""
		return self.likes.count()
	
	def get_comments_count(self):
		"""Return the number of comments for this note"""
		return self.comments.count()
	
	def increment_views(self):
		"""Increment the view count for this note"""
		self.views += 1
		self.save(update_fields=['views'])
	
	def is_liked_by_user(self, user):
		"""Check if the note is liked by a specific user"""
		if user.is_authenticated:
			try:
				user_profile = UserProfile.objects.get(user=user)
				return self.likes.filter(id=user_profile.id).exists()
			except UserProfile.DoesNotExist:
				return False
		return False
	
	def toggle_like(self, user):
		"""Toggle like status for a user"""
		if user.is_authenticated:
			user_profile, created = UserProfile.objects.get_or_create(user=user)
			if self.is_liked_by_user(user):
				self.likes.remove(user_profile)
				return False  # Unliked
			else:
				self.likes.add(user_profile)
				return True  # Liked
		return None
	
	def get_tags_list(self):
		"""Return tags as a list"""
		if self.tags:
			return [tag.strip() for tag in self.tags.split(',')]
		return []

class Comment(models.Model):
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
	note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='comments')
	
	class Meta:
		ordering = ['created_at']  # Show oldest comments first
	
	def __str__(self):
		return f'Comment by {self.author.username} on {self.note.title}'
	