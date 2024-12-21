from django.urls import path
from . import views
from .views import LoginView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    #path('verify_code/', views.verify_code, name='verify_code'),
    path('prihlasovacistranka/', LoginView.as_view(), name='prihlasovacistranka'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)