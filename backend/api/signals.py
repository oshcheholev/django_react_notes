from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create a UserProfile instance when a new User is created.
    """
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Save the UserProfile instance when the User is saved.
    This ensures the profile exists and is saved even if it was created manually.
    """
    if hasattr(instance, 'userprofile'):
        instance.userprofile.save()
    else:
        # If for some reason the profile doesn't exist, create it
        UserProfile.objects.create(user=instance)
