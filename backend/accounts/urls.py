from django.urls import path

from .views import TestView, LoginView, SignUpView, ProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('<userID>', ProfileView.as_view()),
]
