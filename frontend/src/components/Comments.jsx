import React from 'react';
import '../styles/Comments.css';


function Comments({ comments }) {
	return (
		<div className="comments-container">
			{comments.map((comment) => (
				<div key={comment.id} className="comment">
					<p className="comment-author">{comment.author}</p>
					<p className="comment-content">{comment.content}</p>
				</div>
			))}
		</div>
	);
}

export default Comments;