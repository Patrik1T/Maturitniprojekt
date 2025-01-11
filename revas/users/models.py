from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
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

    @property
    def avatar(self):
        if self.image:
            return self.image.url
        return f'{settings.STATIC_URL}images/avatar.svg'





class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Muži'), ('F', 'Ženy')], null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username



# Model pro hráče
class Player(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.username




# Model pro hru
class Game(models.Model):
    name = models.CharField(max_length=100)
    time_limit = models.IntegerField()  # časový limit v sekundách
    points_per_pair = models.IntegerField()  # body za správný pár
    num_players = models.IntegerField()  # počet hráčů
    players = models.ManyToManyField(Player, related_name="games")

    def __str__(self):
        return self.name


# Model pro herní sezení (uchovává výsledky pro jednotlivé hry)
class GameSession(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    time_spent = models.IntegerField()  # čas, který hráč strávil při hře v sekundách
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game: {self.game.name}, Player: {self.player.username}, Score: {self.score}"



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



from django.db import models

class Test(models.Model):  # Zkontroluj, že třída má tento název
    title = models.CharField(max_length=100)
    description = models.TextField()

from django.db import models

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
