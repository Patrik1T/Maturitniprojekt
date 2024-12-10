from django.shortcuts import render
from django.http import HttpResponse
from .forms import RegistrationForm
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
import random
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import RegistrationForm
from django.contrib.auth.models import User
from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
import stripe
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import render, redirect
from .models import Game, Player, QuestionPair
from .forms import QuestionPairForm



# Nastavení Stripe
stripe.api_key = settings.STRIPE_TEST_SECRET_KEY




def main_page(request):
    return render(request, 'main_page.html')

def ano_ne(request):
    return render(request, 'ano_ne.html')

def dvere_hra(request):
    return render(request, 'dvere_hra.html')

def github_log(request):
    return render(request, 'github_log.html')

def google_log(request):
    return render(request, 'google_log.html')

def hlavni_stranka(request):
    return render(request, 'hlavni_stranka.html')

def klikaci_hra(request):
    return render(request, 'klikaci_hra.html')

def kosik(request):
    return render(request, 'kosik.html')

def kosiky(request):
    return render(request, 'kosiky.html')

def kviz(request):
    return render(request, 'kviz.html')

def login(request):
    return render(request, 'login.html')

def piskvorky(request):
    return render(request, 'piskvorky.html')

def pexeso(request):
    return render(request, 'pexeso.html')

def prihlasovacistranka(request):
    return render(request, 'prihlasovacistranka.html')

def profil(request):
    return render(request, 'profil.html')

def psaci_testy(request):
    return render(request, 'psaci_testy.html')

def spojovacka(request):
    return render(request, 'spojovacka.html')

def tabulka(request):
    return render(request, 'tabulka.html')

def testy(request):
    return render(request, 'testy.html')

def ulozene_testy(request):
    return render(request, 'ulozene_testy.html')

def verejne_testy(request):
    return render(request, 'verejne_testy.html')

def vytvor_test(request):
    return render(request, 'vytvor_test.html')

def programovaci_test(request):
    return render(request, 'programovaci_test.html')

def maraton(request):
    return render(request, 'maraton.html')

def labyrint(request):
    return render(request, 'labyrint.html')

def lov_pokladu(request):
    return render(request, 'lov_pokladu.html')

def Multi_test(request):
    return render(request, 'Multi_test.html')

def flappy_bird(request):
    return render(request, 'flappy_bird.html')

def obesenec(request):
    return render(request, 'obesenec.html')

def klikaci(request):
    return render(request, 'klikaci.html')

def nakup(request):
    return render(request, 'nakup.html')

def logout(request):
    return render(request, 'logout.html')

def vice(request):
    return render(request, 'vice.html')

def sparovaci_stranka_moodle(request):
    return render(request, 'sparovaci_stranka_moodle.html')

def sparovaci_stranka_github(request):
    return render(request, 'sparovaci_stranka_github.html')

def snake(request):
    return render(request, 'snake.html')

def chytacka(request):
    return render(request, 'chytacka.html')

def labyrint(request):
    return render(request, 'labyrint.html')

def tetris(request):
    return render(request, 'tetris.html')

def nahoda(request):
    return render(request, 'nahoda.html')

def vyber_testy(request):
    return render(request, 'vyber_testy.html')

def piskvorky(request):
    return render(request, 'piskvorky')

def spravy(request):
    return render(request, 'spravy')

def moodlelog(request):
    # další logika pro zpracování přihlášení nebo dat
    return render(request, 'moodlelog.html')


def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST, request.FILES)
        if form.is_valid():
            # Získání hodnot z formuláře
            username = form.cleaned_data['username']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            profile_picture = form.cleaned_data['profile_picture']

            # Vytvoření uživatele
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password
            )

            # Nastavení profilového obrázku, pokud je součástí formuláře
            if profile_picture:
                user.profile.profile_picture = profile_picture
                user.profile.save()

            messages.success(request, "Úspěšně jste se zaregistrovali.")
            return redirect('login')  # Přesměrování na přihlašovací stránku
        else:
            messages.error(request, "Formulář obsahuje chyby.")
    else:
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})


