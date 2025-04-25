<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $filePath = $_FILES['image']['tmp_name'];
    $fileType = $_FILES['image']['type'];
    $fileName = $_FILES['image']['name'];

    // Préparer CURL
    $cfile = new CURLFile($filePath, $fileType, $fileName);
    $postData = ['file' => $cfile];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:5000/analyze'); // Flask doit être lancé
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo "Erreur CURL : " . curl_error($ch);
    }
    curl_close($ch);

    // Afficher le résultat
    $result = json_decode($response, true);
    if (isset($result['fingers'])) {
        echo "<h3>🖐️ Nombre de doigts détectés : " . $result['fingers'] . "</h3>";
    } else {
        echo "<p>Erreur dans la réponse : " . $response . "</p>";
    }
} else {
    echo "Aucune image reçue.";
}
?>
