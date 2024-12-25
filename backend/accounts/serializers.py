from rest_framework import serializers

from accounts.models import Profile
from django.contrib.auth import get_user_model, authenticate
from django.urls import reverse_lazy

User = get_user_model()

class UserDisplaySerializer(serializers.ModelSerializer):
    follower_count  = serializers.SerializerMethodField()
    url             = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'follower_count',
            'url'
            #'profilePic'
        ]

    def get_follower_count(self, obj):
        return 0 #Profile.objects.get(user=User.username()).followed_by.count()

    def get_url(self, obj):
        return reverse_lazy("accounts:profile", kwargs={"username": obj.username})


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