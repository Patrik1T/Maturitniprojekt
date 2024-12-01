from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Question(models.Model):
    text = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.user.username



    class Profile(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

        def __str__(self):
            return self.user.username

