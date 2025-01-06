from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    #path('verify_code/', views.verify_code, name='verify_code'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)