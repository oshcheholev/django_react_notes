import React, { useState } from 'react';
import Comment from './Comment';
import api from '../api';
import '../styles/Comment.css';

const CommentsSection = ({ noteId, comments, showComments, onCommentsUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/api/notes/${noteId}/comments/`, {
        content: newComment.trim()
      });
      
      if (response.status === 201) {
        setNewComment('');
        setShowAddForm(false);
        onCommentsUpdate(); // Refresh the notes to get updated comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewComment('');
  };

  return (
    <div className="comments-section">
      {showComments && (
        <>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            ) : (
              <div className="no-comments">No comments yet</div>
            )}
          </div>

          <div className="add-comment-section">
            {!showAddForm ? (
              <button 
                className="add-comment-button" 
                onClick={toggleAddForm}
              >
                Add Comment
              </button>
            ) : (
              <form className="add-comment-form" onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  disabled={isSubmitting}
                  required
                />
                <div className="comment-form-buttons">
                  <button 
                    type="submit" 
                    className="submit-comment"
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Comment'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-comment"
                    onClick={cancelAdd}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsSection;
