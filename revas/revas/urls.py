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
from django.contrib.auth.views import LogoutView
from .views import custom_logout

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('users/', include('users.urls')),
                  path('accounts/', include('allauth.urls')),
                  path('', views.main_page, name='main_page'),
                  # Přihlášení a autentifikace přes GitHub a Google
                  path('auth/', include('social_django.urls', namespace='social')),
                  path('spravy/', include('users.urls')),
                  path('edit/<int:note_id>/', views.edit_note, name='edit_note'),
                  path('delete/<int:note_id>/', views.delete_note, name='delete_note'),

                  # Další vlastní cesty
                  path('login/', auth_views.LoginView.as_view(), name='login'),
                  path('prihlasovacistranka/', views.prihlasovacistranka, name='prihlasovacistranka'),
                  path('profil/', views.profil, name='profil'),
                  path('profile/', views.profile_view, name='users:profile'),
                  path('testy/', views.testy, name='testy'),
                  path('ulozene_testy/', views.ulozene_testy, name='ulozene_testy'),
                  path('verejne_testy/', views.verejne_testy, name='verejne_testy'),
                  path('register/', views.register, name='register'),
                  path('hlavni_stranka/', views.hlavni_stranka, name='hlavni_stranka'),
                  path('spravy/', chat, name='spravy'),
                  path('chat/', views.chat, name='chat'),
                  path('zapisnik/', views.zapisnik, name='zapisnik'),
                  path('otazky/', views.otazky, name='otazky'),
                  path('herni_testy/', views.herni_testy, name='herni_testy'),
                  path('herni_testy_procvicovaci/', views.herni_testy_procvicovaci, name='herni_testy_procvicovaci'),
                  path('logout/', custom_logout, name='logout'),
                  path('update_click_count/<str:file_type>/', views.update_click_count, name='update_click_count'),
                  path('profile/edit/', views.edit_profile, name='edit_profile'),



                  # Stránky testů aplikace
                  path('vyber_testy/', views.vyber_testy, name='vyber_testy'),
                  path('maraton/', views.maraton, name='maraton'),
                  path('programovaci_test/', views.programovaci_test, name='programovaci_test'),
                  path('ano_ne/', views.ano_ne, name='ano_ne'),
                  path('spojovacka/', views.spojovacka, name='spojovacka'),
                  path('tabulka/', views.tabulka, name='tabulka'),
                  path('spravna_odpoved/', views.spravna_odpoved, name='spravna_odpoved'),
                  path('textresponse/', views.textresponse, name='textresponse'),

                  # Stránky herních testů aplikace
                  path('obesenec/', views.obesenec, name='obesenec'),
                  path('pexeso/', views.pexeso, name='pexeso'),
                  path('snake/', views.snake, name='snake'),
                  path('dvere_hra/', views.dvere_hra, name='dvere_hra'),
                  path('vytvor_test/', views.vytvor_test, name='vytvor_test'),

                  # Stránky herních testů k procvičování
                  path('flappy_bird/', views.flappy_bird, name='flappy_bird'),
                  path('miny/', views.miny, name='miny'),
                  path('tetris/', views.tetris, name='tetris'),
                  path('klikaci_hra/', views.klikaci_hra, name='klikaci_hra'),
                  path('lov_pokladu/', views.lov_pokladu, name='lov_pokladu'),
                  path('Labyrint/', views.Labyrint, name='Labyrint'),

              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
