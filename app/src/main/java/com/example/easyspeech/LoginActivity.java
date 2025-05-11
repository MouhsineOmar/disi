package com.example.easyspeech;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";

    private EditText emailEditText, passwordEditText;
    private Button loginButton;
    private TextView signupText;
    private ProgressBar progressBar;

    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mAuth = FirebaseAuth.getInstance();

        emailEditText = findViewById(R.id.email_edit_text);
        passwordEditText = findViewById(R.id.password_edit_text);
        loginButton = findViewById(R.id.login_button);
        signupText = findViewById(R.id.signup_text_view);
        progressBar = findViewById(R.id.login_progress_bar);

        loginButton.setOnClickListener(v -> loginUser());
        signupText.setOnClickListener(v -> {
            // For simplicity, we'll reuse this activity for signup by changing button text or similar
            // Or, create a separate SignupActivity
            // For now, let's assume signup is also handled here or by a separate button
            Toast.makeText(LoginActivity.this, "Signup clicked (implement signup flow)", Toast.LENGTH_SHORT).show();
            // Example of handling signup differently:
            if (loginButton.getText().toString().equals("Login")) {
                 loginButton.setText("Sign Up");
                 signupText.setText("Already have an account? Login");
            } else {
                 loginButton.setText("Login");
                 signupText.setText("Don't have an account? Sign Up");
            }
        });

         // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            // User is already logged in, redirect to MainActivity
            startActivity(new Intent(LoginActivity.this, MainActivity.class));
            finish();
        }
    }

    private void loginUser() {
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            emailEditText.setError("Email is required.");
            return;
        }
        if (TextUtils.isEmpty(password)) {
            passwordEditText.setError("Password is required.");
            return;
        }

        progressBar.setVisibility(android.view.View.VISIBLE);

        if (loginButton.getText().toString().equals("Login")) {
            mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    progressBar.setVisibility(android.view.View.GONE);
                    if (task.isSuccessful()) {
                        Log.d(TAG, "signInWithEmail:success");
                        FirebaseUser user = mAuth.getCurrentUser();
                        Toast.makeText(LoginActivity.this, "Login successful.", Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(LoginActivity.this, MainActivity.class));
                        finish();
                    } else {
                        Log.w(TAG, "signInWithEmail:failure", task.getException());
                        Toast.makeText(LoginActivity.this, "Authentication failed: " + task.getException().getMessage(),
                                Toast.LENGTH_LONG).show();
                    }
                });
        } else { // Handle Sign Up
             mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    progressBar.setVisibility(android.view.View.GONE);
                    if (task.isSuccessful()) {
                        Log.d(TAG, "createUserWithEmail:success");
                        FirebaseUser user = mAuth.getCurrentUser();
                        Toast.makeText(LoginActivity.this, "Account created successfully. Please login.", Toast.LENGTH_LONG).show();
                        // Optionally auto-login or redirect to login part of the screen
                        loginButton.setText("Login");
                        signupText.setText("Don't have an account? Sign Up");
                    } else {
                        Log.w(TAG, "createUserWithEmail:failure", task.getException());
                        Toast.makeText(LoginActivity.this, "Account creation failed: " + task.getException().getMessage(),
                                Toast.LENGTH_LONG).show();
                    }
                });
        }
    }
}
