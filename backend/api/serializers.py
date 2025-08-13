
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Comment, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'bio', 'profile_picture']
    
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            else:
                # Fallback for when request context is not available
                return f"/media/{obj.profile_picture.name}"
        return None
        
class UserWithProfileSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'userprofile']

class CommentSerializer(serializers.ModelSerializer):
	author_username = serializers.CharField(source='author.username', read_only=True)

	class Meta:
		model = Comment
		fields = ['id', 'content', 'created_at', 'author', 'note', 'author_username']
		extra_kwargs = {'author': {'read_only': True}, 'note': {'read_only': True}}

class NoteSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author', 'author_username', 'comments', 'comments_count', 'likes_count', 'is_liked_by_user']
        extra_kwargs = {'author': {'read_only': True}}
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_likes_count(self, obj):
        return obj.get_likes_count()
    
    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.is_liked_by_user(request.user)
        return False
