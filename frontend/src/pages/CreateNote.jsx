
import React, { useState } from 'react';
import api from '../api';

const CreateNote = ({ onNoteCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post("/api/notes/", { content, title });
      if (response.status === 201) {
        setContent("");
        setTitle("");
        onNoteCreated(); // Refresh notes list
        onClose(); // Close modal
      } else {
        alert("Failed to create note.");
      }
    } catch (err) {
      console.error("Error creating note:", err);
      alert("Failed to create note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-note-modal">
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={isSubmitting}
        />
        
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        
        <input 
          type="submit" 
          value={isSubmitting ? "Creating..." : "Create Note"}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default CreateNote;