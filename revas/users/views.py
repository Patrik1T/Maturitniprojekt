from .models import UserStatistics, TestType
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .models import Test
from .models import Message
from django.http import JsonResponse
from .models import TestDownloadStats
from django.shortcuts import get_object_or_404, redirect
from django.shortcuts import render
from .forms import *
from django.contrib.auth.decorators import login_required


def main_page(request):
    return render(request, 'main_page.html')

def hlavni_stranka(request):
    return render(request, 'hlavni_stranka.html')

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

def textresponse(request):
    return render(request, 'testy/textresponse.html')

@login_required
def spojovacka(request):
    return render(request, 'testy/spojovacka.html')

def tabulka(request):
    return render(request, 'testy/tabulka.html')

def vyber_testy(request):
    return render(request, 'testy/vyber_testy.html')

def programovaci_test(request):
    return render(request, 'testy/programovaci_test.html')


def ano_ne(request):
    return render(request, 'testy/ano_ne.html')


#herní testy
@login_required
def pexeso(request):
    return render(request, 'herni_testy/pexeso.html')

def maraton(request):
    return render(request, 'herni_testy/maraton.html')

def Labyrint(request):
    return render(request, 'herni_testy_procvicovaci/Labyrint.html')

def lov_pokladu(request):
    return render(request, 'herni_testy_procvicovaci/lov_pokladu.html')

@login_required
def flappy_bird(request):
    return render(request, 'herni_testy_procvicovaci/flappy_bird.html')

@login_required
def obesenec(request):
    return render(request, 'herni_testy/obesenec.html')

def klikaci(request):
    return render(request, 'herni_testy_procvicovaci/klikaci.html')

def vytvor_test(request):
    return render(request, 'herni_testy/vytvor_test.html')

def snake(request):
    return render(request, 'herni_testy/snake.html')

def chytacka(request):
    return render(request, 'herni_testy/chytacka.html')

@login_required
def tetris(request):
    return render(request, 'herni_testy_procvicovaci/tetris.html')

def kamen_nuzky_papir(request):
    return render(request, 'herni_testy/kamen_nuzky_papir')

@login_required
def dvere_hra(request):
    return render(request, 'herni_testy/dvere_hra.html')

def klikaci_hra(request):
    return render(request, 'herni_testy_procvicovaci/klikaci_hra.html')

def spravna_odpoved(request):
    return render(request, 'testy/spravna_odpoved.html')

def zapisnik(request):
    return render(request, 'zapisnik.html')

def otazky(request):
    return render(request, 'otazky.html')

@login_required
def herni_testy(request):
    return render(request, 'herni_testy.html')

@login_required
def herni_testy_procvicovaci(request):
    return render(request, 'herni_testy_procvicovaci.html')

@login_required
def miny(request):
    return render(request, 'herni_testy_procvicovaci/miny.html')

def logout(request):
    return render(request, 'logout.html')



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

@login_required
def notes_list(request):
    # Získání zápisků aktuálního uživatele
    notes = Note.objects.filter(user=request.user)

    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            # Uložení zápisku k aktuálnímu uživatelskému účtu
            note = form.save(commit=False)
            note.user = request.user
            note.save()
            return redirect('zapisnik')  # Přesměrování na stránku s poznámkami
    else:
        form = NoteForm()

    return render(request, 'zapisnik.html', {'form': form, 'zapisnik': notes})


def edit_note(request, note_id):
    note = get_object_or_404(Note, id=note_id)
    if request.method == 'POST':
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            return redirect('zapisnik')  # Název URL pro váš hlavní zápisník
    else:
        form = NoteForm(instance=note)
    return render(request, 'edit_note.html', {'form': form})

# Pohled pro smazání poznámky
def delete_note(request, note_id):
    note = get_object_or_404(Note, id=note_id)
    if request.method == 'POST':
        note.delete()
    return redirect('zapisnik')

@login_required
def zapisnik(request):
    if request.method == 'POST':
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)  # Vytvoří instanci, ale ještě neuloží
            note.user = request.user        # Nastaví aktuálního uživatele
            note.save()                     # Uloží poznámku do databáze
            return redirect('zapisnik')     # Přesměruje uživatele zpět na stránku zápisníku
    else:
        form = NoteForm()

    notes = Note.objects.filter(user=request.user)  # Pouze poznámky aktuálního uživatele
    return render(request, 'zapisnik.html', {'form': form, 'notes': notes})


def save_test(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        image = request.FILES.get('image')
        questions = request.POST.get('questions')
        destination = request.POST.get('destination')

        test = Test(name=name, description=description, image=image, questions=questions)
        test.save()

        return JsonResponse({'success': True})
    return JsonResponse({'success': False})



def update_click_count(request, file_type):
    # Získání nebo vytvoření instance statistiky pro uživatele
    user_stats, created = TestDownloadStats.objects.get_or_create(user=request.user)

    # Aktualizace počtu kliknutí podle typu souboru
    if file_type == 'html':
        user_stats.html_count += 1
    elif file_type == 'xml':
        user_stats.xml_count += 1
    elif file_type == 'json':
        user_stats.json_count += 1

    # Uložení změn
    user_stats.save()

    # Vrácení počtu kliknutí jako JSON odpověď
    return JsonResponse({
        'html_count': user_stats.html_count,
        'xml_count': user_stats.xml_count,
        'json_count': user_stats.json_count
    })
