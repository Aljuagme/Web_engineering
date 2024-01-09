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


def query_objects(request):
    if request.method == "POST":
        object_name = "Beer"
        proper_container = "Glass or Metal Recycling Container, depending on its material"
        explanation = "Glass beer: <span style='color: green; font-weight: bold;'>Green</span> Container\nCan beer: <span style='color: #CCCC00; font-weight: bold;'>Yellow</span> Container"
        return render(request, 'app/recycling.html',
                  {'object_name': object_name, 'proper_container': proper_container, 'explanation': explanation})

    else:
        return render(request, "app/recycling.html")
   