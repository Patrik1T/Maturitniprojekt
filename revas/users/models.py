from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.recipient or 'Public'}: {self.text[:30]}"


class TestType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name


class UserStatistics(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_tests_created = models.PositiveIntegerField(default=0)
    test_statistics = models.JSONField(default=dict)  # Abychom uložili počty pro různé typy testů

    def __str__(self):
        return f"Statistiky pro {self.user.username}"

    def update_statistics(self, test_type_name):
        # Zvětšíme počet pro daný typ testu
        if test_type_name in self.test_statistics:
            self.test_statistics[test_type_name] += 1
        else:
            self.test_statistics[test_type_name] = 1
        self.total_tests_created += 1
        self.save()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='avatars/', null=True, blank=True)
    displayname = models.CharField(max_length=20, null=True, blank=True)
    info = models.TextField(null=True, blank=True)

    def __str__(self):
        return str(self.user)

    @property
    def name(self):
        if self.displayname:
            return self.displayname
        return self.user.username

class CustomUser(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # Přidáno pole created_at

    def __str__(self):
        return self.name



class TestModel(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    questions = models.TextField()  # Pokud má být `questions` textové pole

class Question(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

class Comment(models.Model):
    question = models.ForeignKey(Question, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Vztah k uživatelskému účtu
    content = models.TextField()  # Text zápisku
    created_at = models.DateTimeField(auto_now_add=True)  # Datum a čas vytvoření
    updated_at = models.DateTimeField(auto_now=True)  # Datum a čas poslední úpravy

    def __str__(self):
        return self.content[:50]  # Zobrazí první část zápisku pro přehled

content = models.TextField(default="Výchozí text")


class TestDownloadStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    html_count = models.IntegerField(default=0)
    xml_count = models.IntegerField(default=0)
    json_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Test Download Stats"
