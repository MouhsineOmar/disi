package com.example.easyspeech;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class NotesActivity extends AppCompatActivity {

    private static final String TAG = "NotesActivity";

    private RecyclerView notesRecyclerView;
    private NotesAdapter notesAdapter;
    private List<Map<String, Object>> notesList;

    private FirebaseFirestore db;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notes);

        db = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        notesRecyclerView = findViewById(R.id.notes_recycler_view);
        notesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        notesList = new ArrayList<>();
        notesAdapter = new NotesAdapter(notesList, this::deleteNote); // Pass delete callback
        notesRecyclerView.setAdapter(notesAdapter);

        loadNotes();
    }

    private void loadNotes() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(this, "Please login to view notes.", Toast.LENGTH_SHORT).show();
            // Optionally redirect to LoginActivity
            finish();
            return;
        }

        db.collection("notes")
                .whereEqualTo("userId", currentUser.getUid())
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        notesList.clear();
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            Map<String, Object> note = document.getData();
                            note.put("documentId", document.getId()); // Store document ID for deletion
                            notesList.add(note);
                        }
                        notesAdapter.notifyDataSetChanged();
                        if (notesList.isEmpty()) {
                            Toast.makeText(NotesActivity.this, "No notes found.", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Log.w(TAG, "Error getting documents.", task.getException());
                        Toast.makeText(NotesActivity.this, "Error loading notes: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
    }

    private void deleteNote(Map<String, Object> note) {
        String documentId = (String) note.get("documentId");
        if (documentId == null || documentId.isEmpty()) {
            Toast.makeText(this, "Error: Note ID not found.", Toast.LENGTH_SHORT).show();
            return;
        }

        db.collection("notes").document(documentId)
            .delete()
            .addOnSuccessListener(aVoid -> {
                Toast.makeText(NotesActivity.this, "Note deleted successfully.", Toast.LENGTH_SHORT).show();
                notesList.remove(note); // Remove from local list
                notesAdapter.notifyDataSetChanged(); // Refresh RecyclerView
            })
            .addOnFailureListener(e -> {
                Toast.makeText(NotesActivity.this, "Error deleting note: " + e.getMessage(), Toast.LENGTH_LONG).show();
                Log.e(TAG, "Error deleting note", e);
            });
    }
}
