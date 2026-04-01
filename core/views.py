from django.shortcuts import render
import requests

def home(request):
    return render(request, 'core/home.html')

def detect(request):
    return render(request, 'core/detect.html')

def voice(request):
    return render(request, 'core/voice.html')

import json

def insights(request):
    try:
        API_BASE = "https://melodious-curiosity-production-da13.up.railway.app"

        response = requests.get(f"{API_BASE}/analysis")
        data = response.json()

        # 🔥 CONVERT TO JSON SAFE STRINGS
        data["emotion_list"] = json.dumps(data.get("emotion_list", []))
        data["timestamps"] = json.dumps(data.get("timestamps", []))
        data["emotion_counts"] = json.dumps(data.get("emotion_counts", {}))

    except:
        data = {
            "emotion_list": "[]",
            "timestamps": "[]",
            "emotion_counts": "{}",
            "dominant_emotion": "N/A",
            "confidence": 0,
            "insight": "Backend not reachable"
        }

    return render(request, "core/insights.html", {"data": data})