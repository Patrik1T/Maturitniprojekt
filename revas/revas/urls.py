"""
URL configuration for revas project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from users import views
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import user_login
from .views import chat

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('users/', include('users.urls')),
                  path('accounts/', include('allauth.urls')),
                  path('', views.main_page, name='main_page'),
                  # Přihlášení a autentifikace přes GitHub a Google
                  path('auth/', include('social_django.urls', namespace='social')),
                  path('spravy/', include('users.urls')),

                  # Další vlastní cesty
                  path('github_log/', views.github_log, name='github_log'),
                  path('kosik/', views.kosik, name='kosik'),
                  path('login/', user_login, name='login'),
                  path('prihlasovacistranka/', views.prihlasovacistranka, name='prihlasovacistranka'),
                  path('profil/', views.profil, name='profil'),
                  path('profile', views.edit_profile, name='edit_profile'),
                  path('testy/', views.testy, name='testy'),
                  path('ulozene_testy/', views.ulozene_testy, name='ulozene_testy'),
                  path('verejne_testy/', views.verejne_testy, name='verejne_testy'),
                  path('register/', views.register, name='register'),
                  path('hlavni_stranka/', views.hlavni_stranka, name='hlavni_stranka'),
                  path('spravy/', chat, name='spravy'),
                  path('chat/', views.chat, name='chat'),
                  path('create_test/', views.create_test, name='create_test'),
                  path('save_test/', views.save_test, name='save_test'),

                  # Stránky testů aplikace
                  path('vyber_testy/', views.vyber_testy, name='vyber_testy'),
                  path('maraton/', views.maraton, name='maraton'),
                  path('Multi_test/', views.Multi_test, name='Multi_test'),
                  path('programovaci_test/', views.programovaci_test, name='programovaci_test'),
                  path('psaci_testy/', views.psaci_testy, name='psaci_testy'),
                  path('ano_ne/', views.ano_ne, name='ano_ne'),
                  path('spojovacka/', views.spojovacka, name='spojovacka'),
                  path('tabulka/', views.tabulka, name='tabulka'),
                  path('spravna_odpoved/', views.spravna_odpoved, name='spravna_odpoved'),

                  # Stránky herních testů aplikace
                  path('lov_pokladu/', views.lov_pokladu, name='lov_pokladu'),
                  path('Labyrint/', views.Labyrint, name='Labyrint'),
                  path('obesenec/', views.obesenec, name='obesenec'),
                  path('pexeso/', views.pexeso, name='pexeso'),
                  path('klikaci_hra/', views.klikaci_hra, name='klikaci_hra'),
                  path('snake/', views.snake, name='snake'),
                  path('tetris/', views.tetris, name='tetris'),
                  path('vytvor_test/', views.vytvor_test, name='vytvor_test'),
                  path('dvere_hra/', views.dvere_hra, name='dvere_hra'),
                  path('flappy_bird/', views.flappy_bird, name='flappy_bird'),



              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
