from django.db import models
from django.contrib.auth.models import User
class Question(models.Model):
    text = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return self.text
# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.user.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.user.username
