from .models import Game, Player, UserStatistics, TestType

from django.contrib.auth import authenticate, login

from django.contrib import messages

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Message

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



from .forms import *

def main_page(request):
    return render(request, 'main_page.html')

def github_log(request):
    return render(request, 'github_log.html')

def moodlelog(request):
    return render(request, 'moodlelog.html')

def google_log(request):
    return render(request, 'google_log.html')

def hlavni_stranka(request):
    return render(request, 'hlavni_stranka.html')

def kosik(request):
    return render(request, 'kosik.html')

def testy(request):
    return render(request, 'testy.html')

def ulozene_testy(request):
    return render(request, 'ulozene_testy.html')

def verejne_testy(request):
    return render(request, 'verejne_testy.html')

def login(request):
    return render(request, 'login.html')

def prihlasovacistranka(request):
    return render(request, 'prihlasovacistranka.html')

def profil(request):
    return render(request, 'profil.html')

def spravy(request):
    return render(request, 'spravy.html')


#testy
def kosiky(request):
    return render(request, 'kosiky.html')

def psaci_testy(request):
    return render(request, 'psaci_testy.html')

def spojovacka(request):
    return render(request, 'spojovacka.html')

def tabulka(request):
    return render(request, 'tabulka.html')

def vytvor_test(request):
    return render(request, 'vytvor_test.html')

def programovaci_test(request):
    return render(request, 'programovaci_test.html')

def maraton(request):
    return render(request, 'maraton.html')

def Multi_test(request):
    return render(request, 'Multi_test.html')

def ano_ne(request):
    return render(request, 'ano_ne.html')


#herní testy
def pexeso(request):
    return render(request, 'pexeso.html')

def Labyrint(request):
    return render(request, 'Labyrint.html')

def lov_pokladu(request):
    return render(request, 'lov_pokladu.html')

def flappy_bird(request):
    return render(request, 'flappy_bird.html')

def obesenec(request):
    return render(request, 'obesenec.html')

def klikaci(request):
    return render(request, 'klikaci.html')

def snake(request):
    return render(request, 'snake.html')

def chytacka(request):
    return render(request, 'chytacka.html')

def labyrint(request):
    return render(request, 'labyrint.html')

def tetris(request):
    return render(request, 'tetris.html')

def vyber_testy(request):
    return render(request, 'vyber_testy.html')

def kamen_nuzky_papir(request):
    return render(request, 'kamen_nuzky_papir')

def dvere_hra(request):
    return render(request, 'dvere_hra.html')

def klikaci_hra(request):
    return render(request, 'klikaci_hra.html')

def spravna_odpoved(request):
    return render(request, 'spravna_odpoved.html')





def register(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Vytvoření nového uživatele
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
            )
            messages.success(request, "Registrace byla úspěšná! Nyní se můžete přihlásit.")
            return redirect('login')
        else:
            messages.error(request, "Vyplňte formulář správně.")
    else:
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})

def user_login(request):  # Původní login_user přejmenován
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Ověření uživatele podle emailu
        try:
            user = User.objects.get(email=email)  # Najdeme uživatele podle emailu
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)  # Přihlásíme uživatele
                messages.success(request, "Přihlášení bylo úspěšné.")
                return redirect('hlavni_stranka')  # Přesměrování na hlavní stránku
            else:
                messages.error(request, "Špatné heslo.")
        except User.DoesNotExist:
            messages.error(request, "Uživatel s tímto emailem neexistuje.")

    return render(request, 'login.html')  # Pokud je metoda GET nebo neúspěch, zobrazí se formulář



@login_required
def chat(request):
    messages = Message.objects.filter(recipient__isnull=True).order_by('-timestamp')  # Veřejné zprávy
    form = MessageForm()

    if request.method == "POST":
        form = MessageForm(request.POST)
        if form.is_valid():
            message = Message(
                sender=request.user,
                recipient=form.cleaned_data.get('recipient'),
                text=form.cleaned_data['text']
            )
            message.save()
            return redirect('chat')  # Aktualizuje stránku

    return render(request, 'spravy.html', {'messages': messages, 'form': form})


@login_required
def edit_profile(request):
    user = request.user

    if request.method == "POST":
        form = UserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "Údaje byly úspěšně aktualizovány.")
            return redirect('profile')  # Přesměrování na stránku s profilem
    else:
        form = UserProfileForm(instance=user)

    return render(request, 'edit_profile.html', {'form': form})


@login_required
def profil(request):
    return render(request, 'profil.html', {
        'user': request.user
    })


@login_required
def profile_view(request):
    # Získáme statistiky pro aktuálního uživatele
    user_stats = UserStatistics.objects.get(user=request.user)

    # Získáme všechny testy podle typu
    test_types = TestType.objects.all()

    return render(request, 'profile.html', {
        'user_stats': user_stats,
        'test_types': test_types,
    })

# Zobrazení formuláře pro vytvoření testu
def create_test(request):
    if request.method == 'POST':
        form = TestForm(request.POST, request.FILES)
        if form.is_valid():
            test = form.save(commit=False)
            test.is_public = request.POST.get('is_public') == 'on'  # Pokud je zaškrtnuto, test je veřejný
            test.save()
            return redirect('test_success')  # Přesměrování na stránku o úspěšném uložení
    else:
        form = TestForm()
    return render(request, 'create_test.html', {'form': form})

def public_tests(request):
    tests = Test.objects.filter(is_public=True)
    return render(request, 'verejne_testy.html', {'tests': tests})

def private_tests(request):
    tests = Test.objects.filter(created_by=request.user)
    return render(request, 'ulozene_testy.html', {'tests': tests})


@csrf_exempt
def save_test(request):
    if request.method == 'POST':
        # Získání dat z formuláře
        name = request.POST.get('name')
        description = request.POST.get('description')
        image = request.FILES.get('image')
        is_public = request.POST.get('is_public') == 'true'

        # Uložení testu
        test = Test.objects.create(
            name=name,
            description=description,
            image=image,
            created_by=request.user,
            is_public=is_public
        )

        return JsonResponse({'success': True, 'test_id': test.id})
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)



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

