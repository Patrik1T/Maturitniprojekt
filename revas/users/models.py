from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render

from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

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

from django.db import models

from django.db import models
from django.contrib.auth.models import User


class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='tests/')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Po uložení testu aktualizujeme statistiku počtu testů pro tento typ
        super().save(*args, **kwargs)
        self.test_type.update_statistics()

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



# Model pro otázky v testu
class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')  # Odkaz na test
    question_text = models.CharField(max_length=255)  # Text otázky
    correct_answer_index = models.IntegerField()  # Index správné odpovědi
    answers = models.JSONField()  # Odpovědi (JSON pole)

    def __str__(self):
        return self.question_text


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


class Test(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    # Přidejte pole image, pokud má být součástí modelu
    image = models.ImageField(upload_to='test_images/', null=True, blank=True)


def list_tests(request):
    tests = Test.objects.all()  # Načte všechny testy z databáze
    return render(request, 'verejne_testy.html', {'tests': tests})

class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, default=1)  # Příklad s výchozím testem


@csrf_exempt
def save_test(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            test = Test.objects.create(
                name=data['name'],
                description=data['description'],
                type=data.get('type', 'profil')  # Defaultní typ
            )
            for question_data in data['questions']:
                question = Question.objects.create(
                    test=test,
                    text=question_data['question']
                )
                for answer_data in question_data['answers']:
                    Answer.objects.create(
                        question=question,
                        text=answer_data['text'],
                        is_correct=answer_data['correct']
                    )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

from django.db import models

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)



    def ulozene_testy(request):
        tests = Test.objects.filter(type='profil')
        return render(request, 'ulozene_testy.html', {'tests': tests})

    def verejne_testy(request):
        tests = Test.objects.filter(type='verejne_testy')
        return render(request, 'verejne_testy.html', {'tests': tests})

from django.contrib.auth.models import AbstractUser

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


