import React, { useState } from 'react';
import api from '../api';

const EditNote = ({ note, onNoteUpdated, onClose }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateNote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.put(`/api/notes/${note.id}/`, { content, title });
      if (response.status === 200) {
        onNoteUpdated(); // Refresh notes list
        onClose(); // Close modal
      } else {
        alert("Failed to update note.");
      }
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-note-modal">
      <h2>Edit Note</h2>
      <form onSubmit={updateNote}>
        <label htmlFor="edit-title">Title:</label>
        <input
          type="text"
          id="edit-title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          disabled={isSubmitting}
        />
        
        <label htmlFor="edit-content">Content:</label>
        <textarea
          id="edit-content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        
        <div className="form-buttons">
          <input 
            type="submit" 
            value={isSubmitting ? "Updating..." : "Update Note"}
            disabled={isSubmitting}
          />
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
