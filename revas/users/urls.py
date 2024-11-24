from django.urls import path
from . import views
from .views import LoginView
urlpatterns = [
    path('register/', views.register, name='register'),
    path('verify_code/', views.verify_code, name='verify_code'),
    path('prihlasovacistranka/', LoginView.as_view(), name='prihlasovacistranka'),
]