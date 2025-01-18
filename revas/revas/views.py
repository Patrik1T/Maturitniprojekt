from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from users.models import Message
from users.forms import MessageForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from users.forms import UserProfileForm
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from users.models import Question, Comment
from users.forms import QuestionForm, CommentForm
from django.shortcuts import redirect
from users.models import Note
from users.forms import NoteForm
from django.shortcuts import render
from django.http import JsonResponse
from users.models import TestDownloadStats
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm

def edit_profile(request):
    if request.method == 'POST':
        # Provádějte úpravy profilu
        return redirect('profile')  # Tento řádek zajišťuje přesměrování na profil


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


# Zobrazení seznamu otázek
def question_list(request):
    search_query = request.GET.get('q', '')
    if search_query:
        questions = Question.objects.filter(title__icontains=search_query)
    else:
        questions = Question.objects.all()

    return render(request, 'testy/question_list.html', {
        'questions': questions,
        'search_query': search_query,
    })

# Zobrazení detailu otázky
def question_detail(request, question_id):
    question = get_object_or_404(Question, id=question_id)
    comments = Comment.objects.filter(question=question)
    comment_form = CommentForm()

    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.question = question
            comment.save()
            return redirect('question_detail', question_id=question.id)

    return render(request, 'testy/question_detail.html', {
        'question': question,
        'comments': comments,
        'comment_form': comment_form,
    })

# Vytvoření nové otázky
def create_question(request):
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('question_list')
    else:
        form = QuestionForm()

    return render(request, 'testy/create_question.html', {'form': form})

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



# Pohled pro úpravu poznámky
def edit_note(request, note_id):
    note = get_object_or_404(Note, id=note_id)
    if request.method == 'POST':
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            return redirect('zapisnik')  # Název URL pro váš zápisník
    else:
        form = NoteForm(instance=note)
    return render(request, 'edit_note.html', {'form': form})

# Pohled pro smazání poznámky
def delete_note(request, note_id):
    note = get_object_or_404(Note, id=note_id)
    if request.method == 'POST':
        note.delete()
    return redirect('zapisnik')


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

def custom_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('main_page')  # Přesměrování na domovskou stránku nebo jinou URL

def custom_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('hlavni_stranka')  # Přesměrování
    else:
        form = AuthenticationForm()

    return render(request, 'registration/login.html', {'form': form})