def vytvor_test(request):
    if request.method == 'POST':
        # Zde bude logika pro zpracování testu
        total_questions = 0
        # Počítáme otázky
        for key in request.POST:
            if key.startswith('question') and key.endswith('_text'):
                total_questions += 1

        # Získáme všechny otázky a odpovědi
        questions_data = []
        for i in range(1, total_questions + 1):
            question_text = request.POST.get(f'question{i}_text')
            correct_answer = request.POST.get(f'question{i}_answer')
            options = [
                request.POST.get(f'question{i}_option1'),
                request.POST.get(f'question{i}_option2'),
                request.POST.get(f'question{i}_option3'),
                request.POST.get(f'question{i}_option4')
            ]
            questions_data.append({
                'question': question_text,
                'options': options,
                'correct_answer': correct_answer,
            })

        # Testová data jsou připravena pro další zpracování
        return HttpResponse(f"Test s {total_questions} otázkami byl úspěšně odeslán.")

    return render(request, 'vytvor_test.html')

def generate_verification_code():
    return str(random.randint(100000, 999999))  # 6místný kód



# Funkce pro ověření kódu
def verify_code(request):
    if request.method == 'POST':
        entered_code = request.POST.get('verification_code')

        # Ověření, zda zadaný kód odpovídá kódu v session
        if entered_code == request.session.get('verification_code'):
            # Uložení nového uživatele do databáze
            user = User.objects.create_user(
                username=request.session.get('username'),
                email=request.session.get('email'),
                password=request.session.get('password')
            )

            # Přihlášení uživatele
            login(request, user)
            messages.success(request, 'Úspěšná registrace!')
            return redirect('profile')  # Přesměrování na profilovou stránku
        else:
            messages.error(request, 'Neplatný kód.')

    return render(request, 'users/verify_code.html')

class LoginView(LoginView):
    template_name = 'prihlasovacistranka.html'


def custom_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # Přesměrování po úspěšném přihlášení
        else:
            # Pokud přihlášení neproběhlo
            return render(request, 'prihlasovacistranka.html', {'error': 'Neplatné přihlašovací údaje'})
    else:
        return render(request, 'prihlasovacistranka.html')

    from django.db import models
    from django.contrib.auth.models import User

    class Profile(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
        age = models.IntegerField(null=True)
        gender = models.CharField(max_length=1, choices=[('M', 'Muži'), ('F', 'Ženy')])

        def __str__(self):
            return f'{self.user.username} Profile'


@csrf_exempt
def create_checkout_session(request):
    if request.method == "POST":
        data = json.loads(request.body)
        cart = data.get('items', [])

        # Vytvoření položek pro Checkout session
        line_items = []
        for item in cart:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item['item'],
                    },
                    'unit_amount': item['price'] * 100,  # Cena v centách
                },
                'quantity': 1,
            })

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:8000/success/',
                cancel_url='http://localhost:8000/cancel/',
            )
            return JsonResponse({'id': checkout_session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)})

# Endpointy pro úspěch a zrušení platby
def success(request):
    return render(request, 'success.html')

def cancel(request):
    return render(request, 'cancel.html')

import stripe
import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def create_checkout_session(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            items = data.get('items', [])

            line_items = []
            for item in items:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': item['item'],
                        },
                        'unit_amount': item['price'] * 100,  # Cena je v centech
                    },
                    'quantity': 1,
                })

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=settings.FRONTEND_URL + '/success/',
                cancel_url=settings.FRONTEND_URL + '/cancel/',
            )

            return JsonResponse({'id': session.id})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# Pohled pro vytvoření nové hry
def create_game(request):
    if request.method == "POST":
        name = request.POST['name']
        time_limit = int(request.POST['time_limit'])
        points_per_pair = int(request.POST['points_per_pair'])
        num_players = int(request.POST['num_players'])

        game = Game.objects.create(
            name=name,
            time_limit=time_limit,
            points_per_pair=points_per_pair,
            num_players=num_players
        )

        # Přidání hráčů do hry
        for i in range(num_players):
            player_name = f"Player {i + 1}"
            player = Player.objects.create(username=player_name)
            game.players.add(player)

        return redirect('game_detail', game_id=game.id)
    return render(request, 'create_game.html')

# Pohled pro zobrazení detailu hry
def game_detail(request, game_id):
    game = Game.objects.get(id=game_id)
    question_pairs = QuestionPair.objects.all()
    return render(request, 'game_detail.html', {'game': game, 'question_pairs': question_pairs})

# Pohled pro přidání párů otázek a odpovědí
def add_question_pair(request):
    if request.method == 'POST':
        form = QuestionPairForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('game_detail', game_id=form.instance.game.id)
    else:
        form = QuestionPairForm()
    return render(request, 'add_question_pair.html', {'form': form})