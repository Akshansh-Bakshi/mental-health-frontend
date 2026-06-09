from django.shortcuts import render
import requests
import json


def home(request):
    return render(request, 'core/home.html')


def detect(request):
    return render(request, 'core/detect.html')


def voice(request):
    return render(request, 'core/voice.html')


def assessment(request):
    return render(request, 'core/assessment.html')


def insights(request):
    try:
        API_BASE = "http://127.0.0.1:8000"

        response = requests.get(f"{API_BASE}/analysis")
        data = response.json()

        data["emotion_list"] = json.dumps(data.get("emotion_list", []))
        data["timestamps"] = json.dumps(data.get("timestamps", []))
        data["emotion_counts"] = json.dumps(data.get("emotion_counts", {}))

        data["face_counts"] = json.dumps(data.get("face_counts", {}))
        data["voice_counts"] = json.dumps(data.get("voice_counts", {}))

    except:
        data = {
            "emotion_list": "[]",
            "timestamps": "[]",
            "emotion_counts": "{}",
            "face_counts": "{}",
            "voice_counts": "{}",
            "dominant_emotion": "N/A",
            "confidence": 0,
            "insight": "Backend not reachable"
        }

    return render(request, "core/insights.html", {"data": data})