from django.shortcuts import render
from django.http import HttpResponse
from .models import Question
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.auth import authenticate, login

def main_page(request):
    return render(request, 'main_page.html')

def page1(request):
    return render(request, 'page1.html')

def page2(request):
    return render(request, 'page2.html')

def page3(request):
    return render(request, 'page3.html')

def page4(request):
    return render(request, 'page4.html')

def page5(request):
    return render(request, 'page5.html')

def page6(request):
    return render(request, 'page6.html')

def page7(request):
    return render(request, 'page7.html')

def page8(request):
    return render(request, 'page8.html')

def page9(request):
    return render(request, 'page9.html')

def page10(request):
    return render(request, 'page10.html')

def page11(request):
    return render(request, 'page11.html')

def page12(request):
    return render(request, 'page12.html')

def page13(request):
    return render(request, 'page13.html')

def page14(request):
    return render(request, 'page14.html')

def page15(request):
    return render(request, 'page15.html')

def page16(request):
    return render(request, 'page16.html')

def page17(request):
    return render(request, 'page17.html')

def page18(request):
    return render(request, 'page18.html')

def page19(request):
    return render(request, 'page19.html')

def play(request):
    return render(request, 'play.html')

def piskvorky(request):
    return render(request, 'piskvorky')

def index(request):
    return render(request, 'main_page.html')

def play(request):
    questions = Question.objects.all()
    return render(request, 'myapp/play.html', {'questions': questions})


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
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()  # Uložíme nového uživatele do databáze
            login(request, user)  # Automatické přihlášení po registraci
            messages.success(request, 'Úspěšná registrace! Nyní jste přihlášeni.')
            return redirect('main_page')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})