from django.urls import path
from . import views
from .views import LoginView
urlpatterns = [
    path('register/', views.register, name='register'),
    # Přidej další URL pro přihlášení nebo jiné akce podle potřeby
    path('prihlasovacistranka/', LoginView.as_view(), name='prihlasovacistranka'),
]