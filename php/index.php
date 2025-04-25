<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: sans-serif;
            text-align: center;
            padding-top: 60px;
        }

        .lottie-container {
            width: 300px;
            height: 300px;
            margin: 0 auto 30px;
        }

        h1 {
            font-size: 32px;
            color: #222;
        }

        a {
            display: inline-block;
            margin-top: 30px;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 8px;
        }

        a:hover {
            background-color: #0056b3;
        }
    </style>

    <!-- Lottie script -->
    <script src="https://unpkg.com/lottie-web@latest/build/player/lottie.min.js"></script>
</head>
<body>

    <div class="lottie-container" id="lottie"></div>

    <h1>👋 Welcome to My Finger Detection Project</h1>
    <p>Ce projet permet de détecter le nombre de doigts sur une image.</p>
    <a href="upload.php">Commencer ➜</a>

    <script>
        // Chargement de l'animation
        lottie.loadAnimation({
            container: document.getElementById('lottie'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'welcom.json' // Ton fichier JSON ici
        });
    </script>

</body>
</html>
