from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('predmety/', views.predmety, name='predmety'),
    path('vyukovematerialy/', views.vyukovematerialy, name='vyukovematerialy'),
    path('material/<int:pk>/', views.material_detail, name='material-detail'),
    path('prilohy/', views.prilohy, name='prilohy'),
    path('materials/', views.materials, name='materials'),
    path('comments/', views.comments, name='comments'),
]