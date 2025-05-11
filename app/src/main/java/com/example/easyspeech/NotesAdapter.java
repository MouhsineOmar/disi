package com.example.easyspeech;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.firebase.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class NotesAdapter extends RecyclerView.Adapter<NotesAdapter.NoteViewHolder> {

    private List<Map<String, Object>> notesList;
    private final OnNoteDeleteListener deleteListener;

    public interface OnNoteDeleteListener {
        void onDelete(Map<String, Object> note);
    }

    public NotesAdapter(List<Map<String, Object>> notesList, OnNoteDeleteListener deleteListener) {
        this.notesList = notesList;
        this.deleteListener = deleteListener;
    }

    @NonNull
    @Override
    public NoteViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_note, parent, false);
        return new NoteViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NoteViewHolder holder, int position) {
        Map<String, Object> note = notesList.get(position);
        holder.transcribedText.setText((String) note.get("transcribedText"));
        
        String translated = (String) note.get("translatedText");
        if (translated != null && !translated.isEmpty()) {
            holder.translatedText.setText("Translation: " + translated);
            holder.translatedText.setVisibility(View.VISIBLE);
        } else {
            holder.translatedText.setVisibility(View.GONE);
        }

        Timestamp timestamp = (Timestamp) note.get("timestamp");
        if (timestamp != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault());
            holder.timestampText.setText(sdf.format(timestamp.toDate()));
        } else {
            holder.timestampText.setText("No date");
        }

        holder.deleteButton.setOnClickListener(v -> {
            if (deleteListener != null) {
                deleteListener.onDelete(note);
            }
        });
    }

    @Override
    public int getItemCount() {
        return notesList.size();
    }

    static class NoteViewHolder extends RecyclerView.ViewHolder {
        TextView transcribedText;
        TextView translatedText;
        TextView timestampText;
        Button deleteButton;

        public NoteViewHolder(@NonNull View itemView) {
            super(itemView);
            transcribedText = itemView.findViewById(R.id.note_transcribed_text);
            translatedText = itemView.findViewById(R.id.note_translated_text);
            timestampText = itemView.findViewById(R.id.note_timestamp_text);
            deleteButton = itemView.findViewById(R.id.note_delete_button);
        }
    }
}
