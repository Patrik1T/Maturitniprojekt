from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from users.models import Message  # Import modelu Message z aplikace chat
from users.forms import MessageForm  # Import formuláře MessageForm z aplikace chat
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from users.forms import UserProfileForm


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



from django.shortcuts import render, get_object_or_404, redirect
from users.models import Question, Comment
from users.forms import QuestionForm, CommentForm

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

from django.shortcuts import render, redirect
from users.models import Note
from users.forms import NoteForm

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
