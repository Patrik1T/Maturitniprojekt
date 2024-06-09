from .models import Material, Predmet, Priloha, Comment
from django.shortcuts import render, get_object_or_404
from .forms import MaterialForm


def index(request):
    # Získání všech výukových materiálů (příklad)
    materials = Material.objects.all()
    return render(request, 'index.html', {'materials': materials})

def predmety(request):
    predmety = Predmet.objects.all()
    materials_by_predmet = []
    for predmet in predmety:
        materials = Material.objects.filter(predmet=predmet)
        materials_by_predmet.append({'predmet': predmet, 'materials': materials})
    return render(request, 'predmety.html', {'materials_by_predmet': materials_by_predmet})

def vyukovematerialy(request):
    materials = Material.objects.all()
    return render(request, 'vyukovematerialy.html', {'materials': materials})

def material_detail(request, pk):
    material = get_object_or_404(Material, pk=pk)
    return render(request, 'material_detail.html', {'material': material})

def prilohy(request):
    prilohy = Priloha.objects.all()
    return render(request, 'prilohy.html', {'prilohy': prilohy})

def materials(request):
    if request.method == "POST":
        form = MaterialForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            form = MaterialForm()
    else:
        form = MaterialForm()

    materials = Material.objects.all()
    return render(request, 'materials.html', {'materials': materials, 'form': form})

def my_view(request):
    materials = Material.objects.all()
    return render(request, 'my_template.html', {'materials': materials})

def comments(request):
    comments = Comment.objects.all()
    return render(request, 'comments.html', {'comments': comments})

