python -m venv env
env/Scripts/activate.bat 
 source env/Scripts/activate
 pip install -r requirements.txt 
 django-admin startproject backend
 cd backend
 python3 manage.py startapp api

> settings.py

ALLOWED_HOSTS = ['*']


# Application definition

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

INSTALLED_APPS = [
    'rest_framework',
	"api",
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]

touch api/serializers.py
> 
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

> views.py
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

> backend/urls.py
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    # API URLs
	path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/users/', CreateUserView.as_view(), name='create-user'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
	path('api-auth/', include('rest_framework.urls')),
]

 python3 manage.py makemigrations
 python3 manage.py migrate

 > views.py

 class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

> models.py

from django.contrib.auth.models import User
# Create your models here.

class Note(models.Model):
	title = models.CharField(max_length=100)
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    
	def __str__(self):
		return self.title

> serializers

from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}

> views.py

class NoteListCreateView(generics.ListCreateAPIView):
#	queryset = Note.objects.all()
	serializer_class = NoteSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		# Return notes authored by the authenticated user
		user = self.request.user
		return Note.objects.filter(author=user)
	def perform_create(self, serializer):
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
	
	<!-- def perform_update(self, serializer):
		if serializer.is_valid():
			serializer.save(author=self.request.user)
		else:
			print(serializer.errors) -->

touch api/urls.py
>
from django.urls import path, include
from . import views


urlpatterns = [
	path('notes/', views.NoteListCreate.as_view(), name='note-list'),
	path('notes/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
]

> /backend/urls.py
>
	path('api/', include('api.urls')),

# FRONTEND START
from root folder
 npm create vite@latest frontend -- --template react

 cd frontend
  npm install
  npm run dev

  $ npm install axios react-router-dom jwt-decode

/frontend/src
> mkdir styles, pages
> touch constants.js, api.js

> constants.js

export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

> api.js

import axios from 'axios';
import {  ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
   baseURL: import .meta.env.VITE_API_URL
});

api.interceptors.request.use(config => {
   const token = localStorage.getItem(ACCESS_TOKEN);
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
}
, error => {
   return Promise.reject(error);
});

export default api;


> .env
VITE_API_URL="http://localhost:8000/api"


> touch components/ProtectedRoute.jsx
>
import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import api from '../api';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import React, {useState, useEffect} from 'react';

function ProtectedRoute({children}) {
  const [isAuthorized, setAuthorized] = useState(false);

  useEffect(() => {
		auth().catch(() => {
			setAuthorized(false);
		});
	}, []);

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);
	try {
		const response = await api.post('/auth/api/refresh/', {
			refresh: refreshToken,
		});
		if (response.status == 200) {
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			setAuthorized(true);
		}
		else {
			setAuthorized(false);
		}
	} catch (error) {
		console.error('Error refreshing token:', error);
		}



	const token = localStorage.getItem(ACCESS_TOKEN);
	if (!token) {
		setAuthorized(false);
		return;
	}
	const decoded = jwtDecode(token);
	const tokenExpiration = decoded.exp;
	if (tokenExpiration * 1000 < Date.now()) {
		await refreshToken();
	} else {
		setAuthorized(true);
		return;
	}
  };

  useEffect(() => {
	const token = localStorage.getItem(ACCESS_TOKEN);
	if (token) {
	  const decoded = jwtDecode(token);
	  if (decoded.exp * 1000 < Date.now()) {
		refreshToken();
	  } else {
		setAuthorized(true);
	  }
	}
  }, []);

  // Check if the user is authorized
  return isAuthorized ? ( <>{children}</> ) : <Navigate to="/login" />;
}

export default ProtectedRoute;

> Touch pages/ Login.jsx, Home.jsx, Register.jsx, NotFound.jsx
> in all, just change names etc
function Register() {
  return (
    <div>
      <h1>Welcome to the Register Page</h1>
    </div>
  );
}

export default Register;

> App.jsx
