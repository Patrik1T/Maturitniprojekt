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
