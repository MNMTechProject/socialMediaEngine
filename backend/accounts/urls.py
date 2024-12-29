from django.urls import path

from .views import LoginAPI, RegisterAPI, UserAPI
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'accounts'

urlpatterns = [
    path('login/', LoginAPI.as_view()),
    path('signup/', RegisterAPI.as_view()),
    path('<username>', UserAPI.as_view(), name='profile'),
]
