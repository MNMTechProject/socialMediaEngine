from django.urls import path

from .views import ( 
    LoginAPI, 
    LogoutAPI, 
    RegisterAPI, 
    UserAPI,
    ProfileDetailView,
    UserFollowView,
    ProfileUpdateAPIView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'accounts'

urlpatterns = [
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', LogoutAPI.as_view(), name='logout'),
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('<username>', UserAPI.as_view(), name='profile'),
    
    path('<username>/', ProfileDetailView.as_view(), name='profile'),
    path('<username>/follow', UserFollowView.as_view(), name='follow'),
    path('<username>/edit', ProfileUpdateAPIView.as_view(), name='edit'),
]
