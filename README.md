# EasySpeech - Application Mobile de Transcription et Traduction Vocale

EasySpeech est une application Android intelligente qui permet aux utilisateurs de :

- Transcrire leur voix en texte en temps réel grâce à Vosk (modèle local offline).
- Traduire instantanément le texte reconnu vers d'autres langues via une API.
- Sauvegarder les notes vocales et accéder à un historique.
- Se connecter via Firebase Authentication et gérer un profil utilisateur.
- Profiter d'une interface moderne et intuitive.

## Fonctionnalités clés
- **Reconnaissance vocale offline**: Intégration du modèle Vosk (vosk-us) pour une transcription locale.
- **Traduction via API**: Utilisation d'une API (ex: Google Translate, DeepL) pour traduire le texte transcrit.
- **Gestion des notes vocales**: Sauvegarde des transcriptions dans Firebase Firestore avec historique.
- **Authentification sécurisée**: Connexion/compte utilisateur via Firebase Authentication.
- **Interface utilisateur moderne**: Écran d'accueil animé (Lottie), navigation drawer, bottom bar, design Material Components.

## Technologies utilisées
- Android SDK (Java/Kotlin)
- Vosk API
- Firebase (Auth + Firestore)
- API de traduction
- Lottie Animations
- OkHttp/Retrofit

## Pour Commencer
1. Clonez ce dépôt.
2. Ouvrez le projet dans Android Studio.
3. Configurez Firebase pour votre projet (google-services.json).
4. Assurez-vous d'avoir un modèle Vosk dans le répertoire `app/src/main/assets/vosk-model-small-en-us-0.15` (ou configurez le chemin du modèle).
5. Configurez votre clé API de traduction si nécessaire.
6. Compilez et exécutez l'application sur un émulateur ou un appareil Android (Android 10+).

## Livrables Attendus (par le développeur)
- Code source commenté et documenté.
- APK testable sur Android 10+.
- Documentation technique (architecture, bibliothèques utilisées).
- Vidéo de démonstration des fonctionnalités.
