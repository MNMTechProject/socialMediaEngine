from django.urls import path

from .views import LoginAPI, RegisterAPI, UserAPI
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('login/', LoginAPI.as_view()),
    path('signup/', RegisterAPI.as_view()),
    path('<userID>', UserAPI.as_view()),
]
