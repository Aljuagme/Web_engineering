from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
def login(request):
    return render(request, "app/login.html")

def register(request):
    return render(request, "app/register.html")

def guest(request):
    return redirect("home")

def home(request):
    return render(request, "app/index.html")

def recycling(request):
    return render(request, "app/recycling.html")

def waste_management(request):
    return render(request, "app/waste_management.html")

def root_redirect(request):
    return redirect('login') 