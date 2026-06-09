const FACE_API_URL = "http://127.0.0.1:8000/predict";
const VOICE_API_URL = "http://127.0.0.1:8000/predict-voice";

/* ================= FACE ELEMENTS ================= */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const statusText = document.getElementById("statusText");
const emotionText = document.getElementById("emotionText");
const confidenceText = document.getElementById("confidenceText");
const confidenceFill = document.getElementById("confidenceFill");
const emotionMessage = document.getElementById("emotionMessage");
const resultCard = document.getElementById("resultCard");

/* ================= VOICE ELEMENTS ================= */

const startRecord = document.getElementById("startRecord");
const stopRecord = document.getElementById("stopRecord");

const voiceStatus = document.getElementById("voiceStatus");
const voiceEmotionText = document.getElementById("voiceEmotionText");
const voiceConfidenceText = document.getElementById("voiceConfidenceText");
const voiceConfidenceFill = document.getElementById("voiceConfidenceFill");
const voiceEmotionMessage = document.getElementById("voiceEmotionMessage");
const voiceResultCard = document.getElementById("voiceResultCard");

let stream = null;
let faceInterval = null;

let mediaRecorder = null;
let audioChunks = [];
let audioStream = null;


function normalizeConfidence(rawConfidence) {
    let confidence = Number(rawConfidence);

    if (confidence <= 1) {
        confidence *= 100;
    }

    confidence = Math.max(0, Math.min(100, confidence));

    return confidence;
}

function getEmotionMessage(emotion) {
    const messages = {
        happy: "Positive emotional indicators detected.",
        sad: "Signs of low mood detected.",
        angry: "Elevated tension detected.",
        neutral: "Emotion appears stable.",
        fear: "Possible anxiety indicators detected."
    };

    return messages[emotion] || "Analysis complete.";
}

function setEmotionCardTheme(card, emotion) {
    card.classList.remove("happy", "sad", "angry", "neutral", "fear");
    card.classList.add(emotion);
}


startBtn.addEventListener("click", async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        video.srcObject = stream;
        statusText.textContent = "🟢 Camera Active";

        if (faceInterval) clearInterval(faceInterval);

        faceInterval = setInterval(sendFrameForPrediction, 3000);

    } catch (err) {
        console.error(err);
        statusText.textContent = "❌ Camera Access Denied";
    }
});

stopBtn.addEventListener("click", () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
    }

    if (faceInterval) {
        clearInterval(faceInterval);
        faceInterval = null;
    }

    statusText.textContent = "🔴 Camera Stopped";
});

/* ================= FACE PREDICTION ================= */

async function sendFrameForPrediction() {
    if (!stream || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async blob => {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
            const res = await fetch(FACE_API_URL, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.emotion && data.emotion !== "no_face") {
                updateFaceUI(data);
            }

        } catch (err) {
            console.error("Face API Error:", err);
        }

    }, "image/jpeg");
}

function updateFaceUI(data) {
    const confidence = normalizeConfidence(data.confidence);

    emotionText.textContent = data.emotion;
    confidenceText.textContent = `Confidence: ${confidence.toFixed(1)}%`;
    confidenceFill.style.width = `${confidence}%`;
    emotionMessage.textContent = getEmotionMessage(data.emotion);

    setEmotionCardTheme(resultCard, data.emotion);
}

/* ================= VOICE RECORDING ================= */

startRecord.addEventListener("click", async () => {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(audioStream);
        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = sendVoiceForPrediction;

        mediaRecorder.start();

        voiceStatus.textContent = "🎙 Recording...";

    } catch (err) {
        console.error(err);
        voiceStatus.textContent = "❌ Microphone Access Denied";
    }
});

stopRecord.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }

        voiceStatus.textContent = "⏳ Processing Voice...";
    }
});

/* ================= VOICE PREDICTION ================= */

async function sendVoiceForPrediction() {
    const audioBlob = new Blob(audioChunks, {
        type: "audio/webm"
    });

    const formData = new FormData();
    formData.append("file", audioBlob, "voice.webm");

    try {
        const res = await fetch(VOICE_API_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.emotion) {
            updateVoiceUI(data);
            voiceStatus.textContent = "✅ Voice Analysis Complete";
        }

    } catch (err) {
        console.error("Voice API Error:", err);
        voiceStatus.textContent = "❌ Voice Analysis Failed";
    }
}

function updateVoiceUI(data) {
    const confidence = normalizeConfidence(data.confidence);

    voiceEmotionText.textContent = data.emotion;
    voiceConfidenceText.textContent = `Confidence: ${confidence.toFixed(1)}%`;
    voiceConfidenceFill.style.width = `${confidence}%`;
    voiceEmotionMessage.textContent = getEmotionMessage(data.emotion);

    setEmotionCardTheme(voiceResultCard, data.emotion);
}

