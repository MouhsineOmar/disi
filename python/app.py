from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import base64
import uuid
import os

app = Flask(__name__)
CORS(app)  # Autorise les appels cross-origin depuis le navigateur

UPLOAD_FOLDER = 'static/upload'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Fonction de détection des doigts
def detect_fingers(image_path):
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=True)
    img = cv2.imread(image_path)
    if img is None:
        return 0
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    result = hands.process(img_rgb)

    if not result.multi_hand_landmarks:
        return 0

    hand = result.multi_hand_landmarks[0]
    lm = hand.landmark
    h, w, _ = img.shape
    lmList = [(int(l.x * w), int(l.y * h)) for l in lm]

    fingers = 0
    # Logique simple basée sur les landmarks
    if lmList[8][1] < lmList[6][1]: fingers += 1   # index
    if lmList[12][1] < lmList[10][1]: fingers += 1 # majeur
    if lmList[16][1] < lmList[14][1]: fingers += 1 # annulaire
    if lmList[20][1] < lmList[18][1]: fingers += 1 # auriculaire
    if lmList[4][0] > lmList[3][0]: fingers += 1   # pouce (main droite)

    return fingers

@app.route('/analyze', methods=['POST'])
def analyze():
    # Cas 1 : image envoyée en base64 (depuis caméra)
    if 'image' in request.form:
        try:
            data = request.form['image'].split(',')[1]
            img_bytes = base64.b64decode(data)

            filename = str(uuid.uuid4()) + ".png"
            path = os.path.join(UPLOAD_FOLDER, filename)
            with open(path, 'wb') as f:
                f.write(img_bytes)

            fingers = detect_fingers(path)
            os.remove(path)

            return jsonify({'fingers': fingers})
        except Exception as e:
            print("Erreur:", str(e))
            return jsonify({'error': 'Invalid image'}), 400

    # Cas 2 : fichier image uploadé (type file)
    if 'file' in request.files:
        file = request.files['file']
        filename = str(uuid.uuid4()) + ".png"
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        fingers = detect_fingers(path)
        os.remove(path)

        return jsonify({'fingers': fingers})

    return jsonify({'error': 'No image received'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
