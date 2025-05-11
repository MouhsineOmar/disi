package com.example.easyspeech;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import org.vosk.LibVosk;
import org.vosk.LogLevel;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.vosk.android.SpeechStreamService;
import org.vosk.android.StorageService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity implements RecognitionListener, NavigationView.OnNavigationItemSelectedListener {

    private static final String TAG = "EasySpeechApp";
    private static final int PERMISSIONS_REQUEST_RECORD_AUDIO = 1;

    private Model model;
    private SpeechService speechService;
    private SpeechStreamService speechStreamService;

    private TextView resultView;
    private TextView partialResultView;
    private EditText translatedTextView;
    private Button recordButton;
    private Button translateButton;
    private Spinner targetLanguageSpinner;
    
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private BottomNavigationView bottomNavigationView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        resultView = findViewById(R.id.result_view);
        partialResultView = findViewById(R.id.partial_result_view);
        translatedTextView = findViewById(R.id.translated_text_view);
        recordButton = findViewById(R.id.record_button);
        translateButton = findViewById(R.id.translate_button);
        targetLanguageSpinner = findViewById(R.id.target_language_spinner);
        
        resultView.setMovementMethod(new ScrollingMovementMethod());

        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.nav_view);
        bottomNavigationView = findViewById(R.id.bottom_nav_view);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        navigationView.setNavigationItemSelectedListener(this);
        setupBottomNavigation();


        // Check for RECORD_AUDIO permission
        int permissionCheck = ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.RECORD_AUDIO);
        if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, PERMISSIONS_REQUEST_RECORD_AUDIO);
        } else {
            initVoskModel();
        }

        recordButton.setOnClickListener(view -> {
            if (speechService != null) {
                recognizeMicrophone();
            } else {
                Toast.makeText(this, "Vosk Model not initialized yet.", Toast.LENGTH_SHORT).show();
            }
        });

        translateButton.setOnClickListener(view -> {
            String textToTranslate = resultView.getText().toString();
            if (!textToTranslate.isEmpty()) {
                // TODO: Implement actual translation API call
                // For now, just a placeholder
                String targetLang = targetLanguageSpinner.getSelectedItem().toString();
                translatedTextView.setText("Translating '" + textToTranslate + "' to " + targetLang + " (Not Implemented)");
                 Toast.makeText(this, "Translation API call not implemented.", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "No text to translate.", Toast.LENGTH_SHORT).show();
            }
        });

        Button saveNoteButton = findViewById(R.id.save_note_button);
        saveNoteButton.setOnClickListener(v -> saveNote());
    }

    private void initVoskModel() {
        LibVosk.setLogLevel(LogLevel.INFO);
        // Unpack the model first if it's not unpacked yet.
        // Model path: "file:///android_asset/vosk-model-small-en-us-0.15"
        // This path assumes the model is in app/src/main/assets/vosk-model-small-en-us-0.15
        // You might need to adjust based on your actual model name and location.
        StorageService.unpack(this, "vosk-model-small-en-us-0.15", "model",
                (model) -> {
                    this.model = model;
                    setUiState(true);
                },
                (exception) -> {
                    setErrorState("Failed to unpack the model: " + exception.getMessage());
                    Log.e(TAG, "Failed to unpack model", exception);
                });
    }
    
    private void setupBottomNavigation() {
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_notes) {
                startActivity(new Intent(MainActivity.this, NotesActivity.class));
                return true;
            } else if (itemId == R.id.nav_profile) {
                 startActivity(new Intent(MainActivity.this, ProfileActivity.class));
                return true;
            } else if (itemId == R.id.nav_settings) {
                startActivity(new Intent(MainActivity.this, SettingsActivity.class));
                return true;
            } else if (itemId == R.id.nav_home_bottom) {
                // Already on home (MainActivity)
                return true;
            }
            return false;
        });
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_RECORD_AUDIO) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                initVoskModel();
            } else {
                finish(); // User denied permission
            }
        }
    }

    private void recognizeMicrophone() {
        if (speechService != null) {
            setUiState(false);
            speechService.stop();
            speechService = null;
        } else {
            setUiState(true); // Enable buttons
            try {
                Recognizer rec = new Recognizer(model, 16000.0f);
                speechService = new SpeechService(rec, 16000.0f);
                speechService.startListening(this);
                recordButton.setText(R.string.stop_recording);
            } catch (IOException e) {
                setErrorState(e.getMessage());
            }
        }
    }

    @Override
    public void onPartialResult(String hypothesis) {
        partialResultView.setText(hypothesis);
    }

    @Override
    public void onResult(String hypothesis) {
        // Hypothesis is a JSON string, parse it to get the "text" field
        // Example: {"text" : "hello world"}
        try {
            org.json.JSONObject jsonObject = new org.json.JSONObject(hypothesis);
            String text = jsonObject.getString("text");
            resultView.append(text + "\n");
        } catch (org.json.JSONException e) {
            Log.e(TAG, "Error parsing Vosk result JSON", e);
            resultView.append(hypothesis + "\n"); // Fallback to raw hypothesis
        }
        setUiState(false); // Stop listening after final result
        recordButton.setText(R.string.start_recording);
    }

    @Override
    public void onFinalResult(String hypothesis) {
        // Similar to onResult, but for the very final recognition result of an utterance
         try {
            org.json.JSONObject jsonObject = new org.json.JSONObject(hypothesis);
            String text = jsonObject.getString("text");
            if (!text.isEmpty()) { // Only append if there's actual text
                 resultView.append(text + "\n");
            }
        } catch (org.json.JSONException e) {
            Log.e(TAG, "Error parsing Vosk final result JSON", e);
             if (!hypothesis.trim().equals("{\"text\" : \"\"}")) { // Avoid empty results
                resultView.append(hypothesis + "\n");
            }
        }
        setUiState(false);
        recordButton.setText(R.string.start_recording);
        if (speechService != null) {
            speechService.stop(); // Ensure service is stopped
            speechService = null;
        }
    }

    @Override
    public void onError(Exception error) {
        setErrorState(error.getMessage());
        if (speechService != null) { // Ensure service is stopped on error
            speechService.stop();
            speechService = null;
        }
        setUiState(false);
        recordButton.setText(R.string.start_recording);
    }

    @Override
    public void onTimeout() {
        setUiState(false);
        recordButton.setText(R.string.start_recording);
         if (speechService != null) { // Ensure service is stopped on timeout
            speechService.stop();
            speechService = null;
        }
    }

    private void setUiState(boolean isRecording) {
        recordButton.setText(isRecording ? R.string.stop_recording : R.string.start_recording);
        translateButton.setEnabled(!isRecording && !resultView.getText().toString().isEmpty());
    }

    private void setErrorState(String message) {
        resultView.setText(message);
        partialResultView.setText("");
        Log.e(TAG, message);
        setUiState(false);
        recordButton.setText(R.string.start_recording);
    }
    
    private void saveNote() {
        String transcribedText = resultView.getText().toString().trim();
        String translatedText = translatedTextView.getText().toString().trim();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        if (currentUser == null) {
            Toast.makeText(this, "You need to be logged in to save notes.", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, LoginActivity.class));
            return;
        }

        if (transcribedText.isEmpty()) {
            Toast.makeText(this, "No transcribed text to save.", Toast.LENGTH_SHORT).show();
            return;
        }

        Map<String, Object> note = new HashMap<>();
        note.put("userId", currentUser.getUid());
        note.put("transcribedText", transcribedText);
        note.put("translatedText", translatedText); // Can be empty if not translated
        note.put("timestamp", com.google.firebase.Timestamp.now());

        db.collection("notes")
                .add(note)
                .addOnSuccessListener(documentReference -> {
                    Toast.makeText(MainActivity.this, "Note saved successfully!", Toast.LENGTH_SHORT).show();
                    resultView.setText(""); // Clear text after saving
                    translatedTextView.setText("");
                    partialResultView.setText("");
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(MainActivity.this, "Error saving note: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    Log.e(TAG, "Error saving note", e);
                });
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.nav_home) {
            // Already on home
        } else if (id == R.id.nav_notes_drawer) {
            startActivity(new Intent(this, NotesActivity.class));
        } else if (id == R.id.nav_profile_drawer) {
            startActivity(new Intent(this, ProfileActivity.class));
        } else if (id == R.id.nav_settings_drawer) {
             startActivity(new Intent(this, SettingsActivity.class));
        } else if (id == R.id.nav_logout) {
            mAuth.signOut();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }
        drawerLayout.closeDrawers();
        return true;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (speechService != null) {
            speechService.stop();
            speechService.shutdown();
        }
        if (speechStreamService != null) {
            speechStreamService.stop();
        }
    }

    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(navigationView)) {
            drawerLayout.closeDrawer(navigationView);
        } else {
            super.onBackPressed();
        }
    }
}
