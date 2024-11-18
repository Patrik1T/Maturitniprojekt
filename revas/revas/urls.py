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
from django.urls import path
from users import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main_page, name='main_page'),
    path('ano_ne/', views.ano_ne, name='ano_ne'),
    path('dvere_hra/', views.dvere_hra, name='dvere_hra'),
    path('flappy_bird/', views.flappy_bird, name='flappy_bird'),
    path('github_log/', views.github_log, name='github_log'),
    path('google_log/', views.google_log, name='google_log'),
    path('hlavni_stranka/', views.hlavni_stranka, name='hlavni_stranka'),
    path('klikaci/', views.klikaci, name='klikaci'),
    path('klikaci_hra/', views.klikaci_hra, name='klikaci_hra'),
    path('kosik/', views.kosik, name='kosik'),
    path('kosiky/', views.kosiky, name='kosiky'),
    path('kviz/', views.kviz, name='kviz'),
    path('labyrint/', views.labyrint, name='labyrint'),
    path('login/', views.login, name='login'),
    path('lov_pokladu/', views.lov_pokladu, name='lov_pokladu'),
    path('maraton/', views.maraton, name='maraton'),
    path('Multi_test/', views.Multi_test, name='Multi_test'),
    path('obesenec/', views.obesenec, name='obesenec'),
    path('pexeso/', views.pexeso, name='pexeso'),
    path('piskvorky/', views.piskvorky, name='piskvorky'),
    path('prihlasovacistranka/', views.prihlasovacistranka, name='prihlasovacistranka'),
    path('profil/', views.profil, name='profil'),
    path('programovaci_test/', views.programovaci_test, name='programovaci_test'),
    path('psaci_testy/', views.psaci_testy, name='psaci_testy'),
    path('register/', views.register, name='register'),
    path('spojovacka/', views.spojovacka, name='spojovacka'),
    path('tabulka/', views.tabulka, name='tabulka'),
    path('testy/', views.testy, name='testy'),
    path('ulozene_testy/', views.ulozene_testy, name='ulozene_testy'),
    path('verejne_testy/', views.verejne_testy, name='verejne_testy'),
    path('vytvor_test/', views.vytvor_test, name='vytvor_test'),
    path('nakup/', views.nakup, name='nakup'),
    path('logout/', views.logout, name='logout'),
    path('vice/', views.vice, name='vice'),
    path('sparovaci_stranka_moodle/', views.sparovaci_stranka_moodle, name='sparovaci_stranka_moodle'),
    path('sparovaci_stranka_github/', views.sparovaci_stranka_github, name='sparovaci_stranka_github'),
    path('chytacka/', views.chytacka, name='chytacka'),
    path('snake/', views.snake, name='snake'),
    path('tetris/', views.tetris, name='tetris'),
    path('nahoda/', views.nahoda, name='nahoda'),
    path('vyber_testy/', views.vyber_testy, name='vyber_testy'),

    path('piskvorky/', views.piskvorky, name='piskvorky'),
    path('vytvor_test/', views.vytvor_test, name='vytvor_test'),
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),
]