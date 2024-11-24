from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from .forms import RegisterForm
from .models import UserProfile
from django.contrib.auth.views import LoginView
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

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


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            password = make_password('somepassword')
            age = form.cleaned_data['age']
            gender = form.cleaned_data['gender']

            # Vytvoření nového uživatele
            user = User.objects.create_user(username=email, email=email, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            # Vytvoření profilu pro nového uživatele
            user_profile = UserProfile.objects.create(user=user, age=age, gender=gender)

            return redirect('login')  # Přesměrování na přihlašovací stránku nebo jinou stránku po úspěšné registraci
    else:
        form = RegisterForm()

    return render(request, 'users/register.html', {'form': form})

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