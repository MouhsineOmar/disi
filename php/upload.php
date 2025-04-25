<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Détection de doigts en temps réel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #fbc2eb, #a6c1ee);
            text-align: center;
            padding: 40px;
        }

        .container {
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: auto;
        }

        h2 {
            margin-bottom: 20px;
        }

        .form-section {
            display: none;
            margin-top: 20px;
        }

        video, canvas {
            margin-top: 10px;
            border-radius: 8px;
            max-width: 100%;
        }

        button, input[type="file"] {
            margin-top: 20px;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }

        .option {
            margin: 10px;
            font-size: 16px;
        }
    </style>

    <script src="https://unpkg.com/lottie-web@latest/build/player/lottie.min.js"></script>
</head>
<body>

<div class="container">
    <div style="width: 200px; height: 200px; margin: auto;" id="animLottie"></div>

    <h2>Choisissez une méthode</h2>

    <label class="option">
        <input type="radio" name="method" onclick="showSection('upload')"> 📁 Uploader une image
    </label>
    <label class="option">
        <input type="radio" name="method" onclick="showSection('camera')"> 📷 Utiliser la caméra en temps réel
    </label>

    <!-- Upload image -->
    <div class="form-section" id="upload">
        <form action="flask_api.php" method="post" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*" required>
            <br>
            <button type="submit">Analyser l'image</button>
        </form>
    </div>

    <!-- Utiliser la caméra -->
    <div class="form-section" id="camera">
        <video id="video" width="320" height="240" autoplay></video>
        <canvas id="canvas" width="320" height="240" style="display:none;"></canvas>
        <div id="result" style="margin-top: 20px; font-size: 22px; font-weight: bold; color: #007bff;"></div>
    </div>
</div>

<script>
    // Animation Lottie
    lottie.loadAnimation({
        container: document.getElementById('animLottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'camera.json' // <-- Ton fichier animation JSON ici
    });

    function showSection(section) {
        document.getElementById('upload').style.display = 'none';
        document.getElementById('camera').style.display = 'none';
        document.getElementById(section).style.display = 'block';

        if (section === 'camera') {
            startRealTimeDetection();
        } else {
            stopRealTimeDetection();
        }
    }

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resultDiv = document.getElementById('result');

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
    });

    let intervalId = null;

    function startRealTimeDetection() {
        if (intervalId !== null) clearInterval(intervalId);

        intervalId = setInterval(() => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/png');

            fetch('http://127.0.0.1:5000/analyze', {  // <-- appel direct au serveur Flask
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'image=' + encodeURIComponent(dataURL)
            })
            .then(response => response.json())
            .then(data => {
                if (data.fingers !== undefined) {
                    resultDiv.innerHTML = "👉 Doigts détectés : <strong>" + data.fingers + "</strong>";
                } else {
                    resultDiv.innerHTML = "⚠️ Erreur de détection";
                }
            })
            .catch(error => {
                console.error('Erreur fetch :', error);
                resultDiv.innerHTML = "❌ Erreur connexion serveur.";
            });
        }, 1000); // toutes les 1 seconde
    }

    function stopRealTimeDetection() {
        if (intervalId !== null) clearInterval(intervalId);
    }
</script>

</body>
</html>
