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
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=[('M', 'Muži'), ('F', 'Ženy')], null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.user.username



    class Profile(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

        def __str__(self):
            return self.user.username


# Model pro hráče
class Player(models.Model):
    username = models.CharField(max_length=100)
    score = models.IntegerField(default=0)

    def __str__(self):
        return self.username


# Model pro otázku a odpověď (pár)
class QuestionPair(models.Model):
    question_text = models.CharField(max_length=255)
    answer_text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.question_text} - {self.answer_text}"


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