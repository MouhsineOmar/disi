package com.example.easyspeech;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        TextView settingsPlaceholder = findViewById(R.id.settings_placeholder_text);
        settingsPlaceholder.setText("Settings will be implemented here.\n (e.g., Language preferences, Vosk model selection, API keys for translation)");
    }
}
