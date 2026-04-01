from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('detect/', views.detect, name='detect'),
    path('voice/', views.voice, name='voice'),
    path("insights/", views.insights, name="insights"),
]