from django.db import models

# Create your models here.
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class ProfileManager(models.Manager):
    use_for_related_fields = True

    def all(self):
        qs = self.get_queryset().all()
        try: 
            if self.instance:
                qs = qs.exclude(user=self.instance)
        except:
            pass
        return qs

    def toggle_follow(self, user, to_toggle_user):
        profile = Profile.objects.get(user=user)
        if to_toggle_user in profile.following.all():
            profile.following.remove(to_toggle_user)
            is_now_following = False
        else:
            profile.following.add(to_toggle_user)
            is_now_following = True
        return is_now_following

    def is_following(self, user, followed_by_user):
        user_profile, created = Profile.objects.get_or_create(user=user)
        if created:
            return False
        if followed_by_user in user_profile.following.all():
            return True
        return False

    def recommended(self, user, limit_to=5):
        profile = user.profile
        following = profile.get_following()
        qs = self.get_queryset().exclude(user__in=following).exclude(id=profile.id).order_by("?")[:limit_to]
        return qs

class Profile(models.Model):
    user            = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio             = models.TextField(max_length=200, default="")
    following       = models.ManyToManyField(User, blank=True, related_name='followed_by')
    blocked         = models.ManyToManyField(User, blank=True, related_name='blocked_by')
    privacy         = models.BooleanField(default=False)
    nsfw_filter     = models.BooleanField(default=True)
    profilePic      = models.ImageField(upload_to='profilePics/', null=True)
    coverPic        = models.ImageField(upload_to='coverPics/', null=True)
    objects         = ProfileManager()

    def __str__(self):
        return str(self.user.username)

    def get_following(self):
        users = self.following.all()
        return users.exclude(username=self.user.username)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
   