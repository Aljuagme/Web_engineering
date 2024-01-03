from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("login/", views.login, name="login"),
    path("register/", views.register, name="register"),
    path("guest/", views.guest, name="guest"),
    path("home/", views.home, name="home"),
    path("recycling/", views.recycling, name="recycling"),
    path("waste_management/", views.waste_management, name="waste_management")
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)