from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer, NoteSerializer, CommentSerializer, UserProfileSerializer, UserWithProfileSerializer
from .models import Note, Comment, UserProfile
# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class NoteListCreate(generics.ListCreateAPIView):
#	queryset = Note.objects.all()
	serializer_class = NoteSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		# Return notes authored by the authenticated user
		user = self.request.user
		return Note.objects.all()  #.filter(author=user)
	def perform_create(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors)

class NoteEdit(generics.RetrieveUpdateAPIView):
	serializer_class = NoteSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		# Return notes authored by the authenticated user
		user = self.request.user
		return Note.objects.filter(author=user)

	def perform_update(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors)

class NoteDelete(generics.RetrieveUpdateDestroyAPIView):
#	queryset = Note.objects.all()
	serializer_class = NoteSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		# Return notes authored by the authenticated user
		user = self.request.user
		return Note.objects.filter(author=user)
	
	# def perform_update(self, serializer):
	# 	if serializer.is_valid():
	# 		serializer.save(author=self.request.user)
	# 	else:
	# 		print(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user's information with profile"""
    serializer = UserWithProfileSerializer(request.user, context={'request': request})
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    """Get or update user profile"""
    try:
        user = User.objects.get(id=user_id)
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Only allow users to update their own profile
            if request.user != user:
                return Response({'error': 'Permission denied'}, status=403)
            
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
            
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

class CommentListCreate(generics.ListCreateAPIView):
	serializer_class = CommentSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		note_id = self.kwargs.get('note_id')
		return Comment.objects.filter(note_id=note_id).order_by('created_at')
	
	def perform_create(self, serializer):
		note_id = self.kwargs.get('note_id')
		note = Note.objects.get(id=note_id)
		serializer.save(author=self.request.user, note=note)




