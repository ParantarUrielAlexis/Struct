# api/urls.py
from django.urls import path
from .views import UserRegistrationView, LoginView, ClassCreateView, JoinClassView, UserClassesView, UserLogView

# These URLs will be included under the /api/ prefix
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('classes/create/', ClassCreateView.as_view(), name='create_class'),
    path('classes/join/', JoinClassView.as_view(), name='join_class'),
    path('classes/user/', UserClassesView.as_view(), name='user_classes'),
    path('user-logs/', UserLogView.as_view(), name='user-logs'),
    # Add other API endpoints here
    # path('login/', LoginView.as_view(), name='login'),
    # path('users/', UserListView.as_view(), name='user-list'),
    # etc.
]