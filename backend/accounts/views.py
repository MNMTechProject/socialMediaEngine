from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from .serializers import UserDisplaySerializer, RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Create your views here
# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            "user": UserDisplaySerializer(user, context=self.get_serializer_context()).data,
            "token": tokens
        })

# Login API
class LoginAPI(generics.GenericAPIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data  # Adjusted to expect a user object directly

        if user:
            tokens = get_tokens_for_user(user)
            return Response({
                "user": UserDisplaySerializer(user, context=self.get_serializer_context()).data,
                "tokens": tokens
            })
        else:
            return Response({"error": "Invalid credentials"}, status=400)

# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserDisplaySerializer

    def get_object(self):
        return self.request.user
    
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)  # Fetch user by username from URL
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        serializer = UserDisplaySerializer(user)
        return Response(serializer.data)
