from django.shortcuts import render

def home(request):
    return render(request, 'core/home.html')

def detect(request):
    return render(request, 'core/detect.html')

def voice(request):
    return render(request, 'core/voice.html')