from rest_framework import serializers, permissions

from .models import Profile
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model, authenticate
from django.urls import reverse_lazy

User = get_user_model()

class UserDisplaySerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    recommended = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'follower_count',
            'following',
            'recommended',
            'url',
        ]
        
    def get_follower_count(self, obj):
        return User.objects.filter(profile__following=obj).count()

    def get_url(self, obj):
        return reverse_lazy("accounts:profile", kwargs={"username": obj.username})

    def get_following(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        profile, created = Profile.objects.get_or_create(user=request.user)
        return Profile.objects.is_following(profile, obj)

    def get_recommended(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []
            
        profile, created = Profile.objects.get_or_create(user=obj)
        recommended = Profile.objects.recommended(profile.user)
        # Convert QuerySet to list of usernames for serialization
        return [user.username for user in recommended]

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'username', 
            'email',
            'bio',
            'privacy',
            'nsfw_filter',
            'profilePic',
            'coverPic'
        ]

    def update(self, instance, validated_data):
        instance.bio = validated_data.get('bio', instance.bio)
        instance.privacy = validated_data.get('privacy', instance.privacy)
        instance.nsfw_filter = validated_data.get('nsfw_filter', instance.nsfw_filter)
        instance.profilePic = validated_data.get('profilePic', instance.profilePic)
        instance.coverPic = validated_data.get('coverPic', instance.coverPic)
        instance.save()
        return instance
      
class FollowToggleSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    
    def validate_username(self, value):
        try:
            user = User.objects.get(username__iexact=value)
            if user == self.context['request'].user:
                raise serializers.ValidationError("You cannot follow yourself.")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
          
# TRAVERSKY MEDIA STUFF
# User Serializer
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

    return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
  username = serializers.CharField()
  password = serializers.CharField()

  def validate(self, data):
    user = authenticate(**data)
    if user and user.is_active:
      return user
    raise serializers.ValidationError("Incorrect Credentials")