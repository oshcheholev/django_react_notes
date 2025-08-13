from django.urls import path, include
from . import views


urlpatterns = [
	path('notes/', views.NoteListCreate.as_view(), name='note-list'),
	path('notes/<int:pk>/', views.NoteDelete.as_view(), name='note-detail'),
	path('notes/<int:note_id>/comments/', views.CommentListCreate.as_view(), name='note-comments'),

	path('notes/<int:note_id>/toggle-like/', views.ToggleLikeNote.as_view(), name='toggle-like-note'),
	path('user/me/', views.get_current_user, name='current-user'),
	path('user/<int:user_id>/profile/', views.user_profile, name='user-profile'),

]