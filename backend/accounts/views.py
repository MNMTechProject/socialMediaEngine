from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, Token
from rest_framework_simplejwt.authentication import JWTAuthentication as JWTAuth

from .serializers import UserDisplaySerializer, RegisterSerializer, LoginSerializer, UserSerializer
from .serializers import ProfileSerializer, FollowToggleSerializer

from .models import Profile

from django.contrib.auth import get_user_model
User = get_user_model()

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

class LogoutAPI(APIView):
    authentication_classes = (JWTAuth,)
    permission_classes = [IsAuthenticated]         

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')   # Get the refresh token from the request data
            token = RefreshToken(refresh_token)                 # Create token object from the refresh token
            token.blacklist()                                   # Blacklist the refresh token
            return Response(
                {"message": "Successfully logged out"}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

# Get User API
class UserAPI(generics.RetrieveAPIView):
    authentication_classes = (JWTAuth,)
    serializer_class = UserDisplaySerializer
    
    def get_object(self):
        # Get username from URL parameter
        username = self.kwargs.get('username')
        # Get the requested user, not the logged-in user
        return get_object_or_404(User, username=username)
    
    def get_serializer_context(self):
        """
        Pass request in context so serializer can access logged-in user
        for following status etc.
        """
        return {'request': self.request}

class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    authentication_classes = (JWTAuth,)  # Add this line
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class ProfileDetailView(generics.RetrieveAPIView):
    authentication_classes = (JWTAuth,)  # Add this line
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'request': self.request
        })
        return context
    
    lookup_field = 'user__username'
    lookup_url_kwarg = 'username'
    

class UserFollowView(APIView):
    authentication_classes = (JWTAuth,)  # Add this line
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username, *args, **kwargs):
        serializer = FollowToggleSerializer(
            data={'username': username}, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            toggle_user = get_object_or_404(User, username__iexact=username)
            is_following = Profile.objects.toggle_follow(request.user, toggle_user)
            
            return Response({
                'following': is_following,
                'message': f'Successfully {"followed" if is_following else "unfollowed"} {username}'
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)