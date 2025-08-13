import React from 'react';
import '../styles/Comment.css';

const Comment = ({ comment }) => {
  const formattedDate = new Date(comment.created_at).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="comment">
      <div className="comment-content">{comment.content}</div>
      <div className="comment-meta">
        <span className="comment-author">By {comment.author_username}</span>
        <span className="comment-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default Comment;
