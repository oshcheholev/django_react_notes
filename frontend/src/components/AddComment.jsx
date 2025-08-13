import React, { useState } from "react";
// import "../styles/AddComment.css";
import Comments from "./Comments";
import api from "../api";

function AddComment() {
	// This function will handle adding a comment
	const handleSubmit = (e) => {
		e.preventDefault();
		const commentContent = e.target.elements.comment.value.trim();
		if (!commentContent) {
			alert("Comment content cannot be empty");
			console.log("Comment content is empty");
			return;
		}
		try {
			// Here you would typically make an API call to add the comment
			const response = api.post("/api/comments/", {
				content: commentContent,
				
				// Include any other necessary data here
			});
		} catch (error) {
			console.error("Error adding comment:", error);
		}


		// Logic to add a comment goes here

		// Reset the form or perform any other necessary actions
	}

	return (
		<form className="add-comment-form"
		onSubmit={handleSubmit}>
			<div className="add-comment">
				<textarea className="add-comment-textarea" placeholder="Add a comment..." />
				<button type="submit" className="add-comment-button">Submit</button>
			</div>
		</form>
	);
}

export default AddComment;
